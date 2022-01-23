import { md5, xxhash64 } from 'hash-wasm'
import type { JsonValue } from 'type-fest'

import { OT, pipe, T, Tagged } from './effect/index.js'

export const md5Buffer = (buffer: Buffer): T.Effect<OT.HasTracer, HashError, string> =>
  pipe(
    T.tryCatchPromise(
      () => md5(buffer),
      (error) => new HashError({ error }),
    ),
    T.tap((hash) => OT.addAttribute('hashResult', hash)),
    OT.withSpan('md5Buffer'),
  )

export const hashObject = (obj: JsonValue): T.Effect<unknown, HashError, string> => {
  return T.tryCatchPromise(
    () => xxhash64(JSON.stringify(obj)),
    (error) => new HashError({ error }),
  )
}

export class HashError extends Tagged('HashError')<{
  readonly error: unknown
}> {}
