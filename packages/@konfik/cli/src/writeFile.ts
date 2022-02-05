import type { KonfikFileMapEntry } from '@konfik/core'
import { getFactoryConfig } from '@konfik/core'
import { O, pipe, T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import * as path from 'path'

export const writeFile =
  (outDir: O.Option<string>) =>
  ([filePath, fileContents]: KonfikFileMapEntry) => {
    const content = getFactoryConfig(fileContents).toString(fileContents)

    return pipe(
      outDir,
      O.fold(
        () =>
          pipe(
            T.succeedWith(() => process.cwd()),
            T.chain((pwd) => fs.writeFile(path.join(pwd, filePath), content)),
          ),
        (targetDir) => fs.writeFile(path.join(targetDir, filePath), content),
      ),
    )
  }
