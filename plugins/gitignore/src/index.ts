import { KonfikFactory } from '@konfik/core'

export const GitignoreKonfikBrand = Symbol.for('@konfik-plugin/gitignore')
export type GitignoreKonfikBrand = typeof GitignoreKonfikBrand

export const GitignoreKonfik = KonfikFactory<string[]>()({
  brand: GitignoreKonfikBrand,
  toString: (config) => config.join('\n'),
})
