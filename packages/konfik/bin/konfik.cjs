#!/usr/bin/env node

const main = async () => {
  const { run } = await import('@konfik/cli')
  run()
}

main().catch((e) => console.log(e))
