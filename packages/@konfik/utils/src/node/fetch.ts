import type { Response } from 'undici'
// NOTE wildcard import needed here since `undici` is still CommonJS only
import * as undici from 'undici'

import { OT, pipe, T, Tagged } from '../effect/index.js'

export const fetchHead = (url: string | URL): T.Effect<OT.HasTracer, FetchHeadError, Response> =>
  pipe(
    T.tryCatchPromise(
      () => undici.fetch(url, { method: 'head' }),
      (error) => new FetchHeadError({ url, error }),
    ),
    T.tap((res) => OT.addAttribute('http.status', res.status)),
    OT.withSpan('fetchHead', { attributes: { 'http.url': url.toString() } }),
  )

export const fetchText = (url: string | URL): T.Effect<OT.HasTracer, FetchTextError, string> =>
  pipe(
    T.tryCatchPromise(
      () => undici.fetch(url),
      (error) => new FetchTextError({ url, error }),
    ),
    T.tap((res) => OT.addAttribute('http.status', res.status)),
    T.chain((resp) =>
      resp.ok
        ? T.tryCatchPromise(
            () => resp.text(),
            (error) => new FetchTextError({ url, error, status: resp.status }),
          )
        : T.fail(new FetchTextError({ url, status: resp.status })),
    ),
    OT.withSpan('fetchText', { attributes: { 'http.url': url.toString() } }),
  )

export const fetchJSON = <T>(url: string | URL): T.Effect<OT.HasTracer, FetchJSONError, T> =>
  pipe(
    T.tryCatchPromise(
      () => undici.fetch(url),
      (error) => new FetchJSONError({ url, error }),
    ),
    T.tap((res) => OT.addAttribute('http.status', res.status)),
    T.chain((resp) =>
      resp.ok
        ? T.tryCatchPromise(
            () => resp.json() as Promise<T>,
            (error) => new FetchJSONError({ url, error, status: resp.status }),
          )
        : T.fail(new FetchJSONError({ url, status: resp.status })),
    ),
    OT.withSpan('fetchJSON', { attributes: { 'http.url': url.toString() } }),
  )

export const fetchArrayBuffer = (url: string | URL): T.Effect<OT.HasTracer, FetchArrayBufferError, ArrayBuffer> =>
  pipe(
    T.tryCatchPromise(
      () => undici.fetch(url),
      (error) => new FetchArrayBufferError({ url, error }),
    ),
    T.tap((res) => OT.addAttribute('http.status', res.status)),
    T.chain((resp) =>
      resp.ok
        ? T.tryCatchPromise(
            () => resp.arrayBuffer(),
            (error) => new FetchArrayBufferError({ url, error, status: resp.status }),
          )
        : T.fail(new FetchArrayBufferError({ url, status: resp.status })),
    ),
    OT.withSpan('fetchArrayBuffer', { attributes: { 'http.url': url.toString() } }),
  )

export class FetchHeadError extends Tagged('FetchHeadError')<{
  readonly url: string | URL
  readonly error?: unknown
  readonly status?: number
}> {
  readonly message: string = `Couldn't fetch URL "${this.url}". ${this.error}`
}

export class FetchTextError extends Tagged('FetchTextError')<{
  readonly url: string | URL
  readonly error?: unknown
  readonly status?: number
}> {
  readonly message: string = `Couldn't fetch URL "${this.url}". ${this.error}`
}

export class FetchJSONError extends Tagged('FetchJSONError')<{
  readonly url: string | URL
  readonly error?: unknown
  readonly status?: number
}> {
  readonly message: string = `Couldn't fetch URL "${this.url}". ${this.error}`
}

export class FetchArrayBufferError extends Tagged('FetchArrayBufferError')<{
  readonly url: string | URL
  readonly error?: unknown
  readonly status?: number
}> {
  readonly message: string = `Couldn't fetch URL "${this.url}". ${this.error}`
}
