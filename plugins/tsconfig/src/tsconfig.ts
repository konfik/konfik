import { _, KonfikFactory } from '@konfik/core'
import type { Tsconfig as TsconfigRaw } from 'tsconfig-type'

export const Tsconfig = KonfikFactory<TsconfigRaw>({
  defaultName: 'tsconfig.json',
  toString(tsconfig) {
    return JSON.stringify(tsconfig)
  },
})
