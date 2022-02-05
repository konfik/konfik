import { unknownToPosixFilePath } from '@konfik/utils'
import { O, pipe, T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import * as path from 'path'

export const createDirOfFile = (filePath: string) => {
  return fs.mkdirp(unknownToPosixFilePath(path.join(filePath, '..')))
}

export const writeFile =
  (outDir: O.Option<string>) =>
  ([filePath, fileContents]: [string, string]) => {
    return pipe(
      outDir,
      O.fold(
        () =>
          pipe(
            T.succeedWith(() => process.cwd()),
            T.chain((pwd) => {
              const fullyQualifiedFilePath = path.join(pwd, filePath)

              return pipe(
                createDirOfFile(fullyQualifiedFilePath),
                T.zipRight(fs.writeFile(fullyQualifiedFilePath, fileContents)),
              )
            }),
          ),
        (targetDir) => {
          const fullyQualifiedFilePath = path.join(targetDir, filePath)

          return pipe(
            createDirOfFile(fullyQualifiedFilePath),
            T.zipRight(fs.writeFile(fullyQualifiedFilePath, fileContents)),
          )
        },
      ),
    )
  }
