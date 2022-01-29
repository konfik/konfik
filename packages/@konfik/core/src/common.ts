import type { PosixFilePath } from '@konfik/utils'
import { posixFilePath } from '@konfik/utils'

export type FileContents = string
export type KonfikFileMap = Map<PosixFilePath, FileContents>

export type KonfikPlugin = {
  fileMap: KonfikFileMap
}

export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
