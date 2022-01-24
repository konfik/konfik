import test from 'ava'

import { KnownEsbuildError } from './esbuild.js'
import { extractPluginImportPaths, pluginImportPath } from './esbuild-error.js'

test('extractPluginImportPaths', (t) => {
  const knownError = new KnownEsbuildError({
    error: {
      errors: [
        {
          location: {
            column: 23,
            file: 'konfik.ts',
            length: 34,
            line: 10,
            lineText: "import { eslint } from '.konfik/github.com/konfik/eslint'",
            namespace: '',
            suggestion: '',
          },
          notes: [
            {
              location: null,
              text: 'You can mark the path ".konfik/github.com/konfik/eslint" as external to exclude it from the bundle, which will remove this error.',
            },
          ],
          pluginName: '',
          text: 'Could not resolve ".konfik/github.com/konfik/eslint"',
        },
        {
          location: {
            column: 25,
            file: 'konfik.ts',
            length: 36,
            line: 11,
            lineText: "import { prettier } from '.konfik/github.com/konfik/prettier'",
            namespace: '',
            suggestion: '',
          },
          notes: [
            {
              location: null,
              text: 'You can mark the path ".konfik/github.com/konfik/prettier" as external to exclude it from the bundle, which will remove this error.',
            },
          ],
          pluginName: '',
          text: 'Could not resolve ".konfik/github.com/konfik/prettier"',
        },
      ],
      warnings: [],
    } as any,
  })

  const pluginImportPaths = extractPluginImportPaths(knownError)

  t.deepEqual(pluginImportPaths, ['github.com/konfik/eslint', 'github.com/konfik/prettier'].map(pluginImportPath))
})
