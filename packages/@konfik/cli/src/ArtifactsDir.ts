import type { PosixFilePath } from '@konfik/utils'
import { filePathJoin } from '@konfik/utils'
import type { OT } from '@konfik/utils/effect'
import { pipe, T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'

import type { HasCwd } from './cwd.js'
import { getCwd } from './cwd.js'
import type { GetKonfikVersionError } from './version.js'
import { getKonfikVersion } from './version.js'
// import utilsPkg from '@konfik/utils/package.json'

export namespace ArtifactsDir {
  export const getDirPath = ({ cwd }: { cwd: PosixFilePath }): PosixFilePath =>
    filePathJoin(cwd, 'node_modules' as PosixFilePath, '.konfik' as PosixFilePath)

  export const mkdir: T.Effect<OT.HasTracer & HasCwd, fs.MkdirError, PosixFilePath> = T.gen(function* ($) {
    const cwd = yield* $(getCwd)
    const dirPath = getDirPath({ cwd })
    yield* $(fs.mkdirp(dirPath))

    return dirPath
  })

  export const getCacheDirPath: T.Effect<OT.HasTracer & HasCwd, GetKonfikVersionError, PosixFilePath> = pipe(
    T.struct({
      konfikVersion: getKonfikVersion(),
      cwd: getCwd,
    }),
    T.map(({ konfikVersion, cwd }) =>
      filePathJoin(getDirPath({ cwd }), '.cache' as PosixFilePath, `v${konfikVersion}` as PosixFilePath),
    ),
  )

  export const mkdirCache: T.Effect<OT.HasTracer & HasCwd, fs.MkdirError | GetKonfikVersionError, PosixFilePath> = pipe(
    getCacheDirPath,
    T.tap(fs.mkdirp),
  )
}
