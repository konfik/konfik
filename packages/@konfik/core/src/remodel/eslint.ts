import type { Linter } from 'eslint'

import { Konfik } from './lib'

declare module './lib' {
  export interface Plugins {
    tsconfigPlugin: {
      compilerOptions: {
        strict?: boolean
        lib?: ('ES5' | 'ES6')[]
      }
    }
  }
}

export const TsconfigKonfik = Konfik.from('tsconfigPlugin')

declare module './lib' {
  export interface Plugins {
    eslintPlugin: Linter.Config
  }
}

export const EslintKonfik = Konfik.from('eslintPlugin')
