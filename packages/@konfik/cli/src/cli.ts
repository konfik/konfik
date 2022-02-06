import '@konfik/utils/effect/Tracing/Enable'

import * as CliApp from '@effect-ts/cli/CliApp'
import * as CliCommand from '@effect-ts/cli/Command'
import * as CliExists from '@effect-ts/cli/Exists'
import * as CliHelp from '@effect-ts/cli/Help'
import * as CliOptions from '@effect-ts/cli/Options'
import { runMain } from '@effect-ts/node/Runtime'
import { flattenKonfikTrie } from '@konfik/core'
import { unknownToPosixFilePath } from '@konfik/utils'
import { Map, O, pipe, Show, T, Tagged } from '@konfik/utils/effect'
import { provideDummyTracing, provideJaegerTracing } from '@konfik/utils/effect/Tracing'
import { fs } from '@konfik/utils/node'
import { createPatch } from 'diff'
import * as os from 'node:os'
import * as path from 'node:path'

import { ArtifactsDir } from './ArtifactsDir.js'
import { getCwd, provideCwd } from './cwd.js'
import { getPlugins } from './getConfig/index.js'
import { validatePlugins } from './validate.js'
import { version } from './version.js'
import { writeFile } from './writeFile.js'

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

export type KonfikCliCommand = Build | Diff

export interface CommonCliOptions {
  readonly configPath: O.Option<string>
}

export interface BuildCommandOptions extends CommonCliOptions {
  readonly clearCache: boolean
  readonly configPath: O.Option<string>
  readonly outDir: O.Option<string>
}

export class Build extends Tagged('Build')<BuildCommandOptions> {}

export interface DiffCommandOptions extends CommonCliOptions {}

export class Diff extends Tagged('Diff')<DiffCommandOptions> {}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

export const configPathOption = pipe(CliOptions.file('config'), CliOptions.alias('c'), CliOptions.optional(Show.string))

export const clearCacheOption = CliOptions.boolean('clearCache')

export const outDirOption = pipe(
  CliOptions.directory('outDir', CliExists.either),
  CliOptions.alias('o'),
  CliOptions.optional(Show.string),
)

export const buildOptions = CliOptions.struct({
  clearCache: clearCacheOption,
  configPath: configPathOption,
  outDir: outDirOption,
})

export const buildCommand: CliCommand.Command<KonfikCliCommand> = pipe(
  CliCommand.make('build', buildOptions),
  CliCommand.map((_) => new Build(_)),
)

export const diffOptions = CliOptions.struct({
  configPath: configPathOption,
})

export const diffCommand: CliCommand.Command<KonfikCliCommand> = pipe(
  CliCommand.make('diff', diffOptions),
  CliCommand.map((_) => new Diff(_)),
)

export const konfikCliCommand = pipe(CliCommand.make('konfik'), CliCommand.subcommands(buildCommand, diffCommand))

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

const cli = CliApp.make({
  name: 'konfik',
  version,
  summary: CliHelp.text('Scaffold project configuration with a type-safe DSL'),
  command: konfikCliCommand,
  config: { showBanner: false },
})

const build = (options: BuildCommandOptions) =>
  T.gen(function* ($) {
    const artifactsDir = yield* $(ArtifactsDir.makeTmpDirAndResolveEntryPoint)

    if (options.clearCache) {
      yield* $(fs.rm(artifactsDir, { recursive: true }))
    }

    const { plugin, prettyPrint } = yield* $(getPlugins({ configPath: options.configPath, artifactsDir }))

    yield* $(validatePlugins([plugin]))

    const concurrencyLimit = yield* $(T.succeedWith(() => os.cpus().length))

    const allFileEntries = flattenKonfikTrie(plugin, prettyPrint)

    yield* $(
      fs.mkdirp(
        pipe(
          options.outDir,
          O.getOrElse(() => '.'),
          unknownToPosixFilePath,
        ),
      ),
    )

    yield* $(pipe(allFileEntries, T.forEachParN(concurrencyLimit, writeFile(options.outDir))))
  })

const diff = (options: DiffCommandOptions) =>
  T.gen(function* ($) {
    const artifactsDir = yield* $(ArtifactsDir.makeTmpDirAndResolveEntryPoint)

    const { plugin, prettyPrint } = yield* $(getPlugins({ configPath: options.configPath, artifactsDir }))

    yield* $(validatePlugins([plugin]))

    const fileMap = Map.make(flattenKonfikTrie(plugin, prettyPrint))
    const filePaths = fileMap.keys()

    const cwd = yield* $(getCwd)

    yield* $(
      pipe(
        filePaths,
        T.forEach((filePath) => {
          const absolutePath = path.join(cwd, filePath)
          return pipe(
            fs.readFile(absolutePath),
            T.chain((oldContents) =>
              pipe(
                Map.lookup_(fileMap, filePath),
                O.fold(
                  () => T.fail(`Could not find a Konfik for ${filePath}`),
                  (newContents) =>
                    T.succeedWith(() => console.log(createPatch(absolutePath, oldContents, newContents))),
                ),
              ),
            ),
          )
        }),
      ),
    )
  })

const execute = (command: KonfikCliCommand) =>
  pipe(
    command,
    T.matchTag({
      Build: (_) => build(_),
      Diff: (_) => diff(_),
    }),
  )

const provideTracing = () =>
  process.env.KONFIK_OTEL !== undefined ? provideJaegerTracing('@konfik-plugin/cli') : provideDummyTracing()

export const run = () =>
  pipe(
    T.succeedWith(() => process.argv.slice(2)),
    T.chain((args) => CliApp.run_(cli, args, execute)),
    provideTracing(),
    provideCwd,
    runMain,
  )
