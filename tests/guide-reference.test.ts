import { describe, expect, it } from 'vitest'
import { createBlankStudioDocument, createStudioProject, parseStudioDocument } from '../src/studio'
import { createBrandReference, guideContrastRatio, isGuideAssetPath } from '../src/guide-reference'

describe('source-derived brand reference', () => {
  it('measures opaque sRGB contrast without claiming results for transparent colors', () => {
    expect(guideContrastRatio([0, 0, 0, 255], [255, 255, 255, 255])).toBe(21)
    expect(guideContrastRatio([100, 100, 100, 255], [100, 100, 100, 255])).toBe(1)
    expect(guideContrastRatio([0, 0, 0, 100], [255, 255, 255, 255])).toBeUndefined()
    expect(guideContrastRatio([], [255, 255, 255, 255])).toBeUndefined()
  })
  it('uses runtime precedence and keeps dark inheritance distinct from defaults', () => {
    const doc = createBlankStudioDocument()
    doc.brand.typography = { sans: 'Brand Sans', mono: 'Brand Mono' }
    doc.theme.typography = { sans: 'Theme Sans' }
    doc.theme.cssVariables = { light: { '--font-sans': 'Ignored Sans', '--ui-radius': '0.5rem' }, dark: { '--font-mono': 'Dark Mono', '--ui-bg': '#111111' } }
    const guide = createBrandReference(doc)
    expect(guide.typography.find(font => font.role === 'sans')?.light).toBe('Theme Sans')
    expect(guide.typography.find(font => font.role === 'mono')?.dark).toBe('Dark Mono')
    expect(guide.radius).toEqual({ light: '0.5rem', dark: '0.5rem' })
    expect(guide.variables.find(variable => variable.name === '--ui-bg')).toMatchObject({ light: undefined, dark: '#111111' })
  })

  it('derives a second brand without retaining data from the original', () => {
    const first = createBlankStudioDocument()
    first.brand.colors.coral = { 500: '#F28564', 50: '#FFF2ED' }
    first.theme.ui = { colors: { primary: 'coral' }, icons: { search: 'i-lucide-search' }, button: { defaultVariants: { variant: 'outline' } } }
    const second = parseStudioDocument(first)
    second.brand.colors = { ink: '#112233' }
    second.theme.ui = { colors: { primary: 'blue' } }
    const a = createBrandReference(first)
    const b = createBrandReference(second)
    expect(a.palettes[0]?.shades.map(shade => shade.shade)).toEqual(['50', '500'])
    expect(a.roles[0]?.source).toBe('Brand')
    expect(b.roles[0]?.source).toBe('Nuxt UI')
    expect(b.icons).toEqual([])
    expect(b.components).toEqual([])
    expect(b.palettes.map(palette => palette.name)).toEqual(['ink'])
  })

  it('includes a source-driven guide in exported projects without adding it to runtime dependencies', () => {
    const project = createStudioProject(createBlankStudioDocument())
    expect(project['playground/nuxt.config.ts']).toContain('@happydesigns/id/guide')
    expect(project['playground/content/docs/2.brand-reference.md']).toContain('::id-brand-reference')
    expect(JSON.parse(project['package.json']!).dependencies).not.toHaveProperty('@happydesigns/id')
  })

  it('only links local assets and rejects encoded traversal or executable URLs', () => {
    expect(isGuideAssetPath('/logos/wordmark.svg')).toBe(true)
    for (const path of ['//evil.test/a.svg', 'javascript:alert(1)', '/a/../b', '/%2e%2e/private', '/a\\b']) expect(isGuideAssetPath(path)).toBe(false)
  })
})
