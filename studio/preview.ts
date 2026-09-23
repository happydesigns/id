import { createBrandThemeCss } from '../src/studio-css'
import { copyConfig, replaceThemeUi } from '../src/ui-config'
import type { StudioDocument } from '../src/studio'
import { createPreviewDefaultsCss } from './preview-defaults'

export { copyConfig, replaceThemeUi as previewUi } from '../src/ui-config'
type Config = Record<string, unknown>
const object = (value: unknown): value is Config => !!value && typeof value === 'object' && !Array.isArray(value)

/** Clamp editor radii and scope its resets to the synchronously managed Studio lifetime. */
export function studioShellCss(doc: StudioDocument): string {
  const variables = doc.theme.cssVariables
  const light = variables?.light?.['--ui-radius'] || '0.25rem'
  const dark = variables?.dark?.['--ui-radius'] || light
  return studioPreviewCss({
    ...doc,
    theme: {
      ...doc.theme,
      cssVariables: {
        ...variables,
        light: { ...variables?.light, '--ui-radius': `clamp(0rem, ${light}, 0.25rem)` },
        dark: { ...variables?.dark, '--ui-radius': `clamp(0rem, ${dark}, 0.25rem)` },
      },
    },
  }, ':root:root[data-id-studio-theme]')
}

export function studioPreviewCss(doc: StudioDocument, selector = ':root:root'): string {
  return [createPreviewDefaultsCss(selector),
    createBrandThemeCss(doc.brand, doc.theme, { paletteSelector: selector, lightSelector: selector, darkSelector: `${selector}.dark` }),
    `${selector} { color-scheme: light; overscroll-behavior: contain; } ${selector}.dark { color-scheme: dark; } :where(${selector}) body { background: var(--ui-bg); color: var(--ui-text); }`,
  ].join('\n')
}

export function docusBrandHeader(doc: StudioDocument, header: Config = {}): Config {
  const logos = doc.brand.assets?.logos ?? {}
  const light = logos.wordmark ?? logos.logo
  const dark = logos.wordmarkInverse ?? logos.logoInverse ?? light
  return { ...header, title: doc.theme.label, logo: { ...(object(header.logo) ? header.logo : {}), light: light?.src || '', dark: dark?.src || '', alt: light?.alt || doc.theme.label, wordmark: { light: light?.src || '', dark: dark?.src || '' } } }
}

export interface PreviewAppConfig {
  ui: Config
  idStudio?: { templates?: unknown, document?: StudioDocument }
  id?: { theme: StudioDocument['theme'], themes: StudioDocument['theme'][], assets?: StudioDocument['brand']['assets'] }
  header?: Config
  brand?: { name: string, assets?: StudioDocument['brand']['assets'] }
}

/** Capture the host once so repeated drafts never become their own baseline. */
export function createPreviewBrand(config: PreviewAppConfig, brandUi?: Config, appUi: Config = {}) {
  const hostUi = copyConfig(config.ui ?? {})
  const seedUi = copyConfig(brandUi ?? config.idStudio?.document?.theme.ui ?? config.id?.theme.ui ?? {})
  const overrides = copyConfig(appUi)
  const header = config.header ? copyConfig(config.header) : undefined
  return (doc: StudioDocument) => {
    config.ui = replaceThemeUi(hostUi, seedUi, doc.theme.ui ?? {}, overrides)
    config.brand = { name: doc.theme.label ?? doc.brand.name, assets: doc.brand.assets }
    if (header) config.header = docusBrandHeader(doc, header)
    if (config.idStudio) config.idStudio.document = doc
    if (config.id) {
      config.id.theme = doc.theme
      config.id.themes = []
      config.id.assets = doc.brand.assets
    }
    return studioPreviewCss(doc)
  }
}
