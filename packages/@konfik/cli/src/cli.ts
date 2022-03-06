import { enableTracing, Layer, O, patchOperators, pipe, T } from '@konfik/utils/effect'

enableTracing()
patchOperators()

import * as CliApp from '@effect-ts/cli/CliApp'
import * as CliCommand from '@effect-ts/cli/Command'
import * as CliHelp from '@effect-ts/cli/Help'
import { runMain } from '@effect-ts/node/Runtime'
import { LiveDummyTracing, makeJaegerNodeTracingLayer } from '@konfik/utils/effect/Tracing'

import * as BuildCommand from './commands/build.js'
import * as DevCommand from './commands/dev.js'
import * as DiffCommand from './commands/diff.js'
import { LiveArtifactService } from './services/ArtifactService.js'
import { LiveCwdService } from './services/CwdService.js'
import { version } from './version.js'

export type KonfikCliCommand = BuildCommand.Build | DiffCommand.Diff | DevCommand.Dev

export const konfikCliCommand = pipe(
  CliCommand.make('konfik'),
  CliCommand.subcommands(BuildCommand.command, DiffCommand.command, DevCommand.command),
)

const cli = CliApp.make({
  name: 'konfik',
  version,
  summary: CliHelp.text('Maintain project configuration with a type-safe DSL'),
  command: konfikCliCommand,
  config: { showBanner: false },
})

const execute = (command: KonfikCliCommand) =>
  pipe(
    command,
    T.matchTag({
      Build: BuildCommand.execute,
      Dev: DevCommand.execute,
      Diff: DiffCommand.execute,
    }),
  )

const LiveTracingService = (serviceName: string) =>
  pipe(
    Layer.fromRawEffect(T.succeedWith(() => O.fromNullable(process.env.KONFIK_OTEL))),
    Layer.chain(
      O.fold(
        () => LiveDummyTracing,
        () => makeJaegerNodeTracingLayer(serviceName),
      ),
    ),
  )

export const run = () =>
  pipe(
    T.succeedWith(() => process.argv.slice(2)),
    T.chain((args) => CliApp.run_(cli, args, execute)),
    T.provideSomeLayer(LiveCwdService['+++'](LiveTracingService('@konfik/cli'))['>+>'](LiveArtifactService)),
    runMain,
  )
