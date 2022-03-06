export * from './string.js'
export * from './guards.js'
export * from './object/index.js'
export * from './promise.js'
export * from './hash.js'
export * from './time.js'
export * from './single-item.js'
export * from './file-paths.js'
export * from './types.js'
export { stripMargin } from '@effect-ts/core/String'

export { v4 as uuid } from 'uuid'

import { Tagged } from '@effect-ts/core/Case'

export type Prettify<T> = T extends infer U ? { [K in keyof U]: Prettify<U[K]> } : never

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const recRemoveUndefinedValues = (val: any): void => {
  if (Array.isArray(val)) {
    val.forEach(recRemoveUndefinedValues)
  } else if (typeof val === 'object') {
    Object.keys(val).forEach((key) => {
      if (val[key] === undefined) {
        delete val[key]
      } else {
        recRemoveUndefinedValues(val[key])
      }
    })
  }
}

export const partition = <T>(arr: T[], isLeft: (_: T) => boolean): [T[], T[]] => {
  return arr.reduce(
    (acc, el) => {
      if (isLeft(el)) {
        acc[0].push(el)
      } else {
        acc[1].push(el)
      }
      return acc
    },
    [[], []] as [T[], T[]],
  )
}

export const prop =
  <T extends {}, K extends keyof T>(key: K) =>
  (obj: T): T[K] =>
    obj[key]

export const errorToString = (error: any) => {
  const stack = process.env.CL_DEBUG ? error.stack : undefined
  const str = error.toString()
  const stackStr = stack ? `\n${stack}` : ''
  if (str !== '[object Object]') return str + stackStr

  return JSON.stringify({ ...error, stack }, null, 2)
}

export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Use this to make assertion at end of if-else chain that all members of a
 * union have been accounted for.
 */
/* eslint-disable-next-line prefer-arrow/prefer-arrow-functions */
export function casesHandled(x: never): never {
  throw new Error(`A case was not handled for value: ${JSON.stringify(x)}`)
}

export type Thunk<T> = () => T

export const unwrapThunk = <T>(_: T | (() => T)): T => {
  if (typeof _ === 'function') {
    return (_ as any)()
  } else {
    return _
  }
}

export class RawError extends Tagged('RawError')<{ readonly error: any }> {}
