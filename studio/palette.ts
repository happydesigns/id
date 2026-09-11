import tailwindColors from 'tailwindcss/colors'

type Palette = string | Record<string, string | undefined>

export function paletteSwatch(name: string, custom: Record<string, Palette>, shade = '500'): string | undefined {
  const palette = custom[name] ?? (tailwindColors as unknown as Record<string, Palette>)[name]
  if (typeof palette === 'string') return palette
  return palette?.[shade] || palette?.['500'] || Object.values(palette || {}).find(Boolean)
}

export function paletteRamp(name: string, custom: Record<string, Palette>): string | undefined {
  const shades = ['400', '500', '600'].map(shade => paletteSwatch(name, custom, shade))
  return shades.every(Boolean) ? `linear-gradient(to right, ${shades.join(', ')})` : undefined
}
