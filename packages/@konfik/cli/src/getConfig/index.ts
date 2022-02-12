import type { KonfikPlugin, PrettyPrint } from '@konfik/core'
import type { PosixFilePath } from '@konfik/utils'
import type { E } from '@konfik/utils/effect'
import { Chunk, identity, O, OT, pipe, S, T } from '@konfik/utils/effect'
// import type { GetKonfikVersionError } from '@konfik/utils/node'
import { fs } from '@konfik/utils/node'
import * as path from 'path'

import type { EsbuildBinNotFoundError } from '../errors.js'
import { ConfigNoDefaultExportError, ConfigReadError, NoConfigFoundError } from '../errors.js'
import type { HasCwdService } from '../services/CwdService.js'
import { accessCwd } from '../services/CwdService.js'
import type { GetKonfikVersionError } from '../version.js'
import * as esbuild from './esbuild.js'

type GetConfigError =
  | esbuild.EsbuildError
  | NoConfigFoundError
  | fs.StatError
  | fs.UnknownFSError
  | fs.MkdirError
  | EsbuildBinNotFoundError
  | ConfigReadError
  | ConfigNoDefaultExportError
  | GetKonfikVersionError

export type KonfikResult = {
  plugin: KonfikPlugin
  prettyPrint: PrettyPrint
}

export const getPlugins = ({
  configPath,
  outFilePath,
}: {
  configPath: O.Option<string>
  outFilePath: PosixFilePath
}): T.Effect<OT.HasTracer & HasCwdService, GetConfigError, KonfikResult> =>
  pipe(
    getPluginsWatch({ configPath, outFilePath }),
    S.take(1),
    S.runCollect,
    T.map(Chunk.unsafeHead),
    T.rightOrFail,
    OT.withSpan('@konfik/core/getConfig:getConfig', { attributes: { configPath: O.toUndefined(configPath) } }),
  )

export const getPluginsWatch = ({
  configPath: configPath_,
  outFilePath,
}: {
  configPath: O.Option<string>
  outFilePath: PosixFilePath
}): S.Stream<OT.HasTracer & HasCwdService, never, E.Either<GetConfigError, KonfikResult>> => {
  const configPath = O.toUndefined(configPath_)
  const resolveParams = pipe(T.structPar({ configPath: resolveConfigPath({ configPath }) }), T.either)

  return pipe(
    S.fromEffect(resolveParams),
    S.chainMapEitherRight(({ configPath }) =>
      pipe(
        esbuild.makeAndSubscribe({
          entryPoints: [configPath],
          outfile: outFilePath,
          sourcemap: true,
          platform: 'node',
          target: 'es2020',
          format: 'esm',
          mainFields: ['module', 'main'],
          banner: {
            js: `import { createRequire as topLevelCreateRequire } from 'module'; const require = topLevelCreateRequire(import.meta.url); const __dirname = '__SET_BY_ESBUILD__';`,
          },
          bundle: true,
          logLevel: 'silent',
          // plugins: [contentlayerGenPlugin(), makeAllPackagesExternalPlugin(configPath)],
        }),
        S.mapEffectEitherRight((result) => getConfigFromResult({ result, configPath, outFilePath })),
      ),
    ),
  )
}

const resolveConfigPath = ({
  configPath,
}: {
  configPath?: string
}): T.Effect<HasCwdService & OT.HasTracer, NoConfigFoundError | fs.StatError, string> =>
  T.gen(function* ($) {
    const cwd = yield* $(accessCwd)

    if (configPath) {
      if (path.isAbsolute(configPath)) {
        return configPath
      }

      return path.join(cwd, configPath)
    }

    const defaultFilePaths = [path.join(cwd, 'konfik.ts'), path.join(cwd, 'konfik.js')]
    const foundDefaultFiles = yield* $(pipe(defaultFilePaths, T.forEachPar(fs.fileOrDirExists), T.map(Chunk.toArray)))
    const foundDefaultFile = defaultFilePaths[foundDefaultFiles.findIndex((_) => _)]
    if (foundDefaultFile) {
      return foundDefaultFile
    }

    return yield* $(T.fail(new NoConfigFoundError({ cwd, configPath })))
  })

const getConfigFromResult = ({
  result,
  configPath,
  outFilePath,
}: {
  result: esbuild.BuildResult
  /** configPath only needed for error message */
  configPath: string
  outFilePath: PosixFilePath
}): T.Effect<OT.HasTracer, never, E.Either<ConfigReadError | ConfigNoDefaultExportError, KonfikResult>> =>
  pipe(
    T.gen(function* ($) {
      const unknownWarnings = result.warnings.filter(
        (warning) =>
          warning.text.match(
            /Import \".*\" will always be undefined because the file \"konfik-gen:.konfik\/(data|types)\" has no exports/,
          ) === null,
      )

      if (unknownWarnings.length > 0) {
        console.error(`Konfik esbuild warnings:`)
        console.error(unknownWarnings)
      }

      // Needed in order for source maps of dynamic file to work
      yield* $(
        T.tryCatchPromise(
          async () => (await import('source-map-support')).install(),
          (error) => new ConfigReadError({ error, configPath }),
        ),
      )

      // NOTES:
      // 1) `?x=` suffix needed in case of re-loading when watching the config file for changes
      // 2) `file://` prefix is needed for Windows to work properly
      const importFresh = async (modulePath: string) => import(`file://${modulePath}?x=${new Date()}`)

      const exports = yield* $(
        T.tryCatchPromise(
          () => importFresh(outFilePath),
          (error) => new ConfigReadError({ error, configPath }),
        ),
      )
      if (!('default' in exports)) {
        return yield* $(T.fail(new ConfigNoDefaultExportError({ configPath, availableExports: Object.keys(exports) })))
      }

      // Note currently `makeSource` returns a Promise but we should reconsider that design decision
      const plugin: KonfikPlugin = yield* $(
        T.tryCatchPromise(
          async () => exports.default,
          (error) => new ConfigReadError({ error, configPath }),
        ),
      )

      const prettyPrint: PrettyPrint = exports.prettyPrint ?? identity

      return { plugin, prettyPrint }
    }),
    OT.withSpan('@konfik/core/getConfig:getConfigFromResult', { attributes: { configPath, outFilePath } }),
    T.either,
  )

/**
 * This esbuild plugin is needed in some cases where users import code that imports from '.konfik/*'
 * (e.g. when co-locating document type definitions with React components).
 */
const contentlayerGenPlugin = (): esbuild.Plugin => ({
  name: '@konfik-plugin/gen',
  setup(build) {
    build.onResolve({ filter: /^\.konfik\// }, (args) => ({
      path: args.path,
      namespace: '@konfik-plugin/gen',
    }))

    build.onLoad({ filter: /.*/, namespace: '@konfik-plugin/gen' }, () => ({
      contents: '// empty',
    }))
  },
})

// TODO also take tsconfig.json `paths` mapping into account
const makeAllPackagesExternalPlugin = (configPath: string): esbuild.Plugin => ({
  name: 'make-all-packages-external',
  setup: (build) => {
    const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => {
      // avoid marking config file as external
      if (args.path.includes(configPath)) {
        return { path: args.path, external: false }
      }

      return { path: args.path, external: true }
    })
  },
})
