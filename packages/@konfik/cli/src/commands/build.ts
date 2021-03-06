import * as CliCommand from '@effect-ts/cli/Command'
import * as CliExists from '@effect-ts/cli/Exists'
import * as CliOptions from '@effect-ts/cli/Options'
import { flattenKonfikTrie } from '@konfik/core'
import { filePathJoin, unknownToPosixFilePath } from '@konfik/utils'
import { O, pipe, Show, T, Tagged } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import * as os from 'node:os'

import type { KonfikCliCommand } from '../cli.js'
import { getPlugins } from '../getConfig/index.js'
import { makeArtifactCacheDirectory } from '../services/ArtifactService.js'
import { validatePlugins } from '../validate.js'
import { writeFile } from '../writeFile.js'
import type { CommonCliOptions } from './common.js'
import { configPathOption } from './common.js'

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

export interface BuildCommandOptions extends CommonCliOptions {
  readonly clearCache: boolean
  readonly configPath: O.Option<string>
  readonly outDir: O.Option<string>
}

export class Build extends Tagged('Build')<BuildCommandOptions> {}

// -----------------------------------------------------------------------------
// Options
// -----------------------------------------------------------------------------

export const clearCacheOption = CliOptions.boolean('clearCache')

export const outDirOption = pipe(
  CliOptions.directory('outDir', CliExists.either),
  CliOptions.alias('o'),
  CliOptions.optional(Show.string),
)

export const options = CliOptions.struct({
  clearCache: clearCacheOption,
  configPath: configPathOption,
  outDir: outDirOption,
})

export const command: CliCommand.Command<KonfikCliCommand> = pipe(
  CliCommand.make('build', options),
  CliCommand.map((_) => new Build(_)),
)

// -----------------------------------------------------------------------------
// Execute
// -----------------------------------------------------------------------------

export const execute = ({ clearCache, configPath, outDir }: BuildCommandOptions) =>
  T.gen(function* ($) {
    const artifactCacheDir = yield* $(makeArtifactCacheDirectory)

    if (clearCache) {
      yield* $(fs.rm(artifactCacheDir, { recursive: true }))
    }

    const outFilePath = filePathJoin(artifactCacheDir, 'compiled-konfik-map.mjs')

    const { plugin, prettyPrint } = yield* $(getPlugins({ configPath, outFilePath }))

    yield* $(validatePlugins([plugin]))

    const concurrencyLimit = yield* $(T.succeedWith(() => os.cpus().length))

    const allFileEntries = flattenKonfikTrie(plugin, prettyPrint)

    yield* $(
      fs.mkdirp(
        pipe(
          outDir,
          O.getOrElse(() => '.'),
          unknownToPosixFilePath,
        ),
      ),
    )

    yield* $(pipe(allFileEntries, T.forEachParN(concurrencyLimit, writeFile(outDir))))
  })
