import { KonfikFactory } from '@konfik/core'
import type * as WorkflowTypes from '@konfik-generate/github/dist/src/Workflow'
import { dump } from 'js-yaml'

export type { WorkflowTypes }

export const GitHubWorkflowKonfikBrand = Symbol.for('@konfik-plugin/github-workflow')
export type GitHubWorkflowKonfikBrand = typeof GitHubWorkflowKonfikBrand

export const GitHubWorkflowKonfik = KonfikFactory<WorkflowTypes.Workflow>()({
  brand: GitHubWorkflowKonfikBrand,
  // TODO: investigate whether this consistently handles interpolated vars properly.
  toString: (config) => {
    const withVarsQuoted = dump(config, { noRefs: true })
    return withVarsQuoted
  },
  fileType: 'yaml',
})
