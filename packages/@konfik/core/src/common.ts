import type { PosixFilePath } from '@konfik/utils'
import * as path from 'node:path'

import { getFactoryConfig } from './konfik-factory.js'

export type FileContents = string
export type KonfikFileMap = Record<PosixFilePath, FileContents>

export type KonfikPlugin = KonfikFileMap

// export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
// export type KonfikFileMapEntry = [string, FileContents]

// TODO: revisit typings
export const flattenKonfikTrie = (konfikTrie: object, currentDir = ''): [string, string][] => {
  const current: [string, string][] = []
  const entries = Object.entries(konfikTrie)
  entries.forEach(([k, v]) => {
    try {
      const config = getFactoryConfig(v)
      // HARRY ISN'T SURE.
      current.push([path.join(currentDir, k), config.toString(v)])
    } catch {
      const childPaths = flattenKonfikTrie(v, path.join(currentDir, k))
      current.push(...childPaths)
    }
  })
  return current
}
