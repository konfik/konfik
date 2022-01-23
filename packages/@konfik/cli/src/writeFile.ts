import type { KonfikFileMapEntry, KonfikPlugin } from '@konfik/core'
import { T } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'

export const writeFile = ([filePath, fileContents]: KonfikFileMapEntry) =>
  T.gen(function* ($) {
    yield* $(fs.writeFile(filePath, fileContents))
  })
