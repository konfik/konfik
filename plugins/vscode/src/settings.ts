import { KonfikFactory } from '@konfik/core'

export const VscodeSettingsKonfikBrand = Symbol.for('@konfik-plugin/vscode-settings')
export type VscodeSettingsKonfikBrand = typeof VscodeSettingsKonfikBrand

// TODO: swap out with narrow settings type (BUT AUGMENTABLE / accounting for extensions)
export const VscodeSettingsKonfik = KonfikFactory<Record<string, any>>()({
  brand: VscodeSettingsKonfikBrand,
  toString: (config) => JSON.stringify(config, null, 2),
})
