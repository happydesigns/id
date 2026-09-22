import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createBlankStudioDocument, parseStudioDocument, createStudioProject, createStudioRuntimeFiles } from '../src/studio'
import { readStudioSource, writeStudioSource } from '../studio/source'
import { previewUi } from '../studio/preview'
import { studioTemplates, withinStudioRoute } from '../studio/templates'

const directories: string[] = []
afterEach(async () => {
  for (const directory of directories.splice(0)) {
    if (!resolve(directory).startsWith(resolve(tmpdir(), 'id-studio-test-'))) throw new Error('Unexpected cleanup directory')
    await rm(directory, { recursive: true, force: true })
  }
})
async function source() {
  const directory = await mkdtemp(join(tmpdir(), 'id-studio-test-'))
  directories.push(directory)
  const path = join(directory, 'brand.studio.json')
  const document = createBlankStudioDocument()
  await writeFile(path, JSON.stringify(document, null, 4))
  return { path, ...await readStudioSource(path) }
}

describe('connected brand source', () => {
  it('rejects oversized UTF-8 documents even when their string length is smaller', () => {
    const doc = createBlankStudioDocument()
    doc.notes = 'ä'.repeat(4_000_001)
    expect(() => parseStudioDocument(JSON.stringify(doc))).toThrow('8 MB')
  })
  it('preserves exact bytes when nothing changed', async () => {
    const item = await source()
    const before = await readFile(item.path)
    const result = await writeStudioSource(item.path, item.revision, item.document)
    expect(result.changed).toBe(false)
    expect(await readFile(item.path)).toEqual(before)
  })
  it('writes a reviewed document without BOM and preserves unknown metadata', async () => {
    const item = await source()
    item.document.editorial = { owner: 'Design' }
    item.document.theme.label = 'Updated brand'
    const result = await writeStudioSource(item.path, item.revision, item.document)
    expect(result.changed).toBe(true)
    expect(result.document.editorial).toEqual({ owner: 'Design' })
    expect((await readFile(item.path))[0]).toBe(123)
  })
  it('rejects a stale revision without replacing an IDE edit', async () => {
    const item = await source()
    await writeFile(item.path, JSON.stringify({ ...item.document, editor: 'IDE' }))
    const external = await readFile(item.path)
    await expect(writeStudioSource(item.path, item.revision, item.document)).rejects.toThrow('outside Studio')
    expect(await readFile(item.path)).toEqual(external)
  })
  it('serializes simultaneous writes to the same source', async () => {
    const item = await source()
    const left = structuredClone(item.document)
    left.theme.label = 'Left'
    const right = structuredClone(item.document)
    right.theme.label = 'Right'
    const results = await Promise.allSettled([writeStudioSource(item.path, item.revision, left), writeStudioSource(item.path, item.revision, right)])
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1)
    const accepted = results.find(result => result.status === 'fulfilled')
    expect((await readStudioSource(item.path)).document.theme.label).toBe(accepted?.status === 'fulfilled' ? accepted.value.document.theme.label : undefined)
  })
  it('rejects an oversized replacement before changing the source', async () => {
    const item = await source()
    const before = await readFile(item.path)
    item.document.notes = 'x'.repeat(8_000_000)
    await expect(writeStudioSource(item.path, item.revision, item.document)).rejects.toThrow('smaller than 8 MB')
    expect(await readFile(item.path)).toEqual(before)
  })
})

describe('native runtime and real previews', () => {
  it.each([{}, { guide: true }, { legacyRuntime: true }])('exports release and installed dependency versions for %j', async (options) => {
    const root = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    const files = createStudioProject(createBlankStudioDocument(), options)
    const manifest = JSON.parse(files['package.json']!)
    const dependencies = { ...manifest.dependencies, ...manifest.devDependencies }
    expect(dependencies[root.name]).toBe('^' + root.version)
    for (const name of ['nuxt', '@nuxt/ui', 'tailwindcss', '@iconify-json/lucide', ...(options.guide ? ['docus'] : [])]) {
      const installed = JSON.parse(await readFile(new URL('../node_modules/' + name + '/package.json', import.meta.url), 'utf8'))
      expect(dependencies[name]).toBe(installed.version)
    }
    expect(Object.values(dependencies).some(version => /^(workspace|catalog):/.test(String(version)))).toBe(false)
  })

  it('keeps older generated projects compatible until explicitly migrated', () => {
    const document = createBlankStudioDocument()
    expect(createStudioRuntimeFiles(document)['app/assets/css/brand.css']).toContain('@import "tailwindcss"')
    expect(createStudioRuntimeFiles(document, { styles: 'fragment' })['app/assets/css/brand.css']).not.toContain('@import')
    expect(createStudioRuntimeFiles(document, { config: 'fragment' })['app/assets/css/brand.css']).toContain('@source "../../brand.config.ts"')
    expect(createStudioRuntimeFiles(document)['app/app.config.ts']).toContain('defineAppConfig(')
  })
  it('exports runtime files without an id runtime import and with optional authoring dependencies', () => {
    const files = createStudioProject(createBlankStudioDocument())
    expect(files['nuxt.config.ts']).not.toContain('@happydesigns/id')
    expect(files['app/app.config.ts']).toContain('import brand from \'./brand.config\'')
    expect(files['app/brand.config.ts']).not.toContain('import')
    expect(files['app/components/BrandLogo.vue']).toContain('UColorModeImage')
    expect(files['playground/app/app.vue']).toContain('<UApp>')
    expect(files['playground/nuxt.config.ts']).not.toContain('docus')
    expect(files['playground/app/app.config.ts']).toBeUndefined()
    expect(Object.values(files).every(value => typeof value === 'string')).toBe(true)
    const pkg = JSON.parse(files['package.json']!)
    expect(pkg.dependencies['@happydesigns/id']).toBeUndefined()
    expect(pkg.devDependencies['@happydesigns/id']).toBeTruthy()
    expect(pkg.exports['.']).toBe('./nuxt.config.ts')
    expect(pkg.exports['./styles.css']).toBe('./app/assets/css/brand.css')
    expect(files['nuxt.config.ts']).not.toContain('css:')
    expect(files['app/assets/css/brand.css']).not.toMatch(/@import|@source/)
    expect(files['app/assets/css/brand.css']).toContain('@theme static')
    expect(files['playground/app/app.css']).toContain('@import "@nuxt/ui";')
    expect(files['playground/content/docs/1.introduction.md']).toBeUndefined()
    expect(pkg.devDependencies.docus).toBeUndefined()
    expect(pkg.devDependencies['@takumi-rs/core']).toBeUndefined()
    expect(files['scripts/generate-brand.mjs']).toMatch(/createStudioRuntimeFiles\(source,\s*\{\s*styles: 'fragment', config: 'fragment'\s*\}\)/)
    expect(pkg.files).not.toContain('playground')
  })
  it('keeps consumer overrides while removing the previous brand', () => {
    const seed = { colors: { primary: 'coral' }, button: { slots: { base: 'old-brand' } } }
    const host = { ...seed, prose: { custom: true }, icons: { close: 'i-lucide-x' } }
    const result = previewUi(host, seed, { colors: { primary: 'blue' } })
    expect(result.colors).toMatchObject({ primary: 'blue' })
    expect(result.button).toBeUndefined()
    expect(result.prose).toEqual({ custom: true })
    expect(result.icons).toEqual({ close: 'i-lucide-x' })
    expect(host.button.slots.base).toBe('old-brand')
  })
  it('registers real docs routes and rejects remote, traversal and editor routes', () => {
    const docs = { label: 'Docs', route: '/docs/guide/overview', routePrefix: '/docs/guide' }
    expect(studioTemplates({ docs }).at(-1)?.route).toBe(docs.route)
    expect(withinStudioRoute('/docs/guide/colors', docs.routePrefix)).toBe(true)
    expect(withinStudioRoute('/docs/guide-other', docs.routePrefix)).toBe(false)
    for (const route of ['//evil.test', '/docs/../private', '/studio', '/api/docs', '/docs/%2e%2e/private']) expect(studioTemplates({ docs: { ...docs, route } })).toHaveLength(1)
  })
})
