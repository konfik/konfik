import { KonfikFactory } from '@konfik/core'
import { PackageJson } from 'type-fest'

export const Package = KonfikFactory<PackageJson>({
  defaultName: 'package.json',
  toString(config) {
    return JSON.stringify(config, null, 2)
  },
})
