import { EslintKonfik } from '../eslint.js'
import * as base from './base.js'

export const eslintKonfik = base.eslintKonfik.derived('eslint.config.json')((bag) => {
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
