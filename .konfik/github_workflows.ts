import { GitHubWorkflowKonfik } from '../plugins/github/src'
import dedent from 'dedent'

export const main = GitHubWorkflowKonfik({
  name: 'Publish CI',
  on: {
    push: {
      // TODO: patch types to get inference on fields such as `branches`.
      // TODO: do we want to enable fetching list of branch names and patching types.
      // ... would be nice if `main` was inferred.
      branches: ['main'],
    },
  },
  jobs: {
    build: {
      // TODO: fix inference
      ['runs-on']: 'ubuntu-latest',
      steps: [
        {
          uses: 'actions/checkout@v2',
          with: {
            ['fetch-depth']: 0,
          },
        },
        {
          name: 'Use Node.js 16.x',
          uses: 'actions/setup-node@v2',
          with: {
            ['node-version']: '16.x',
            cache: 'yarn',
          },
        },
        {
          name: 'Build',
          run: dedent`
            yarn
            yarn build
          `,
          env: {
            CI: true,
          },
        },
        {
          name: 'Create Release Pull Request or Publish to NPM',
          uses: 'contentlayerdev/action@draft-release-flow',
          with: {
            publish: 'yarn changeset publish',
            version: 'yarn changeset version',
          },
          env: {
            GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
            NPM_TOKEN: '${{ secrets.NPM_TOKEN }}',
            YARN_NPM_AUTH_TOKEN: '${{ secrets.NPM_TOKEN }}',
          },
        },
      ],
    },
  },
})

export const pr = GitHubWorkflowKonfik({
  name: 'Pull Request CI',
  on: {
    pull_request: {
      branches: ['main'],
    },
  },
  jobs: {
    build: {
      ['runs-on']: 'ubuntu-latest',
      steps: [
        {
          uses: 'actions/checkout@v2',
          with: {
            ['fetch-depth']: 0,
          },
        },
        {
          name: 'Use Node.js 16.x',
          uses: 'actions/setup-node@v2',
          with: {
            ['node-version']: '16.x',
            cache: 'yarn',
          },
        },
        {
          name: 'build',
          run: dedent`
            yarn
            yarn build
          `,
          env: {
            CI: true,
          },
        },
      ],
    },
  },
})
