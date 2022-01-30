import type { WorkspaceConfig as GitpodConfig } from '@gitpod/gitpod-protocol'
import { KonfikFactory } from '@konfik/core'
import { dump } from 'js-yaml'

export const GitpodKonfikBrand = Symbol.for('konfik-gitpod')
export type GitpodKonfikBrand = typeof GitpodKonfikBrand

export const GitpodKonfik = KonfikFactory<GitpodConfig>()({
  brand: GitpodKonfikBrand,
  toString: (config) => dump(config),
})
