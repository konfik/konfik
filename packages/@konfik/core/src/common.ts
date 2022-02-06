import type { PosixFilePath } from '@konfik/utils'
import * as path from 'node:path'

import type { FileType } from './konfik-factory.js'
import { getFactoryConfig } from './konfik-factory.js'

export type FileContents = string
export type KonfikFileMap = Record<PosixFilePath, FileContents>

export type KonfikPlugin = KonfikFileMap

export type PrettyPrint = (str: string, fileType: FileType) => string

// export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
// export type KonfikFileMapEntry = [string, FileContents]

// TODO: revisit typings
export const flattenKonfikTrie = (
  konfikTrie: object,
  prettyPrint: PrettyPrint,
  currentDir = '',
): [filePath: string, contents: string][] => {
  const current: [string, string][] = []
  const entries = Object.entries(konfikTrie)
  entries.forEach(([k, v]) => {
    try {
      const config = getFactoryConfig(v)
      const content = prettyPrint(config.toString(v), config.fileType)
      // HARRY ISN'T SURE.
      current.push([path.join(currentDir, k), content])
    } catch {
      const childPaths = flattenKonfikTrie(v, prettyPrint, path.join(currentDir, k))
      current.push(...childPaths)
    }
  })
  return current
}
