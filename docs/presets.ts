import data from './app/data/nuxt-ui-presets.json'
import type { BrandPalette, BrandTheme } from '../src'
import { resolvePalette } from '../src/palettes'
import { createStudioDocument } from '../src/studio'
import { themeIcons, type ThemeIcons } from '../studio/icon-sets'

export const presetIcons: Record<string, string> = {
  default: 'simple-icons:nuxt', mono: 'lucide:contrast', cobalt: 'lucide:gem', sky: 'lucide:cloud-sun', mint: 'lucide:leaf', iris: 'lucide:flower', crimson: 'lucide:clapperboard', coral: 'lucide:shell', sunset: 'lucide:sunset', carbon: 'lucide:zap', bubblegum: 'lucide:candy', parchment: 'lucide:scroll-text',
}
export const docsPresetDocuments = Object.fromEntries(data.presets.filter(preset => preset.id !== 'default').map((preset) => {
  const name = 'nuxt-ui-' + preset.id
  return [name, createStudioDocument({ name, colors: preset.palettes as BrandPalette, typography: preset.typography }, {
    name, label: preset.name, description: preset.description,
    typography: preset.typography,
    cssVariables: {
      light: { ...data.defaults.cssVariables.light, ...(preset.cssVariables as NonNullable<BrandTheme['cssVariables']>).light },
      dark: { ...data.defaults.cssVariables.dark, ...(preset.cssVariables as NonNullable<BrandTheme['cssVariables']>).dark },
    },
    ui: { ...preset.ui, colors: { ...data.defaults.colors, ...preset.ui.colors }, icons: themeIcons[preset.icons as ThemeIcons] },
  })]
}))
export const presetFonts = [...new Set(data.presets.flatMap(preset => Object.values(preset.typography).filter((value): value is string => typeof value === 'string').map(value => value.split(',')[0]!.replace(/["']/g, ''))))]

export function docsPresetAvatar(theme?: BrandTheme) {
  const document = theme ? docsPresetDocuments[theme.name] : undefined
  const palette = resolvePalette(theme?.ui?.colors?.primary || 'green', document?.brand.colors || {})
  const color = theme?.cssVariables?.light?.['--ui-primary'] === 'black' ? 'var(--ui-text-highlighted)' : typeof palette === 'object' ? palette[500] : palette
  return { icon: presetIcons[theme?.name === 'nuxt-ui' ? 'default' : theme?.name.replace('nuxt-ui-', '') || ''] || 'i-lucide-palette', style: { color, backgroundColor: color ? 'color-mix(in oklab, ' + color + ' 15%, transparent)' : undefined } }
}
