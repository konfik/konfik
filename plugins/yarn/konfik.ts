import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik-plugin/yarn',
  version: '0.0.2',
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
    '@yarnpkg/core': '^3.2.0-rc.13',
    '@types/js-yaml': '^4',
    'js-yaml': '^4.1.0',
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
