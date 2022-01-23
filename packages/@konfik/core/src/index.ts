import type { PosixFilePath } from '@konfik/utils'

export type KonfikPlugin = {
  fileMap: KonfikFileMap
}

export type FileContents = string
export type KonfikFileMap = Map<PosixFilePath, FileContents>
