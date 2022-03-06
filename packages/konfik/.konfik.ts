import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJson, baseTsconfig } from '../../.konfik/common.js'

export const konfikPkg = PackageJsonKonfik({
  ...basePackageJson,
  name: 'konfik',
  bin: './dist/bundle/cli.cjs',
  exports: {
    '.': './dist/src/lib/index.js',
  },
  types: './dist/src/lib/index.d.ts',
  files: ['./dist/**/*.{cjs,js,ts,map}', './src/*', './package.json'],
  scripts: {
    ...basePackageJson.scripts,
    prepublish: 'run build:bundle',
    // TODO figure out again why we're bundling to CJS instead of ESM
    'build:bundle':
      'esbuild ./dist/src/cli/index.js --bundle --platform=node --format=cjs --external:esbuild --outfile=dist/bundle/cli.cjs --main-fields=module,main --banner:js="#!/usr/bin/env node"',
  },
  dependencies: {
    '@konfik/core': 'workspace:*',
    esbuild: '^0.14.13',
  },
  devDependencies: {
    ...basePackageJson.devDependencies,
    '@konfik/cli': 'workspace:*',
    '@types/node': '^17.0.10',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../tsconfig.base.json',
  ...baseTsconfig,
  references: [{ path: '../@konfik/cli' }, { path: '../@konfik/core' }],
})
