import { KonfikFactory } from '@konfik/core'
import type { Workflow } from '@konfik-generate/github/dist/Workflow'
import { dump } from 'js-yaml'

export const GitHubWorkflowKonfikBrand = Symbol.for('@konfik-plugin/github-workflow')
export type GitHubWorkflowKonfikBrand = typeof GitHubWorkflowKonfikBrand

export const GitHubWorkflowKonfik = KonfikFactory<Workflow>()({
  brand: GitHubWorkflowKonfikBrand,
  // TODO: investigate whether this consistently handles interpolated vars properly.
  toString: (config) => {
    const withVarsQuoted = dump(config)
    return withVarsQuoted
  },
  fileType: 'yaml',
})
