import { describe, expect, it } from 'vitest'
import {
  BrandValidationError,
  createThemeCssVars,
  cssVariablesAdapter,
  defineBrand,
  defineBrandAdapter,
  nuxtUiAdapter
} from '../src'

const brand = defineBrand({
  name: 'adapter-fixture',
  colors: {
    coral: {
      50: '#FFF2ED',
      500: '#F28564'
    },
    sand: {
      150: '#F1ECE6',
      500: '#8F857A'
    },
    graphite: '#242423'
  },
  roles: {
    signature: 'coral',
    structure: 'sand'
  },
  typography: {
    sans: 'Fixture Sans, sans-serif'
  }
} as const)

describe('brand definitions', () => {
  it('keeps arbitrary color names, scale steps, and free roles', () => {
    expect(brand.colors.sand[150]).toBe('#F1ECE6')
    expect(brand.roles.signature).toBe('coral')
  })

  it('rejects roles that reference undefined colors', () => {
    expect(() => defineBrand({
      name: 'invalid-brand',
      colors: {
        coral: '#F28564'
      },
      roles: {
        action: 'missing'
      }
    } as never)).toThrow(BrandValidationError)
  })
})

describe('Nuxt UI adapter', () => {
  it('maps named brand colors and role values to Nuxt UI roles', () => {
    const theme = nuxtUiAdapter.transform(brand, {
      label: 'Adapter fixture',
      colors: {
        primary: brand.roles.signature,
        neutral: brand.roles.structure
      },
      components: {
        button: {
          defaultVariants: {
            variant: 'solid'
          }
        }
      }
    })

    expect(theme.ui).toMatchObject({
      colors: {
        primary: 'coral',
        neutral: 'sand'
      },
      button: {
        defaultVariants: {
          variant: 'solid'
        }
      }
    })
  })

  it('leaves omitted target roles at Nuxt UI defaults', () => {
    const theme = nuxtUiAdapter.transform(brand, {
      colors: {
        primary: 'coral'
      }
    })

    expect(theme.ui?.colors).toEqual({ primary: 'coral' })
    expect(theme.ui?.colors).not.toHaveProperty('secondary')
  })

  it('rejects mappings to undefined brand colors', () => {
    expect(() => nuxtUiAdapter.transform(brand, {
      colors: {
        primary: 'missing'
      }
    } as never)).toThrow(BrandValidationError)
  })

  it('only emits dark overrides when the brand integration provides them', () => {
    const lightOnly = nuxtUiAdapter.transform(brand, {
      colors: {
        primary: 'coral'
      },
      cssVariables: {
        light: {
          '--ui-bg': '#FAF7F2'
        }
      }
    })
    const withDarkOverrides = nuxtUiAdapter.transform(brand, {
      colors: {
        primary: 'coral'
      },
      cssVariables: {
        light: {
          '--ui-bg': '#FAF7F2'
        },
        dark: {
          '--ui-bg': '#242423'
        }
      }
    })

    expect(createThemeCssVars(lightOnly)).not.toContain('.dark')
    expect(createThemeCssVars(withDarkOverrides)).toContain('.dark')
  })
})

describe('CSS variables adapter', () => {
  it('flattens the same neutral colors, roles, and typography', () => {
    const output = cssVariablesAdapter.transform(brand, {
      prefix: 'client',
      selector: '[data-brand="client"]'
    })

    expect(output.variables).toMatchObject({
      '--client-color-coral-500': '#F28564',
      '--client-color-sand-150': '#F1ECE6',
      '--client-color-graphite': '#242423',
      '--client-role-signature-500': 'var(--client-color-coral-500)',
      '--client-font-sans': 'Fixture Sans, sans-serif'
    })
    expect(output.css).toContain('[data-brand="client"] {')
    expect(output.css).toContain('--client-color-sand-150: #F1ECE6;')
  })
})

describe('custom adapters', () => {
  it('keeps user adapters as ordinary TypeScript objects', () => {
    const customAdapter = defineBrandAdapter({
      name: 'status-colors',
      transform(input: typeof brand, options: { accent: keyof typeof brand.colors }) {
        return {
          accent: options.accent,
          value: input.colors[options.accent]
        }
      }
    })

    expect(customAdapter.transform(brand, { accent: 'graphite' })).toEqual({
      accent: 'graphite',
      value: '#242423'
    })
  })
})
