import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik-generated/github',
  types: 'index.ts',
  version,
  devDependencies: {
    'json-schema-to-typescript': '^10.1.5',
  },
  scripts: {
    gen: 'ts-node gen.ts',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extend: ['../../tsconfig.base.json'],
  compilerOptions: {
    noEmit: true,
  },
  include: ['.'],
})
