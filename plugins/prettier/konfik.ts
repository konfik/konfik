import { PackageJsonKonfik } from 'konfik-package-json'
import { TsconfigKonfik } from 'konfik-tsconfig'

export const packageJsonKonfik = PackageJsonKonfik({
  name: 'konfik-prettier',
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
    prettier: '^2.5.1',
  },
  devDependencies: {
    '@types/prettier': '^2',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }],
})
