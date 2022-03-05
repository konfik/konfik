import { KonfikFactory } from '@konfik/core'

import type { TaskConfiguration } from './types/tasks-types-docs.js'

export const VscodeTasksKonfikBrand = Symbol.for('@konfik-plugin/vscode-tasks')
export type VscodeTasksKonfikBrand = typeof VscodeTasksKonfikBrand

// TODO: swap out with narrow tasks type (BUT AUGMENTABLE / accounting for extensions)
export const VscodeTasksKonfik = KonfikFactory<TaskConfiguration>()({
  brand: VscodeTasksKonfikBrand,
  toString: (config) => JSON.stringify(config),
  fileType: 'json',
})
