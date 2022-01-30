import { PackageJson } from 'konfik-package-json'
import { Tsconfig } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJson({
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
