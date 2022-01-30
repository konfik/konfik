import { PackageJsonKonfik } from 'konfik-package-json'
import { TsconfigKonfik } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
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
