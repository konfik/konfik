import { _, Konfiks } from 'konfik'
import { Tsconfig } from '.konfik/github.com/konfik/konfik/plugins/tsconfig'
import { Package } from '.konfik/github.com/konfik/konfik/plugins/package-json'

const pkg = Package({
  name: 'new-example',
  devDependencies: {
    '@konfik/core': 'workspace:*',
    '@konfik/package': 'workspace:*',
    '@konfik/tsconfig': 'workspace:*',
  },
})

const tsconfig = Tsconfig({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }, { path: '../../packages/@konfik/tsconfig' }],
})

export const konfik = [{ fileMap: Konfiks(pkg, tsconfig) }]
