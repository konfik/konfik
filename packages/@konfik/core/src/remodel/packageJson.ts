import type { PackageJson as PackageJsonRaw } from 'type-fest'

import { Konfik } from './lib'

declare module './lib' {
  export interface Plugins {
    packageJsonPlugin: PackageJsonRaw
  }
}

export const PackageJsonKonfik = Konfik.from('packageJsonPlugin')
