import { EslintKonfik } from '../eslint.js'
import { PackageJsonKonfik } from '../packageJson.js'
import * as base from './base.js'

export const eslintKonfik = base.eslintKonfik.derive((bag) => {
  const baseConfig = bag['eslint.config.json']

  return EslintKonfik('eslint.config.json', {
    env: { browser: true, es6: true },
    ignorePatterns: baseConfig.ignorePatterns,
    parser: baseConfig.parser,
    plugins: baseConfig.plugins,
    extends: [...baseConfig.extends, 'plugin:react-hooks/recommended'],
    rules: {
      ...baseConfig.rules,
      'react/no-children-prop': 'off', // 🤷‍♂️ It seems to be more of a stylistic suggestion https://stackoverflow.com/a/42984758
    },
  })
})

export const packageJsonKonfik = base.packageJsonKonfik.derive((bag) =>
  PackageJsonKonfik('package.json', {
    dependencies: {
      ...bag['package.json'].dependencies,
      'eslint-plugin-react-hooks': '^4.3.0',
    },
  }),
)
