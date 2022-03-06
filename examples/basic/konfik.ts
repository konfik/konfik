import { EslintKonfik } from '@konfik-plugin/eslint'
import { GitignoreKonfik } from '@konfik-plugin/gitignore'
import { GitpodKonfik } from '@konfik-plugin/gitpod'
import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { PrettierKonfik } from '@konfik-plugin/prettier'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

const gitpodKonfik = GitpodKonfik({
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

const packageJsonKonfik = PackageJsonKonfik({
  name: 'basic',
  // TODO: can we create a type representing every possible NPM package name and valid versions
  devDependencies: {
    konfik: 'workspace:*',
    '@konfik-plugin/tsconfig': 'workspace:*',
    '@konfik-plugin/package-json': 'workspace:*',
    '@konfik-plugin/eslint': 'workspace:*',
    '@konfik-plugin/prettier': 'workspace:*',
    '@konfik-plugin/gitpod': 'workspace:*',
    '@konfik-plugin/gitignore': 'workspace:*',
  },
})

const gitignoreKonfik = GitignoreKonfik([
  '.eslintrc',
  // TODO: can we make Gitpod aware of this without including in src ctrl?
  '.gitpod.yml',
  '.prettierrc',
  'package.json',
  'tsconfig.json',
])

const prettierKonfik = PrettierKonfik({
  printWidth: 120,
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
})

const eslintKonfik = EslintKonfik({
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

const tsconfigKonfik = TsconfigKonfik({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist/src',
    rootDir: './src',
    tsBuildInfoFile: './dist/src/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }, { path: '../../packages/@konfik/tsconfig' }],
})

// TODO: how to supply option to generate gitignore
export default {
  '.gitpod.yml': gitpodKonfik,
  'package.json': packageJsonKonfik,
  'tsconfig.json': tsconfigKonfik,
  '.prettierrc.json': prettierKonfik,
  '.eslintrc.json': eslintKonfik,
  '.gitignore': gitignoreKonfik,
}
