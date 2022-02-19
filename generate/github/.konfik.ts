import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik-generate/github',
  types: 'index.ts',
  version,
  devDependencies: {
    'json-schema-to-typescript': '^10.1.5',
  },
  scripts: {
    prepublish: 'yarn gen',
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
})
