import type { UnionToIntersection } from '@konfik/utils/src'

// LIB CODE

export type Flat<X> = {
  [k in keyof X]: X[k]
} extends infer Y
  ? Y
  : never

export interface Plugins {}

export abstract class Konfik<Bag> {
  static from<P extends keyof Plugins>(
    p: P,
  ): <Path extends string, Content extends Plugins[P]>(
    path: Path,
    content: Content,
  ) => Konfik<{
    [k in Path]: Content
  }> {
    return 0 as any
  }

  static merge<Konfiks extends Konfik<any>[]>(
    ...konfiks: Konfiks
  ): Konfik<
    Flat<
      UnionToIntersection<
        {
          [k in keyof Konfiks]: Konfiks[k] extends Konfik<infer Bag> ? Bag : never
        }[number]
      >
    >
  > {
    return 0 as any
  }

  abstract derived<Keys extends (keyof Bag)[]>(
    ...keys: Keys
  ): <X>(
    body: (
      _: Flat<
        UnionToIntersection<
          {
            [k in keyof Keys]: Keys[k] extends keyof Bag ? { [h in Keys[k]]: Bag[Keys[k]] } : never
          }[number]
        >
      >,
    ) => X,
  ) => X

  abstract extend<Keys extends (keyof Bag)[]>(
    ...keys: Keys
  ): <X>(
    body: (
      _: Flat<
        UnionToIntersection<
          {
            [k in keyof Keys]: Keys[k] extends keyof Bag ? { [h in Keys[k]]: Bag[Keys[k]] } : never
          }[number]
        >
      >,
    ) => X,
  ) => X extends Konfik<infer Y> ? Konfik<Flat<Bag & Y>> : never
}
