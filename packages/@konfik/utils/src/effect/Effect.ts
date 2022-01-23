// ets_tracing: off

import { Chunk, Effect as T, Either as E, pipe } from '@effect-ts/core'
import * as Tuple from '@effect-ts/core/Collections/Immutable/Tuple'

// import { flow, identity } from '@effect-ts/core/Function'
// import { matchTag } from '@effect-ts/core/Utils'
import { RawError } from '../index.js'

export * from '@effect-ts/core/Effect'

export const forEachArray_ = <R, E, A, B>(as: Iterable<A>, f: (a: A) => T.Effect<R, E, B>, __trace?: string) =>
  pipe(T.forEach_(as, f), T.map(Chunk.toArray))

export const forEachArray =
  <A, R, E, B>(f: (a: A) => T.Effect<R, E, B>, __trace?: string) =>
  (as: Iterable<A>) =>
    forEachArray_(as, f, __trace)

export const log = (...args: any[]) =>
  T.succeedWith(() => {
    console.log(...args)
  })

export const rightOrFail = <R, E1, EE1, A>(
  effect: T.Effect<R, E1, E.Either<EE1, A>>,
  __trace?: string,
): T.Effect<R, E1 | EE1, A> =>
  T.chain_(
    effect,
    E.fold(
      (x) => T.fail(x, __trace),
      (x) => T.succeed(x, __trace),
    ),
  )

export const eitherMap =
  <A1, A2>(mapRight: (a1: A1) => A2) =>
  <R, E1, EE1>(effect: T.Effect<R, E1, E.Either<EE1, A1>>, __trace?: string): T.Effect<R, E1, E.Either<EE1, A2>> =>
    T.map_(effect, E.map(mapRight))

export const chainMergeObject =
  <T2, E2, A1 extends {}, A2 extends {}>(effect: (a1: A1) => T.Effect<T2, E2, A2>) =>
  <T1, E1>(self: T.Effect<T1, E1, A1>): T.Effect<T1 & T2, E1 | E2, A1 & A2> =>
    T.chain_(self, (a1) =>
      pipe(
        effect(a1),
        T.map((a2) => ({ ...a1, ...a2 })),
      ),
    )

export const forEachParDict =
  <A, R, E, B>(args: { mapKey: (a: A) => T.Effect<R, E, string>; mapValue: (a: A) => T.Effect<R, E, B> }) =>
  (as: Iterable<A>): T.Effect<R, E, Record<string, B>> =>
    forEachParDict_(as, args)

export const forEachParDict_ = <A, R, E, B>(
  as: Iterable<A>,
  {
    mapKey,
    mapValue,
  }: {
    mapKey: (a: A) => T.Effect<R, E, string>
    mapValue: (a: A) => T.Effect<R, E, B>
  },
): T.Effect<R, E, Record<string, B>> =>
  pipe(
    as,
    T.forEach((a) => T.tuplePar(mapKey(a), mapValue(a))),
    T.map(Chunk.map(Tuple.toNative)),
    T.map(Chunk.toArray),
    T.map(Object.fromEntries),
  )

export const tryPromiseRaw = <A>(promise: () => Promise<A>) =>
  T.tryCatchPromise(promise, (error) => new RawError({ error }))

/** Note that if `tapError` fails, E2 fails instead of E1 */
export const tapErrorTag =
  <R2, TTag extends E1['_tag'] & string, E1 extends { _tag: string }, E2>(
    tag: TTag,
    tapFn: (err: Extract<E1, { _tag: TTag }>) => T.Effect<R2, E2, unknown>,
    __trace?: string,
  ) =>
  <R1, A>(eff: T.Effect<R1, E1, A>): T.Effect<R1 & R2, E1 | E2, A> =>
    T.catchTag_(
      eff,
      tag,
      (error) =>
        pipe(
          tapFn(error),
          T.chain(() => T.fail(error)),
        ),
      __trace,
    )

// export const mapErrorMatchTag =
//   <
//     E_in extends { _tag: Tag_in },
//     E_out extends { _tag: string },
//     Tag_in extends string,
//     // Match extends { [P in E_in['_tag']]: (e: E_in & { _tag: P }) => E_out },
//   >(match: { [P in E_in['_tag']]: (e: E_in & { _tag: P }) => E_out }) =>
//   <R, A>(eff: T.Effect<R, E_in, A>): T.Effect<R, E_out, A> => {
//     return T.mapError_(eff, (error) => {
//       const errorHandler = match[error._tag]
//       if (errorHandler) {
//         return errorHandler(error)
//       }

//       return error as unknown as E_out
//     })
//   }

// type MatchArg = Parameters<typeof matchTag>[0]

// export const matchErrorTag =
//   <M extends MatchArg>(matchMap: M) =>
//   <R, E extends {_tag: string}, A>(eff: T.Effect<R, E, A>) =>
//     pipe(eff, T.mapError(matchTag(matchMap, identity)))
