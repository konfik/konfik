import { EslintKonfik } from '../eslint'

const tuple = <T extends string[]>(..._: T): T[number][] => _ as any

export const eslintKonfik = EslintKonfik('eslint.config.json', {
  env: { es6: true },

  ignorePatterns: ['!.konfik', '**/dist/*', '**/.nyc_output/*', 'node_modules/*'],

  parser: '@typescript-eslint/parser',
  plugins: tuple('@typescript-eslint', 'simple-import-sort', 'import', 'prefer-arrow'),
  extends: tuple(
    'plugin:@typescript-eslint/recommended',
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    'plugin:unicorn/recommended',
    // Turns off all rules that are unnecessary or might conflict with Prettier.
    'prettier',
  ),

  rules: {
    // ----------------
    // Unicorn --------
    // ----------------
    'unicorn/prevent-abbreviations': 'off',

    // ----------------
    // Function-related
    // ----------------
    'func-style': ['warn', 'expression'], // only works for "top level" functions
    'prefer-arrow-callback': 'warn', // this is about function values provided as arguments
    'prefer-arrow/prefer-arrow-functions': [
      'warn',
      {
        classPropertiesAllowed: true,
        disallowPrototype: true,
        singleReturnOnly: false,
      },
    ],
    'no-empty-function': 'off', // allow empty function bodies
    '@typescript-eslint/no-empty-function': 'off', // this extra rule seems to be needed (https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-empty-function.md#rule-details)

    // ----------------
    // `import`-related
    // ----------------
    'simple-import-sort/imports': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    'import/no-duplicates': 'warn',

    // ------------------
    // TypeScript-related
    // ------------------
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off', // With inlay types this becomes less important
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
  },
})
