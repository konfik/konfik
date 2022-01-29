#!/usr/bin/env zx

const examples = await fs.readdir('./examples')

for (const example of examples) {
  const virtualKonfikRoot = `examples/${example}/node_modules/.konfik/github.com/konfik/konfik`
  await $`mkdir -p ./${virtualKonfikRoot}`

  await $`ln -sf $PWD/plugins $PWD/${virtualKonfikRoot}/plugins`
}

// let branch = await $`git branch --show-current`
// console.log(branch)
// await $`dep deploy --branch=${branch}`

// await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`])

// let name = 'foo bar'
// await $`mkdir /tmp/${name}`
