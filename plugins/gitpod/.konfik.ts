import { PackageJsonKonfik } from '@konfik-plugin/package-json'

import { basePackageJsonPlugin, baseTsconfigPlugin } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJsonPlugin,
  name: '@konfik-plugin/gitpod',
  dependencies: {
    ...basePackageJsonPlugin.dependencies,
    '@gitpod/gitpod-protocol': '^0.1.5-test.4',
    '@types/js-yaml': '^4',
    'js-yaml': '^4.1.0',
  },
})

export const tsconfigKonfik = baseTsconfigPlugin
