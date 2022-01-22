import { Config, Command } from 'progen'
// import { ts } from '@progen/ts'
import { pkg } from '@progen/pkg'
import { ts } from '.progen/b6c6d0ac5999b69cc0f16700bb3023471db89d8f/packages/system-next/test/int.test.ts'
import * as path from 'path'
import * as util from 'some-util'

function sharedTask(args: string[]) {
  // Do something.
  return null
}

const TsconfigBase = ts.Config({
  compilerOptions: {
    module: _,
  },
  exclude: ['node_modules'],
})

const PkgTsconfig = TsconfigBase({
  compilerOptions: {
    module: _,
  },
})

const configA: Config = (ctx) => [
  // All paths are relative to the scope's `dir`.
  PkgTsconfig({
    compilerOptions: {
      module: 'CommonJS',
    },
  }),
  PkgTsconfig(
    {
      compilerOptions: {
        module: 'ESModules',
      },
    },
    'tsconfig.esm.json',
  ),
  PackageJSON({
    name: 'pkg-a',
    scripts: {
      ['some-task']: 'some-task',
      ['another-task'](args) {
        // Do something.
      },
      ['shared-task']: sharedTask,
    },
  }),
]

const configB: Config = (ctx) => {
  return {
    ['package.json']: {
      name: 'pkg-b',
      dependencies: {
        ['pkg-a']: util.getReference(configA),
        ['effect-ts']: true,
        ['typescript']: '4.5.0',
      },
      scripts: {
        sharedTask,
      },
    },
  }
}

// we capture into `root`, incase you have
// nested workspaces. Ultimately, we can synth
// upon calling `Workspace`, independent.
const root: Config = (ctx) => [
  packageJson({
    workspaces: ['packages/a', 'packages/b'],
  }),
]

synth(root, configA, configB)
