import type { Clock } from '@effect-ts/core/Effect/Clock'
import type { Has } from '@effect-ts/core/Has'

export * from './ConsoleService.js'

export * from './EnvVar.js'

export type { _A as OutputOf } from '@effect-ts/core/Utils'

export { pipe, flow, identity } from '@effect-ts/core/Function'
export { Tagged } from '@effect-ts/core/Case'
export { tag, service } from '@effect-ts/core/Has'
export type { Has, Tag } from '@effect-ts/core/Has'
export { pretty } from '@effect-ts/core/Effect/Cause'
export { matchTag_ } from '@effect-ts/core/Utils'

export * as Branded from '@effect-ts/core/Branded'

export * as Effect from './Effect.js'
export * as T from './Effect.js'

export * as Sync from '@effect-ts/core/Sync'

export * as STM from '@effect-ts/core/Effect/Transactional/STM'
export * as TRef from '@effect-ts/core/Effect/Transactional/TRef'

export * as Tuple from '@effect-ts/core/Collections/Immutable/Tuple'
export * as Tp from '@effect-ts/core/Collections/Immutable/Tuple'

export * as Array from '@effect-ts/core/Collections/Immutable/Array'

export * as Chunk from './Chunk.js'

export * as Fiber from '@effect-ts/core/Effect/Fiber'
export * as F from '@effect-ts/core/Effect/Fiber'

export * as Layer from '@effect-ts/core/Effect/Layer'
export * as L from '@effect-ts/core/Effect/Layer'

export * as Cause from '@effect-ts/core/Effect/Cause'

export * as Clock from '@effect-ts/core/Effect/Clock'
export type HasClock = Has<Clock>

export * as Schedule from '@effect-ts/core/Effect/Schedule'
export * as SC from '@effect-ts/core/Effect/Schedule'

export * as Stream from './Stream.js'
export * as S from './Stream.js'

export * as Either from '@effect-ts/core/Either'
export * as E from '@effect-ts/core/Either'

export * as Option from '@effect-ts/core/Option'
export * as O from '@effect-ts/core/Option'

export * as Ex from '@effect-ts/core/Effect/Exit'

export * as H from '@effect-ts/core/Effect/Hub'

export * as M from '@effect-ts/core/Effect/Managed'

export * as Q from '@effect-ts/core/Effect/Queue'

export * as Pr from '@effect-ts/core/Effect/Promise'

export * as Ref from '@effect-ts/core/Effect/Ref'

export * as OT from '@effect-ts/otel'
