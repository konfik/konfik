import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

export const version = '0.0.18'

export const basePackageJson = PackageJsonKonfik({
  type: 'module',
  version,
  sideEffects: false,
  scripts: {
    'build:ts': 'tsc',
  },
  devDependencies: {
    typescript: '*',
  },
  publishConfig: {
    access: 'public',
  },
} as const)

export const basePackageJsonPlugin = PackageJsonKonfik({
  ...basePackageJson,
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: {
    '@konfik/core': 'workspace:*',
  },
} as const)

export const baseTsconfig = TsconfigKonfik({
  compilerOptions: {
    outDir: './dist/src',
    rootDir: './src',
    tsBuildInfoFile: './dist/src/.tsbuildinfo',
  } as const,
  include: ['./src'],
})

export const baseTsconfigPlugin = TsconfigKonfik({
  extends: '../../tsconfig.base.json' as const,
  ...baseTsconfig,
  references: [{ path: '../../packages/@konfik/core' }],
})
