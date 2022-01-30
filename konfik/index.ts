import * as cli from '@konfik/cli/konfik.js'
import * as core from '@konfik/core/konfik.js'
import * as ghDownloader from '@konfik/github-downloader/konfik.js'
import * as utils from '@konfik/utils/konfik.js'
import { _ } from 'konfik'
import { konfikPkg } from 'konfik/konfik.js'
import * as eslint from 'konfik-eslint/konfik.js'
import * as gitignore from 'konfik-gitignore/konfik.js'
import * as gitpod from 'konfik-gitpod/konfik.js'
import * as packageJson from 'konfik-package-json/konfik.js'
import * as prettier from 'konfik-prettier/konfik.js'
import * as tsconfig from 'konfik-tsconfig/konfik.js'
import * as vscode from 'konfik-vscode/konfik.js'
import * as yarn from 'konfik-yarn/konfik.js'

import * as root from './root.js'

// TODO: how to supply option to generate gitignore
export default {
  'prettier.config.js': root.prettierKonfik,
  '.eslintrc': root.eslintKonfik,
  '.gitignore': root.gitignoreKonfik,
  '.yarnrc.yml': root.yarnKonfik,
  '.gitpod.yml': root.gitpodKonfik,
  'tsconfig.all.json': root.tsconfigAllKonfik,
  'tsconfig.base.json': root.tsconfigBaseKonfik,
  'package.json': root.packageJsonKonfik,
  packages: {
    '@konfik': {
      core: {
        'package.json': core.packageJsonKonfik,
        'tsconfig.json': core.tsconfigKonfik,
      },
      cli: {
        'package.json': cli.packageJsonKonfik,
        'tsconfig.json': cli.tsconfigKonfik,
      },
      'github-downloader': {
        'package.json': ghDownloader.packageJsonKonfik,
        'tsconfig.json': ghDownloader.tsconfigKonfik,
      },
      utils: {
        'package.json': utils.packageJsonKonfik,
        'tsconfig.json': utils.tsconfigKonfik,
      },
    },
    konfik: {
      'package.json': konfikPkg,
    },
  },
  plugins: {
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
  },
}
