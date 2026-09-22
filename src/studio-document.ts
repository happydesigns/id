import { z } from 'zod'
import { brandDefinitionSchema, brandThemeSchema } from './schema.js'
import type { BrandDefinition, BrandTheme } from './types.js'
import { validateBrandDefinition, validateBrandTheme } from './validation.js'

/** Browser import and local HTTP writer transfer guard; not a schema limit. */
export const studioDocumentMaxBytes = 8_000_000

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

export function parseStudioDocument(input: unknown): StudioDocument {
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
