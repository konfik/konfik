import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../../konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik/cli',
  // NOTE this module doesn't need a version as it's not published on NPM
  private: true,
  type: 'module',
  exports: {
    './cli': './dist/cli.js',
  },
  typesVersions: {
    '*': {
      cli: ['./dist/cli.d.ts'],
    },
  },
  dependencies: {
    '@effect-ts/cli': '^0.7.2',
    '@effect-ts/figlet': '^0.2.0',
    '@effect-ts/node': '^0.36.0',
    '@effect-ts/printer': '^0.12.0',
    '@konfik/core': version,
    '@konfik/utils': version,
    diff: '^5.0.0',
    esbuild: '^0.14.13',
    'source-map-support': '^0.5.21',
  },
  devDependencies: {
    '@types/diff': '^5',
    '@types/source-map-support': '^0',
    ava: '^4.0.1',
  },
  scripts: {
    test: 'ava',
    cli: 'node ./dist/cli.js',
  },
  publishConfig: {
    access: 'public',
  },
  ava: {
    files: ['dist/**/*.test.js'],
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    resolveJsonModule: true,
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../utils' }, { path: '../core' }],
})
