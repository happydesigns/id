import { describe, expect, it } from 'vitest'
import {
  BrandValidationError,
  applyBrandTheme,
  createNuxtUiAppConfig,
  createThemeCssDeclarations,
  createThemeCssVars,
  defineBrandGuide,
  defineBrandTheme,
  editorialBrandTheme,
  validateBrandTheme
} from '../src'

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
})
