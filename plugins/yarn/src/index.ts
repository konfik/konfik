import { KonfikFactory } from '@konfik/core'
// TODO: modify this type so users don't need to interact with `@yarnpkg/fs`
// import type { ConfigurationValueMap as YarnConfig } from '@yarnpkg/core'
import { dump } from 'js-yaml'

interface YarnConfig {
  nodeLinker: string
  plugins: {
    path: string
    spec: string
  }[]
  yarnPath: string
}

export const Yarn = KonfikFactory<YarnConfig>({
  defaultName: '.yarnrc.yml',
  toString(config) {
    return dump(config)
  },
})
