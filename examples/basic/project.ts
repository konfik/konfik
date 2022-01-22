import {
  // should `PackageJson` be exposed from `progen` itself,
  // or through similar means as TS configs?
  PackageJson,
  generate,
  ConfigsFactory,
  _,
} from 'progen'
import { Tsconfig, ts } from '@progen/tsconfig'
import { eslint } from '@progen/eslint'
import { pkg } from '@progen/pkg'

// import * as otherProject from './packages/other-project/project.ts'

// What makes a given config factory "special"?
// - can there be multiple?
// - how to generate (yaml, json, etc.)

const Configs = ConfigsFactory({
  bluePrints: {
    ts,
    eslint,
    pkg,
  },
  subConfigs: [otherProject],
})

// TODO: how much do we want to generate
// const somePackage = Pkg({
//   name: "",
//   dir: "./something"
// })

// whateverSynth(somePackage)

// TODO: how to deal with extends?
const someOtherTsconfig = ts.Config({
  // ...
})

const rootTsconfig = ts.Config({
  files: [],
  references: [someOtherTsconfig],
})

const MyTsconfig = ts.Config({
  compilerOptions: {
    // ...
    module: _,
  },
})

// Some configs (such as `tsconfigs`) can have multiple instances coexisting.
// Other configs should be one-of-a-kind.
const configs: Configs = Configs({
  pkg: pkg.Config({
    name: '',
  }),
  ts: {
    ['tsconfig.json']: MyTsconfig({
      module: ts.ModuleKind.CommonJS,
    }),
    ['tsconfig.esm.json']: MyTsconfig({
      module: ts.ModuleKind.ESModules,
    }),
  },
  eslint: {
    ['.eslintrc.json']: eslint.Config({
      // ...
    }),
  },
})

configs.synth()
configs.synth() // type error if called a second time

// What are the atomic units of this DX?
// - scopes
// - deps
// - tasks
// - configFactories

// const TsconfigFactory = Tsconfig({
//   compilerOptions: {
//     lib: [''],
//     typeRoots: _,
//   },
//   includes: _,
// })

// const tsconfig1 = TsconfigFactory({ includes: ['a'], typeRoots: [] })
// const tsconfig2 = TsconfigFactory({ includes: ['b'], typeRoots: [] })

const packageJson = PackageJson({
  name: 'basic-example',
  dependencies: {},
  scripts: {},
})

generate([tsconfig, packageJson])
