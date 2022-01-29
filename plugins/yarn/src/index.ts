import {ConfigurationValueMap as YarnConfig} from "@yarnpkg/core"
import {KonfikFactory} from "@konfik/core"
import { dump } from 'js-yaml'

export const Yarn = KonfikFactory<YarnConfig>({
  defaultName: ".yarnrc.yml",
  toString(config) {
    return dump(config)
  }
})