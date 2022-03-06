import { PackageJsonKonfik } from '@konfik-plugin/package-json'
import { TsconfigKonfik } from '@konfik-plugin/tsconfig'

import { basePackageJson, baseTsconfig } from '../../.konfik/common.js'

export const packageJsonKonfik = PackageJsonKonfik({
  ...basePackageJson,
  name: '@konfik-generate/github',
  types: 'index.ts',
  files: ['dist/src/Action.ts', 'dist/src/Workflow.ts', 'dist/src/WorkflowTemplateProperties.ts'],
  devDependencies: {
    ...basePackageJson.devDependencies,
    'json-schema-to-typescript': '^10.1.5',
  },
  scripts: {
    ...basePackageJson.scripts,
    build: 'node ./dist/src/gen.js',
  },
})

export const tsconfigKonfik = TsconfigKonfik({
  extends: '../../tsconfig.base.json',
  ...baseTsconfig,
})
