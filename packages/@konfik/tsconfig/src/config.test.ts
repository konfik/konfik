import { _ } from "../../../konfik";
import { Ts } from "./config";

const MyTs = Ts({
  compilerOptions: {
    declaration: true,
    allowJs: false,
    composite: true,
  },
  exclude: ["node_modules"],
  include: _,
  extends: _,
  watchOptions: _,
});

const Almost = MyTs({
  // TODO: retain symbol-bound docs.
  include: ["."],
  extends: _,
  watchOptions: _,
});

const SoClose = Almost({
  extends: "",
  watchOptions: _,
});

const final = SoClose({
  watchOptions: {},
});
