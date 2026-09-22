import colors from 'tailwindcss/colors'
import type { BrandPalette, BrandColorScale } from './types.js'

export const builtinPalettes: Record<string, BrandColorScale> = Object.fromEntries(
  Object.entries(colors).filter(([, value]) => typeof value === 'object'),
)
export const builtinPaletteNames = Object.keys(builtinPalettes)
export const neutralPalettes = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'mauve', 'olive', 'mist', 'taupe']
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/** Partial overrides inherit upstream shades; new scales use their own fallback. */
export function resolvePalette(name: string, custom: BrandPalette): BrandPalette[string] | undefined {
  const value = custom[name]
  if (typeof value === 'string') return value
  const base = builtinPalettes[name]
  if (!value) return base
  const defined = Object.fromEntries(Object.entries(value).filter(([, color]) => color !== undefined))
  const fallback = value[500] ?? Object.values(defined)[0]
  return { ...(base ?? Object.fromEntries(shades.map(shade => [shade, fallback]))), ...defined }
}

export function resolveBrandPalettes(custom: BrandPalette): BrandPalette {
  return Object.fromEntries(Object.keys(custom).map(name => [name, resolvePalette(name, custom)!]))
}
