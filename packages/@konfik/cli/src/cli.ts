import '@konfik/utils/effect/Tracing/Enable'

import * as CliApp from '@effect-ts/cli/CliApp'
import * as CliCommand from '@effect-ts/cli/Command'
import * as CliExists from '@effect-ts/cli/Exists'
import * as CliHelp from '@effect-ts/cli/Help'
import * as CliOptions from '@effect-ts/cli/Options'
import { runMain } from '@effect-ts/node/Runtime'
import { unknownToPosixFilePath } from '@konfik/utils'
import { O, pipe, Show, T, Tagged } from '@konfik/utils/effect'
import { provideDummyTracing, provideJaegerTracing } from '@konfik/utils/effect/Tracing'
import { fs } from '@konfik/utils/src/node/index.js'
import * as os from 'node:os'

import { provideCwd } from './cwd.js'
import { getPlugins } from './getConfig/index.js'
import { validatePlugins } from './validate.js'
import { writeFile } from './writeFile.js'

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

export type KonfikCliCommand = Build

export interface BuildCommandOptions {
  readonly configPath: O.Option<string>
  readonly outDir: O.Option<string>
}

export class Build extends Tagged('Build')<BuildCommandOptions> {}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

export const configPathOption = pipe(CliOptions.file('config'), CliOptions.alias('c'), CliOptions.optional(Show.string))

export const outDirOption = pipe(
  CliOptions.directory('outDir', CliExists.either),
  CliOptions.alias('o'),
  CliOptions.optional(Show.string),
)

export const buildOptions = CliOptions.struct({
  outDir: outDirOption,
  configPath: configPathOption,
})

export const buildCommand: CliCommand.Command<KonfikCliCommand> = pipe(
  CliCommand.make('build', buildOptions),
  CliCommand.map((_) => new Build(_)),
)

export const konfikCliCommand = pipe(CliCommand.make('konfik'), CliCommand.subcommands(buildCommand))

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

const cli = CliApp.make({
  name: 'konfik',
  version: '0.1.0',
  summary: CliHelp.text('Scaffold project configuration with a type-safe DSL'),
  command: konfikCliCommand,
  config: { showBanner: false },
})

const build = (options: BuildCommandOptions) =>
  T.gen(function* ($) {
    const plugins = yield* $(getPlugins({ configPath: options.configPath }))

    yield* $(validatePlugins(plugins))

    const concurrencyLimit = os.cpus().length

    const allFileEntries = plugins.flatMap((_) => Object.entries(_))

    fs.mkdirp(
      pipe(
        options.outDir,
        O.getOrElse(() => '.'),
        unknownToPosixFilePath,
      ),
    )

    yield* $(pipe(allFileEntries, T.forEachParN(concurrencyLimit, writeFile(options.outDir))))
  })

const execute = (command: KonfikCliCommand) =>
  pipe(
    command,
    T.matchTag({
      Build: (_) => build(_),
    }),
  )

const provideTracing = () =>
  process.env.KONFIK_OTEL !== undefined ? provideJaegerTracing('konfik-cli') : provideDummyTracing()

export const run = () =>
  pipe(
    T.succeedWith(() => process.argv.slice(2)),
    T.chain((args) => CliApp.run_(cli, args, execute)),
    provideTracing(),
    provideCwd,
    runMain,
  )
