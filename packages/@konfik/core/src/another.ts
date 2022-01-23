import { ConfigFactory, _ } from './config-factory.js'
const Config = ConfigFactory<{
  a: string
  b: number
  c: boolean
}>({
  defaultName: '',
  toString(config) {
    return JSON.stringify(config)
  },
})
const A = Config({
  a: 'A',
  b: _,
  c: _,
})
const B = A({
  b: 2,
  c: _,
})
const c = B({
  c: true,
})
console.log(c.synth())
