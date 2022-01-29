import { Linter } from 'eslint'
import { KonfikFactory } from '@konfik/core'

export const Eslint = KonfikFactory<Linter.Config>({
  defaultName: '.eslintrc.json',
  toString(config) {
    return JSON.stringify(config)
  },
})
