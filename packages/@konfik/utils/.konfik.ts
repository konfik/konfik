import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { version } from '../../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  name: '@konfik/utils',
  version,
  type: 'module',
  exports: {
    './package.json': {
      import: './package.json',
    },
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
      'package.json': ['./package.json'],
      'effect/Tracing': ['./dist/effect/Tracing'],
      'effect/Tracing/Enable': ['./dist/effect/Tracing/Enable'],
      node: ['./dist/node'],
    },
  },
  sideEffects: ['./dist/effect/Tracing/Enable.js'],
  scripts: {
    test: 'echo No tests yet',
  },
  dependencies: {
    '@effect-ts/core': '^0.55.1',
    '@effect-ts/otel': '^0.11.6',
    '@effect-ts/otel-exporter-trace-otlp-http': '^0.11.6',
    '@effect-ts/otel-sdk-trace-node': '^0.11.6',
    '@opentelemetry/api': '^1.0.3',
    '@opentelemetry/core': '^1.0.1',
    '@opentelemetry/exporter-trace-otlp-http': '0.27.0',
    '@opentelemetry/node': '^0.24.0',
    '@opentelemetry/resources': '1.0.1',
    '@opentelemetry/sdk-node': '^0.27.0',
    '@opentelemetry/sdk-trace-base': '^1.0.1',
    '@opentelemetry/sdk-trace-node': '^1.0.1',
    '@opentelemetry/semantic-conventions': '1.0.1',
    '@opentelemetry/tracing': '^0.24.0',
    'hash-wasm': '^4.9.0',
    'pretty-bytes': '^5.6.0',
    'type-fest': '^2.5.4',
    undici: '^4.12.2',
    uuid: '^8.3.2',
  },
  devDependencies: {
    '@types/inflection': '^1.13.0',
    '@types/uuid': '^8.3.3',
  },
  publishConfig: {
    access: 'public',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../../tsconfig.base.json',
  compilerOptions: {
    module: 'ES2020',
    rootDir: './src',
    outDir: './dist',
    tsBuildInfoFile: './dist/.tsbuildinfo.json',
  },
  include: ['./src'],
  references: [],
})