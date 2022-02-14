# konfik [![](https://badgen.net/npm/v/konfik)](https://www.npmjs.com/package/konfik) [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/konfik/konfik)

Abstract over configuration with TypeScript.

## Plugins

- tsconfig

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
- Replace "templates" / "boilerplate"
  - Templates/boilerplates just help you when getting started but not while maintaining
- Single source of truth
- Makes the right thing easy
  - e.g. have different linting rules for various sub packages in a repo
- Clarity through code
  - It's much easier to understand how things relate to/depend on each other when you can express the relationships in code

### Cons

- Can't use
  - Some Yarn CLI commands: `yarn add`, `yarn upgrade-interactive`
  - Dependabot/Renovate/...
