import { KonfikFactory } from '@konfik/core'
import type { PackageJson as PackageJsonRaw } from 'type-fest'

export const PackageJsonKonfikBrand = Symbol.for('@konfik-plugin/package-json')
export type PackageJsonKonfikBrand = typeof PackageJsonKonfikBrand

export const PackageJsonKonfik = KonfikFactory<PackageJsonRaw>()({
  brand: PackageJsonKonfikBrand,
  toString: (config) => JSON.stringify(config),
  // NOTE we can't simply use `json` here since prettier seems to format `package.json` files with the `json-stringify` parser by default
  // We should come up with a better solution to this
  fileType: 'json-stringify',
})
