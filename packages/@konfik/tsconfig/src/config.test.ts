// TODO: use correct yarn 2 convention to resolve
import { _ } from "../../../konfik/src/lib";
import { Ts } from "./config";

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
