import { cssVariablesAdapter } from '../src/adapters/css-variables'
import { resolveBrandPalettes, resolvePalette } from '../src/palettes'
import type { BrandDefinition, BrandTheme } from '../src/types'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export type FirstPaintTheme = {
  active: string
  revision?: string
  light: Record<string, string>
  dark: Record<string, string>
}

export function firstPaintThemeKey(scope: string) {
  return `id-studio:1:${scope}:first-paint`
}

/** Cache presentation values only; the browser bootstrap never reads a brand document as code. */
export function createFirstPaintTheme(active: string, brand: BrandDefinition, theme: BrandTheme, revision?: string): FirstPaintTheme {
  const light = cssVariablesAdapter.transform({ ...brand, colors: resolveBrandPalettes(brand.colors) }, { prefix: '', includeRoles: false, includeTypography: false }).variables
  for (const [role, palette] of Object.entries(theme.ui?.colors ?? {})) {
    if (typeof palette !== 'string' || !/^[\w-]+$/.test(role) || !/^[\w-]+$/.test(palette)) continue
    const scale = resolvePalette(palette, brand.colors)
    if (!scale || typeof scale === 'string') continue
    for (const shade of shades) {
      const color = scale[shade]
      if (color) light[`--ui-color-${role}-${shade}`] = color
    }
  }
  const typography = { ...brand.typography, ...theme.typography }
  for (const [name, value] of Object.entries(typography)) if (value) light[`--font-${name}`] = value
  Object.assign(light, theme.cssVariables?.light)
  return { active, revision, light, dark: { ...theme.cssVariables?.dark } }
}
