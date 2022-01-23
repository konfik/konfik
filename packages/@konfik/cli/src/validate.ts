import type { KonfikPlugin } from '@konfik/core'
import { T } from '@konfik/utils/effect'

export const validatePlugins = (plugins: KonfikPlugin[]) =>
  T.gen(function* ($) {
    yield* $(T.log(`validatePlugins: ${plugins.length}`))
    // TODO look for duplicate file paths
  })
