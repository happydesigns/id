import { z } from 'zod'
import { brandDefinitionSchema, brandThemeSchema } from './schema'
import { cssVariablesAdapter } from './adapters/css-variables'
import { createThemeCssVars } from './css'
import type { BrandDefinition, BrandTheme } from './types'
import { validateBrandDefinition, validateBrandTheme } from './validation'

/** The editable source. Unknown JSON fields survive an unchanged round trip. */
export type StudioDocument = {
  version: 1
  brand: BrandDefinition
  theme: BrandTheme
  [key: string]: unknown
}

const documentSchema = z.object({
  version: z.literal(1),
  brand: brandDefinitionSchema,
  theme: brandThemeSchema
}).passthrough()

export const studioBuiltinPalettes = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'mauve', 'olive', 'mist', 'taupe', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']

export const studioScenes = ['components', 'landing', 'docs'] as const
export type StudioScene = typeof studioScenes[number]
export const studioRoles = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'] as const

function inspectJson(value: unknown, depth = 0): void {
  if (depth > 30) throw new Error('Brand document is nested too deeply.')
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return
  if (typeof value === 'number' && Number.isFinite(value)) return
  if (typeof value !== 'object') throw new Error('Brand documents must contain JSON data only.')
  for (const [key, child] of Object.entries(value)) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error('Unsafe document property.')
    inspectJson(child, depth + 1)
  }
}

export function parseStudioDocument(input: string | unknown): StudioDocument {
  if (typeof input === 'string' && input.length > 8_000_000) throw new Error('Brand document exceeds 8 MB.')
  const value: unknown = typeof input === 'string' ? JSON.parse(input) : input
  inspectJson(value)
  documentSchema.parse(value)
  // Validate without projecting the object through a schema: projection would
  // strip properties authored by another tool or a newer compatible editor.
  const doc = JSON.parse(JSON.stringify(value)) as StudioDocument
  validateBrandDefinition(doc.brand)
  validateBrandTheme(doc.theme)
  if (doc.brand.packageName && !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(doc.brand.packageName)) throw new Error('Use a valid lowercase package name, such as @example/brand.')
  const paletteNames = new Set<string>()
  for (const name of Object.keys(doc.brand.colors)) {
    const normalized = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(name) || paletteNames.has(normalized)) throw new Error('Palette names must produce distinct CSS token names.')
    paletteNames.add(normalized)
  }
  const cssValues = [
    ...Object.values(doc.brand.colors).flatMap(color => typeof color === 'string' ? [color] : Object.values(color)),
    ...Object.values(doc.brand.typography ?? {}),
    ...Object.values(doc.theme.typography ?? {}),
    ...Object.values(doc.theme.cssVariables?.light ?? {}),
    ...Object.values(doc.theme.cssVariables?.dark ?? {})
  ]
  for (const css of cssValues) {
    if (typeof css !== 'string' || /[;{}<>\\]|url\s*\(|expression\s*\(|@import/i.test(css)) {
      throw new Error('Use CSS values, not rules, URLs or executable content.')
    }
  }
  for (const vars of Object.values(doc.theme.cssVariables ?? {})) {
    for (const key of Object.keys(vars)) if (!/^--[\w-]+$/.test(key)) throw new Error('Invalid CSS variable name.')
  }
  for (const [role, palette] of Object.entries(doc.theme.ui?.colors ?? {})) {
    if (!palette || !/^[\w-]+$/.test(role) || !/^[\w-]+$/.test(palette)) throw new Error('Invalid color mapping.')
    if (!studioBuiltinPalettes.includes(palette) && typeof doc.brand.colors[palette] !== 'object') throw new Error('Map semantic roles to a named brand scale or a Nuxt UI palette.')
  }
  for (const asset of [...Object.values(doc.brand.assets?.logos ?? {}), ...(doc.brand.assets?.files ?? [])]) {
    if (!asset) continue
    if (!/^\/(?!\/)[\w/.-]+$/.test(asset.src) && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(asset.src)) {
      throw new Error('Assets must use a local public path or an embedded PNG, JPEG or WebP.')
    }
    if (asset.src.split('/').includes('..')) throw new Error('Asset paths cannot leave public/.')
  }
  return doc
}

export function createStudioDocument(brand: BrandDefinition, theme: BrandTheme): StudioDocument {
  return parseStudioDocument(JSON.stringify({ version: 1, brand, theme }))
}

export function createBlankStudioDocument(): StudioDocument {
  return createStudioDocument({
    name: 'new-brand', packageName: '@example/brand', claim: 'Make it your own.',
    colors: {}, typography: { sans: 'system-ui, sans-serif', mono: 'ui-monospace, monospace' }
  }, { name: 'new-brand', label: 'New brand', ui: { colors: { primary: 'green', neutral: 'slate' } } })
}

export type StudioChange = { path: string, before: unknown, after: unknown }

export function diffStudioDocuments(before: StudioDocument, after: StudioDocument): StudioChange[] {
  const changes: StudioChange[] = []
  function visit(a: unknown, b: unknown, path: string) {
    if (JSON.stringify(a) === JSON.stringify(b)) return
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      const left = a as Record<string, unknown>
      const right = b as Record<string, unknown>
      for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) visit(left[key], right[key], path ? `${path}.${key}` : key)
    } else changes.push({ path, before: a, after: b })
  }
  visit(before, after, '')
  return changes
}

export function createStudioCss(doc: StudioDocument): string {
  parseStudioDocument(doc)
  return [
    cssVariablesAdapter.transform(doc.brand, { prefix: '', selector: '@theme static', includeRoles: false }).css,
    createThemeCssVars({ ...doc.theme, typography: { ...doc.brand.typography, ...doc.theme.typography } })
  ].filter(Boolean).join('\n\n')
}

/** Native runtime output. The editor is a development dependency only. */
export function createStudioRuntimeFiles(input: StudioDocument): Record<string, string> {
  const doc = parseStudioDocument(input)
  const json = (value: unknown) => JSON.stringify(value, null, 2).replaceAll('<', '\\u003c')
  return {
    'app/app.config.ts': `// Generated from brand.studio.json.\nexport default defineAppConfig(${json({ ui: doc.theme.ui ?? {}, brand: { name: doc.theme.label, assets: doc.brand.assets ?? {} } })})\n`,
    'app/assets/css/brand.css': `/* Generated from brand.studio.json. */\n@import "tailwindcss";\n@import "@nuxt/ui";\n@source "../../app.config.ts";\n${createStudioCss(doc)}\n`,
    'app/brand.assets.json': `${json({ name: doc.theme.label, logos: doc.brand.assets?.logos ?? {} })}\n`
  }
}

/** JSON is the single editable source; the generated layer never ships the editor. */
export function createStudioProject(input: StudioDocument, options: { bundledPackage?: boolean, legacyRuntime?: boolean } = {}): Record<string, string> {
  const doc = parseStudioDocument(input)
  const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
  const files: Record<string, string> = {
    'brand.studio.json': json(doc),
    'package.json': json({ name: doc.brand.packageName || doc.brand.name, private: true, type: 'module', scripts: { dev: 'nuxt dev playground', build: 'nuxt build playground' }, dependencies: { '@happydesigns/id': options.bundledPackage ? 'file:./vendor/id.tgz' : '^0.1.0', '@nuxt/ui': '4.10.0', nuxt: '4.5.2', tailwindcss: '4.3.3', '@iconify-json/lucide': '^1.2.123' } }),
    'nuxt.config.ts': `import { fileURLToPath } from 'node:url'\nimport { createStudioCss, parseStudioDocument } from '@happydesigns/id/studio/core'\nimport { writeFileSync } from 'node:fs'\nimport source from './brand.studio.json'\n\nwriteFileSync(fileURLToPath(new URL('./app/assets/css/brand.css', import.meta.url)), '@import "tailwindcss";\\n@import "@nuxt/ui";\\n@source "../../../brand.studio.json";\\n' + createStudioCss(parseStudioDocument(source)))\n\nexport default defineNuxtConfig({ extends: ['@happydesigns/id/nuxt'], css: [fileURLToPath(new URL('./app/assets/css/brand.css', import.meta.url))], compatibilityDate: '2026-08-01' })\n`,
    'app/app.config.ts': `import source from '../brand.studio.json'\nexport default defineAppConfig({ id: { name: source.brand.name, theme: source.theme, assets: source.brand.assets }, ui: source.theme.ui })\n`,
    'app/assets/css/brand.css': `/* Regenerated from brand.studio.json when Nuxt starts. */\n@import "tailwindcss";\n@import "@nuxt/ui";\n@source "../../../brand.studio.json";\n${createStudioCss(doc)}\n`,
    'playground/nuxt.config.ts': `import document from '../brand.studio.json'\nexport default defineNuxtConfig({ extends: ['..', '@happydesigns/id/studio'], compatibilityDate: '2026-08-01', appConfig: { idStudio: { document, sourcePath: 'brand.studio.json'${options.bundledPackage ? ", packageAsset: '/studio-packages/id.tgz'" : ''} } } })\n`,
    'playground/app/app.vue': '<template><UApp><NuxtPage /></UApp></template>\n',
    'playground/app/pages/index.vue': '<script setup lang="ts">await navigateTo("/studio")</script>\n<template><div /></template>\n',
    '.gitignore': 'node_modules\n.nuxt\n.output\nplayground/.nuxt\nplayground/.output\n',
    'README.md': `# ${doc.theme.label}\n\nA Nuxt UI brand layer. Edit brand.studio.json directly or open /studio in the playground, import the document, and export the reviewed source back to that file. Nuxt regenerates the CSS at startup.\n\nInstall the dependencies with pnpm install, then run pnpm dev. ${options.bundledPackage ? 'The reviewed id package is included in vendor/id.tgz; no sibling checkout is needed.' : 'Until @happydesigns/id is published, replace its dependency with your reviewed local package or tarball.'}\n\nConsumers extend this directory in nuxt.config.ts. The playground and Studio are optional authoring tools, never a runtime requirement.\n\nCustom class overrides must be compiled by Tailwind; the source document is scanned. Fonts need to be installed or loaded by the consuming application. Public assets are included when exported from a host that can serve them. Brand primitives and custom layouts remain owned by their original project; a theme archive does not reproduce arbitrary Vue components.\n`
  }
  if (options.legacyRuntime) return files
  delete files['playground/app/app.vue']
  return {
    ...files,
    ...createStudioRuntimeFiles(doc),
    'package.json': json({ name: doc.brand.packageName || doc.brand.name, private: true, type: 'module', main: './nuxt.config.ts', exports: { '.': './nuxt.config.ts' }, files: ['app', 'public', 'nuxt.config.ts', 'README.md'], scripts: { 'generate:brand': 'node scripts/generate-brand.mjs', predev: 'node scripts/generate-brand.mjs', dev: 'nuxt dev playground', prebuild: 'node scripts/generate-brand.mjs', build: 'nuxt build playground' }, dependencies: { '@nuxt/ui': '4.10.0', tailwindcss: '4.3.3' }, devDependencies: { '@happydesigns/id': options.bundledPackage ? 'file:./vendor/id.tgz' : '^0.1.0', nuxt: '4.5.2', docus: '5.12.3', '@takumi-rs/core': '1.8.7', '@iconify-json/lucide': '^1.2.123', '@iconify-json/vscode-icons': '^1.2.61' } }),
    'nuxt.config.ts': `import { fileURLToPath } from 'node:url'\nexport default defineNuxtConfig({ modules: ['@nuxt/ui'], css: [fileURLToPath(new URL('./app/assets/css/brand.css', import.meta.url))], compatibilityDate: '2026-08-01' })\n`,
    'scripts/generate-brand.mjs': `import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'\nimport { fileURLToPath } from 'node:url'\nimport { dirname, resolve } from 'node:path'\nimport { createStudioRuntimeFiles } from '@happydesigns/id/studio/core'\nconst root = fileURLToPath(new URL('..', import.meta.url))\nexport function generateBrand() {\n  const source = JSON.parse(readFileSync(resolve(root, 'brand.studio.json'), 'utf8'))\n  for (const [path, content] of Object.entries(createStudioRuntimeFiles(source))) {\n    const target = resolve(root, path)\n    mkdirSync(dirname(target), { recursive: true })\n    let previous = ''\n    try { previous = readFileSync(target, 'utf8') } catch {}\n    if (previous !== content) writeFileSync(target, content, 'utf8')\n  }\n}\ngenerateBrand()\n`,
    'app/components/BrandLogo.vue': `<script setup lang="ts">\nimport brand from '../brand.assets.json'\nconst config = useAppConfig() as unknown as { brand?: { name: string, assets?: { logos?: Record<string, { src: string, alt?: string }> } } }\nconst assets = computed(() => config.brand?.assets?.logos ?? brand.logos as Record<string, { src: string, alt?: string }>)\nconst light = computed(() => assets.value.wordmark ?? assets.value.logo)\nconst dark = computed(() => assets.value.wordmarkInverse ?? assets.value.logoInverse ?? light.value)\n</script>\n<template><UColorModeImage v-if="light" :light="light.src" :dark="dark?.src || light.src" :alt="light.alt || config.brand?.name || brand.name" class="h-6 w-auto" /><span v-else>{{ config.brand?.name || brand.name }}</span></template>\n`,
    'playground/nuxt.config.ts': `import { fileURLToPath } from 'node:url'\nimport source from '../brand.studio.json'\nimport { parseStudioDocument } from '@happydesigns/id/studio/core'\nconst document = parseStudioDocument(source)\nimport { generateBrand } from '../scripts/generate-brand.mjs'\nexport default defineNuxtConfig({ extends: ['..', '@happydesigns/id/studio', 'docus'], compatibilityDate: '2026-08-01', image: { provider: 'none' }, icon: { serverBundle: { collections: ['lucide', 'vscode-icons'] } }, runtimeConfig: { idStudioSource: fileURLToPath(new URL('../brand.studio.json', import.meta.url)) }, hooks: { 'builder:watch': (_event, path) => { if (path.endsWith('brand.studio.json')) generateBrand() } }, appConfig: { idStudio: { document, sourcePath: 'brand.studio.json', templates: { docs: { label: 'Docs', owner: 'docus', route: '/docs/introduction', routePrefix: '/docs' } }${options.bundledPackage ? ", packageAsset: '/studio-packages/id.tgz'" : ''} }, header: { title: document.theme.label, logo: { light: document.brand.assets?.logos?.wordmark?.src, dark: document.brand.assets?.logos?.wordmarkInverse?.src } }, github: false } })\n`,
    'playground/app/app.config.ts': 'export default defineAppConfig({ github: false })\n',
    'playground/content/docs/1.introduction.md': `---\ntitle: Use your brand\ndescription: A shared identity for your Nuxt applications.\n---\n\n## Install\n\nExtend the brand layer in your application's Nuxt configuration.\n\n\x60\x60\x60ts [nuxt.config.ts]\nexport default defineNuxtConfig({ extends: [${JSON.stringify(doc.brand.packageName || doc.brand.name)}] })\n\x60\x60\x60\n\n## Customize\n\nUse Studio to review changes to the shared source. Your application keeps its own pages and behavior.\n`,
    'README.md': `# ${doc.theme.label}\n\nA native Nuxt UI brand layer. Consumers extend this directory and receive CSS, app config and BrandLogo. They do not need the id runtime or Docus.\n\nThe editable source is brand.studio.json. Run pnpm install and pnpm dev to use the optional Studio and Docus playground. In local development, Apply changes updates the connected source after a revision check. Run pnpm generate:brand after external source edits. Generated app files are not a second editable source.\n\n${options.bundledPackage ? 'The id development package is bundled in vendor/id.tgz.' : 'Until id is published, use a reviewed local id package as the development dependency.'}\n\nFonts must be available to the consuming build. Custom domain components and capabilities are not included in the brand.\n`
  }
}

/** Small deterministic, uncompressed ZIP writer. No archive dependency in runtime. */
export function createStudioArchive(files: Record<string, string | Uint8Array>): Uint8Array {
  const encode = new TextEncoder()
  const chunks: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0
  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith('/') || path.includes('..') || path.includes('\\')) throw new Error('Unsafe archive path.')
    const name = encode.encode(path)
    const data = typeof content === 'string' ? encode.encode(content) : content
    let crc = 0xffffffff
    for (const byte of data) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
    }
    crc = (crc ^ 0xffffffff) >>> 0
    const header = new Uint8Array(30 + name.length)
    const view = new DataView(header.buffer)
    view.setUint32(0, 0x04034b50, true)
    view.setUint16(4, 20, true)
    view.setUint16(6, 0x800, true)
    view.setUint16(12, 33, true)
    view.setUint32(14, crc, true)
    view.setUint32(18, data.length, true)
    view.setUint32(22, data.length, true)
    view.setUint16(26, name.length, true)
    header.set(name, 30)
    const directory = new Uint8Array(46 + name.length)
    const entry = new DataView(directory.buffer)
    entry.setUint32(0, 0x02014b50, true)
    entry.setUint16(4, 20, true)
    directory.set(header.slice(4, 30), 6)
    entry.setUint32(42, offset, true)
    directory.set(name, 46)
    central.push(directory)
    chunks.push(header, data)
    offset += header.length + data.length
  }
  const directorySize = central.reduce((size, entry) => size + entry.length, 0)
  const end = new Uint8Array(22)
  const view = new DataView(end.buffer)
  view.setUint32(0, 0x06054b50, true)
  view.setUint16(8, central.length, true)
  view.setUint16(10, central.length, true)
  view.setUint32(12, directorySize, true)
  view.setUint32(16, offset, true)
  const result = new Uint8Array(offset + directorySize + end.length)
  let position = 0
  for (const chunk of [...chunks, ...central, end]) { result.set(chunk, position); position += chunk.length }
  return result
}
