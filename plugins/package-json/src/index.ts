import { KonfikFactory } from '@konfik/core'
import type { PackageJson as PackageJsonRaw } from 'type-fest'

export const PackageJsonKonfikBrand = Symbol.for('@konfik-plugin/package-json')
export type PackageJsonKonfikBrand = typeof PackageJsonKonfikBrand

export const PackageJsonKonfik = KonfikFactory<PackageJsonRaw>()({
  brand: PackageJsonKonfikBrand,
  toString: (config) => JSON.stringify(config, null, 2),
})
