import { KonfikFactory } from '@konfik/core'

export const Gitignore = KonfikFactory<string[]>({
  defaultName: '.gitignore',
  toString(config) {
    return config.join('\n')
  },
})
