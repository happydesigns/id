import { afterEach, describe, expect, it, vi } from 'vitest'
import { createBlankStudioDocument, createStudioProject } from '../src/studio'
import { exportStudioProject } from '../studio/export'

afterEach(() => vi.unstubAllGlobals())

describe('project export', () => {
  it.each([{}, { guide: true }, { legacyRuntime: true }, { legacyRuntime: true, guide: true }])('keeps brand data separate from scaffold code: %j', (options) => {
    const doc = createBlankStudioDocument()
    doc.theme.label = 'Brand {{packageName}} "sample"'
    doc.brand.packageName = '@sample/brand'
    const files = createStudioProject(doc, options)
    expect(JSON.parse(files['brand.studio.json']!)).toEqual(doc)
    expect(JSON.parse(files['package.json']!).name).toBe('@sample/brand')
    expect(files['README.md']).toContain(doc.theme.label)
    expect(files['playground/nuxt.config.ts']).not.toContain(doc.theme.label)
    const manifest = JSON.parse(files['package.json']!)
    expect(!!manifest.devDependencies?.docus).toBe(!!options.guide && !options.legacyRuntime)
  })
  it('does not fetch anything for a self-contained brand', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const archive = await exportStudioProject(createBlankStudioDocument())
    expect(archive[0]).toBe(0x50)
    expect(fetch).not.toHaveBeenCalled()
  })
  it('rejects external package paths before fetching', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    await expect(exportStudioProject(createBlankStudioDocument(), { packageAsset: '//other.test/id.tgz' })).rejects.toThrow('Invalid host package')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('fails a complete export when an asset URL returns an HTML fallback', async () => {
    const doc = createBlankStudioDocument()
    doc.brand.assets = { logos: { logo: { name: 'Logo', src: '/logo.svg', role: 'logo' } } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>Fallback</html>', { headers: { 'content-type': 'text/html' } })))
    await expect(exportStudioProject(doc)).rejects.toThrow('Asset unavailable: /logo.svg')
  })
})
