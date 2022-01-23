<<<<<<< HEAD
export { _, ConfigFactory } from "./config_factory";
=======
export { _, ConfigFactory } from "./config";
>>>>>>> bd2a928 (merge main and resolve conflicts)

export interface GenerateConfig {}

export const generate = async (config: GenerateConfig) => {
  console.log("generate");
  console.log({ config });
};
