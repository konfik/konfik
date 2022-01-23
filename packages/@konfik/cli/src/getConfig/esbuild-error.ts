import { Branded, T } from '@konfik/utils/effect'

import type { KnownEsbuildError } from './esbuild'

export type PluginImportPath = Branded.Branded<string, 'PluginImportPath'>

export const pluginImportPath = (path_: string): PluginImportPath => {
  // if (!isPosixFilePathString(path_)) {
  //   throw new Error(`Expected a Posix file path, got ${path_}`)
  // }
  return Branded.makeBranded(path_)
}

export const extractPluginImportPaths = (knownError: KnownEsbuildError) =>
  T.gen(function* ($) {
    return null
  })
