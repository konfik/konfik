export { _, ConfigFactory } from './config_factory'

export interface GenerateConfig {}

export const generate = async (config: GenerateConfig) => {
  console.log('generate')
  console.log({ config })
}
