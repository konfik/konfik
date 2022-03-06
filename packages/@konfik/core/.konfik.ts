import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJson, baseTsconfig } from '../../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJson,
  name: '@konfik/core',
  exports: { '.': './dist/src/index.js' },
  types: './dist/src/index.d.ts',
  scripts: {
    ...basePackageJson.scripts,
    test: 'ava',
  },
  devDependencies: {
    ...basePackageJson.devDependencies,
    ava: '^4.0.1',
    'conditional-type-checks': '^1.0.5',
  },
  ava: { files: ['dist/tests.js'] },
})

export const tsconfigKonfik = TsconfigKonfik({
  ...baseTsconfig,
  extends: '../../../tsconfig.base.json',
  references: [{ path: '../utils' }],
})
