import type { KonfikPlugin } from '@konfik/core'
import { T } from '@konfik/utils/src/effect'

export const writeFileForPlugin = (plugin: KonfikPlugin) =>
  T.gen(function* ($) {
    yield* $(T.log(`writeFileForPlugin: ${plugin}`))
  })
