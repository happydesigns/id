import { resolveBrandPalettes } from './palettes.js'
import { cssVariablesAdapter } from './adapters/css-variables.js'
import { createThemeCssVars } from './css.js'
import type { BrandDefinition, BrandTheme, ThemeCssOptions } from './types.js'

/** Shared rendering for native output and isolated previews; callers validate the document. */
export function createBrandThemeCss(brand: BrandDefinition, theme: BrandTheme, options: ThemeCssOptions & { paletteSelector?: string } = {}) {
  const paletteCss = cssVariablesAdapter.transform({ ...brand, colors: resolveBrandPalettes(brand.colors) }, { prefix: '', selector: options.paletteSelector ?? '@theme static', includeRoles: false }).css
  return [
    // Nuxt UI reserves neutral for its semantic role and aliases the original palette.
    paletteCss.replaceAll('--color-neutral-', '--color-old-neutral-'),
    createThemeCssVars({ ...theme, typography: { ...brand.typography, ...theme.typography } }, options),
  ].filter(Boolean).join('\n\n')
}
