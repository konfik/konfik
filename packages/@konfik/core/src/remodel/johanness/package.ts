import { PackageJsonKonfik } from '../packageJson'
import * as next from './next'
import * as react from './react'

export const packageJsonNext = react.packageJsonKonfik.derive((bag) =>
  PackageJsonKonfik('package.json', {
    dependencies: {
      ...bag['package.json'].dependencies,
    },
  }),
)

export const packageJsonReact = next.packageJsonKonfik.derive((bag) =>
  PackageJsonKonfik('package.json', {
    dependencies: {
      ...bag['package.json'].dependencies,
    },
  }),
)
