import { createThemeCssVars } from '../src/css'
import { cssVariablesAdapter } from '../src/adapters/css-variables'
import type { StudioDocument } from '../src/studio'
import { previewDefaults } from './preview-defaults'

export { copyConfig, replaceThemeUi as previewUi } from '../src/ui-config'
type Config = Record<string, unknown>
const object = (value: unknown): value is Config => !!value && typeof value === 'object' && !Array.isArray(value)

/** Keep authoring controls usable while previews retain the full brand radius. */
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
  })
}

export function studioPreviewCss(doc: StudioDocument): string {
  return [previewDefaults,
    cssVariablesAdapter.transform(doc.brand, { prefix: '', includeRoles: false, selector: ':root:root' }).css,
    createThemeCssVars({ ...doc.theme, typography: { ...doc.brand.typography, ...doc.theme.typography } }, { lightSelector: ':root:root', darkSelector: ':root:root.dark' }),
    'html { color-scheme: light; overscroll-behavior: contain; } html.dark { color-scheme: dark; } body { background: var(--ui-bg); color: var(--ui-text); }',
  ].join('\n')
}

export function docusBrandHeader(doc: StudioDocument, header: Config = {}): Config {
  const logos = doc.brand.assets?.logos ?? {}
  const light = logos.wordmark ?? logos.logo
  const dark = logos.wordmarkInverse ?? logos.logoInverse ?? light
  return { ...header, title: doc.theme.label, logo: { ...(object(header.logo) ? header.logo : {}), light: light?.src || '', dark: dark?.src || '', alt: light?.alt || doc.theme.label, wordmark: { light: light?.src || '', dark: dark?.src || '' } } }
}
