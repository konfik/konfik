export {}
// import { KonfikFactory } from './konfik-factory.js'
// import { _ } from './placeholder'
// import test from 'ava'

// test('first', (t) => {
//   const Config = KonfikFactory<{
//     a: string
//     b: number
//     c: boolean
//   }>({
//     defaultName: '',
//     toString(config) {
//       return JSON.stringify(config)
//     },
//   })
//   const A = Config({
//     a: 'A',
//     b: _,
//     c: _,
//   })
//   const B = A({
//     b: 2,
//     c: _,
//   })
//   const c = B({
//     c: true,
//   })
//   t.deepEqual(c.config, {
//     a: 'A',
//     b: 2,
//     c: true,
//   })
// })
