import { Config as PrettierConfig } from 'prettier'
import { KonfikFactory } from '@konfik/core'

export const Prettier = KonfikFactory<PrettierConfig>({
  defaultName: '.prettierrc.json',
  toString(config) {
    return JSON.stringify(config, null, 2)
  },
})
