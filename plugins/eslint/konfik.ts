import { PackageJsonKonfik } from 'konfik-package-json'
import { TsconfigKonfik } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
  name: 'konfik-eslint',
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
    eslint: '^8.8.0',
  },
  devDependencies: {
    '@types/eslint': '^8',
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
