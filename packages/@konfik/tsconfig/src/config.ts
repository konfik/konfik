// TODO: use correct yarn 2 convention to resolve
import { ConfigFactory, _ } from "../../../konfik";
import { Tsconfig } from "tsconfig-type";

export const Ts = ConfigFactory<Tsconfig>();

const MyTs = Ts({
  compilerOptions: {
    declaration: true,
    allowJs: false,
    composite: true,
  },
  exclude: ["node_modules"],
  include: _,
});

const final = MyTs({
  // TODO: retain symbol-bound docs.
  include: ["YO"],
});
