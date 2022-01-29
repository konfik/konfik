import { KonfikFactory, _ } from '@konfik/core'
import { Tsconfig } from 'tsconfig-type'

export const Ts = KonfikFactory<Tsconfig>({
  defaultName: 'tsconfig.json',
  toString(config) {
    return JSON.stringify(config, null, 2)
  },
})
