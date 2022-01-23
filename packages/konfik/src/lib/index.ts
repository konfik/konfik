export { _, KonfikFactory } from '@konfik/core'

export interface GenerateConfig {}

export const generate = async (config: GenerateConfig) => {
  console.log('generate')
  console.log({ config })
}
