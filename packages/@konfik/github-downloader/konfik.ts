import { PackageJson } from 'konfik-package-json'
import { Tsconfig } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJson({
  name: '@konfik/github-downloader',
  type: 'module',
  exports: {
    '.': './dist/index.js',
  },
  types: './dist/index.d.ts',
  dependencies: {
    '@konfik/utils': 'workspace:*',
  },
})

export const tsconfigKonfik = Tsconfig({
  extends: '../../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../utils' }],
})
