import colors from 'tailwindcss/colors'
import { createBlankStudioDocument, createStudioCss, parseStudioDocument, studioBuiltinPalettes } from '../src/studio'
import { studioPreviewCss } from '../studio/preview'
import { describe, expect, it } from 'vitest'
import { paletteRamp, paletteSwatch, rolePalettes } from '../studio/palette'

describe('Studio palette swatches', () => {
  it('suggests role-appropriate palettes without hiding custom or existing choices', () => {
    const options = ['slate', 'green', 'sand']
    const custom = { sand: { 500: '#aaaa88' } }
    expect(rolePalettes(options, 'neutral', '__default', custom)).toEqual(['slate', 'sand'])
    expect(rolePalettes(options, 'primary', '__default', custom)).toEqual(['green', 'sand'])
    expect(rolePalettes(options, 'neutral', 'green', custom)).toEqual(options)
    expect(rolePalettes(options, 'neutral', '__default', custom, true)).toEqual(options)
  })
  it('resolves every built-in palette without host CSS variables', () => {
    for (const name of studioBuiltinPalettes) {
      expect(paletteSwatch(name, {})).toBeTruthy()
      expect(paletteRamp(name, {})).toMatch(/^linear-gradient\(/)
      expect(paletteRamp(name, {})).not.toContain('var(')
    }
  })
  it('prefers brand values and handles incomplete palettes', () => {
    expect(paletteSwatch('green', { green: { 500: '#123456' } })).toBe('#123456')
    expect(paletteRamp('accent', { accent: { 700: '#123456' } })).toBe('linear-gradient(to right, #123456, #123456, #123456)')
    expect(paletteSwatch('ink', { ink: '#242423' })).toBe('#242423')
    expect(paletteRamp('__default', {})).toBeUndefined()
  })
})

it('uses upstream shades for partial overrides in swatches, preview and native output', () => {
  const doc = createBlankStudioDocument()
  doc.brand.colors.blue = { 500: '#123456' }
  doc.theme.ui!.colors!.primary = 'blue'
  expect(parseStudioDocument(doc)).toEqual(doc)
  expect(paletteSwatch('blue', doc.brand.colors, '400')).toBe(colors.blue[400])
  for (const css of [createStudioCss(doc), studioPreviewCss(doc)]) {
    expect(css).toContain('--color-blue-500: #123456;')
    expect(css).toContain('--color-blue-400: ' + colors.blue[400] + ';')
  }
  delete doc.brand.colors.blue
  expect(paletteSwatch('blue', doc.brand.colors)).toBe(colors.blue[500])
  expect(studioPreviewCss(doc)).not.toContain('#123456')
  expect(doc.theme.ui!.colors!.primary).toBe('blue')
})

it('uses only brand values for incomplete new scales without mutating their source', () => {
  const doc = createBlankStudioDocument()
  doc.brand.colors.ocean = { 500: '#123456', 700: '#012345' }
  const before = JSON.stringify(doc)
  for (const css of [createStudioCss(doc), studioPreviewCss(doc)]) {
    expect(css).toContain('--color-ocean-400: #123456;')
    expect(css).toContain('--color-ocean-700: #012345;')
  }
  expect(paletteSwatch('ocean', doc.brand.colors, '700')).toBe('#012345')
  expect(JSON.stringify(doc)).toBe(before)
})

it('writes neutral overrides to the palette alias used by Nuxt UI', () => {
  const doc = createBlankStudioDocument()
  doc.brand.colors.neutral = { 500: '#123456' }
  doc.theme.ui!.colors!.neutral = 'neutral'
  for (const css of [createStudioCss(doc), studioPreviewCss(doc)]) {
    expect(css).toContain('--color-old-neutral-500: #123456;')
    expect(css).not.toContain('--color-neutral-500: #123456;')
  }
})
