import * as CliCommand from '@effect-ts/cli/Command'
import * as CliOptions from '@effect-ts/cli/Options'
import * as Doc from '@effect-ts/printer/Core/Doc'
import * as AnsiColor from '@effect-ts/printer/Terminal/Color'
import type { AnsiDoc } from '@effect-ts/printer/Terminal/Render'
import { renderPrettyDefault } from '@effect-ts/printer/Terminal/Render'
import * as AnsiStyle from '@effect-ts/printer/Terminal/Style'
import { flattenKonfikTrie } from '@konfik/core'
import { Array, Map, O, pipe, T, Tagged } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import type { Change } from 'diff'
import { diffLines } from 'diff'
import * as path from 'node:path'

import { ArtifactsDir } from '../ArtifactsDir.js'
import type { KonfikCliCommand } from '../cli.js'
import { getCwd } from '../cwd.js'
import { getPlugins } from '../getConfig/index.js'
import { validatePlugins } from '../validate.js'
import type { CommonCliOptions } from './common.js'
import { configPathOption } from './common.js'

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

export interface DiffCommandOptions extends CommonCliOptions {}

export class Diff extends Tagged('Diff')<DiffCommandOptions> {}

// -----------------------------------------------------------------------------
// Options
// -----------------------------------------------------------------------------

export const options = CliOptions.struct({
  configPath: configPathOption,
})

export const command: CliCommand.Command<KonfikCliCommand> = pipe(
  CliCommand.make('diff', options),
  CliCommand.map((_) => new Diff(_)),
)

// -----------------------------------------------------------------------------
// Execute
// -----------------------------------------------------------------------------

const contextLines = (lines: Array<string>): Array<AnsiDoc> => lines.map((entry) => Doc.text(` ${entry}`))

const changeLines = (current: Change & { lines: Array<string> }): Array<AnsiDoc> =>
  current.lines.map((entry) =>
    current.added
      ? pipe(Doc.text(`+${entry}`), Doc.annotate(AnsiStyle.color(AnsiColor.green)))
      : pipe(Doc.text(`-${entry}`), Doc.annotate(AnsiStyle.color(AnsiColor.red))),
  )

const getDiff = (oldContents: string, newContents: string) => {
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

export const execute = (options: DiffCommandOptions) =>
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
                    T.succeedWith(() => {
                      const changes = renderChanges(absolutePath, oldContents, newContents)
                      if (changes.length > 0) {
                        console.log(changes)
                      }
                    }),
                ),
              ),
            ),
          )
        }),
      ),
    )
  })
