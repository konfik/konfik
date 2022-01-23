<<<<<<< HEAD
<<<<<<< HEAD
import { _ } from "../../../konfik";
=======
=======
>>>>>>> 8da8708 (fix test exclusion from tsc)
// TODO: use correct yarn 2 convention to resolve
<<<<<<< HEAD
import { _ } from "../../../konfik/src/lib";
>>>>>>> bd2a928 (merge main and resolve conflicts)
import { Ts } from "./config";

const MyTs = Ts({
  compilerOptions: {
    declaration: true,
    allowJs: false,
    composite: true,
  },
  exclude: ["node_modules"],
  include: _,
<<<<<<< HEAD
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
=======
});

const final = MyTs({
  // TODO: retain symbol-bound docs.
  include: ["YO"],
>>>>>>> bd2a928 (merge main and resolve conflicts)
});
=======
// import { _ } from '../../../konfik/src/lib'
// import { Ts } from './config'

// const MyTs = Ts({
//   compilerOptions: {
//     declaration: true,
//     allowJs: false,
//     composite: true,
//   },
//   exclude: ['node_modules'],
//   include: _,
// })

// const final = MyTs({
//   // TODO: retain symbol-bound docs.
//   include: ['YO'],
// })

export {}
<<<<<<< HEAD
>>>>>>> bcff76c (move files into core and set up ava)
=======
=======
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
>>>>>>> 9bc4c39 (fix test exclusion from tsc)
>>>>>>> 8da8708 (fix test exclusion from tsc)
