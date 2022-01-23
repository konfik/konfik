export const isNotUndefined = <T>(_: T | undefined): _ is T => _ !== undefined

export const isNotNull = <T>(_: T | null): _ is T => _ !== null
export const isUndefined = <T>(_: T | undefined): _ is undefined => _ === undefined
