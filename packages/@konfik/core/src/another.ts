import { KonfikFactory } from './konfik-factory.js'
import { _ } from './placeholder.js'

const Config = KonfikFactory<{
  a: string
  b: number
  c: {
    d: {
      e: boolean
    }
  }
}>({
  defaultName: 'my-konfik.json',
  toString(config) {
    return JSON.stringify(config, null, 2)
  },
})

const A = Config({
  a: 'HELLO',
  b: _,
  c: _,
})

const B = A({
  b: 10,
  c: _,
})

const c = B({
  c: {
    d: {
      e: true,
    },
  },
})
