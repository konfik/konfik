import '@konfik/utils/effect/Tracing/Enable'

import * as CliApp from '@effect-ts/cli/CliApp'
import * as Command from '@effect-ts/cli/Command'
import * as Options from '@effect-ts/cli/Options'
import { runMain } from '@effect-ts/node/Runtime'
import { pipe, T, Tagged } from '@konfik/utils/effect'
import { provideDummyTracing, provideJaegerTracing } from '@konfik/utils/effect/Tracing'

import { provideCwd } from './cwd.js'
import { getConfig } from './getConfig/index.js'

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

export type KonfikCliCommand = Build

export class Build extends Tagged('Build')<{}> {}

// -----------------------------------------------------------------------------
// Args
// -----------------------------------------------------------------------------

// const taskQs = Object.values(taskQueues).map((_) => Tp.tuple(_.name, _))
// export const queuesArg = pipe(Args.namedEnumeration('taskQueue', taskQs[0] as any, ...taskQs.slice(1)), Args.repeat)

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

export const buildCommand: Command.Command<KonfikCliCommand> = pipe(
  Command.make('build', Options.none),
  Command.map(() => new Build()),
)

export const konfikCliCommand = pipe(Command.make('konfik'), Command.subcommands(buildCommand))

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

const cli = CliApp.make({
  name: 'test',
  version: '0.1.0',
  command: konfikCliCommand,
})

const build = T.gen(function* ($) {
  const config = yield* $(getConfig({ configPath: undefined }))
})

const execute = (command: KonfikCliCommand) =>
  pipe(
    command,
    T.matchTag({
      Build: () => build,
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
