import type { PosixFilePath } from '@konfik/utils'
import { filePathJoin } from '@konfik/utils'
import type { Has } from '@konfik/utils/effect'
import { Layer, OT, pipe, service, T, tag } from '@konfik/utils/effect'
import { fs } from '@konfik/utils/node'

import type { GetKonfikVersionError } from '../version.js'
import { getKonfikVersion } from '../version.js'
import type { HasCwdService } from './CwdService.js'
import { CwdService } from './CwdService.js'

export const ArtifactServiceId = Symbol.for('@konfik/cli/ArtifactService')
export type ArtifactServiceId = typeof ArtifactServiceId

export interface ArtifactService {
  readonly [ArtifactServiceId]: ArtifactServiceId
  /**
   * Retrieve the absolute path to the directory that is being used to store
   * all artifacts produced by Konfik, including cached build artifacts.
   */
  readonly artifactDirectory: PosixFilePath
  /**
   * Retrieve the absolute path to the directory that is being used to cache
   * Konfik build artifacts.
   */
  readonly artifactCacheDirectory: PosixFilePath
  /**
   * Create a new directory for storing artifacts produced by Konfik. This
   * includes cached build artifacts as well as installation artifacts when
   * using HTTP imports.
   */
  readonly makeArtifactDirectory: T.Effect<unknown, fs.MkdirError, PosixFilePath>
  /**
   * Create a new directory for caching Konfik build artifacts. The cache
   * directory will be a child of the parent artifact directory.
   */
  readonly makeArtifactCacheDirectory: T.Effect<unknown, fs.MkdirError, PosixFilePath>
}

export const makeArtifactService: T.Effect<OT.HasTracer & HasCwdService, GetKonfikVersionError, ArtifactService> =
  T.gen(function* ($) {
    const tracer = yield* $(OT.Tracer)
    const { cwd } = yield* $(CwdService)

    const artifactDirectory = filePathJoin(cwd, 'node_modules' as PosixFilePath, '.konfik' as PosixFilePath)

    const artifactCacheDirectory = yield* $(
      pipe(
        getKonfikVersion(),
        T.map((version) => filePathJoin(artifactDirectory, '.cache' as PosixFilePath, `v${version}` as PosixFilePath)),
      ),
    )

    const makeArtifactDirectory = pipe(
      fs.mkdirp(artifactDirectory),
      T.as(artifactDirectory),
      T.provideService(OT.Tracer)(tracer),
    )

    const makeArtifactCacheDirectory = pipe(
      fs.mkdirp(artifactCacheDirectory),
      T.as(artifactCacheDirectory),
      T.provideService(OT.Tracer)(tracer),
    )

    return service({
      [ArtifactServiceId]: ArtifactServiceId as ArtifactServiceId,
      artifactDirectory,
      artifactCacheDirectory,
      makeArtifactDirectory,
      makeArtifactCacheDirectory,
    })
  })

export const ArtifactService = tag<ArtifactService>(ArtifactServiceId)

export type HasArtifactService = Has<ArtifactService>

export const LiveArtifactService = Layer.fromEffect(ArtifactService)(makeArtifactService)

export const provideArtifactService = T.provideServiceM(ArtifactService)(makeArtifactService)

export const { artifactDirectory, artifactCacheDirectory, makeArtifactDirectory, makeArtifactCacheDirectory } =
  T.deriveLifted(ArtifactService)(
    [],
    ['makeArtifactDirectory', 'makeArtifactCacheDirectory'],
    ['artifactDirectory', 'artifactCacheDirectory'],
  )
