import * as githubKonfik from './github/.konfik.js'

export default {
  github: {
    ['package.json']: githubKonfik.packageJsonKonfik,
    ['tsconfig.json']: githubKonfik.tsconfigKonfik,
  },
}
