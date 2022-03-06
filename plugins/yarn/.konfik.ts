import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/yarn',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    '@types/js-yaml': '^4',
    '@yarnpkg/core': '^3.2.0-rc.13',
    'js-yaml': '^4.1.0',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
