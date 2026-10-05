import { fileURLToPath } from 'node:url'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { afterAll, describe, expect, it } from 'vitest'
import { createBlankStudioDocument } from '../../src/studio'

describe('published Nuxt module', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'id-nuxt-source-'))
  const source = join(directory, 'brand.json')
  await writeFile(source, JSON.stringify(createBlankStudioDocument()))
  afterAll(() => rm(directory, { recursive: true, force: true }))
  await setup({
    rootDir: fileURLToPath(new URL('../fixtures/module', import.meta.url)),
    nuxtConfig: { runtimeConfig: { idStudioSource: source, idStudioWriterToken: 'test-writer' } },
  })

  it('registers its prefixed components, composables and Nuxt UI with host overrides', async () => {
    const html = await $fetch<string>('/')
    expect(html).toMatch(/<span[^>]*>Host identity<\/span>/)
    expect(html).toContain('data-testid="brand-label">Host identity</p>')
    expect(html).toMatch(/<button[^>]*>.*Nuxt UI dependency.*<\/button>/s)
    expect(html).not.toContain('Module default')
  })

  it('serves the portable Studio handler through Nuxt with access and revision checks', async () => {
    const headers = { 'x-id-studio-token': 'test-writer' }
    await expect($fetch('/api/studio-source')).rejects.toMatchObject({ statusCode: 403 })
    const current = await $fetch<{ revision: string, document: ReturnType<typeof createBlankStudioDocument> }>('/api/studio-source', { headers })
    current.document.theme.label = 'Saved through Nuxt'
    const body = JSON.stringify(current)
    const options = { method: 'POST' as const, headers: { ...headers, 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(body)) }, body }
    await $fetch('/api/studio-source', options)
    expect(JSON.parse(await readFile(source, 'utf8')).theme.label).toBe('Saved through Nuxt')
    await expect($fetch('/api/studio-source', options)).rejects.toMatchObject({ statusCode: 409 })
  })
})
