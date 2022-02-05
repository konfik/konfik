import { PackageJsonKonfik } from 'konfik-package-json'

export const konfikPkg = PackageJsonKonfik({
  name: 'konfik',
  version: '0.0.0',
  bin: './bin/konfik',
  type: 'module',
  exports: {
    '.': './dist/lib/index.js',
  },
  types: './dist/lib/index.d.ts',
  scripts: {
    'bundle:cli':
      'esbuild ./dist/cli/index.js --bundle --platform=node --format=esm --outfile=dist/cli/bundle.js --main-fields=module,main',
  },
  dependencies: {
    '@konfik/core': 'workspace:*',
    esbuild: '^0.14.13',
  },
  devDependencies: {
    '@konfik/cli': 'workspace:*',
    '@types/node': '^17.0.10',
  },
})
