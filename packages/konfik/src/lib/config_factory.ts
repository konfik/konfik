export const _ = Symbol.for("konfik.Placeholder");
export type Placeholder = typeof _;

// TODO: do we want to exclude complex types such as `Date`?
export type Placeheld<T extends Record<PropertyKey, any>> = {
  [Key in keyof T]: T[Key] extends any[]
    ? T[Key] | Placeholder
    : T[Key] extends Record<PropertyKey, any>
    ? Placeheld<T[Key]> | Placeholder
    : T[Key] | Placeholder;
};

export type IsPlaceheld<T> = [IsPlaceheld._0<T>] extends [never]
  ? false
  : [IsPlaceheld._0<T>] extends [true]
  ? true
  : false;
namespace IsPlaceheld {
  export type _0<T> = T extends Placeholder
    ? true
    : T extends any[]
    ? never
    : T extends Record<PropertyKey, any>
    ? {
        [Key in keyof T]: _0<T[Key]>;
      }[keyof T]
    : never;
}

export type ConfigPhase<
  Constraint extends Placeheld<Record<PropertyKey, any>>,
  Supplied extends Constraint
> = ConfigPhase._0<Constraint, Supplied>;
namespace ConfigPhase {
  export type _0<
    Constraint extends Record<PropertyKey, any>,
    Supplied extends Record<PropertyKey, any>
  > = {
    [Key in keyof Supplied as IsPlaceheld<Supplied[Key]> extends true
      ? Key
      : never]: Key extends keyof Exclude<Constraint, undefined | Placeholder>
      ? Supplied[Key] extends Placeholder
        ? Exclude<Constraint, undefined | Placeholder>[Key]
        : _0<Exclude<Constraint, undefined | Placeholder>[Key], Supplied[Key]>
      : never;
  };
}

export type Config<Base extends Placeheld<Record<PropertyKey, any>>> = <
  Supplied extends Base
>(
  remainder: Supplied
) => IsPlaceheld<Supplied> extends true
  ? Config<ConfigPhase<Base, Supplied>>
  : CfgHandle;

// TODO: do we care about representing the configuration within this type?
// Would it make the checker will go kaboom?
// Would there be any any tangible benefit to the DX?
export class CfgHandle {
  constructor(private config: any) {}

  synth() {
    // TODO
  }
}

export declare const ConfigFactory: <
  Blueprint extends Record<PropertyKey, any>
>() => Config<Placeheld<Blueprint>>;
