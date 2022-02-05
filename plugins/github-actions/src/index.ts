import { KonfikFactory } from '@konfik/core'
import type { Config as PrettierConfig } from 'prettier'

export const GitHubActionsKonfikBrand = Symbol.for('konfik-prettier')
export type GitHubActionsKonfikBrand = typeof GitHubActionsKonfikBrand

export const GitHubActionsKonfik = KonfikFactory<PrettierConfig>()({
  brand: GitHubActionsKonfikBrand,
  toString: (config) => JSON.stringify(config, null, 2),
})
