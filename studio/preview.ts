import { createThemeCssVars } from '../src/css'
import { cssVariablesAdapter } from '../src/adapters/css-variables'
import type { StudioDocument } from '../src/studio'
import { previewDefaults } from './preview-defaults'

type Config = Record<string, unknown>
const object = (value: unknown): value is Config => !!value && typeof value === 'object' && !Array.isArray(value)
export function copyConfig<T>(value: T): T {
  if (Array.isArray(value)) return value.map(copyConfig) as T
  if (object(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copyConfig(item)])) as T
  return value
}
/** Remove only seed-owned declarations; retain explicit consumer overrides. */
export function previewUi(host: Config, seed: Config, draft: Config): Config {
  function without(base: Config, owned: Config): Config {
    const result = copyConfig(base)
    for (const key of Object.keys(owned)) {
      if (object(result[key]) && object(owned[key])) {
        result[key] = without(result[key], owned[key])
        if (!Object.keys(result[key] as Config).length) Reflect.deleteProperty(result, key)
      } else if (JSON.stringify(result[key]) === JSON.stringify(owned[key])) Reflect.deleteProperty(result, key)
    }
    return result
  }
  function merge(base: Config, extra: Config): Config {
    const result = copyConfig(base)
    for (const [key, value] of Object.entries(extra)) result[key] = object(value) && object(result[key]) ? merge(result[key], value) : copyConfig(value)
    return result
  }
  return merge(merge({ colors: { primary: 'green', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red', neutral: 'slate' } }, draft), without(host, seed))
}

export function studioPreviewCss(doc: StudioDocument): string {
  return [previewDefaults,
    cssVariablesAdapter.transform(doc.brand, { prefix: '', includeRoles: false, selector: ':root:root' }).css,
    createThemeCssVars({ ...doc.theme, typography: { ...doc.brand.typography, ...doc.theme.typography } }, { lightSelector: ':root:root', darkSelector: ':root:root.dark' }),
    'html { color-scheme: light; overscroll-behavior: contain; } html.dark { color-scheme: dark; } body { background: var(--ui-bg); color: var(--ui-text); }'
  ].join('\n')
}

export function docusBrandHeader(doc: StudioDocument, header: Config = {}): Config {
  const logos = doc.brand.assets?.logos ?? {}
  const light = logos.wordmark ?? logos.logo
  const dark = logos.wordmarkInverse ?? logos.logoInverse ?? light
  return { ...header, title: doc.theme.label, logo: { ...(object(header.logo) ? header.logo : {}), light: light?.src || '', dark: dark?.src || '', alt: light?.alt || doc.theme.label, wordmark: { light: light?.src || '', dark: dark?.src || '' } } }
}
