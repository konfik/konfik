import { PackageJson } from 'konfik-package-json'
import { Tsconfig } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJson({
  name: 'gitpod',
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@gitpod/gitpod-protocol': '^0.1.5-test.4',
    '@konfik/core': 'workspace:*',
    'js-yaml': '^4.1.0',
  },
  devDependencies: {
    '@types/js-yaml': '^4',
  },
})

export const tsconfigKonfik = Tsconfig({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }],
})
