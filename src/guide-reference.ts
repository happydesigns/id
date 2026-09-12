import type { StudioDocument } from './studio'

const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
const strings = (value: unknown) => Object.entries(record(value)).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
const cssName = (name: string) => name.startsWith('--') ? name : `--${name}`

/** Read the authoring source without maintaining a second set of brand values. */
export function createBrandReference(document: StudioDocument) {
  const { brand, theme } = document
  const typography = { ...brand.typography, ...theme.typography }
  const light = Object.fromEntries(Object.entries(theme.cssVariables?.light ?? {}).map(([key, value]) => [cssName(key), value]))
  // Same precedence as createStudioCss/createThemeCssVars.
  for (const role of ['sans', 'mono', 'display']) if (typography[role]) light[`--font-${role}`] = typography[role]
  const darkOverrides = Object.fromEntries(Object.entries(theme.cssVariables?.dark ?? {}).map(([key, value]) => [cssName(key), value]))
  const dark = { ...light, ...darkOverrides }
  const variables = [...new Set([...Object.keys(light), ...Object.keys(dark)])].sort().map(name => ({ name, light: light[name], dark: dark[name], darkOverride: name in darkOverrides }))
  const ui = record(theme.ui)
  return {
    name: theme.label,
    packageName: brand.packageName,
    palettes: Object.entries(brand.colors).map(([name, scale]) => ({
      name,
      shades: (typeof scale === 'string' ? [['', scale]] : Object.entries(scale).sort(([a], [b]) => Number(a) - Number(b))).map(([shade, value]) => ({ shade: shade!, value: value! }))
    })),
    roles: strings(ui.colors).map(([role, palette]) => ({ role, palette, source: palette in brand.colors ? 'Brand' : 'Nuxt UI' })),
    typography: Object.entries(typography).map(([role, family]) => ({ role, family, light: light[`--font-${role}`] ?? family, dark: dark[`--font-${role}`] ?? family })),
    variables,
    radius: { light: light['--ui-radius'], dark: dark['--ui-radius'] },
    icons: strings(ui.icons).map(([role, icon]) => ({ role, icon })),
    components: Object.entries(ui).filter(([name]) => !['colors', 'icons'].includes(name)).map(([name, config]) => ({ name, config: JSON.stringify(config, null, 2) })),
    assets: [
      ...Object.entries(brand.assets?.logos ?? {}).map(([key, asset]) => ({ ...asset, key, kind: 'Logo' })),
      ...(brand.assets?.files ?? []).map((asset, index) => ({ ...asset, key: `file-${index}`, kind: 'Asset' }))
    ]
  }
}

/** Guide assets are links/images, never executable imported markup. */
export function isGuideAssetPath(path: unknown): path is string {
  return typeof path === 'string' && /^\/(?!\/)/.test(path) && !path.includes('\\') && !Array.from(path).some(character => character.charCodeAt(0) < 32) && !path.split('/').includes('..') && !/%(?:2e|2f|5c)/i.test(path)
}

/** WCAG relative luminance ratio for opaque, browser-resolved sRGB pixels. */
export function guideContrastRatio(foreground: readonly number[], background: readonly number[]) {
  if ([foreground, background].some(pixel => pixel.length !== 4 || pixel[3] !== 255 || pixel.some(value => !Number.isFinite(value) || value < 0 || value > 255))) return undefined
  const luminance = (pixel: readonly number[]) => pixel.slice(0, 3).map(value => {
    const channel = value / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index]!, 0)
  const first = luminance(foreground)
  const second = luminance(background)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
