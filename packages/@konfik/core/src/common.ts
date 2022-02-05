import type { PosixFilePath } from '@konfik/utils'
import * as path from 'node:path'

import { getFactoryConfig } from './konfik-factory.js'

export type FileContents = string
export type KonfikFileMap = Record<PosixFilePath, FileContents>

export type KonfikPlugin = KonfikFileMap

// export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
// export type KonfikFileMapEntry = [string, FileContents]

// TODO: revisit typings
export const flattenKonfikTrie = (konfikTrie: object, currentDir = ''): [string, object][] => {
  const current: [string, object][] = []
  const entries = Object.entries(konfikTrie)
  entries.forEach(([k, v]) => {
    if (getFactoryConfig(v)) {
      current.push([path.join(currentDir, k), v])
    } else {
      const childPaths = flattenKonfikTrie(v, path.join(currentDir, k))
      current.push(...childPaths)
    }
  })
  return current
}
