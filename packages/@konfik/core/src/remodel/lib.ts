import type { UnionToIntersection } from '@konfik/utils/src'

// LIB CODE

export type Flat<X> = {
  [k in keyof X]: X[k]
} extends infer Y
  ? Y
  : never

export interface Plugins {}

export class Konfik<Bag> {
  constructor(private bag: Bag) {}

  static from<P extends keyof Plugins>(
    _p: P,
  ): <Path extends string, Content extends Plugins[P]>(
    path: Path,
    content: Content,
  ) => Konfik<{
    [k in Path]: Content
  }> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Konfik({ [path]: content })
  }

  static merge<Konfiks extends Konfik<any>[]>(
    ..._konfiks: Konfiks
  ): Konfik<
    Flat<
      UnionToIntersection<
        {
          [k in keyof Konfiks]: Konfiks[k] extends Konfik<infer Bag> ? Bag : never
        }[number]
      >
    >
  > {
    const bag = {}
    _konfiks.forEach((k) => Object.assign(bag, k.bag))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Konfik(bag)
  }

  derive<X>(body: (_: Bag) => X): X {
    return body(this.bag)
  }

  extend<X>(body: (_: Bag) => X): X extends Konfik<infer Y> ? Konfik<Flat<Bag & Y>> : never {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return Konfik.merge(this.bag, body(this.bag))
  }
}
