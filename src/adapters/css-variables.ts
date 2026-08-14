import { defineBrandAdapter } from '../adapter'
import type { BrandColorScale, BrandDefinition, BrandPalette } from '../types'
import { validateBrandDefinition } from '../validation'

export type CssVariablesAdapterOptions = {
  prefix?: string
  selector?: string
  includeRoles?: boolean
  includeTypography?: boolean
}

export type CssVariablesAdapterOutput = {
  variables: Record<string, string>
  css: string
}

function kebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase()
}

function variableName(prefix: string, ...parts: string[]) {
  return `--${[prefix, ...parts].filter(Boolean).map(kebabCase).join('-')}`
}

function isColorScale(value: BrandPalette[string]): value is BrandColorScale {
  return typeof value === 'object' && value !== null
}

function addColorVariables(
  variables: Record<string, string>,
  prefix: string,
  colorName: string,
  value: BrandPalette[string],
  target = 'color'
) {
  if (!isColorScale(value)) {
    variables[variableName(prefix, target, colorName)] = value
    return
  }

  for (const [shade, shadeValue] of Object.entries(value)) {
    if (shadeValue) {
      variables[variableName(prefix, target, colorName, shade)] = shadeValue
    }
  }
}

function renderCss(selector: string, variables: Record<string, string>) {
  const declarations = Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  return declarations ? `${selector} {\n${declarations}\n}` : ''
}

export const cssVariablesAdapter = defineBrandAdapter({
  name: 'css-variables',

  transform<const TBrand extends BrandDefinition>(
    brand: TBrand,
    options: CssVariablesAdapterOptions = {}
  ): CssVariablesAdapterOutput {
    validateBrandDefinition(brand)
    const prefix = kebabCase(options.prefix ?? 'brand')
    const variables: Record<string, string> = {}

    for (const [name, value] of Object.entries(brand.colors)) {
      addColorVariables(variables, prefix, name, value)
    }

    if (options.includeRoles ?? true) {
      for (const [role, colorName] of Object.entries(brand.roles ?? {})) {
        const color = brand.colors[colorName]

        if (isColorScale(color)) {
          for (const shade of Object.keys(color)) {
            variables[variableName(prefix, 'role', role, shade)]
              = `var(${variableName(prefix, 'color', colorName, shade)})`
          }
        } else {
          variables[variableName(prefix, 'role', role)]
            = `var(${variableName(prefix, 'color', colorName)})`
        }
      }
    }

    if ((options.includeTypography ?? true) && brand.typography) {
      for (const [role, stack] of Object.entries(brand.typography)) {
        if (stack) {
          variables[variableName(prefix, 'font', role)] = stack
        }
      }
    }

    return {
      variables,
      css: renderCss(options.selector ?? ':root', variables)
    }
  }
})
