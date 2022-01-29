import { WorkspaceConfig as GitpodConfig } from '@gitpod/gitpod-protocol'
import { KonfikFactory } from '@konfik/core'
import { dump } from 'js-yaml'

export const Gitpod = KonfikFactory<GitpodConfig>({
  defaultName: '.gitpod.yml',
  toString(config) {
    return dump(config)
  },
})
