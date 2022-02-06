import type { FileType } from '@konfik/core'
import type { BuiltInParserName } from 'prettier'
import { format } from 'prettier'

import * as cli from '../packages/@konfik/cli/konfik.js'
import * as core from '../packages/@konfik/core/konfik.js'
import * as ghDownloader from '../packages/@konfik/github-downloader/konfik.js'
import * as utils from '../packages/@konfik/utils/konfik.js'
import { konfikPkg } from '../packages/konfik/konfik.js'
import * as eslint from '../plugins/eslint/konfik.js'
import * as gitignore from '../plugins/gitignore/konfik.js'
import * as gitpod from '../plugins/gitpod/konfik.js'
import * as packageJson from '../plugins/package-json/konfik.js'
import * as prettier from '../plugins/prettier/konfik.js'
import * as tsconfig from '../plugins/tsconfig/konfik.js'
import * as vscode from '../plugins/vscode/konfik.js'
import * as yarn from '../plugins/yarn/konfik.js'
import * as root from './root.js'

export const prettyPrint = (uglyString: string, fileType: FileType): string => {
  const parser = mapFileTypeToParser(fileType)
  if (parser === undefined) return uglyString

  return format(uglyString, { ...root.prettierOptions, parser })
}

const mapFileTypeToParser = (fileType: FileType): BuiltInParserName | undefined => {
  switch (fileType) {
    case 'json':
      return 'json'
    case 'yaml':
      return 'yaml'
    case 'js':
    case 'ts':
      return 'babel-ts'
    case 'plain':
      return undefined
  }
}

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
