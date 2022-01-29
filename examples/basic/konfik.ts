import { _, Konfiks } from 'konfik'
import { Tsconfig } from 'konfik-tsconfig'
import { Package } from 'konfik-package-json'
import { Eslint } from 'konfik-eslint'
import { Prettier } from 'konfik-prettier'
import { Gitpod } from 'konfik-gitpod'
import { Gitignore } from 'konfik-gitignore'

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
  name: 'basic',
  // TODO: can we create a type representing every possible NPM package name and valid versions
  devDependencies: {
    konfik: 'workspace:*',
    'konfik-tsconfig': 'workspace:*',
    'konfik-package-json': 'workspace:*',
    'konfik-eslint': 'workspace:*',
    'konfik-prettier': 'workspace:*',
    'konfik-gitpod': 'workspace:*',
    'konfik-gitignore': 'workspace:*',
  },
})

const gitignore = Gitignore([
  '.eslintrc',
  // TODO: can we make Gitpod aware of this without including in src ctrl?
  '.gitpod.yml',
  '.prettierrc',
  'package.json',
  'tsconfig.json',
])

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
  ignorePatterns: ['packages/_archive/*', '**/dist/*', '**/.nyc_output/*'],
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

// TODO: how to supply option to generate gitignore
export default Konfiks(gitpod, pkg, tsconfig, prettier, eslint, gitignore)
