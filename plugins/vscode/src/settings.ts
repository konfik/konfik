import {KonfikFactory} from "@konfik/core"

// TODO: swap out with narrow settings type (BUT AUGMENTABLE / accounting for extensions)
export const Settings = KonfikFactory<Record<string, any>>({
  defaultName: ".vscode/settings.json",
  toString(config) {
    return JSON.stringify(config, null, 2)
  }
})