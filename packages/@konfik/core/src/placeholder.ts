export const _ = Symbol.for('konfik.Placeholder')
export type Placeholder = typeof _

// TODO: do we want to exclude complex types such as `Date`?
export type Placeheld<T extends Record<PropertyKey, any>> = {
  [Key in keyof T]: T[Key] extends any[]
    ? T[Key] | Placeholder
    : T[Key] extends Record<PropertyKey, any>
    ? Placeheld<T[Key]> | Placeholder
    : T[Key] | Placeholder
}

export type IsPlaceheld<T> = [IsPlaceheld._0<T>] extends [never]
  ? false
  : [IsPlaceheld._0<T>] extends [true]
  ? true
  : false
namespace IsPlaceheld {
  export type _0<T> = T extends Placeholder
    ? true
    : T extends any[]
    ? never
    : T extends Record<PropertyKey, any>
    ? {
        [Key in keyof T]: _0<T[Key]>
      }[keyof T]
    : never
}
