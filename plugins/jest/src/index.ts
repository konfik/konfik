import type { Config } from '@jest/types'
import { KonfikFactory } from '@konfik/core'

export const JestKonfikBrand = Symbol.for('@konfik-plugin/jest')
export type JestKonfikBrand = typeof JestKonfikBrand

export const JestKonfik = KonfikFactory<Config.InitialOptions>()({
  brand: JestKonfikBrand,
  toString: (config) => JSON.stringify(config, null, 2),
  fileType: 'json',
})
