import { parseStudioDocument } from './studio-document.js'
import type { StudioDocument } from './studio-document.js'
import { createBrandThemeCss } from './studio-css.js'

export function createStudioCss(doc: StudioDocument): string {
  parseStudioDocument(doc)
  return createBrandThemeCss(doc.brand, doc.theme)
}

export function createStudioRuntimeFiles(input: StudioDocument, options: { styles?: 'entry' | 'fragment', config?: 'entry' | 'fragment' } = {}): Record<string, string> {
  const doc = parseStudioDocument(input)
  const json = (value: unknown) => JSON.stringify(value, null, 2).replaceAll('<', '\\u003c')
  const config = json({ ui: doc.theme.ui ?? {}, brand: { name: doc.theme.label, assets: doc.brand.assets ?? {} } })
  return {
    [options.config === 'fragment' ? 'app/brand.config.ts' : 'app/app.config.ts']: options.config === 'fragment'
      ? `// Generated from brand.studio.json. Do not edit.\nexport default ${config}\n`
      : `// Generated from brand.studio.json.\nexport default defineAppConfig(${config})\n`,
    'app/assets/css/brand.css': options.styles === 'fragment'
      ? `/* Generated from brand.studio.json. Import after Tailwind and Nuxt UI in the host CSS entry. */\n${createStudioCss(doc)}\n`
      : `/* Generated from brand.studio.json. */\n@import "tailwindcss";\n@import "@nuxt/ui";\n@source "../../${options.config === 'fragment' ? 'brand.config.ts' : 'app.config.ts'}";\n${createStudioCss(doc)}\n`,
    ...(options.config === 'fragment' ? {} : { 'app/brand.assets.json': `${json({ name: doc.theme.label, logos: doc.brand.assets?.logos ?? {} })}\n` }),
  }
}
