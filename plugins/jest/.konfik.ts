import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/jest',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    '@jest/types': '27.5.1',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
