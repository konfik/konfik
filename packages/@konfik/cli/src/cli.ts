import '@konfik/utils/effect/Tracing/Enable'

import * as CliApp from '@effect-ts/cli/CliApp'
import * as CliCommand from '@effect-ts/cli/Command'
import * as CliExists from '@effect-ts/cli/Exists'
import * as CliHelp from '@effect-ts/cli/Help'
import * as CliOptions from '@effect-ts/cli/Options'
import { runMain } from '@effect-ts/node/Runtime'
import * as Doc from '@effect-ts/printer/Core/Doc'
import * as AnsiColor from '@effect-ts/printer/Terminal/Color'
import type { AnsiDoc } from '@effect-ts/printer/Terminal/Render'
import { renderPrettyDefault } from '@effect-ts/printer/Terminal/Render'
import * as AnsiStyle from '@effect-ts/printer/Terminal/Style'
import { flattenKonfikTrie } from '@konfik/core'
import { unknownToPosixFilePath } from '@konfik/utils'
import { Array, Map, O, pipe, Show, T, Tagged } from '@konfik/utils/effect'
import { provideDummyTracing, provideJaegerTracing } from '@konfik/utils/effect/Tracing'
import { fs } from '@konfik/utils/node'
import type { Change } from 'diff'
import { diffLines } from 'diff'
import * as os from 'node:os'
import * as path from 'node:path'

// import * as util from 'node:util'
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
                    T.succeedWith(() => console.log(renderChanges(absolutePath, oldContents, newContents))),
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

function contextLines(lines: Array<string>): Array<AnsiDoc> {
  return lines.map((entry) => Doc.text(` ${entry}`))
}

function changeLines(current: Change & { lines: Array<string> }): Array<AnsiDoc> {
  return current.lines.map((entry) => {
    if (current.added) {
      return pipe(Doc.text(`+${entry}`), Doc.annotate(AnsiStyle.color(AnsiColor.green)))
    }
    return pipe(Doc.text(`-${entry}`), Doc.annotate(AnsiStyle.color(AnsiColor.red)))
  })
}

function getDiff(oldContents: string, newContents: string) {
  const context = 4
  const diff = pipe(
    diffLines(oldContents, newContents),
    Array.map((change) => ({ ...change, lines: change.value.replace(/\n$/, '').split('\n') })),
    // Append an empty value to make cleanup easier
    Array.prepend({ value: '', lines: [] } as Change & { lines: Array<string> }),
  )

  const hunks = []
  let oldRangeStart = 0
  let newRangeStart = 0
  let curRange: Array<Doc.Doc<AnsiStyle.Style>> = []
  let oldLine = 1
  let newLine = 1
  for (let i = 0; i < diff.length; i++) {
    const current = diff[i]!
    if (current.added || current.removed) {
      // If we have previous context, start with that
      if (!oldRangeStart) {
        const prev = diff[i - 1]
        oldRangeStart = oldLine
        newRangeStart = newLine

        if (prev) {
          curRange = contextLines(prev.lines.slice(-context))
          oldRangeStart -= curRange.length
          newRangeStart -= curRange.length
        }
      }

      // Output our changes
      curRange.push(...changeLines(current))

      // Track the updated file position
      if (current.added) {
        newLine += current.lines.length
      } else {
        oldLine += current.lines.length
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (current.lines.length <= context * 2 && i < diff.length - 2) {
          // Overlapping
          curRange.push(...contextLines(current.lines))
        } else {
          // end the range and output
          const contextSize = Math.min(current.lines.length, context)
          curRange.push(...contextLines(current.lines.slice(0, contextSize)))

          const hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange,
          }
          if (i >= diff.length - 2 && current.lines.length <= context) {
            // EOF is inside this hunk
            const oldEOFNewline = /\n$/.test(oldContents)
            const newEOFNewline = /\n$/.test(newContents)
            const noNlBeforeAdds = current.lines.length == 0 && curRange.length > hunk.oldLines
            if (!oldEOFNewline && noNlBeforeAdds && oldContents.length > 0) {
              const doc = pipe(Doc.text('\\ No newline at end of file'), Doc.annotate(AnsiStyle.color(AnsiColor.red)))
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              // however, if the old file is empty, do not output the no-nl line
              curRange.splice(hunk.oldLines, 0, doc)
            }
            if ((!oldEOFNewline && !noNlBeforeAdds) || !newEOFNewline) {
              const doc = pipe(Doc.text('\\ No newline at end of file'), Doc.annotate(AnsiStyle.color(AnsiColor.red)))
              curRange.push(doc)
            }
          }
          hunks.push(hunk)

          oldRangeStart = 0
          newRangeStart = 0
          curRange = []
        }
      }
      oldLine += current.lines.length
      newLine += current.lines.length
    }
  }

  return hunks.filter(({ lines }) => lines.length > 0)
}

function renderChanges(fileName: string, oldContents: string, newContents: string): string {
  const diff = getDiff(oldContents, newContents)

  // Render an empty diff if there were no changes
  if (diff.length === 0) {
    return ''
  }

  const documents: Array<AnsiDoc> = []

  documents.push(Doc.text('==================================================================='))
  documents.push(pipe(Doc.text(`--- ${fileName}`), Doc.annotate(AnsiStyle.bold)))
  documents.push(pipe(Doc.text(`+++ ${fileName}`), Doc.annotate(AnsiStyle.bold)))

  for (let i = 0; i < diff.length; i++) {
    const hunk = diff[i]!

    // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1
    }
    documents.push(
      pipe(
        Doc.text('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@'),
        Doc.annotate(AnsiStyle.color(AnsiColor.cyan)),
      ),
    )
    documents.push(...hunk.lines)
  }

  return renderPrettyDefault(Doc.vsep(documents))
}
