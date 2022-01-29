import '@konfik/utils/effect/Tracing/Enable'

import * as CliApp from '@effect-ts/cli/CliApp'
import * as Command from '@effect-ts/cli/Command'
import * as Help from '@effect-ts/cli/Help'
import * as Options from '@effect-ts/cli/Options'
import { runMain } from '@effect-ts/node/Runtime'
import type { O } from '@konfik/utils/effect'
import { pipe, Show, T, Tagged } from '@konfik/utils/effect'
import { provideDummyTracing, provideJaegerTracing } from '@konfik/utils/effect/Tracing'
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

export const configPathOption = pipe(Options.file('config'), Options.alias('c'), Options.optional(Show.string))

export const outDirOption = pipe(Options.directory('outDir'), Options.alias('o'), Options.optional(Show.string))

export const buildOptions = Options.struct({
  outDir: outDirOption,
  configPath: configPathOption,
})

export const buildCommand: Command.Command<KonfikCliCommand> = pipe(
  Command.make('build', buildOptions),
  Command.map((_) => new Build(_)),
)

export const konfikCliCommand = pipe(Command.make('konfik'), Command.subcommands(buildCommand))

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

const cli = CliApp.make({
  name: 'konfik',
  version: '0.1.0',
  summary: Help.text('Scaffold project configuration with a type-safe DSL'),
  command: konfikCliCommand,
})

const build = (options: BuildCommandOptions) =>
  T.gen(function* ($) {
    const plugins = yield* $(getPlugins({ configPath: options.configPath }))

    yield* $(validatePlugins(plugins))

    const concurrencyLimit = os.cpus().length

    const allFileEntries = plugins.flatMap((_) => Array.from(_.fileMap.entries()))

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
