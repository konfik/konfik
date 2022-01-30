import type { PosixFilePath } from '@konfik/utils'

export type FileContents = string
export type KonfikFileMap = Record<PosixFilePath, FileContents>

export type KonfikPlugin = KonfikFileMap

// export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
export type KonfikFileMapEntry = [string, FileContents]
