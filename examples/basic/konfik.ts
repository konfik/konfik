import { _ } from '@konfik/core'
import { Tsconfig } from '@konfik/tsconfig'
import { Package } from '@konfik/package'

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

export const konfik = [pkg, tsconfig]
