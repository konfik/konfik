import { program } from 'commander'
// import * as fs from 'node:fs/promises'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const run = async () => {
  // TODO: get version
  const version = ''
  program
    .version(version)
    .option('-c, --config <string>', 'TODO: description', 'project')
    .action(async ({ config: configPath }: { config: string }) => {
      const fullConfigPath = path.relative(__dirname, configPath)
      // const fullConfigPath = configPath

      console.log({ fullConfigPath, __dirname })

      // const register  = await import('@swc/register')
      await import(fullConfigPath)
    })
    .parse(process.argv)
}
