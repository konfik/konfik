import { KonfikFileMap } from './konfik-factory.js'
export { KonfikFactory, type KonfikFileMap, Konfiks } from './konfik-factory.js'
export { _ } from './placeholder.js'

// TODO: do we need this intermediate type?
export type KonfikPlugin = {
  fileMap: KonfikFileMap
}

export type KonfikFileMapEntry = KonfikFileMap extends Map<infer K, infer V> ? [K, V] : never
