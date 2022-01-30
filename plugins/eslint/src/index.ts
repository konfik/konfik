import { KonfikFactory } from '@konfik/core'
import type { Linter } from 'eslint'

export const EslintKonfikBrand = Symbol.for('konfik-eslint')
export type PackageJsonBrand = typeof EslintKonfikBrand

export const EslintKonfik = KonfikFactory<Linter.Config>()({
  brand: EslintKonfikBrand,
  toString(config) {
    return JSON.stringify(config, null, 2)
  },
})
