import type { Linter } from 'eslint'

import { Konfik } from './lib'

declare module './lib' {
  export interface Plugins {
    eslintPlugin: Linter.Config
  }
}

export const EslintKonfik = Konfik.from('eslintPlugin')
