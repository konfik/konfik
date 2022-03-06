import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/github',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    '@konfik-generate/github': 'workspace:*',
    '@types/js-yaml': '^4',
    'js-yaml': '^4.1.0',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  ...baseTsconfigPlugin,
  references: [...baseTsconfigPlugin.references, { path: '../../generate/github' }],
})
