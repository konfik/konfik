<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export { _, ConfigFactory } from "./config_factory";
=======
export { _, ConfigFactory } from "./config";
>>>>>>> bd2a928 (merge main and resolve conflicts)

=======
>>>>>>> bcff76c (move files into core and set up ava)
=======
=======
export { _, ConfigFactory } from "./config_factory";

>>>>>>> 9bc4c39 (fix test exclusion from tsc)
>>>>>>> 8da8708 (fix test exclusion from tsc)
export interface GenerateConfig {}

export const generate = async (config: GenerateConfig) => {
  console.log('generate')
  console.log({ config })
}
