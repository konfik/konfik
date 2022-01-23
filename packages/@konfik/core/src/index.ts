import type { PosixFilePath } from '@konfik/utils'
import { ConfigFactory, _ } from './config-factory.js'

export { ConfigFactory, _ }

export type KonfikPlugin = {
  fileMap: KonfikFileMap
}

export type FileContents = string
export type KonfikFileMap = Map<PosixFilePath, FileContents>
