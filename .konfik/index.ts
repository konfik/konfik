import type { FileType } from '@konfik/core'
import type { BuiltInParserName } from 'prettier'
import { format } from 'prettier'

import generate from '../generate/.konfik.js'
import { default as packages } from '../packages/.konfik.js'
import { default as plugins } from '../plugins/.konfik.js'
import * as githubWorkflows from './github_workflows.js'
import * as root from './root.js'
import { vscodeTasks } from './vscode.js'

export const prettyPrint = (uglyString: string, fileType: FileType): string => {
  const parser = mapFileTypeToParser(fileType)
  if (parser === undefined) return uglyString

  return format(uglyString, { ...root.prettierOptions, parser })
}

const mapFileTypeToParser = (fileType: FileType): BuiltInParserName | undefined => {
  switch (fileType) {
    case 'json-stringify':
      return 'json-stringify'
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

// TODO: how to supply option to generate gitignore (not standalone gitignore konfik)
export default {
  'prettier.config.js': root.prettierKonfik,
  '.eslintrc': root.eslintKonfik,
  '.gitignore': root.gitignoreKonfik,
  // '.yarnrc.yml': root.yarnKonfik,
  '.gitpod.yml': root.gitpodKonfik,
  'tsconfig.all.json': root.tsconfigAllKonfik,
  'tsconfig.base.json': root.tsconfigBaseKonfik,
  'package.json': root.packageJsonKonfik,
  '.vscode': {
    'tasks.json': vscodeTasks,
  },
  '.github': {
    workflows: {
      ['main.yml']: githubWorkflows.main,
      ['pr.yml']: githubWorkflows.pr,
    },
  },
  packages,
  generate,
  plugins,
}
