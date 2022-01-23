import { _ } from '@konfik/core'
import { Ts } from '@konfik/tsconfig'

const tsconfig = Ts({
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['./src'],
  references: [{ path: '../../packages/@konfik/core' }, { path: '../../packages/@konfik/tsconfig' }],
})

export const konfik = [tsconfig]
