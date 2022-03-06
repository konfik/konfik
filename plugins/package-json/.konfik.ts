import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/package-json',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    'type-fest': '^2.10.0',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
