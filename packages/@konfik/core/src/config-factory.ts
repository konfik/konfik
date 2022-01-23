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

export type ConfigPhase<
  Constraint extends Placeheld<Record<PropertyKey, any>>,
  Supplied extends Constraint,
> = ConfigPhase._0<Constraint, Supplied>
namespace ConfigPhase {
  export type _0<Constraint extends Record<PropertyKey, any>, Supplied extends Record<PropertyKey, any>> = {
    [Key in keyof Supplied as IsPlaceheld<Supplied[Key]> extends true ? Key : never]: Key extends keyof Exclude<
      Constraint,
      undefined | Placeholder
    >
      ? Supplied[Key] extends Placeholder
        ? Exclude<Constraint, undefined | Placeholder>[Key]
        : _0<Exclude<Constraint, undefined | Placeholder>[Key], Supplied[Key]>
      : never
  }
}

export type Config<Base extends Placeheld<Record<PropertyKey, any>>> = <Supplied extends Base>(
  remainder: Supplied,
) => IsPlaceheld<Supplied> extends true ? Config<ConfigPhase<Base, Supplied>> : ConfigHandle

// TODO: do we care about representing the configuration within this type?
// Would it make the checker will go kaboom?
// Would there be any any tangible benefit to the DX?
export class ConfigHandle {
  constructor(public configFactoryProps: ConfigFactoryProps<Record<PropertyKey, any>>, public config: any) {}

  synth(): string {
    return this.configFactoryProps.toString(this.config)
  }
}

export interface ConfigFactoryProps<Blueprint extends Record<PropertyKey, any>> {
  // TODO: determine what the right approach to rooting is
  defaultName: string
  toString(config: Blueprint): string
}

type ConfigFactory = <Blueprint extends Record<PropertyKey, any>>(
  props: ConfigFactoryProps<Blueprint>,
) => Config<Placeheld<Blueprint>>

// TODO: fix typing
export const ConfigFactory: ConfigFactory = ((props: any) => {
  const phaseConfig = (configOrPartial: any) => {
    const visit: any[] = Object.values(configOrPartial)
    while (visit.length) {
      const current = visit.shift()
      if (current === _) {
        return (nextConfigOrPartial: any) => {
          return phaseConfig(deepMerge(configOrPartial, nextConfigOrPartial))
        }
      } else if (shouldVisit(current)) {
        visit.push(...Object.values(current))
      }
    }
    return new ConfigHandle(props, configOrPartial)
  }
  return phaseConfig
}) as any

const deepMerge = (a: any, b: any): any => {
  const next: any = {}
  for (const key in b) {
    if (a[key]) {
      if (shouldVisit(a[key])) {
        next[key] = deepMerge(a[key], b[key])
      } else {
        next[key] = b[key]
      }
    } else {
      next[key] = b[key]
    }
  }
  for (const key in a) {
    if (!next[key]) {
      next[key] = a[key]
    }
  }
  return next
}

const shouldVisit = (e: any): boolean => {
  // TODO: is the ! instanceof ConfigHandle check necessary? Is there another way to do this?
  return !Array.isArray(e) && e !== _ && !(e instanceof ConfigHandle) && typeof e === 'object'
}
