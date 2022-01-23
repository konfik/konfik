/**
 * TODO: FINISH TESTS! Why timing out sometimes?
 * TODO: create utils to reduce boilerplate in the following tests.
 * TODO: improve naming consistency.
 * TODO: more test cases! More deeply-nested cases. Real-world cases.
 * TODO: TRY TO BREAK IT! Circularity?
 */

import { KonfikPhase, KonfikFactory, KonfikFactoryProps } from './konfik-factory.js'
import { _, Placeholder, Placeheld, IsPlaceheld } from './placeholder.js'
import { IsExact, assert } from 'conditional-type-checks'
import test from 'ava'

const konfikFactoryTestProps: KonfikFactoryProps<Record<PropertyKey, any>> = {
  defaultName: 'testing',
  toString(final) {
    return JSON.stringify(final)
  },
}

test('child', (t) => {
  type Raw = {
    child: number
  }
  assert<IsPlaceheld<Raw>>(false)
  type Expected = {
    child: Placeholder | number
  }
  type Actual = Placeheld<Raw>
  assert<IsPlaceheld<Actual>>(true)
  assert<IsExact<Expected, Actual>>(true)
  type Phase0 = KonfikPhase<
    Actual,
    {
      child: number
    }
  >
  assert<IsExact<Phase0, {}>>(true)
  const Konfik = KonfikFactory<Raw>(konfikFactoryTestProps)
  const actual = Konfik({
    child: 1,
  }).config
  const expected: Raw = {
    child: 1,
  }
  t.deepEqual(expected, actual)
})

test('children', (t) => {
  type Raw = {
    childA: number
    childB: boolean
  }
  assert<IsPlaceheld<Raw>>(false)
  type Expected = {
    childA: Placeholder | number
    childB: Placeholder | boolean
  }
  type Actual = Placeheld<Raw>
  assert<IsPlaceheld<Actual>>(true)
  assert<IsExact<Expected, Actual>>(true)
  type Phase0 = KonfikPhase<
    Actual,
    {
      childA: 101
      childB: Placeholder
    }
  >
  assert<
    IsExact<
      Phase0,
      {
        childB: Placeholder | boolean
      }
    >
  >(true)
  const Konfik = KonfikFactory<Raw>(konfikFactoryTestProps)
  const phase0 = Konfik({
    childA: 101,
    childB: _,
  })
  type Phase1 = KonfikPhase<
    Phase0,
    {
      childB: true
    }
  >
  assert<IsExact<Phase1, {}>>(true)
  const actual = phase0({
    childB: true,
  }).config
  const expected: Raw = {
    childA: 101,
    childB: true,
  }
  t.deepEqual(expected, actual)
})

test('optional', (t) => {
  type Raw = {
    opt?: number
  }
  assert<IsPlaceheld<Raw>>(false)
  type Expected = {
    opt?: Placeholder | number
  }
  type Actual = Placeheld<Raw>
  // TODO: fix `IsPlaceheld` check on optional fields
  // @ts-expect-error
  assert<IsPlaceheld<Actual>>(true)
  assert<IsExact<Expected, Actual>>(true)
  // TODO: phase tests once `IsPlaceheld` bug sorted
  const Konfik = KonfikFactory<Raw>(konfikFactoryTestProps)
  const actual = Konfik({
    opt: 1,
  }).config
  const expected: Raw = {
    opt: 1,
  }
  t.deepEqual(expected, actual)
})

test('grandchild', (t) => {
  type Raw = {
    child: {
      grandchild: number
    }
  }
  assert<IsPlaceheld<Raw>>(false)
  type Expected = {
    child:
      | Placeholder
      | {
          grandchild: Placeholder | number
        }
  }
  type Actual = Placeheld<Raw>
  assert<IsPlaceheld<Actual>>(true)
  assert<IsExact<Expected, Actual>>(true)

  type Phase0 = KonfikPhase<
    Actual,
    {
      child: Placeholder
    }
  >
  assert<
    IsExact<
      Phase0,
      {
        child:
          | Placeholder
          | Placeheld<{
              grandchild: number
            }>
      }
    >
  >(true)
  type Phase1 = KonfikPhase<
    Phase0,
    {
      child: {
        grandchild: Placeholder
      }
    }
  >
  assert<
    IsExact<
      Phase1,
      {
        child: {
          grandchild: Placeholder | number
        }
      }
    >
  >(true)
  type Phase2 = KonfikPhase<
    Phase1,
    {
      child: {
        grandchild: 321
      }
    }
  >
  assert<IsExact<Phase2, {}>>(true)
  t.is(true, true)
})

test('grandchildren', (t) => {
  type Raw = {
    child: {
      grandchildA: number
      grandchildB: {
        greatGrandchild: Date
      }
    }
  }
  assert<IsPlaceheld<Raw>>(false)
  type Expected = {
    child:
      | Placeholder
      | {
          grandchildA: number
          grandchildB: {
            greatGrandchild: Date
          }
        }
      | {
          grandchildA: Placeholder | number
          grandchildB:
            | Placeholder
            | {
                greatGrandchild: Placeholder | Placeheld<Date>
              }
        }
  }
  type Actual = Placeheld<Raw>
  assert<IsPlaceheld<Actual>>(true)
  assert<IsExact<Expected, Actual>>(true)

  type Phase0 = KonfikPhase<
    Actual,
    {
      child: {
        grandchildA: 101
        grandchildB: Placeholder
      }
    }
  >
  assert<
    IsExact<
      Phase0,
      {
        child: {
          grandchildB:
            | Placeholder
            | Placeheld<{
                greatGrandchild: Date
              }>
        }
      }
    >
  >(true)
  type Phase1 = KonfikPhase<
    Phase0,
    {
      child: {
        grandchildB: {
          greatGrandchild: Placeholder
        }
      }
    }
  >
  assert<
    IsExact<
      Phase1,
      {
        child: {
          grandchildB: {
            greatGrandchild: Placeholder | Placeheld<Date>
          }
        }
      }
    >
  >(true)
  type Phase2 = KonfikPhase<
    Phase1,
    {
      child: {
        grandchildB: {
          greatGrandchild: Date
        }
      }
    }
  >
  assert<IsExact<Phase2, {}>>(true)
  t.is(true, true)
})

test('child array', (t) => {
  type Raw = {
    value: string[]
  }
  assert<IsPlaceheld<Raw>>(false)
  type Expected = {
    value: Placeholder | string[]
  }
  type Actual = Placeheld<Raw>
  assert<IsPlaceheld<Actual>>(true)
  assert<IsExact<Expected, Actual>>(true)

  type Phase0 = KonfikPhase<
    Actual,
    {
      value: Placeholder
    }
  >
  assert<
    IsExact<
      Phase0,
      {
        value: Placeholder | string[]
      }
    >
  >(true)
  type Phase1 = KonfikPhase<
    Phase0,
    {
      value: ['Rice crackers!']
    }
  >
  assert<IsExact<Phase1, {}>>(true)
  t.is(true, true)
})
