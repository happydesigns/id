import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

describe('published module types', () => {
  it.each([ts.ModuleResolutionKind.NodeNext, ts.ModuleResolutionKind.Bundler])('types the public Nuxt config with resolution %s', (resolution) => {
    const file = resolve('.tmp/package-type-consumer.ts')
    const moduleExample = `import { defineNuxtConfig } from 'nuxt/config'
import id from '@happydesigns/id/module'
import type { ModuleOptions } from '@happydesigns/id/module'
import preview from '@happydesigns/id/preview'
import type { PreviewOptions } from '@happydesigns/id/preview'
const previewOptions: PreviewOptions = { studioOrigin: 'http://localhost:3000', id: 'app' }
defineNuxtConfig({ modules: [[preview, previewOptions]] })
const options: ModuleOptions = { name: 'brand', componentPrefix: 'Brand' }
export default defineNuxtConfig({ modules: [id], id: options })
// @ts-expect-error Module options must retain their types.
const invalid: ModuleOptions = { componentPrefix: 123 }
`
    const reference = readFileSync('docs/content/4.reference/1.api.md', 'utf8')
    const documentedExample = reference.match(/```ts \[preview.config.ts\]\n([\s\S]*?)```/)?.[1]
    expect(documentedExample).toBeTruthy()
    for (const source of [moduleExample, documentedExample!]) {
      const options: ts.CompilerOptions = {
        noEmit: true, strict: true, skipLibCheck: true, types: [],
        target: ts.ScriptTarget.ESNext, moduleResolution: resolution,
        module: resolution === ts.ModuleResolutionKind.NodeNext ? ts.ModuleKind.NodeNext : ts.ModuleKind.ESNext,
      }
      const host = ts.createCompilerHost(options)
      const getSource = host.getSourceFile.bind(host)
      host.getSourceFile = (name, ...args) => resolve(name) === file ? ts.createSourceFile(file, source, ts.ScriptTarget.ESNext, true) : getSource(name, ...args)
      const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([file], options, host))
      expect(diagnostics.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n'))).toEqual([])
    }
  })
})
