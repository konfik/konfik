import type { PosixFilePath } from '@konfik/utils'
import { posixFilePath } from '@konfik/utils'

import type { KonfikPlugin } from './common.js'
import type { IsPlaceheld, Placeheld, Placeholder } from './placeholder.js'
import { _ } from './placeholder.js'

export type KonfikPhase<
  Constraint extends Placeheld<Record<PropertyKey, any>>,
  Supplied extends Constraint,
> = KonfikPhase._0<Constraint, Supplied>
namespace KonfikPhase {
  // prettier-ignore
  export type _0<
    Constraint extends Record<PropertyKey, any>,
    Supplied extends Record<PropertyKey, any>,
  > = {
    // Map over all supplied fields containing placeholders or descendants with placeholders.
    [Key in keyof Supplied as IsPlaceheld<Supplied[Key]> extends true ? Key : never]:
      // Alias the version of constraint to recurse without branching.
      Exclude<Constraint, undefined | Placeholder> extends infer ConstraintSafe
        // Checker can't infer that `Key` is a key of `X`, so we help it out.
        ? Key extends keyof ConstraintSafe
          ? Supplied[Key] extends Placeholder
            // If the value is placeheld, we return it as is for the next phase.
            ? ConstraintSafe[Key]
            // Otherwise we recurse.
            : _0<ConstraintSafe[Key], Supplied[Key]>
          : never
        : never;
  }
}

export class KonfikHandle<Blueprint extends Record<PropertyKey, any>> {
  name

  constructor(public configFactoryProps: KonfikFactoryProps<Blueprint>, public config: Blueprint) {
    this.name = configFactoryProps.defaultName
  }

  named(name: string): Exclude<KonfikHandle<Blueprint>, 'name'> {
    this.name = name
    const { named: _named, ...rest } = this
    return rest as any
  }
}

// TODO: decide on globals (such as formatting per-file type)
// TODO: decide whether to add type-level validations. If not, no need for the type param.
export const Konfiks = <KonfikHandles extends KonfikHandle<Record<PropertyKey, any>>[]>(
  ...konfikHandles: KonfikHandles
): KonfikPlugin => {
  const fileMap = konfikHandles.reduce((acc, handle) => {
    const contents = handle.configFactoryProps.toString(handle.config)
    acc.set(posixFilePath(handle.name), contents)
    return acc
  }, new Map<PosixFilePath, string>())

  return { fileMap }
}

// Shout out to @tjjfvi.
type RestoreDocs<Blueprint, Supplied> = [Blueprint | Supplied] extends [Record<PropertyKey, any>]
  ? Pick<
      {
        [Key in keyof Blueprint]: RestoreDocs<Blueprint[Key], Supplied[Key & keyof Supplied]>
      },
      keyof Supplied & keyof Blueprint
    >
  : Supplied

// TODO: optional validation logic included
export type Konfik<Blueprint extends Record<PropertyKey, any>, Base extends Placeheld<Record<PropertyKey, any>>> = <
  Supplied extends Base,
>(
  remainder: [Supplied] extends [unknown] ? RestoreDocs<Blueprint, Supplied> : Supplied,
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
    return !Array.isArray(e) && e !== _ && typeof e === 'object'
  }
}
