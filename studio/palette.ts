import { resolvePalette, neutralPalettes } from '../src/palettes'

export { neutralPalettes } from '../src/palettes'

type Palette = string | Record<string, string | undefined>

export function rolePalettes(options: string[], role: string, current: string, custom: Record<string, Palette>, all = false) {
  return options.filter(name => all || name === current || typeof custom[name] === 'object' || (role === 'neutral' ? neutralPalettes.includes(name) : !neutralPalettes.includes(name)))
}

export function paletteSwatch(name: string, custom: Record<string, Palette>, shade = '500'): string | undefined {
  const palette = resolvePalette(name, custom)
  if (typeof palette === 'string') return palette
  return palette?.[Number(shade)] || palette?.['500'] || Object.values(palette || {}).find(Boolean)
}

export function paletteRamp(name: string, custom: Record<string, Palette>): string | undefined {
  const shades = ['400', '500', '600'].map(shade => paletteSwatch(name, custom, shade))
  return shades.every(Boolean) ? `linear-gradient(to right, ${shades.join(', ')})` : undefined
}
