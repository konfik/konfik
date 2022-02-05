import { KonfikFactory } from '@konfik/core'
import type { Config as PrettierConfig } from 'prettier'

export const PrettierKonfikBrand = Symbol.for('konfik-prettier')
export type PrettierKonfikBrand = typeof PrettierKonfikBrand

export const PrettierKonfik = KonfikFactory<PrettierConfig>()({
  brand: PrettierKonfikBrand,
  toString: (config) => wrapWithModuleExports(JSON.stringify(config, null, 2)),
})

const wrapWithModuleExports = (exportJson: string) => `module.exports = ${exportJson}`
