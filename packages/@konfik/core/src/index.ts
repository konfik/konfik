import type { KonfikFileMap } from './common.js'

export { KonfikFactory, Konfiks } from './konfik-factory.js'
export { _ } from './placeholder.js'

// TODO: do we need this intermediate type?
export type KonfikPlugin = {
  fileMap: KonfikFileMap
}

export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
