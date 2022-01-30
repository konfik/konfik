import { PackageJson } from 'konfik-package-json'
import { Tsconfig } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJson({
  name: 'konfik-package-json',
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
    'type-fest': '^2.10.0',
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
