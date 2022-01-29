import type { PosixFilePath } from '@konfik/utils'
import { Tagged } from '@konfik/utils/effect'

export class GitHubData extends Tagged('GitHubData')<{
  readonly owner: string
  readonly repo: string
  readonly branch: string
}> {}

export const download = (gitHubData: GitHubData, targetDirPath: PosixFilePath) => {
  const downloadUrl = `https://github.com/${gitHubData.owner}/${gitHubData.repo}/tarball/${gitHubData.branch}`
  // -> some.tar.gz
}
