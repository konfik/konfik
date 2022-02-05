import type { KonfikFileMap } from '@konfik/core'
import { KonfikFactory } from '@konfik/core'
import type { Config as PrettierConfig } from 'prettier'
import { format } from 'prettier'

export { PrettierConfig }

export const PrettierKonfikBrand = Symbol.for('konfik-prettier')
export type PrettierKonfikBrand = typeof PrettierKonfikBrand

export const PrettierKonfik = KonfikFactory<PrettierConfig>()({
  brand: PrettierKonfikBrand,
  toString: (config) => wrapWithModuleExports(JSON.stringify(config, null, 2)),
})

const wrapWithModuleExports = (exportJson: string) => `module.exports = ${exportJson}`

export const GlobalPrettierPlugin = (files: KonfikFileMap): KonfikFileMap => {
  const formatted = Object.fromEntries(
    Object.entries(files).map(([name, contents]) => {
      return [name, format(contents)]
    }),
  )
  return formatted
}
