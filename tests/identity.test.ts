import { describe, expect, it } from 'vitest'
import {
  BrandValidationError,
  applyBrandTheme,
  createNuxtUiAppConfig,
  createThemeCssDeclarations,
  createThemeCssVars,
  defineBrandGuide,
  defineBrandTheme,
  idBrandGuide,
  neutralBrandTheme,
  nuxtUiBrandTheme,
  normalizeBrandThemes,
  resolveBrandThemes,
  validateBrandTheme
} from '../src'
import {
  editorialBrandTheme,
  studioBrandTheme,
  testBrandThemes
} from './fixtures'

describe('brand theme contract', () => {
  it('accepts a valid theme', () => {
    const theme = defineBrandTheme({
      name: 'client-brand',
      label: 'Client Brand',
      semanticColors: {
        primary: 'blue',
        neutral: 'slate'
      }
    })

    expect(theme.name).toBe('client-brand')
  })

  it('rejects themes without any theming surface', () => {
    expect(() => validateBrandTheme({
      name: 'empty',
      label: 'Empty'
    })).toThrow(BrandValidationError)
  })

  it('rejects non-kebab-case theme names', () => {
    expect(() => validateBrandTheme({
      name: 'Client Brand',
      label: 'Client Brand',
      semanticColors: {
        primary: 'blue'
      }
    })).toThrow(BrandValidationError)
  })
})

describe('brand guide contract', () => {
  it('accepts a complete guide shape', () => {
    const guide = defineBrandGuide({
      name: 'client-brand',
      title: 'Client Brand',
      description: 'A documented identity system.',
      semanticColors: {
        primary: 'blue'
      },
      usage: {
        avoid: ['domain behavior']
      }
    })

    expect(guide.usage?.avoid).toContain('domain behavior')
  })

  it('accepts arbitrary logo roles and validates their assets', () => {
    const guide = defineBrandGuide({
      name: 'client-brand',
      title: 'Client Brand',
      description: 'A documented identity system.',
      assets: {
        logos: {
          crest: {
            name: 'Client crest',
            src: '/brand/crest.svg',
            role: 'crest',
            alt: 'Client Brand'
          },
          'partner-lockup': {
            name: 'Partner lockup',
            src: '/brand/partner-lockup.svg',
            role: 'partner-lockup'
          }
        }
      }
    })

    expect(guide.assets?.logos?.crest?.src).toBe('/brand/crest.svg')
    expect(guide.assets?.logos?.['partner-lockup']?.role).toBe('partner-lockup')
  })

  it('rejects invalid assets behind custom logo roles', () => {
    expect(() => defineBrandGuide({
      name: 'client-brand',
      title: 'Client Brand',
      description: 'A documented identity system.',
      assets: {
        logos: {
          crest: {
            name: 'Client crest',
            src: '',
            role: 'crest'
          }
        }
      }
    })).toThrow(BrandValidationError)
  })

  it('ships an id brand guide for the default Nuxt UI baseline', () => {
    expect(idBrandGuide.name).toBe('happydesigns-id')
    expect(idBrandGuide.semanticColors?.primary).toBe('green')
    expect(idBrandGuide.usage?.avoid).toContain('domain behavior')
  })
})

describe('css generation', () => {
  it('renders light and dark css variable blocks', () => {
    const css = createThemeCssVars(editorialBrandTheme)

    expect(css).toContain(':root')
    expect(css).toContain('.dark')
    expect(css).toContain('--ui-bg')
    expect(css).toContain('--font-sans')
  })

  it('renders declarations for a single mode', () => {
    const declarations = createThemeCssDeclarations(editorialBrandTheme, 'dark')

    expect(declarations).toContain('--ui-bg')
    expect(declarations).toContain('--font-sans')
    expect(declarations).not.toContain(':root')
  })
})

describe('nuxt ui app config generation', () => {
  it('maps semantic colors to ui.colors', () => {
    const config = createNuxtUiAppConfig(editorialBrandTheme)

    expect(config.ui).toMatchObject({
      colors: {
        primary: 'orange',
        neutral: 'stone'
      }
    })
  })

  it('keeps component defaults in generated app config', () => {
    const config = createNuxtUiAppConfig(studioBrandTheme)

    expect(config.ui).toMatchObject({
      button: {
        defaultVariants: {
          color: 'primary',
          variant: 'solid'
        }
      },
      card: {
        slots: {
          root: expect.stringContaining('rounded-xl')
        }
      }
    })
  })
})

describe('brand theme lists', () => {
  it('dedupes merged app-config themes by name with the latest theme winning', () => {
    const customNeutral = defineBrandTheme({
      ...neutralBrandTheme,
      label: 'Custom Nuxt UI'
    })

    const themes = normalizeBrandThemes([
      neutralBrandTheme,
      customNeutral,
      editorialBrandTheme
    ])

    expect(themes.map(theme => theme.name)).toEqual(['nuxt-ui', 'editorial'])
    expect(themes[0]?.label).toBe('Custom Nuxt UI')
  })

  it('keeps theme fixtures covered with light and dark tokens plus component defaults', () => {
    expect(testBrandThemes.map(theme => theme.name)).toEqual(['nuxt-ui', 'editorial', 'studio'])

    for (const theme of testBrandThemes) {
      expect(theme.cssVariables?.light?.['--ui-bg']).toBeTruthy()
      expect(theme.cssVariables?.dark?.['--ui-bg']).toBeTruthy()
      expect(theme.ui?.button).toBeTruthy()
      expect(theme.ui?.card).toBeTruthy()
    }
  })

  it('uses id.theme as the primary brand theme before optional runtime themes', () => {
    const themes = resolveBrandThemes({
      theme: studioBrandTheme,
      themes: [
        nuxtUiBrandTheme,
        editorialBrandTheme,
        {
          ...studioBrandTheme,
          label: 'Duplicate Studio'
        }
      ]
    })

    expect(themes.map(theme => theme.name)).toEqual(['studio', 'nuxt-ui', 'editorial'])
    expect(themes[0]?.label).toBe('Studio')
  })
})

describe('runtime theme application', () => {
  it('applies css variables and emits app config', () => {
    const style = new Map<string, string>()
    const target = {
      style: {
        setProperty(name: string, value: string) {
          style.set(name, value)
        }
      }
    } as HTMLElement
    let config: Record<string, unknown> | undefined

    applyBrandTheme(editorialBrandTheme, {
      target,
      updateAppConfig(value) {
        config = value
      }
    })

    expect(style.get('--ui-bg')).toBe('#FFFCF7')
    expect(config).toMatchObject({
      ui: {
        colors: {
          primary: 'orange'
        }
      }
    })
  })

  it('applies dark variables without dropping typography tokens', () => {
    const style = new Map<string, string>()
    const target = {
      style: {
        setProperty(name: string, value: string) {
          style.set(name, value)
        }
      }
    } as HTMLElement

    applyBrandTheme(editorialBrandTheme, {
      mode: 'dark',
      target
    })

    expect(style.get('--ui-bg')).toBe('#211B16')
    expect(style.get('--font-sans')).toContain('Georgia')
  })

  it('applies visible neutral surface text tokens', () => {
    const style = new Map<string, string>()
    const target = {
      style: {
        setProperty(name: string, value: string) {
          style.set(name, value)
        }
      }
    } as HTMLElement

    applyBrandTheme(neutralBrandTheme, {
      target
    })

    expect(style.get('--ui-bg')).toBe('white')
    expect(neutralBrandTheme).toBe(nuxtUiBrandTheme)
    expect(style.get('--ui-text-highlighted')).toBe('#020617')
    expect(style.get('--ui-text-muted')).toBe('#64748B')
  })
})
