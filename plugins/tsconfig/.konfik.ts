import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/tsconfig',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    'tsconfig-type': '1.21.0',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
