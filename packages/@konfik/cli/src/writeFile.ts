import { unknownToPosixFilePath } from '@konfik/utils'
import { O, pipe, T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import * as path from 'path'

export const createDirOfFile = (filePath: string) => {
  return fs.mkdirp(unknownToPosixFilePath(path.join(filePath, '..')))
}

export const writeFile =
  (outDir: O.Option<string>) =>
  ([filePath, fileContents]: [string, string]) =>
    pipe(
      O.isSome(outDir)
        ? T.succeed(path.join(outDir.value, filePath))
        : T.succeedWith(() => path.join(process.cwd(), filePath)),
      T.chain((fullPath) => T.zipRight_(createDirOfFile(fullPath), fs.writeFile(fullPath, fileContents))),
    )
