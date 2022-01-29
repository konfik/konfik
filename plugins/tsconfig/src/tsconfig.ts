import { KonfikFactory, _ } from '@konfik/core'
import { Tsconfig as TsconfigRaw } from 'tsconfig-type'

export const Tsconfig = KonfikFactory<TsconfigRaw>({
  defaultName: 'tsconfig.json',
  toString(tsconfig) {
    return JSON.stringify(tsconfig)
  },
})
