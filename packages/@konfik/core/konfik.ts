import { PackageJson } from 'konfik-package-json'
import { Tsconfig } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJson({
  name: '@konfik/core',
  scripts: {
    test: 'ava',
  },
  type: 'module',
  exports: {
    '.': './dist/index.js',
  },
  types: './dist/index.d.ts',
  devDependencies: {
    ava: '^4.0.1',
  },
  // TODO: widen index signature
  // @ts-ignore
  ava: {
    files: ['dist/tests.js'],
  },
})

export const tsconfigKonfik = Tsconfig({
  extends: '../../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../utils' }],
})
