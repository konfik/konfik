import { pipe, T } from '@konfik/utils/effect'

export const runBuild = (): T.Effect<unknown, never, void> =>
  pipe(
    T.succeedWith(() => {
      console.log('runBuild')

      return 42
    }),
  )
