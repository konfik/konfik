import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik-plugin/github',
  version,
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
    '@konfik-generate/github': 'workspace:*',
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
  references: [
    {
      path: '../../packages/@konfik/core',
    },
    {
      path: '../../generate/github',
    },
  ],
})
