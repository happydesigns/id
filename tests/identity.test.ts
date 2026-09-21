import { describe, expect, it } from 'vitest'
import {
  BrandValidationError,
  applyBrandTheme,
  brandThemeCookiePrefix,
  brandThemeStatePrefix,
  brandThemeStyleElementId,
  collectBrandAssets,
  createBrandGuideAssets,
  createBrandLogoSet,
  createBrandThemeCookieName,
  createBrandThemeStateKey,
  createNuxtUiAppConfig,
  createThemeCssDeclarations,
  createThemeCssVars,
  defineBrandIdentity,
  defineBrandGuide,
  defineBrandTheme,
  idBrandGuide,
  neutralBrandTheme,
  nuxtUiBrandTheme,
  normalizeBrandThemes,
  resolveBrandThemeName,
  resolveBrandThemes,
  selectBrandAsset,
  validateBrandIdentity,
  validateBrandTheme,
} from '../src'
import type {
  BrandGuideAppConfig,
  BrandRuntimeConfig,
  BrandRuntimeOnlyConfig,
} from '../src'
import {
  editorialBrandTheme,
  studioBrandTheme,
  testBrandThemes,
} from './fixtures'
import {
  sampleBrandGuide,
  sampleBrandTheme,
} from '../themes/sample-brand'

describe('brand identity contract', () => {
  it('accepts a raw brand identity source object', () => {
    const identity = defineBrandIdentity({
      name: 'client-brand',
      packageName: '@client/brand',
      claim: 'Clear systems for practical teams.',
      logoAssetPaths: {
        wordmark: '/logos/client-wordmark.svg',
      },
      colors: {
        blue: '#155EEF',
      },
    })
    expect(identity.logoAssetPaths.wordmark).toBe('/logos/client-wordmark.svg')
  })
  it('rejects non-kebab-case identity names', () => {
    expect(() => validateBrandIdentity({
      name: 'Client Brand',
    })).toThrow(BrandValidationError)
  })
})

describe('brand theme contract', () => {
  it('accepts a valid theme', () => {
    const theme = defineBrandTheme({
      name: 'client-brand',
      label: 'Client Brand',
      ui: {
        colors: {
          primary: 'blue',
          neutral: 'slate',
        },
      },
    })
    expect(theme.name).toBe('client-brand')
  })
  it('rejects themes without any theming surface', () => {
    expect(() => validateBrandTheme({
      name: 'empty',
      label: 'Empty',
    })).toThrow(BrandValidationError)
  })
  it('rejects non-kebab-case theme names', () => {
    expect(() => validateBrandTheme({
      name: 'Client Brand',
      label: 'Client Brand',
      ui: {
        colors: {
          primary: 'blue',
        },
      },
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
        primary: 'blue',
      },
      usage: {
        avoid: ['domain behavior'],
      },
    })
    expect(guide.usage?.avoid).toContain('domain behavior')
  })
  it('accepts structured voice examples', () => {
    const guide = defineBrandGuide({
      name: 'client-brand',
      title: 'Client Brand',
      description: 'A documented identity system.',
      voice: {
        attributes: ['Clear'],
        dos: ['Name the action.'],
        donts: ['Do not obscure the task.'],
        examples: [
          {
            label: 'Button',
            text: 'Save changes',
          },
        ],
      },
    })
    expect(guide.voice?.examples?.[0]).toEqual({
      label: 'Button',
      text: 'Save changes',
    })
  })
  it('accepts arbitrary logo roles and validates their assets', () => {
    const guide = defineBrandGuide({
      name: 'client-brand',
      title: 'Client Brand',
      description: 'A documented identity system.',
      assets: {
        logos: {
          'crest': {
            name: 'Client crest',
            src: '/brand/crest.svg',
            role: 'crest',
            alt: 'Client Brand',
          },
          'partner-lockup': {
            name: 'Partner lockup',
            src: '/brand/partner-lockup.svg',
            role: 'partner-lockup',
          },
        },
      },
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
            role: 'crest',
          },
        },
      },
    })).toThrow(BrandValidationError)
  })
  it('selects brand assets from arbitrary role maps with media-aware fallback', () => {
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
          },
          signature: {
            name: 'Client signature',
            src: '/brand/signature-dark.svg',
            role: 'signature',
            media: 'dark',
          },
        },
        files: [
          {
            name: 'Fallback lockup',
            src: '/brand/lockup.svg',
            role: 'lockup',
            media: 'any',
          },
        ],
      },
    })
    const assets = collectBrandAssets(guide)
    expect(selectBrandAsset(assets, { role: 'signature', media: 'dark' })?.src).toBe('/brand/signature-dark.svg')
    expect(selectBrandAsset(assets, { role: 'signature', media: 'light' })?.src).toBe('/brand/signature-dark.svg')
    expect(selectBrandAsset(assets, { fallbackRoles: ['lockup'] })?.src).toBe('/brand/lockup.svg')
  })
  it('prefers inverse logo roles for dark media fallback', () => {
    const assets = collectBrandAssets({
      assets: {
        logos: {
          logo: {
            name: 'Client logo',
            src: '/brand/logo.svg',
            role: 'logo',
          },
          wordmark: {
            name: 'Client wordmark',
            src: '/brand/wordmark.svg',
            role: 'wordmark',
          },
          wordmarkInverse: {
            name: 'Client inverse wordmark',
            src: '/brand/wordmark-inverse.svg',
            role: 'wordmarkInverse',
          },
        },
      },
    })
    expect(selectBrandAsset(assets, { media: 'light' })?.src).toBe('/brand/logo.svg')
    expect(selectBrandAsset(assets, { media: 'dark' })?.src).toBe('/brand/wordmark-inverse.svg')
  })
  it('maps guide asset entries into logo maps and file assets', () => {
    const entries = [
      {
        name: 'Client wordmark',
        role: 'wordmark',
        path: '/brand/wordmark.svg',
        usage: 'Primary navigation identity.',
      },
      {
        name: 'Client signature',
        role: 'signature',
        path: '/brand/signature.svg',
        usage: 'Footer signature.',
        media: 'dark' as const,
        alt: 'Client signature for dark surfaces',
      },
    ]
    const logos = createBrandLogoSet(entries)
    const assets = createBrandGuideAssets(entries, {
      alt: entry => `${entry.name} asset`,
    })
    expect(logos.wordmark?.src).toBe('/brand/wordmark.svg')
    expect(logos.signature?.alt).toBe('Client signature for dark surfaces')
    expect(logos.signature?.media).toBe('dark')
    expect(assets.logos?.wordmark?.alt).toBe('Client wordmark asset')
    expect(assets.logos?.signature?.alt).toBe('Client signature for dark surfaces')
    expect(assets.files?.map(asset => asset.role)).toEqual(['wordmark', 'signature'])
    expect(collectBrandAssets(assets).map(entry => entry.role)).toContain('signature')
    expect(collectBrandAssets({ assets }).map(entry => entry.role)).toContain('signature')
  })
  it('ships an id brand guide for the default Nuxt UI baseline', () => {
    expect(idBrandGuide.name).toBe('happydesigns-id')
    expect(idBrandGuide.semanticColors?.primary).toBe('green')
    expect(idBrandGuide.usage?.avoid).toContain('domain behavior')
  })
  it('ships a neutral sample guide as a documentation demo boundary', () => {
    expect(sampleBrandGuide.packageName).toBe('@example/brand')
    expect(sampleBrandGuide.semanticColors?.primary).toBe('sample')
    expect(sampleBrandGuide.usage?.useFor).toContain('contract demonstrations')
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
  it('keeps Nuxt UI colors in ui.colors', () => {
    const config = createNuxtUiAppConfig(editorialBrandTheme)
    expect(config.ui).toMatchObject({
      colors: {
        primary: 'orange',
        neutral: 'stone',
      },
    })
  })
  it('keeps component defaults in generated app config', () => {
    const config = createNuxtUiAppConfig(studioBrandTheme)
    expect(config.ui).toMatchObject({
      button: {
        defaultVariants: {
          color: 'primary',
          variant: 'solid',
        },
      },
      card: {
        slots: {
          root: expect.stringContaining('rounded-xl'),
        },
      },
    })
  })
})

describe('brand theme lists', () => {
  it('dedupes merged app-config themes by name with the latest theme winning', () => {
    const customNeutral = defineBrandTheme({
      ...neutralBrandTheme,
      label: 'Custom Nuxt UI',
    })
    const themes = normalizeBrandThemes([
      neutralBrandTheme,
      customNeutral,
      editorialBrandTheme,
    ])
    expect(themes.map(theme => theme.name)).toEqual(['nuxt-ui', 'editorial'])
    expect(themes[0]?.label).toBe('Custom Nuxt UI')
  })
  it('keeps theme fixtures covered with light and dark tokens plus component defaults', () => {
    expect(testBrandThemes.map(theme => theme.name)).toEqual(['nuxt-ui', 'editorial', 'studio'])
    for (const theme of testBrandThemes) {
      expect(theme.cssVariables?.light?.['--ui-bg']).toBeTruthy()
      expect(theme.cssVariables?.dark?.['--ui-bg']).toBeTruthy()
      expect(theme.ui?.colors).toBeTruthy()
      if (theme.name !== nuxtUiBrandTheme.name) {
        expect(theme.ui?.button).toBeTruthy()
        expect(theme.ui?.card).toBeTruthy()
      }
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
          label: 'Duplicate Studio',
        },
      ],
    })
    expect(themes.map(theme => theme.name)).toEqual(['studio', 'nuxt-ui', 'editorial'])
    expect(themes[0]?.label).toBe('Studio')
  })
  it('resolves a valid initial runtime theme name', () => {
    expect(resolveBrandThemeName({
      defaultTheme: 'editorial',
      theme: studioBrandTheme,
      themes: [editorialBrandTheme],
    })).toBe('editorial')
  })
  it('falls back when defaultTheme does not match a shipped theme', () => {
    expect(resolveBrandThemeName({
      defaultTheme: 'missing-theme',
      theme: studioBrandTheme,
      themes: [editorialBrandTheme],
    })).toBe('studio')
  })
  it('returns an empty theme name for an empty runtime theme list', () => {
    expect(resolveBrandThemeName()).toBe('')
  })
  it('keeps the sample brand theme runtime-safe and reversible', () => {
    expect(sampleBrandTheme.name).toBe('sample-brand')
    expect(sampleBrandTheme.ui?.colors?.primary).toBe('sample')
    expect(sampleBrandTheme.cssVariables?.light?.['--ui-bg']).toBe('white')
    expect(sampleBrandTheme.cssVariables?.dark?.['--ui-bg']).toBe('#0F172A')
    expect(sampleBrandTheme.ui?.button).toBeTruthy()
    expect(sampleBrandTheme.ui?.card).toBeTruthy()
  })
})

describe('runtime theme application', () => {
  it('uses brand-neutral runtime identifiers', () => {
    expect(brandThemeCookiePrefix).toBe('id-theme')
    expect(brandThemeStatePrefix).toBe('id-theme-state')
    expect(brandThemeStyleElementId).toBe('id-theme-vars')
    expect(createBrandThemeCookieName('Client Brand Docs')).toBe('id-theme-client-brand-docs')
    expect(createBrandThemeStateKey('Client Brand Docs')).toBe('id-theme-state:client-brand-docs')
    expect(createBrandThemeCookieName('')).toBe('id-theme-default')
    expect(createBrandThemeStateKey('')).toBe('id-theme-state:default')
  })
  it('applies css variables and emits app config', () => {
    const style = new Map<string, string>()
    const target = {
      style: {
        setProperty(name: string, value: string) {
          style.set(name, value)
        },
        removeProperty(name: string) {
          style.delete(name)
        },
      },
    } as HTMLElement
    let config: Record<string, unknown> | undefined
    applyBrandTheme(editorialBrandTheme, {
      target,
      updateAppConfig(value) {
        config = value
      },
    })
    expect(style.get('--ui-bg')).toBe('#FFFCF7')
    expect(config).toMatchObject({
      ui: {
        colors: {
          primary: 'orange',
        },
      },
    })
  })
  it('applies dark variables without dropping typography tokens', () => {
    const style = new Map<string, string>()
    const target = {
      style: {
        setProperty(name: string, value: string) {
          style.set(name, value)
        },
        removeProperty(name: string) {
          style.delete(name)
        },
      },
    } as HTMLElement
    applyBrandTheme(editorialBrandTheme, {
      mode: 'dark',
      target,
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
        },
        removeProperty(name: string) {
          style.delete(name)
        },
      },
    } as HTMLElement
    applyBrandTheme(neutralBrandTheme, {
      target,
    })
    expect(style.get('--ui-bg')).toBe('white')
    expect(neutralBrandTheme).toBe(nuxtUiBrandTheme)
    expect(style.get('--ui-text-highlighted')).toBe('var(--ui-color-neutral-950)')
    expect(style.get('--ui-text-muted')).toBe('var(--ui-color-neutral-500)')
  })
  it('removes stale inline css variables when switching back to the Nuxt UI theme', () => {
    const style = new Map<string, string>()
    const target = {
      style: {
        setProperty(name: string, value: string) {
          style.set(name, value)
        },
        removeProperty(name: string) {
          style.delete(name)
        },
      },
    } as HTMLElement
    applyBrandTheme(sampleBrandTheme, {
      target,
    })
    expect(style.get('--ui-primary')).toBe('#2563EB')
    applyBrandTheme(nuxtUiBrandTheme, {
      target,
    })
    expect(style.get('--ui-bg')).toBe('white')
    expect(style.has('--ui-primary')).toBe(false)
    expect(style.has('--sample-surface-accent')).toBe(false)
  })
})

describe('app config contracts', () => {
  it('separates runtime-only config from optional guide app data and keeps the combined legacy name', () => {
    const runtime = {
      name: 'client',
      assets: {
        logos: {
          logo: {
            name: 'Client logo',
            src: '/brand/logo.svg',
            role: 'logo',
          },
        },
      },
    } satisfies BrandRuntimeOnlyConfig
    const guideApp = {
      ...runtime,
      guide: {
        name: 'client',
        title: 'Client',
        description: 'Client brand guide.',
      },
    } satisfies BrandGuideAppConfig
    const legacyCombined = guideApp satisfies BrandRuntimeConfig
    expect(runtime).not.toHaveProperty('guide')
    expect(guideApp.guide.title).toBe('Client')
    expect(legacyCombined.assets?.logos?.logo?.src).toBe('/brand/logo.svg')
  })
})
