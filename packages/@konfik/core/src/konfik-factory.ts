import { _, Placeholder, Placeheld, IsPlaceheld } from './placeholder.js'
import { posixFilePath, PosixFilePath } from '@konfik/utils'

export type FileContents = string
export type KonfikFileMap = Map<PosixFilePath, FileContents>

export type KonfikPhase<
  Constraint extends Placeheld<Record<PropertyKey, any>>,
  Supplied extends Constraint,
> = KonfikPhase._0<Constraint, Supplied>
namespace KonfikPhase {
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

export class KonfikHandle<Blueprint extends Record<PropertyKey, any>> {
  name

  constructor(public configFactoryProps: KonfikFactoryProps<Blueprint>, public config: any) {
    this.name = configFactoryProps.defaultName
  }

  named(name: string): KonfikHandle<Blueprint> {
    this.name = name
    return this
  }
}

// TODO: decide whether to add type-level validations. If not, no need for the type param.
export const Konfiks = <KonfikHandles extends KonfikHandle<Record<PropertyKey, any>>[]>(
  ...konfikHandles: KonfikHandles
): KonfikFileMap => {
  return konfikHandles.reduce((acc, handle) => {
    const contents = handle.configFactoryProps.toString(handle.config)
    acc.set(posixFilePath(handle.name), contents)
    return acc
  }, new Map<PosixFilePath, string>())
}

export type Konfik<Blueprint extends Record<PropertyKey, any>, Base extends Placeheld<Record<PropertyKey, any>>> = <
  Supplied extends Base,
>(
  remainder: Supplied,
) => IsPlaceheld<Supplied> extends true ? Konfik<Blueprint, KonfikPhase<Base, Supplied>> : KonfikHandle<Blueprint>

export interface KonfikFactoryProps<Blueprint extends Record<PropertyKey, any>> {
  // TODO: determine what the right approach to rooting is
  defaultName: string
  toString(config: Blueprint): string
}

export const KonfikFactory = <Blueprint extends Record<PropertyKey, any>>(
  props: KonfikFactoryProps<Blueprint>,
): Konfik<Blueprint, Placeheld<Blueprint>> => {
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
    return new KonfikHandle(props, configOrPartial)
  }
  return phaseConfig as Konfik<Blueprint, Placeheld<Blueprint>>

  function deepMerge(a: any, b: any): any {
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

  function shouldVisit(e: any): boolean {
    // TODO: is the ! instanceof ConfigHandle check necessary? Is there another way to do this?
    return !Array.isArray(e) && e !== _ && typeof e === 'object'
  }
}
