import * as eslint from './eslint/.konfik.js'
import * as github from './github/.konfik.js'
import * as gitignore from './gitignore/.konfik.js'
import * as gitpod from './gitpod/.konfik.js'
import * as jest from './jest/.konfik.js'
import * as packageJson from './package-json/.konfik.js'
import * as prettier from './prettier/.konfik.js'
import * as tsconfig from './tsconfig/.konfik.js'
import * as vscode from './vscode/.konfik.js'
import * as yarn from './yarn/.konfik.js'

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
