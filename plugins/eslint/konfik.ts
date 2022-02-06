import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik-plugin/eslint',
  version: '0.0.2',
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
    '@types/eslint': '^8',
    eslint: '^8.8.0',
  },
  publishConfig: {
    access: 'public',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }],
})
