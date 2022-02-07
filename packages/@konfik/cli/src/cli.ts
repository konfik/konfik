import '@konfik/utils/effect/Tracing/Enable'

import * as CliApp from '@effect-ts/cli/CliApp'
import * as CliCommand from '@effect-ts/cli/Command'
import * as CliHelp from '@effect-ts/cli/Help'
import { runMain } from '@effect-ts/node/Runtime'
import { pipe, T } from '@konfik/utils/effect'
import { provideDummyTracing, provideJaegerTracing } from '@konfik/utils/effect/Tracing'

import * as BuildCommand from './commands/build.js'
import * as DiffCommand from './commands/diff.js'
import { provideCwd } from './cwd.js'
import { version } from './version.js'

export type KonfikCliCommand = BuildCommand.Build | DiffCommand.Diff

export const konfikCliCommand = pipe(
  CliCommand.make('konfik'),
  CliCommand.subcommands(BuildCommand.command, DiffCommand.command),
)

const cli = CliApp.make({
  name: 'konfik',
  version,
  summary: CliHelp.text('Scaffold project configuration with a type-safe DSL'),
  command: konfikCliCommand,
  config: { showBanner: false },
})

const execute = (command: KonfikCliCommand) =>
  pipe(
    command,
    T.matchTag({
      Build: (_) => BuildCommand.execute(_),
      Diff: (_) => DiffCommand.execute(_),
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
