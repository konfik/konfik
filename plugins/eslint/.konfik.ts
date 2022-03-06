import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/eslint',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    '@types/eslint': '^8',
    eslint: '^8.8.0',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
