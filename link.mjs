#!/usr/bin/env zx

// Based on https://github.com/google/zx

const examples = await fs.readdir('./examples')

for (const example of examples) {
  const virtualKonfikRoot = `examples/${example}/node_modules/.konfik/github.com/konfik/konfik`
  await $`mkdir -p ./${virtualKonfikRoot}`

  await $`rm $PWD/${virtualKonfikRoot}/plugins`
  await $`ln -sf $PWD/plugins $PWD/${virtualKonfikRoot}/plugins`
}
