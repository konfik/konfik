import type { PosixFilePath } from '@konfik/utils'
import { posixFilePath } from '@konfik/utils'

export type FileContents = string
export type KonfikFileMap = Map<PosixFilePath, FileContents>
