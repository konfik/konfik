import * as T from '@effect-ts/core/Effect'
import type { Has, Tag } from '@effect-ts/core/Has'
import { tag } from '@effect-ts/core/Has'

const EnvVarSymbol = Symbol()
type EnvVarSymbol = typeof EnvVarSymbol

export class EnvVarImpl<Name> {
  readonly [EnvVarSymbol] = EnvVarSymbol
  constructor(readonly envVarName: Name, readonly value: string) {}
}

// export const provideEnvVar = <Name extends string, R, E, A>(name: Name): T.Effect<R & Has<EnvVar<Name>>, E, A> =>
//   T.provideService(EnvVarFor(name))(new EnvVarImpl(name, process.env[name]!))

export const provideEnvVar = <Name extends string>(
  envVarName: Name,
): (<R1, E1, A1>(ma: T.Effect<R1 & Has<EnvVar<Name>>, E1, A1>) => T.Effect<R1, E1, A1>) => {
  const value = process?.env?.[envVarName]
  if (value === undefined) {
    return () => T.die(new Error(`Environment variable not found: "${envVarName}"`))
  }
  return T.provideService(EnvVarFor(envVarName))(new EnvVarImpl(envVarName, value))
}

export interface EnvVar<Name extends string> extends EnvVarImpl<Name> {}

export const EnvVarFor = <Name extends string>(envVarName: Name): Tag<EnvVar<Name>> =>
  tag<EnvVar<Name>>(Symbol.for(`env/${envVarName}`))
