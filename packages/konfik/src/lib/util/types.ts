export type Flatten<T> = T extends object
  ? {
      [Key in keyof T]: Flatten<T[Key]>;
    }
  : T;

export type ValueOf<T> = T[keyof T];

export type UnionToIntersection<Union> = (
  Union extends any ? (_: Union) => any : never
) extends (_: infer Intersection) => any
  ? Intersection
  : never;

export type IsOptional<T, K extends keyof T> = [
  {
    [Key in keyof T]: never;
  }[K]
] extends [never]
  ? false
  : true;

// type Test = {
//   a?: "yo";
//   b?: "yo" | undefined;
//   c: "yo";
// };
// type X = {
//   [Key in keyof Test]: undefined extends Key ? ;
// };
