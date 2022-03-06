import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJson, baseTsconfig } from '../../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJson,
  name: '@konfik/github-downloader',
  exports: {
    '.': './dist/src/index.js',
  },
  types: './dist/src/index.d.ts',
  dependencies: {
    '@konfik/utils': 'workspace:*',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../../tsconfig.base.json',
  ...baseTsconfig,
  references: [{ path: '../utils' }],
})
