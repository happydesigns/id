import { defineBrand, defineBrandAdapter, nuxtUiAdapter } from '../../../src'

export const flexiblePlaygroundBrand = defineBrand({
  name: 'flexible-playground',
  colors: {
    indigo: {
      500: '#6366F1',
      600: '#4F46E5'
    },
    amber: {
      400: '#FBBF24',
      500: '#F59E0B'
    },
    slate: {
      500: '#64748B',
      900: '#0F172A'
    }
  },
  roles: {
    signature: 'indigo',
    tertiary: 'amber',
    structure: 'slate'
  },
  typography: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    editorial: 'Georgia, Cambria, serif'
  }
} as const)

export const flexiblePlaygroundTheme = nuxtUiAdapter.transform(flexiblePlaygroundBrand, {
  name: 'flexible-light-only',
  label: 'Flexible light-only',
  description: 'A Nuxt UI mapping with a free tertiary brand role, no runtime assets, and no dark overrides.',
  colors: {
    primary: flexiblePlaygroundBrand.roles.signature,
    secondary: flexiblePlaygroundBrand.roles.tertiary,
    neutral: flexiblePlaygroundBrand.roles.structure
  },
  cssVariables: {
    light: {
      '--ui-primary': '#4F46E5',
      '--ui-secondary': '#F59E0B',
      '--ui-radius': '0.625rem'
    }
  }
})

type FlexiblePlaygroundRole = keyof typeof flexiblePlaygroundBrand.roles

const productSurfaceAdapter = defineBrandAdapter({
  name: 'product-surface',
  transform(
    brand: typeof flexiblePlaygroundBrand,
    options: { accentRole: FlexiblePlaygroundRole }
  ) {
    const colorName = brand.roles[options.accentRole]

    return {
      target: 'product-surface',
      accentRole: options.accentRole,
      colorName,
      color: brand.colors[colorName]
    }
  }
})

export const productSurfaceOutput = productSurfaceAdapter.transform(flexiblePlaygroundBrand, {
  accentRole: 'tertiary'
})

export const adapterValidationRows = [
  {
    contract: 'Free brand role',
    input: 'tertiary',
    output: flexiblePlaygroundBrand.roles.tertiary
  },
  {
    contract: 'Nuxt UI mapping',
    input: 'secondary',
    output: String(flexiblePlaygroundTheme.ui?.colors?.secondary)
  },
  {
    contract: 'User adapter mapping',
    input: productSurfaceOutput.accentRole,
    output: productSurfaceOutput.colorName
  },
  {
    contract: 'Custom typography',
    input: 'editorial',
    output: flexiblePlaygroundBrand.typography.editorial
  }
] as const

export const adapterOmissionRows = [
  {
    contract: 'Dark overrides',
    behavior: flexiblePlaygroundTheme.cssVariables?.dark ? 'provided' : 'omitted; target defaults remain active'
  },
  {
    contract: 'Runtime assets',
    behavior: flexiblePlaygroundBrand.assets ? 'provided' : 'omitted; consumers render no brand asset'
  }
] as const
