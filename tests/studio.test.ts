import colors from 'tailwindcss/colors'
import { describe, expect, it } from 'vitest'
import { createBlankStudioDocument, createStudioArchive, createStudioCss, createStudioProject, diffStudioDocuments, parseStudioDocument, studioBuiltinPalettes } from '../src/studio'

describe('editable Nuxt UI brand documents', () => {
  it('offers every built-in palette in the tested Tailwind version', () => {
    expect([...studioBuiltinPalettes].sort()).toEqual(Object.keys(colors).filter(key => typeof colors[key as keyof typeof colors] === 'object').sort())
  })

  it('preserves unknown metadata, palettes and component rules in a no-op round trip', () => {
    const doc = createBlankStudioDocument()
    doc.brand.colors.coral = { 50: '#fff4ef', 500: '#f28564', 950: '#24110b' }
    doc.brand.colors.graphite = '#242423'
    doc.theme.ui = { colors: { primary: 'coral' }, button: { compoundVariants: [{ color: 'primary', variant: 'solid', class: 'bg-inverted text-inverted' }] } }
    doc.theme.cssVariables = { dark: { '--ui-bg': 'color-mix(in srgb, var(--color-graphite) 90%, black)' } }
    doc.editorial = { owner: 'Design team', rules: ['Keep the signature color restrained.'] }
    const restored = parseStudioDocument(JSON.stringify(doc))
    expect(restored).toEqual(doc)
    expect(diffStudioDocuments(doc, restored)).toEqual([])
    expect(createStudioCss(restored)).toContain('color-mix(')
    expect(createStudioCss(restored)).toContain('--color-graphite: #242423')
  })

  it('rejects unusable mappings and colliding CSS palette names', () => {
    const doc = createBlankStudioDocument()
    doc.theme.ui!.colors!.primary = 'missing'
    expect(() => parseStudioDocument(doc)).toThrow('named brand scale')
    doc.theme.ui!.colors!.primary = 'green'
    doc.brand.colors.warmWhite = '#fff'
    expect(parseStudioDocument(doc).brand.colors.warmWhite).toBe('#fff')
    doc.brand.colors['warm-white'] = '#eee'
    expect(() => parseStudioDocument(doc)).toThrow('distinct CSS token')
  })
  it('isolates the parsed copy and reports only changed fields', () => {
    const original = createBlankStudioDocument()
    const draft = parseStudioDocument(original)
    draft.theme.label = 'Different name'
    expect(original.theme.label).toBe('New brand')
    expect(diffStudioDocuments(original, draft)).toEqual([{ path: 'theme.label', before: 'New brand', after: 'Different name' }])
  })

  it.each(['red; } body { display:none', '</style><script>alert(1)</script>', 'url(https://example.com/image)', 'expression(alert(1))'])('rejects unsafe CSS value %s', (css) => {
    const doc = createBlankStudioDocument()
    doc.theme.cssVariables = { light: { '--ui-bg': css } }
    expect(() => parseStudioDocument(doc)).toThrow()
  })

  it('rejects executable objects, unsupported versions and prototype keys', () => {
    expect(() => parseStudioDocument({ ...createBlankStudioDocument(), version: 2 })).toThrow()
    expect(() => parseStudioDocument({ ...createBlankStudioDocument(), script: () => 1 })).toThrow()
    expect(() => parseStudioDocument('{"__proto__":{"polluted":true}}')).toThrow('Unsafe')
  })

  it.each(['https://example.com/logo.svg', '//example.com/logo.svg', '/../../secret', 'data:image/svg+xml,<svg onload="alert(1)"/>'])('rejects unsafe or remote asset %s', (src) => {
    const doc = createBlankStudioDocument()
    doc.brand.assets = { logos: { logo: { name: 'Logo', role: 'logo', src } } }
    expect(() => parseStudioDocument(doc)).toThrow()
  })

  it('exports a source-first runtime layer and an optional Studio playground', () => {
    const doc = createBlankStudioDocument()
    const files = createStudioProject(doc, { legacyRuntime: true })
    expect(parseStudioDocument(files['brand.studio.json'])).toEqual(doc)
    expect(files['nuxt.config.ts']).toContain('@happydesigns/id/nuxt')
    expect(files['nuxt.config.ts']).not.toContain("extends: ['@happydesigns/id/studio']")
    expect(files['playground/nuxt.config.ts']).toContain('@happydesigns/id/studio')
    expect(files['app/assets/css/brand.css']).toContain('@source "../../../brand.studio.json"')
    expect(files['app/app.config.ts']).toContain("from '../brand.studio.json'")
  })

  it('writes deterministic UTF-8 archives with correct directory offsets', () => {
    const zip = createStudioArchive({ 'brand.studio.json': 'Farbe für alle', 'public/logo.png': new Uint8Array([1, 2, 3]) })
    const view = new DataView(zip.buffer)
    expect(view.getUint32(0, true)).toBe(0x04034b50)
    const end = zip.length - 22
    expect(view.getUint32(end, true)).toBe(0x06054b50)
    expect(view.getUint16(end + 10, true)).toBe(2)
    expect(view.getUint32(view.getUint32(end + 16, true), true)).toBe(0x02014b50)
    expect(zip).toEqual(createStudioArchive({ 'brand.studio.json': 'Farbe für alle', 'public/logo.png': new Uint8Array([1, 2, 3]) }))
    expect(() => createStudioArchive({ '../outside': '' })).toThrow()
  })
})
