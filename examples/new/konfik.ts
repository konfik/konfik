import { Tsconfig } from '.konfik/github.com/konfik/konfik/plugins/tsconfig'

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

export const konfik = [tsconfig]
