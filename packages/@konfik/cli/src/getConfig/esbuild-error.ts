import { isNotNull, isNotUndefined } from '@konfik/utils'
import { Branded, O, Tagged } from '@konfik/utils/effect'

import type { KnownEsbuildError } from './esbuild.js'

export type PluginImportPath = Branded.Branded<string, 'PluginImportPath'>

export const pluginImportPath = (path_: string): PluginImportPath => {
  // if (!isPosixFilePathString(path_)) {
  //   throw new Error(`Expected a Posix file path, got ${path_}`)
  // }
  return Branded.makeBranded(path_)
}

export const extractPluginImportPaths = (knownError: KnownEsbuildError) => {
  const couldNotResolveRegex = /^Could not resolve "\.konfik\/(?<path>.+)"/

  const pluginImportPaths = knownError.error.errors
    .map((_) => _.text.match(couldNotResolveRegex))
    .filter(isNotNull)
    .map((_) => _.groups?.path)
    .filter(isNotUndefined)
    .map(pluginImportPath)

  return pluginImportPaths
}

export class GitHubData extends Tagged('GitHubData')<{
  readonly owner: string
  readonly repo: string
  readonly hashOrTag?: string
}> {}

export const parseGitHubData = (pluginImportPath: PluginImportPath): O.Option<GitHubData> => {
  const gitHubDataRegex = /^github\.com\/(?<owner>.+)\/(?<repo>.+)(?:\/(?<hashOrTag>.+))?$/
  const match = pluginImportPath.match(gitHubDataRegex)
  if (match === null) return O.none

  const { owner, repo, hashOrTag } = (match.groups ?? {}) as { owner?: string; repo?: string; hashOrTag: string }
  if (owner === undefined || repo === undefined) return O.none

  return O.some(new GitHubData({ owner, repo, hashOrTag }))
}
