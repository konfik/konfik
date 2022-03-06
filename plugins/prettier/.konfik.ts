import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/prettier',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    '@types/prettier': '^2',
    prettier: '^2.5.1',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
