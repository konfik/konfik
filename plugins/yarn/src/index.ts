import { KonfikFactory } from '@konfik/core'
// TODO: determine what other things need to be generated (`.yarn`)
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

export const YarnKonfikBrand = Symbol.for('konfik-yarn')
export type YarnKonfikBrand = typeof YarnKonfikBrand

export const YarnKonfik = KonfikFactory<YarnConfig>()({
  brand: YarnKonfikBrand,
  toString: (config) => dump(config),
})
