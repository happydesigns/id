import { readFile } from 'node:fs/promises'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { parse } from 'yaml'
import { createBlankStudioDocument, createStudioProject } from '../src/studio'
import { exportStudioProject } from '../studio/export'

afterEach(() => vi.unstubAllGlobals())

describe('project export', () => {
  it.each([{}, { guide: true }, { bundledPackage: true }, { bundledPackage: true, guide: true }])('exports a pinned package manager and restricted build decisions: %j', async (options) => {
    const root = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    const files = createStudioProject(createBlankStudioDocument(), options)
    expect.soft(JSON.parse(files['package.json']!).packageManager).toBe(root.packageManager)
    expect.soft(files['pnpm-workspace.yaml']).toBeDefined()
    if (files['pnpm-workspace.yaml']) {
      expect(parse(files['pnpm-workspace.yaml'])).toEqual({ allowBuilds: { 'better-sqlite3': false, 'esbuild': false, 'vue-demi': false } })
    }
  })
  it.each([{ legacyRuntime: true }, { legacyRuntime: true, guide: true }])('preserves the legacy scaffold installation contract: %j', (options) => {
    const files = createStudioProject(createBlankStudioDocument(), options)
    expect(JSON.parse(files['package.json']!).packageManager).toBeUndefined()
    expect(files['pnpm-workspace.yaml']).toBeUndefined()
  })
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
  it.each(['text/html', 'Text/HTML; charset=UTF-8', 'TEXT/HTML'])('fails a complete export when an asset URL returns an HTML fallback: %s', async (contentType) => {
    const doc = createBlankStudioDocument()
    doc.brand.assets = { logos: { logo: { name: 'Logo', src: '/logo.svg', role: 'logo' } } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>Fallback</html>', { headers: { 'content-type': contentType } })))
    await expect(exportStudioProject(doc)).rejects.toThrow('Asset unavailable: /logo.svg')
  })
  it('exports accepted local asset filenames containing consecutive dots', async () => {
    const doc = createBlankStudioDocument()
    doc.brand.assets = { logos: { logo: { name: 'Logo', src: '/logos/logo..svg', role: 'logo' } } }
    const content = '<svg xmlns="http://www.w3.org/2000/svg"><title>Brand</title></svg>'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(content, { headers: { 'content-type': 'image/svg+xml' } })))
    const zip = await exportStudioProject(doc)
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength)
    const entries: Record<string, string> = {}
    for (let offset = 0; view.getUint32(offset, true) === 0x04034b50;) {
      const size = view.getUint32(offset + 18, true)
      const nameEnd = offset + 30 + view.getUint16(offset + 26, true)
      const dataStart = nameEnd + view.getUint16(offset + 28, true)
      entries[new TextDecoder().decode(zip.subarray(offset + 30, nameEnd))] = new TextDecoder().decode(zip.subarray(dataStart, dataStart + size))
      offset = dataStart + size
    }
    expect(entries['public/logos/logo..svg']).toBe(content)
    expect(fetch).toHaveBeenCalledWith('/logos/logo..svg', { credentials: 'omit', redirect: 'error' })
  })
})
