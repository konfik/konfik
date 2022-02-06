import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../../konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik/core',
  type: 'module',
  version,
  exports: {
    '.': './dist/index.js',
  },
  types: './dist/index.d.ts',
  scripts: {
    test: 'ava',
  },
  devDependencies: {
    ava: '^4.0.1',
    'conditional-type-checks': '^1.0.5',
  },
  ava: {
    files: ['dist/tests.js'],
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
