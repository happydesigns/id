import { projectTemplates } from './project-templates.generated.js'
import { z } from 'zod'
import { brandDefinitionSchema, brandThemeSchema } from './schema.js'
import { cssVariablesAdapter } from './adapters/css-variables.js'
import { createThemeCssVars } from './css.js'
import type { BrandDefinition, BrandTheme } from './types.js'
import { validateBrandDefinition, validateBrandTheme } from './validation.js'

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
  theme: brandThemeSchema,
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
  // Earlier Studio icon presets persisted this malformed Material icon name.
  // Repair only that exact value; preserve user-authored icon overrides.
  const icons = doc.theme.ui?.icons as Record<string, unknown> | undefined
  if (icons?.light === 'i-material-symbols:light-mode-outline-rounded') {
    icons.light = 'i-material-symbols-light-mode-outline-rounded'
  }
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
    ...Object.values(doc.theme.cssVariables?.dark ?? {}),
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
    colors: {}, typography: { sans: 'system-ui, sans-serif', mono: 'ui-monospace, monospace' },
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
    }
    else changes.push({ path, before: a, after: b })
  }
  visit(before, after, '')
  return changes
}

export function createStudioCss(doc: StudioDocument): string {
  parseStudioDocument(doc)
  return [
    cssVariablesAdapter.transform(doc.brand, { prefix: '', selector: '@theme static', includeRoles: false }).css,
    createThemeCssVars({ ...doc.theme, typography: { ...doc.brand.typography, ...doc.theme.typography } }),
  ].filter(Boolean).join('\n\n')
}

export function createStudioRuntimeFiles(input: StudioDocument, options: { styles?: 'entry' | 'fragment' } = {}): Record<string, string> {
  const doc = parseStudioDocument(input)
  const json = (value: unknown) => JSON.stringify(value, null, 2).replaceAll('<', '\\u003c')
  return {
    'app/app.config.ts': `// Generated from brand.studio.json.\nexport default defineAppConfig(${json({ ui: doc.theme.ui ?? {}, brand: { name: doc.theme.label, assets: doc.brand.assets ?? {} } })})\n`,
    'app/assets/css/brand.css': options.styles === 'fragment'
      ? `/* Generated from brand.studio.json. Import after Tailwind and Nuxt UI in the host CSS entry. */\n${createStudioCss(doc)}\n`
      : `/* Generated from brand.studio.json. */\n@import "tailwindcss";\n@import "@nuxt/ui";\n@source "../../app.config.ts";\n${createStudioCss(doc)}\n`,
    'app/brand.assets.json': `${json({ name: doc.theme.label, logos: doc.brand.assets?.logos ?? {} })}\n`,
  }
}

export type StudioProjectOptions = { bundledPackage?: boolean, legacyRuntime?: boolean, guide?: boolean }

/** Assemble bundled starter files; only brand data and explicit options vary. */
export function createStudioProject(input: StudioDocument, options: StudioProjectOptions = {}): Record<string, string> {
  const doc = parseStudioDocument(input)
  const legacy = !!options.legacyRuntime
  const guide = !legacy && !!options.guide
  const files: Record<string, string> = { ...projectTemplates[legacy ? 'legacy' : 'native'] }
  const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
  const manifest = JSON.parse(files['package.json']!)
  if (guide) {
    const { 'package.json': dependencies, ...guideFiles } = projectTemplates.guide
    Object.assign(files, guideFiles)
    Object.assign(manifest.devDependencies, JSON.parse(dependencies!).devDependencies)
    // Docus supplies the host app; the minimal Studio host supplies its own UApp.
    delete files['playground/app/app.vue']
  }
  manifest.name = doc.brand.packageName || doc.brand.name
  const dependencies = legacy ? manifest.dependencies : manifest.devDependencies
  if (options.bundledPackage) dependencies['@happydesigns/id'] = 'file:./vendor/id.tgz'
  files['package.json'] = json(manifest)
  files['brand.studio.json'] = json(doc)
  if (legacy) {
    files['app/assets/css/brand.css'] = [
      '/* Regenerated from brand.studio.json when Nuxt starts. */',
      '@import "tailwindcss";', '@import "@nuxt/ui";',
      '@source "../../../brand.studio.json";', createStudioCss(doc), '',
    ].join('\n')
  }
  else Object.assign(files, createStudioRuntimeFiles(doc, { styles: 'fragment' }))
  const text: Record<string, string> = {
    brandName: doc.theme.label,
    packageName: manifest.name,
    packageNote: options.bundledPackage
      ? 'The reviewed id development package is bundled in vendor/id.tgz.'
      : 'Install the reviewed id package as the development dependency.',
  }
  for (const path of Object.keys(files)) {
    if (path.endsWith('.md')) files[path] = files[path]!.replace(/\{\{(brandName|packageName|packageNote)\}\}/g, (_, key: string) => text[key]!)
  }
  return files
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
  for (const chunk of [...chunks, ...central, end]) {
    result.set(chunk, position)
    position += chunk.length
  }
  return result
}

export type { StudioHostConfig } from './studio-host.js'
