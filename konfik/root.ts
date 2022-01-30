import { EslintKonfik } from 'konfik-eslint'
import { GitignoreKonfik } from 'konfik-gitignore'
import { GitpodKonfik } from 'konfik-gitpod'
import { PackageJsonKonfik } from 'konfik-package-json'
import { PrettierKonfik } from 'konfik-prettier'
import { TsconfigKonfik } from 'konfik-tsconfig'
import { YarnKonfik } from 'konfik-yarn'

export const yarnKonfik = YarnKonfik({
  nodeLinker: 'node-modules',
  plugins: [
    {
      path: '.yarn/plugins/@yarnpkg/plugin-typescript.cjs',
      spec: '@yarnpkg/plugin-typescript',
    },
    {
      path: '.yarn/plugins/@yarnpkg/plugin-interactive-tools.cjs',
      spec: '@yarnpkg/plugin-interactive-tools',
    },
  ],
  yarnPath: '.yarn/releases/yarn-3.1.1.cjs',
})

export const gitpodKonfik = GitpodKonfik({
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

export const tsconfigBaseKonfik = TsconfigKonfik({
  compilerOptions: {
    strict: true,
    noUncheckedIndexedAccess: true,
    esModuleInterop: true,
    sourceMap: true,
    declarationMap: true,
    declaration: true,
    moduleResolution: 'Node',
    incremental: true,
    composite: true,
    allowJs: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    noErrorTruncation: true,
    isolatedModules: true,
    target: 'ES2021',
    module: 'ESNext',
    plugins: [{ name: '@effect-ts/tracing-plugin' }],
    paths: {
      konfik: ['./packages/konfik'],
      '@konfik/utils/effect/*': ['./packages/@konfik/utils/effect/*'],
      '@konfik/*': ['./packages/@konfik/*'],
    },
  },
  exclude: ['dist', 'node_modules'],
})

export const tsconfigAllKonfik = TsconfigKonfik({
  extends: './tsconfig.base.json',
  references: [{ path: './packages/konfik' }],
})

export const packageJsonKonfik = PackageJsonKonfik({
  // TODO: do we need to support the following field?
  // @ts-ignore
  packageManager: 'yarn@3.1.1',
  workspaces: ['packages/*', 'plugins/*', 'packages/@konfik/*', 'examples/*'],
  scripts: {
    'build:clean': "bash -c 'rm -rf packages/*/dist packages/@konfik/*/dist'",
    'dev:ts': 'tsc --build --watch tsconfig.all.json',
    'lint:check': `run lint:eslint:check && run lint:prettier:check`,
    'lint:eslint:check': 'eslint packages --ext .ts --max-warnings=0',
    'lint:eslint:fix': 'eslint packages --ext .ts --fix',
    'lint:fix': 'run lint:eslint:fix & run lint:prettier:fix',
    'lint:prettier:check': 'prettier packages --check',
    'lint:prettier:fix': 'prettier packages --write',
    postinstall: 'ts-patch install && ts-patch --persist && ./link.mjs',
  },
  // TODO: can we create a type representing every possible NPM package name and valid versions
  devDependencies: {
    '@effect-ts/tracing-plugin': '^0.14.21',
    '@typescript-eslint/eslint-plugin': '^4.31.1',
    '@typescript-eslint/parser': '^4.31.1',
    'eslint-config-prettier': '^8.3.0',
    'eslint-plugin-import': '^2.24.2',
    'eslint-plugin-prefer-arrow': '^1.2.3',
    'eslint-plugin-prettier': '^4.0.0',
    'eslint-plugin-react-hooks': '^4.2.0',
    'eslint-plugin-simple-import-sort': '^7.0.0',
    'ts-patch': '^1.4.5',
    eslint: '^7.21.0',
    prettier: '^2.5.0',
    typescript: '^4.5.5',
    zx: '^4.3.0',
  },
})

// TODO: can we use Gitpod without including `.gitpod.yml` in vc?
export const gitignoreKonfik = GitignoreKonfik([
  'node_modules',
  '.idea/',
  '.DS_STORE',
  'tmp',
  'dist',
  '/.yarn/*',
  '!/.yarn/releases',
  '!/.yarn/patches',
  '!/.yarn/plugins',
  '!/.yarn/sdks',
  '*.log',
  '.direnv',
  '.eslintrc',
])

export const prettierKonfik = PrettierKonfik({
  printWidth: 120,
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
})

export const eslintKonfik = EslintKonfik({
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
