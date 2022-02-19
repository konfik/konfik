import { KonfikFactory } from '@konfik/core'
import type { PackageJson as PackageJsonRaw } from 'type-fest'

export const PackageJsonKonfikBrand = Symbol.for('@konfik-plugin/package-json')
export type PackageJsonKonfikBrand = typeof PackageJsonKonfikBrand

export const PackageJsonKonfik = KonfikFactory<PackageJsonRaw>()({
  brand: PackageJsonKonfikBrand,
  toString: (config) => {
    if (config.dependencies) {
      config.dependencies = sortObjectAlphabetically(config.dependencies)
    }

    if (config.devDependencies) {
      config.devDependencies = sortObjectAlphabetically(config.devDependencies)
    }

    if (config.peerDependencies) {
      config.peerDependencies = sortObjectAlphabetically(config.peerDependencies)
    }

    return JSON.stringify(config)
  },
  // NOTE we can't simply use `json` here since prettier seems to format `package.json` files with the `json-stringify` parser by default
  // We should come up with a better solution to this
  fileType: 'json-stringify',
})

const sortObjectAlphabetically = <T extends Record<string, any>>(obj: T) => {
  const sorted = {} as T
  Object.keys(obj)
    .sort()
    .forEach((key: keyof T) => {
      sorted[key] = obj[key]
    })
  return sorted
}
