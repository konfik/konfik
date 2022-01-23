import type { OT } from '@konfik/utils/effect'
import { pipe, T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'
import * as path from 'node:path'
import { fileURLToPath } from 'url'

// use static import once JSON modules are no longer experimental
// import utilsPkg from '@konfik/utils/package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const getKonfikVersion = (): T.Effect<OT.HasTracer, GetKonfikVersionError, string> => {
  // Go one level up for "dist/version.js"
  const packageJsonFilePath = path.join(__dirname, '..', 'package.json')

  return pipe(
    fs.readFileJson(packageJsonFilePath),
    T.map((pkg: any) => pkg.version as string),
    T.catchTag('node.fs.FileNotFoundError', (e) => T.die(e)),
  )
}

export type GetKonfikVersionError = fs.ReadFileError | fs.JsonParseError
