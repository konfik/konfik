// TODO: write real tests here
import { _ } from '@konfik/core'
import { Ts } from './config.js'

const MyTs = Ts({
  compilerOptions: {
    declaration: true,
    allowJs: false,
    composite: true,
  },
  exclude: ['node_modules'],
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
