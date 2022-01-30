import type { OT } from '@konfik/utils/effect'
import { pipe, T } from '@konfik/utils/effect'
import type { fs } from '@konfik/utils/node'
// NOTE for this to work we're relying on the static json import feature of esbuild (this feature will also be supported in Node.js in the future)
import { version } from '@konfik/utils/package.json'

// TODO refactor this to a static value instead of an effect
export const getKonfikVersion = (): T.Effect<OT.HasTracer, GetKonfikVersionError, string> => {
  return pipe(T.succeed(version))
}

export type GetKonfikVersionError = fs.ReadFileError | fs.JsonParseError
