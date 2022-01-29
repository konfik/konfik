import { _, Konfiks } from 'konfik'
import { Eslint } from 'konfik-eslint'
import { Gitignore } from 'konfik-gitignore'
import { Gitpod } from 'konfik-gitpod'
import { PackageJson } from 'konfik-package-json'
import { Prettier } from 'konfik-prettier'
import { Tsconfig } from 'konfik-tsconfig'
import { Yarn } from 'konfik-yarn'

const VERSION = '0.1.0-beta.1'

// ====
// Yarn
// ====

// TODO: where is the official type?!
const yarn = Yarn({
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

// ======
// Gitpod
// ======

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

// ==========
// TypeScript
// ==========

const tsconfigBase = Tsconfig({
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
}).named('tsconfig.base.json')

const tsconfigAll = Tsconfig({
  extends: './tsconfig.base.json',
  references: [{ path: './packages/konfik' }],
}).named('tsconfig.all.json')

// =================
// Package Manifests
// =================

const rootPkg = PackageJson({
  // TODO: do we need to support the following field?
  // @ts-ignore
  packageManager: 'yarn@3.1.1',
  workspaces: ['packages/*', 'plugins/*', 'packages/@konfik/*', 'examples/*'],
  scripts: {
    'build:clean': "bash -c 'rm -rf packages/*/dist packages/@konfik/*/dist'",
    'dev:ts': 'tsc --build --watch tsconfig.all.json',
    'lint:check': 'run lint:eslint:check && run lint:prettier:check',
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

const corePkg = PackageJson({
  name: '@konfik/core',
  version: VERSION,
  scripts: {
    test: 'ava',
  },
  type: 'module',
  exports: {
    '.': './dist/index.js',
  },
  types: './dist/index.d.ts',
  devDependencies: {
    ava: '^4.0.1',
  },
  // TODO: widen index signature
  // @ts-ignore
  ava: {
    files: ['dist/tests.js'],
  },
})

const cliPkg = PackageJson({
  name: '@konfik/cli',
  version: VERSION,
  type: 'module',
  exports: {
    './cli': './dist/cli.js',
  },
  typesVersions: {
    '*': {
      cli: ['./dist/cli.d.ts'],
    },
  },
  dependencies: {
    '@effect-ts/cli': '^0.6.0',
    '@effect-ts/figlet': '^0.1.0',
    '@effect-ts/node': '^0.31.0',
    '@effect-ts/printer': '^0.11.1',
    '@effect-ts/process': '^0.2.0',
    '@konfik/core': 'workspace:*',
    '@konfik/utils': 'workspace:*',
    esbuild: '^0.14.13',
    'source-map-support': '^0.5.21',
  },
  devDependencies: {
    '@types/source-map-support': '^0',
    ava: '^4.0.1',
  },
  scripts: {
    test: 'ava',
  },
  // TODO: widen index signature
  // @ts-ignore
  ava: {
    files: ['dist/**/*.test.js'],
  },
})

const ghDownloaderPkg = PackageJson({
  name: '@konfik/github-downloader',
  version: VERSION,
  type: 'module',
  exports: {
    '.': './dist/index.js',
  },
  types: './dist/index.d.ts',
  dependencies: {
    '@konfik/utils': 'workspace:*',
  },
})

const utilsPkg = PackageJson({
  name: '@konfik/utils',
  version: VERSION,
  type: 'module',
  exports: {
    '.': {
      import: './dist/index.js',
    },
    './effect': {
      import: './dist/effect/index.js',
    },
    './effect/Tracing': {
      import: './dist/effect/Tracing/index.js',
    },
    './effect/Tracing/Enable': {
      import: './dist/effect/Tracing/Enable.js',
    },
    './node': {
      import: './dist/node/index.js',
    },
  },
  types: './dist/index.d.ts',
  typesVersions: {
    '*': {
      effect: ['./dist/effect'],
      'effect/Tracing': ['./dist/effect/Tracing'],
      'effect/Tracing/Enable': ['./dist/effect/Tracing/Enable'],
      node: ['./dist/node'],
    },
  },
  scripts: {
    test: 'echo No tests yet',
  },
  dependencies: {
    '@effect-ts/core': '^0.48.5',
    '@effect-ts/otel': '^0.9.1',
    '@effect-ts/otel-exporter-trace-otlp-grpc': '^0.9.1',
    '@effect-ts/otel-sdk-trace-node': '^0.9.1',
    '@opentelemetry/api': '^1.0.3',
    '@opentelemetry/core': '^1.0.1',
    '@opentelemetry/exporter-trace-otlp-grpc': '0.27.0',
    '@opentelemetry/node': '^0.24.0',
    '@opentelemetry/resources': '1.0.1',
    '@opentelemetry/sdk-node': '^0.27.0',
    '@opentelemetry/sdk-trace-base': '^1.0.1',
    '@opentelemetry/sdk-trace-node': '^1.0.1',
    '@opentelemetry/semantic-conventions': '1.0.1',
    '@opentelemetry/tracing': '^0.24.0',
    'hash-wasm': '^4.9.0',
    'pretty-bytes': '^5.6.0',
    'ts-pattern': '^3.3.3',
    'type-fest': '^2.5.4',
    undici: '^4.12.2',
    uuid: '^8.3.2',
  },
  devDependencies: {
    '@types/inflection': '^1.13.0',
    '@types/uuid': '^8.3.3',
  },
})

const konfikPkg = PackageJson({
  name: 'konfik',
  version: VERSION,
  bin: './bin/konfik.cjs',
  type: 'module',
  exports: {
    '.': './dist/lib/index.js',
  },
  types: './dist/lib/index.d.ts',
  scripts: {
    'bundle:cli':
      'esbuild ./dist/cli/index.js --bundle --platform=node --format=esm --outfile=dist/cli/bundle.js --main-fields=module,main',
  },
  dependencies: {
    '@konfik/cli': 'workspace:*',
    '@konfik/core': 'workspace:*',
    '@swc/core': '^1.2.133',
    '@swc/register': '^0.1.9',
    commander: '^8.3.0',
    esbuild: '^0.14.13',
    'esbuild-register': '^3.3.2',
  },
  devDependencies: {
    '@types/node': '^17.0.10',
    'conditional-type-checks': '^1.0.5',
  },
})

const PluginPkg = PackageJson({
  name: _,
  version: VERSION,
  exports: {
    '.': './src/index.ts',
  },
  types: './src/index.ts',
  dependencies: _,
  devDependencies: _,
})

const pluginPkgMeta: {
  name: string
  dependencies: Record<string, string>
  devDependencies?: Record<string, string>
}[] = [
  {
    name: 'eslint',
    dependencies: {
      '@konfik/core': 'workspace:*',
      eslint: '^8.8.0',
    },
    devDependencies: {
      '@types/eslint': '^8',
    },
  },
  {
    name: 'gitignore',
    dependencies: {
      '@konfik/core': 'workspace:*',
    },
  },
  {
    name: 'gitpod',
    dependencies: {
      '@gitpod/gitpod-protocol': '^0.1.5-test.4',
      '@konfik/core': 'workspace:*',
      'js-yaml': '^4.1.0',
    },
    devDependencies: {
      '@types/js-yaml': '^4',
    },
  },
  {
    name: 'package-json',
    dependencies: {
      '@konfik/core': 'workspace:*',
      'type-fest': '^2.10.0',
    },
  },
  {
    name: 'prettier',
    dependencies: {
      '@konfik/core': 'workspace:*',
      prettier: '^2.5.1',
    },
    devDependencies: {
      '@types/prettier': '^2',
    },
  },
  {
    name: 'tsconfig',
    dependencies: {
      '@konfik/core': 'workspace:*',
      'tsconfig-type': '1.21.0',
    },
  },
  {
    name: 'vscode',
    dependencies: {
      '@konfik/core': 'workspace:*',
    },
  },
  {
    name: 'yarn',
    dependencies: {
      '@konfik/core': 'workspace:*',
      '@yarnpkg/core': '^3.2.0-rc.13',
      'js-yaml': '^4.1.0',
    },
    devDependencies: {
      '@types/js-yaml': '^4',
    },
  },
]
const pluginPkgs = pluginPkgMeta.map(({ name, dependencies, devDependencies }) => {
  return PluginPkg({
    name,
    dependencies,
    devDependencies,
  }).named(`plugins/${name}/package.json`)
})

const PkgTsconfig = Tsconfig({
  extends: '../../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../utils' }],
})
const pluginTsconfigs = pluginPkgMeta.map(({ name }) => {
  return PkgTsconfig.named(name)
})

// TODO: can we use Gitpod without including `.gitpod.yml` in vc?
const gitignore = Gitignore([
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

// TODO: how to supply option to generate gitignore
export default Konfiks(
  yarn,
  gitpod,
  tsconfigAll,
  tsconfigBase,
  rootPkg,
  corePkg,
  cliPkg,
  ghDownloaderPkg,
  utilsPkg,
  konfikPkg,
  ...pluginPkgs,
  ...pluginTsconfigs,
  prettier,
  eslint,
  gitignore,
)
