import type { PosixFilePath } from '@konfik/utils'
import { unknownToPosixFilePath } from '@konfik/utils'
import type { Has } from '@konfik/utils/effect'
import { Layer, service, T, tag } from '@konfik/utils/effect'

export const CwdServiceId = Symbol.for('@konfik/cli/CwdService')
export type CwdServiceId = typeof CwdServiceId

export interface CwdService {
  readonly [CwdServiceId]: CwdServiceId
  readonly cwd: PosixFilePath
}

export const makeCwdService = T.gen(function* ($) {
  // The value of `process.env.INIT_CWD` is set by `yarn` or `npm` during
  // installation
  const cwd = yield* $(T.succeedWith(() => unknownToPosixFilePath(process.env.INIT_CWD ?? process.cwd())))

  return service({
    [CwdServiceId]: CwdServiceId as CwdServiceId,
    cwd,
  })
})

export const CwdService = tag<CwdService>(CwdServiceId)

export type HasCwdService = Has<CwdService>

export const LiveCwdService = Layer.fromEffect(CwdService)(makeCwdService)

export const { cwd: accessCwd } = T.deriveLifted(CwdService)([], [], ['cwd'])

export const provideCwd = T.provideServiceM(CwdService)(makeCwdService)
