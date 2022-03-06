import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJson, baseTsconfig } from '../../../.konfik/common'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJson,
  name: '@konfik/cli',
  // NOTE this module doesn't need a version as it's not published on NPM
  private: true,
  exports: {
    './cli': './dist/src/cli.js',
  },
  typesVersions: {
    '*': {
      cli: ['./dist/src/cli.d.ts'],
    },
  },
  dependencies: {
    '@effect-ts/cli': '^0.7.3',
    '@effect-ts/figlet': '^0.4.1',
    '@effect-ts/node': '^0.38.3',
    '@effect-ts/printer': '^0.13.0',
    '@konfik/core': 'workspace:*',
    '@konfik/utils': 'workspace:*',
    diff: '^5.0.0',
    esbuild: '^0.14.13',
    'source-map-support': '^0.5.21',
  },
  devDependencies: {
    ...basePackageJson.devDependencies,
    '@types/diff': '^5',
    '@types/source-map-support': '^0',
    ava: '^4.0.1',
  },
  scripts: {
    ...basePackageJson.scripts,
    test: 'ava',
    cli: 'node ./dist/src/cli.js',
  },
  ava: {
    files: ['dist/**/*.test.js'],
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../../tsconfig.base.json',
  ...baseTsconfig,
  compilerOptions: {
    ...baseTsconfig.compilerOptions,
    // needed to read version from `package.json`
    resolveJsonModule: true,
  },
  references: [{ path: '../utils' }, { path: '../core' }],
})
