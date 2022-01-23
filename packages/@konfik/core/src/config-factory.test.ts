import { ConfigFactory, _ } from './config-factory.js'
import test from 'ava'

test('first', (t) => {
  const Config = ConfigFactory<{
    a: string
    b: number
    c: boolean
  }>({})
  console.log(Config)
  // const A = Config({
  //   a: 'A',
  //   b: _,
  //   c: _,
  // })
  // const B = A({
  //   b: 2,
  //   c: _,
  // })
  // const c = B({
  //   c: true,
  // })
  // t.is(c.config, {
  //   a: 'A',
  //   b: 2,
  //   c: true,
  // })
})
