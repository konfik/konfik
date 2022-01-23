<<<<<<< HEAD
import { _ } from "../../../konfik";
=======
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
>>>>>>> bcff76c (move files into core and set up ava)
