import * as cli from './@konfik/cli/.konfik'
import * as core from './@konfik/core/.konfik'
import * as githubDownloader from './@konfik/github-downloader/.konfik'
import * as utils from './@konfik/utils/.konfik'
import * as bundled from './konfik/.konfik'

export default {
  '@konfik': {
    core: {
      'package.json': core.packageJsonKonfik,
      'tsconfig.json': core.tsconfigKonfik,
    },
    cli: {
      'package.json': cli.packageJsonKonfik,
      'tsconfig.json': cli.tsconfigKonfik,
    },
    'github-downloader': {
      'package.json': githubDownloader.packageJsonKonfik,
      'tsconfig.json': githubDownloader.tsconfigKonfik,
    },
    utils: {
      'package.json': utils.packageJsonKonfik,
      'tsconfig.json': utils.tsconfigKonfik,
    },
  },
  konfik: {
    'package.json': bundled.konfikPkg,
  },
}
