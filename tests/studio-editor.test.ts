import { describe, expect, it } from 'vitest'
import { createStudioPalette, contrastRatio, parseStudioSession } from '../studio/editor'
import { createBlankStudioDocument, createStudioProject } from '../src/studio'

describe('Studio authoring tools', () => {
  it('preserves the chosen base and creates ordered light/dark stops', () => {
    const scale = createStudioPalette('#d946ef')
    expect(scale[500]).toBe('#d946ef')
    expect(Object.keys(scale)).toHaveLength(11)
    expect(scale[50]).toBe('#fdf6fe')
    expect(scale[950]).toBe('#2b0e30')
    expect(() => createStudioPalette('red')).toThrow()
  })
  it('measures opaque sRGB contrast without guessing unsupported values', () => {
    expect(contrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)')).toBe(21)
    expect(contrastRatio('rgb(80, 80, 80)', 'rgb(80, 80, 80)')).toBe(1)
    expect(contrastRatio('rgba(0, 0, 0, 0.5)', 'rgb(255, 255, 255)')).toBeUndefined()
  })
  it('validates and isolates saved project snapshots', () => {
    const doc = createBlankStudioDocument()
    const session = parseStudioSession({ id: 'project-a', baseline: doc, draft: doc, exported: doc, updatedAt: 1 })
    session.draft.theme.label = 'Changed'
    expect(session.baseline.theme.label).toBe('New brand')
    expect(doc.theme.label).toBe('New brand')
    expect(() => parseStudioSession({ ...session, id: '../a' })).toThrow()
    expect(() => parseStudioSession({ ...session, draft: {} })).toThrow()
    expect(parseStudioSession({ ...session, catalogKey: '@example/brand::host' }).catalogKey).toBe('@example/brand::host')
    expect(parseStudioSession(session).catalogKey).toBeUndefined()
    expect(parseStudioSession({ ...session, catalogKey: {} }).catalogKey).toBeUndefined()
  })
  it('exports a portable dependency and instructions when the host supplies a package', () => {
    const files = createStudioProject(createBlankStudioDocument(), { bundledPackage: true })
    expect(JSON.parse(files['package.json']!).devDependencies['@happydesigns/id']).toBe('file:./vendor/id.tgz')
    expect(files['README.md']).toContain('bundled in vendor/id.tgz')
    expect(files['playground/nuxt.config.ts']).toContain('packageAsset: \'/studio-packages/id.tgz\'')
  })
})
