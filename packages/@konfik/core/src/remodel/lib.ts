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
    _p: P,
  ): <Path extends string, Content extends Plugins[P]>(
    path: Path,
    content: Content,
  ) => Konfik<{
    [k in Path]: Content
  }> {
    return 0 as any
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
    return 0 as any
  }

  abstract derive<X>(body: (_: Bag) => X): X
  abstract extend<X>(body: (_: Bag) => X): X extends Konfik<infer Y> ? Konfik<Flat<Bag & Y>> : never
}
