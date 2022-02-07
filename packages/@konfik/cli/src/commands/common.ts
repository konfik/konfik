import * as CliOptions from '@effect-ts/cli/Options'
import type { O } from '@konfik/utils/effect'
import { pipe, Show } from '@konfik/utils/effect'

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

export interface CommonCliOptions {
  readonly configPath: O.Option<string>
}

// -----------------------------------------------------------------------------
// Options
// -----------------------------------------------------------------------------

export const configPathOption = pipe(CliOptions.file('config'), CliOptions.alias('c'), CliOptions.optional(Show.string))
