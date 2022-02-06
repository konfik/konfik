import { KonfikFactory } from '@konfik/core'
import type { Tsconfig } from 'tsconfig-type'

export const TsconfigKonfikBrand = Symbol.for('@konfik-plugin/tsconfig')
export type TsconfigKonfikBrand = typeof TsconfigKonfikBrand

export const TsconfigKonfik = KonfikFactory<Tsconfig>()({
  brand: TsconfigKonfikBrand,
  toString: (config) => JSON.stringify(config, null, 2),
  fileType: 'json',
})
