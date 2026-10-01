import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('published Nuxt module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../fixtures/module', import.meta.url)),
  })

  it('registers its prefixed components, composables and Nuxt UI with host overrides', async () => {
    const html = await $fetch<string>('/')
    expect(html).toMatch(/<span[^>]*>Host identity<\/span>/)
    expect(html).toContain('data-testid="brand-label">Host identity</p>')
    expect(html).toMatch(/<button[^>]*>.*Nuxt UI dependency.*<\/button>/s)
    expect(html).not.toContain('Module default')
  })
})
