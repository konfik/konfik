import { _, Konfiks } from '../../packages/@konfik/core'
import { Tsconfig } from '.konfik/github.com/konfik/konfik/plugins/tsconfig'
import { Package } from '.konfik/github.com/konfik/konfik/plugins/package-json'
import { Eslint } from '.konfik/github.com/konfik/konfik/plugins/eslint'
import { Prettier } from '.konfik/github.com/konfik/konfik/plugins/prettier'
import { Gitpod } from '.konfik/github.com/konfik/konfik/plugins/gitpod'

const gitpod = Gitpod({
  tasks: [
    {
      name: 'init',
      command: 'yarn install',
    },
  ],
  vscode: {
    extensions: ['dbaeumer.vscode-eslint'],
  },
})

const pkg = Package({
  name: 'new-example',
  devDependencies: {
    '@konfik/core': 'workspace:*',
    '@konfik/package': 'workspace:*',
    '@konfik/tsconfig': 'workspace:*',
  },
})

const prettier = Prettier({
  printWidth: 120,
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
})

const eslint = Eslint({
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: ['packages/_archive/*', 'examples/*', '**/dist/*', '**/.nyc_output/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prefer-arrow', 'import'],
  // TODO: can we infer the dependencies & inject them into a generated `package.json`?
  extends: ['plugin:react-hooks/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'simple-import-sort/imports': 'error',
    'import/no-duplicates': 'warn',
    'import/no-extraneous-dependencies': 'error',
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
  },
})

const tsconfig = Tsconfig({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }, { path: '../../packages/@konfik/tsconfig' }],
})

export const konfik = [{ fileMap: Konfiks(gitpod, pkg, tsconfig, prettier, eslint) }]
