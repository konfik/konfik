# konfik

## Use cases

- [ ] TypeScript
  - [ ] tsconfig
  - [ ] project references
- [ ] Eslint
- [ ] dprint / prettier
- [ ] Yarn
- [ ] gitignore
- [ ] VSC tasks

### Questions

- [ ] nix integrations?
- [ ] direnv?
- [ ] How to deal with Yarn 2/3 monorepo files (i.e. `.yarn` folder)
  - Possible answer: Use Konfik for some parts but not for all
  - Or only apply parts of a generated file

### CLI features

- [ ] watch

## Pros / Cons

### Pros

- Reusablity
- Type-safety
- Composable

### Cons

- Can't use
  - Some Yarn CLI commands: `yarn add`, `yarn upgrade-interactive`
  - Dependabot/Renovate/...

## Design Decisions

- Import plugins from GitHub
  - chicken-egg problem
  - Not NPM: Doesn't require `npm publish`
- `konfik.ts` should work with TS + VSC out of the box - even without a `tsconfig.json`
