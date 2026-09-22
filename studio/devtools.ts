import { createStudioDocument, parseStudioDocument, type StudioDocument } from '../src/studio-document'
import { copyConfig, createPreviewBrand, type PreviewAppConfig } from './preview'

export type ThemeMode = 'light' | 'dark' | 'system'
export interface DevtoolsThemeSession {
  baseline: StudioDocument
  current: () => StudioDocument
  apply: (input: unknown) => void
  reset: () => void
  mode: (value?: ThemeMode) => ThemeMode
}

/** The host owns the draft so closing or remounting its editor cannot lose it. */
export function createDevtoolsThemeSession(config: PreviewAppConfig, setCss: (css: string) => void, mode: DevtoolsThemeSession['mode'], options: { document?: StudioDocument, appUi?: Record<string, unknown> } = {}): DevtoolsThemeSession {
  const source = options.document ?? config.idStudio?.document
  const baseline = source
    ? parseStudioDocument(source)
    : createStudioDocument({ name: 'application', colors: {} }, { name: 'application', label: 'Application', ui: copyConfig(config.ui) })
  let draft = parseStudioDocument(baseline)
  const originalMode = mode()
  const original = new Map<string, unknown>()
  for (const key of ['ui', 'brand', 'header', 'id', 'idStudio'] as const) {
    if (Object.hasOwn(config, key)) original.set(key, copyConfig(config[key]))
  }
  const apply = createPreviewBrand(config, baseline.theme.ui, options.appUi)
  return {
    baseline: parseStudioDocument(baseline),
    current: () => parseStudioDocument(draft),
    apply(input) {
      const next = parseStudioDocument(input)
      const css = apply(next)
      setCss(css)
      draft = next
    },
    reset() {
      for (const key of ['ui', 'brand', 'header', 'id', 'idStudio'] as const) {
        if (original.has(key)) Object.assign(config, { [key]: copyConfig(original.get(key)) })
        else Reflect.deleteProperty(config, key)
      }
      setCss('')
      mode(originalMode)
      draft = parseStudioDocument(baseline)
    },
    mode,
  }
}
