import { cssVariablesAdapter } from './adapters/css-variables.js'
import { createThemeCssVars } from './css.js'
import type { BrandDefinition, BrandTheme, ThemeCssOptions } from './types.js'

/** Shared rendering for native output and isolated previews; callers validate the document. */
export function createBrandThemeCss(brand: BrandDefinition, theme: BrandTheme, options: ThemeCssOptions & { paletteSelector?: string } = {}) {
  return [
    cssVariablesAdapter.transform(brand, { prefix: '', selector: options.paletteSelector ?? '@theme static', includeRoles: false }).css,
    createThemeCssVars({ ...theme, typography: { ...brand.typography, ...theme.typography } }, options),
  ].filter(Boolean).join('\n\n')
}
