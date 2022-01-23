import { ConfigFactory, _ } from '@konfik/core'
import { Tsconfig } from 'tsconfig-type'

export const Ts = ConfigFactory<Tsconfig>({
  defaultName: 'tsconfig.json',
  toString(tsconfig) {
    return JSON.stringify(tsconfig)
  },
})
