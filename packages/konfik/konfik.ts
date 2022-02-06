import { PackageJsonKonfik } from '@konfik-plugin/package-json'

export const konfikPkg = PackageJsonKonfik({
  name: 'konfik',
  type: 'module',
  version: '0.0.2',
  bin: './dist/cli/bundle.cjs',
  exports: {
    '.': './dist/lib/index.js',
  },
  types: './dist/lib/index.d.ts',
  files: ['./dist', './src', 'package.json'],
  scripts: {
    prepublish: 'run bundle-cli',
    'bundle-cli':
      'esbuild ./dist/cli/index.js --bundle --platform=node --format=cjs --external:esbuild --outfile=dist/cli/bundle.cjs --main-fields=module,main --banner:js="#!/usr/bin/env node"',
  },
  dependencies: {
    '@konfik/core': 'workspace:*',
    esbuild: '^0.14.13',
  },
  devDependencies: {
    '@konfik/cli': 'workspace:*',
    '@types/node': '^17.0.10',
  },
  publishConfig: {
    access: 'public',
  },
})
