import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJson, baseTsconfig } from '../../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJson,
  name: '@konfik/utils',
  exports: {
    './package.json': {
      import: './package.json',
    },
    '.': {
      import: './dist/src/index.js',
    },
    './effect': {
      import: './dist/src/effect/index.js',
    },
    './effect/Tracing': {
      import: './dist/src/effect/Tracing/index.js',
    },
    './node': {
      import: './dist/src/node/index.js',
    },
  },
  types: './dist/src/index.d.ts',
  typesVersions: {
    '*': {
      'package.json': ['./package.json'],
      effect: ['./dist/src/effect'],
      'effect/Tracing': ['./dist/src/effect/Tracing'],
      node: ['./dist/src/node'],
    },
  },
  scripts: {
    ...basePackageJson.scripts,
    test: 'echo No tests yet',
  },
  dependencies: {
    '@effect-ts/core': '^0.58.0',
    '@effect-ts/otel': '^0.13.0',
    '@effect-ts/otel-exporter-trace-otlp-http': '^0.13.0',
    '@effect-ts/otel-sdk-trace-node': '^0.13.0',
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
    ...basePackageJson.devDependencies,
    '@types/inflection': '^1.13.0',
    '@types/uuid': '^8.3.3',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../../tsconfig.base.json',
  ...baseTsconfig,
})
