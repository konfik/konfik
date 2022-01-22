import { fetch } from 'undici'

type Context = any
type Resolve = (specifier: string, context: Context, defaultResolve: Resolve) => { url: string }

export const resolve: Resolve = (specifier, context, defaultResolve) => {
  const { parentURL = null } = context

  // Normally Node.js would error on specifiers starting with 'https://', so
  // this hook intercepts them and converts them into absolute URLs to be
  // passed along to the later hooks below.
  if (specifier.startsWith('https://')) {
    return {
      url: specifier,
    }
  } else if (parentURL && parentURL.startsWith('https://')) {
    return {
      url: new URL(specifier, parentURL).href,
    }
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve)
}

export function load(url: string, context: Context, defaultLoad: any) {
  // For JavaScript to be loaded over the network, we need to fetch and
  // return it.

  if (url.startsWith('https://')) {
    return fetch(url)
      .then((res) => res.text())
      .then((source) => ({ format: 'module', source }))
    // return new Promise((resolve, reject) => {
    //   get(url, (res) => {
    //     let data = ''
    //     res.on('data', (chunk) => (data += chunk))
    //     res.on('end', () =>
    //       resolve({
    //         // This example assumes all network-provided JavaScript is ES module
    //         // code.
    //         format: 'module',
    //         source: data,
    //       }),
    //     )
    //   }).on('error', (err) => reject(err))
    // })
  }

  // Let Node.js handle all other URLs.
  return defaultLoad(url, context, defaultLoad)
}
