import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik/github-downloader',
  type: 'module',
  version: '0.0.2',
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
