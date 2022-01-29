import { KonfikFactory } from '@konfik/core'
import type { PackageJson as PackageJsonRaw } from 'type-fest'

export const PackageJson = KonfikFactory<PackageJsonRaw>({
  defaultName: 'package.json',
  toString(config) {
    return JSON.stringify(config, null, 2)
  },
})
