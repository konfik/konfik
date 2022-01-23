import { KonfikFactory, _ } from '@konfik/core'
import { Tsconfig } from 'tsconfig-type'

export const Ts = KonfikFactory<Tsconfig>({
  defaultName: 'tsconfig.json',
  toString(tsconfig) {
    return JSON.stringify(tsconfig)
  },
})
