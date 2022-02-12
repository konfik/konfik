const githubChangelogGenerator = require('@changesets/changelog-github').default

module.exports = {
  default: {
    getDependencyReleaseLine: () => '',
    getReleaseLine: (changeset, type) =>
      githubChangelogGenerator.getReleaseLine(changeset, type, {
        repo: 'konfik/konfik',
      }),
  },
}
