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
