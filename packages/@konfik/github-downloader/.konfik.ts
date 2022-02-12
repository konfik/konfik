import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik/github-downloader',
  type: 'module',
  version,
  exports: {
    '.': './dist/index.js',
  },
  types: './dist/index.d.ts',
  dependencies: {
    '@konfik/utils': 'workspace:*',
  },
  publishConfig: {
    access: 'public',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../utils' }],
})
