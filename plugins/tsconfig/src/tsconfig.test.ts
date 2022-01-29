// TODO: write real tests here
import { _ } from '@konfik/core'
import { Tsconfig } from './tsconfig.js'

const MyTs = Tsconfig({
  compilerOptions: {
    declaration: true,
    allowJs: false,
    composite: true,
  },
  include: _,
  extends: _,
  watchOptions: _,
})

const Almost = MyTs({
  // TODO: retain symbol-bound docs.
  include: ['.'],
  extends: _,
  watchOptions: _,
})

const SoClose = Almost({
  extends: '',
  watchOptions: _,
})

const final = SoClose({
  watchOptions: {},
})
