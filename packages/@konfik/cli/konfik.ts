import { PackageJsonKonfik } from 'konfik-package-json'
import { TsconfigKonfik } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik/cli',
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
    '@effect-ts/cli': '^0.6.0',
    '@effect-ts/figlet': '^0.1.0',
    '@effect-ts/node': '^0.31.0',
    '@effect-ts/printer': '^0.11.1',
    '@effect-ts/process': '^0.2.0',
    '@konfik/core': 'workspace:*',
    '@konfik/utils': 'workspace:*',
    esbuild: '^0.14.13',
    'source-map-support': '^0.5.21',
  },
  devDependencies: {
    '@types/source-map-support': '^0',
    ava: '^4.0.1',
  },
  scripts: {
    test: 'ava',
  },
  // TODO: widen index signature
  // @ts-ignore
  ava: {
    files: ['dist/**/*.test.js'],
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
  references: [{ path: '../utils' }, { path: '../core' }],
})
