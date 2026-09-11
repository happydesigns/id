import { describe, expect, it } from 'vitest'
import { studioBuiltinPalettes } from '../src/studio'
import { paletteRamp, paletteSwatch } from '../studio/palette'

describe('Studio palette swatches', () => {
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
