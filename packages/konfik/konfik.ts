import { PackageJson } from 'konfik-package-json'

export const konfikPkg = PackageJson({
  name: 'konfik',
  version: '0.1.0',
  bin: './bin/konfik.cjs',
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
    '@konfik/cli': 'workspace:*',
    '@konfik/core': 'workspace:*',
    '@swc/core': '^1.2.133',
    '@swc/register': '^0.1.9',
    commander: '^8.3.0',
    esbuild: '^0.14.13',
    'esbuild-register': '^3.3.2',
  },
  devDependencies: {
    '@types/node': '^17.0.10',
    'conditional-type-checks': '^1.0.5',
  },
})
