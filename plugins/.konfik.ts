import * as eslint from '@konfik-plugin/eslint/.konfik'
import * as gitignore from '@konfik-plugin/eslint/.konfik'
import * as gitpod from '@konfik-plugin/eslint/.konfik'
import * as packageJson from '@konfik-plugin/eslint/.konfik'
import * as prettier from '@konfik-plugin/eslint/.konfik'
import * as tsconfig from '@konfik-plugin/eslint/.konfik'
import * as vscode from '@konfik-plugin/eslint/.konfik'
import * as yarn from '@konfik-plugin/eslint/.konfik'
import * as jest from '@konfik-plugin/eslint/.konfik'
import * as github from '@konfik-plugin/eslint/.konfik'

export default {
  eslint: {
    'package.json': eslint.packageJsonKonfik,
    'tsconfig.json': eslint.tsconfigKonfik,
  },
  gitignore: {
    'package.json': gitignore.packageJsonKonfik,
    'tsconfig.json': gitignore.tsconfigKonfik,
  },
  gitpod: {
    'package.json': gitpod.packageJsonKonfik,
    'tsconfig.json': gitpod.tsconfigKonfik,
  },
  'package-json': {
    'package.json': packageJson.packageJsonKonfik,
    'tsconfig.json': packageJson.tsconfigKonfik,
  },
  prettier: {
    'package.json': prettier.packageJsonKonfik,
    'tsconfig.json': prettier.tsconfigKonfik,
  },
  tsconfig: {
    'package.json': tsconfig.packageJsonKonfik,
    'tsconfig.json': tsconfig.tsconfigKonfik,
  },
  vscode: {
    'package.json': vscode.packageJsonKonfik,
    'tsconfig.json': vscode.tsconfigKonfik,
  },
  yarn: {
    'package.json': yarn.packageJsonKonfik,
    'tsconfig.json': yarn.tsconfigKonfik,
  },
  jest: {
    'package.json': jest.packageJsonKonfik,
    'tsconfig.json': jest.tsconfigKonfik,
  },
  github: {
    'package.json': github.packageJsonKonfik,
    'tsconfig.json': github.tsconfigKonfik,
  },
}
