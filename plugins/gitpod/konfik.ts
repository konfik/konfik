import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik-plugin/gitpod',
  version,
  publishConfig: {
    access: 'public',
  },
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@gitpod/gitpod-protocol': '^0.1.5-test.4',
    '@konfik/core': version,
    '@types/js-yaml': '^4',
    'js-yaml': '^4.1.0',
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
