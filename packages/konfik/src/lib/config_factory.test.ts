import { Placeheld, Placeholder, IsPlaceheld, ConfigPhase } from "./config_factory";
import { IsExact, assert } from "conditional-type-checks";

namespace _Types {
  namespace _Child {
    type Raw = {
      child: number;
    };
    assert<IsPlaceheld<Raw>>(false);
    type Expected = {
      child: Placeholder | number;
    };
    type Actual = Placeheld<Raw>;
    assert<IsPlaceheld<Actual>>(true);
    assert<IsExact<Expected, Actual>>(true);

    type Phase0 = ConfigPhase<
      Actual,
      {
        child: number;
      }
    >;
    assert<IsExact<Phase0, {}>>(true);
  }

  namespace _Children {
    type Raw = {
      childA: number;
      childB: boolean;
    };
    assert<IsPlaceheld<Raw>>(false);
    type Expected = {
      childA: Placeholder | number;
      childB: Placeholder | boolean;
    };
    type Actual = Placeheld<Raw>;
    assert<IsPlaceheld<Actual>>(true);
    assert<IsExact<Expected, Actual>>(true);

    type Phase0 = ConfigPhase<
      Actual,
      {
        childA: 101;
        childB: Placeholder;
      }
    >;
    assert<
      IsExact<
        Phase0,
        {
          childB: Placeholder | boolean;
        }
      >
    >(true);
    type Phase1 = ConfigPhase<
      Phase0,
      {
        childB: boolean;
      }
    >;
    assert<IsExact<Phase1, {}>>(true);
  }

  namespace _Optional {
    type Raw = {
      opt?: number;
    };
    assert<IsPlaceheld<Raw>>(false);
    type Expected = {
      opt?: Placeholder | number;
    };
    type Actual = Placeheld<Raw>;
    // TODO: fix `IsPlaceheld` check on optional fields
    assert<IsPlaceheld<Actual>>(true);
    assert<IsExact<Expected, Actual>>(true);

    // TODO: phase tests once `IsPlaceheld` bug sorted
  }

  namespace _Grandchild {
    export type Raw = {
      child: {
        grandchild: number;
      };
    };
    assert<IsPlaceheld<Raw>>(false);
    type Expected = {
      child:
        | Placeholder
        | {
            grandchild: Placeholder | number;
          };
    };
    type Actual = Placeheld<Raw>;
    assert<IsPlaceheld<Actual>>(true);
    assert<IsExact<Expected, Actual>>(true);

    type Phase0 = ConfigPhase<
      Actual,
      {
        child: Placeholder;
      }
    >;
    assert<
      IsExact<
        Phase0,
        {
          child:
            | Placeholder
            | Placeheld<{
                grandchild: number;
              }>;
        }
      >
    >(true);
    type Phase1 = ConfigPhase<
      Phase0,
      {
        child: {
          grandchild: Placeholder;
        };
      }
    >;
    assert<
      IsExact<
        Phase1,
        {
          child: {
            grandchild: Placeholder | number;
          };
        }
      >
    >(true);
    type Phase2 = ConfigPhase<
      Phase1,
      {
        child: {
          grandchild: 321;
        };
      }
    >;
    assert<IsExact<Phase2, {}>>(true);
  }

  namespace _Grandchildren {
    type Raw = {
      child: {
        grandchildA: number;
        grandchildB: {
          greatGrandchild: Date;
        };
      };
    };
    assert<IsPlaceheld<Raw>>(false);
    type Expected = {
      child:
        | Placeholder
        | {
            grandchildA: number;
            grandchildB: {
              greatGrandchild: Date;
            };
          }
        | {
            grandchildA: Placeholder | number;
            grandchildB:
              | Placeholder
              | {
                  greatGrandchild: Placeholder | Placeheld<Date>;
                };
          };
    };
    type Actual = Placeheld<Raw>;
    assert<IsPlaceheld<Actual>>(true);
    assert<IsExact<Expected, Actual>>(true);

    type Phase0 = ConfigPhase<
      Actual,
      {
        child: {
          grandchildA: 101;
          grandchildB: Placeholder;
        };
      }
    >;
    assert<
      IsExact<
        Phase0,
        {
          child: {
            grandchildB:
              | Placeholder
              | Placeheld<{
                  greatGrandchild: Date;
                }>;
          };
        }
      >
    >(true);
    type Phase1 = ConfigPhase<
      Phase0,
      {
        child: {
          grandchildB: {
            greatGrandchild: Placeholder;
          };
        };
      }
    >;
    assert<
      IsExact<
        Phase1,
        {
          child: {
            grandchildB: {
              greatGrandchild: Placeholder | Placeheld<Date>;
            };
          };
        }
      >
    >(true);
    type Phase2 = ConfigPhase<
      Phase1,
      {
        child: {
          grandchildB: {
            greatGrandchild: Date;
          };
        };
      }
    >;
    assert<IsExact<Phase2, {}>>(true);
  }

  namespace _ChildArray {
    type Raw = {
      value: string[];
    };
    assert<IsPlaceheld<Raw>>(false);
    type Expected = {
      value: Placeholder | string[];
    };
    type Actual = Placeheld<Raw>;
    assert<IsPlaceheld<Actual>>(true);
    assert<IsExact<Expected, Actual>>(true);

    type Phase0 = ConfigPhase<
      Actual,
      {
        value: Placeholder;
      }
    >;
    assert<
      IsExact<
        Phase0,
        {
          value: Placeholder | string[];
        }
      >
    >(true);
    type Phase1 = ConfigPhase<
      Phase0,
      {
        value: ["Rice crackers!"];
      }
    >;
    assert<IsExact<Phase1, {}>>(true);
  }
}
