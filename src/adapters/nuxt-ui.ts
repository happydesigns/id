import { defineBrandAdapter } from '../adapter.js'
import type {
  BrandColorName,
  BrandCssVariables,
  BrandDefinition,
  BrandTheme,
  NuxtUiColorRole,
} from '../types.js'
import { BrandValidationError, defineBrandTheme, validateBrandDefinition } from '../validation.js'

export type NuxtUiAdapterOptions<TBrand extends BrandDefinition> = {
  name?: string
  label?: string
  description?: string
  colors?: Partial<Record<NuxtUiColorRole, BrandColorName<TBrand['colors']>>>
  cssVariables?: BrandCssVariables
  components?: Record<string, unknown>
}

function resolveColors<TBrand extends BrandDefinition>(
  brand: TBrand,
  colors: NuxtUiAdapterOptions<TBrand>['colors'] = {},
) {
  const resolved: Record<string, string> = {}
  for (const [role, colorName] of Object.entries(colors)) {
    if (!colorName) {
      continue
    }
    if (!(colorName in brand.colors)) {
      throw new BrandValidationError('Invalid Nuxt UI brand mapping', [
        `colors.${role}: Brand color "${colorName}" is not defined`,
      ])
    }
    resolved[role] = colorName
  }
  return resolved
}

export const nuxtUiAdapter = defineBrandAdapter({
  name: 'nuxt-ui',

  transform<const TBrand extends BrandDefinition>(
    brand: TBrand,
    options: NuxtUiAdapterOptions<TBrand> = {},
  ): BrandTheme {
    validateBrandDefinition(brand)
    const colors = resolveColors(brand, options.colors)
    const ui = {
      ...(options.components ?? {}),
      ...(Object.keys(colors).length > 0 ? { colors } : {}),
    }
    return defineBrandTheme({
      name: options.name ?? brand.name,
      label: options.label ?? brand.name,
      description: options.description,
      typography: brand.typography,
      cssVariables: options.cssVariables,
      ...(Object.keys(ui).length > 0 ? { ui } : {}),
    })
  },
})
