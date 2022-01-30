# Contributing

## Development

- Run `./link.mjs` (requires [xz](https://github.com/google/zx) installed) in order to link the local plugins for development

## Design Decisions

- Import plugins from GitHub
  - chicken-egg problem
  - Not NPM: Doesn't require `npm publish`
- `konfik.ts` should work with TS + VSC out of the box - even without a `tsconfig.json`
  - Requires an initial call of `konfik dev` to pick up the TS definitions though

## Principles

- Simplicity
  - A user should have to learn as few new things as possible
- Easy to build plugins
- Easy to share configs across projects
- Generated files are read-only (strongly recommended)
- Avoid chicken-egg problems
- Incrementally adoptable
- No magic
