import type { KonfikFileMapEntry } from '@konfik/core'
import { O, pipe, T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import * as path from 'path'

export const writeFile =
  (outDir: O.Option<string>) =>
  ([filePath, fileContents]: KonfikFileMapEntry) => {
    return pipe(
      outDir,
      O.fold(
        () =>
          pipe(
            T.succeedWith(() => process.cwd()),
            T.chain((pwd) => fs.writeFile(path.join(pwd, filePath), fileContents.toString())),
          ),
        (targetDir) => fs.writeFile(path.join(targetDir, filePath), fileContents.toString()),
      ),
    )
  }
