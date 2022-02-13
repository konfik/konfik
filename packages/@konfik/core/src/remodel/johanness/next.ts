import { EslintKonfik } from '../eslint.js'
import * as base from './base.js'

export const eslintKonfik = base.eslintKonfik.derived('eslint.config.json')((bag) => {
  const baseConfig = bag['eslint.config.json']
  return EslintKonfik('eslint.config.json', {
    env: { browser: true, es6: true, node: true },
    ignorePatterns: baseConfig.ignorePatterns,
    parser: baseConfig.parser,
    plugins: baseConfig.plugins,
    extends: [
      ...baseConfig.extends,
      'plugin:react-hooks/recommended',
      // https://nextjs.org/docs/basic-features/eslint#eslint-config
      'next',
    ],
    rules: {
      ...baseConfig.rules,
      // Coming from "next"
      // no longer needed https://stackoverflow.com/a/67839804
      // "react/jsx-no-target-blank": "off",
      'react/no-children-prop': 'off', // 🤷‍♂️ It seems to be more of a stylistic suggestion https://stackoverflow.com/a/42984758
    },
  })
})
