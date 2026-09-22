import { parseStudioDocument } from '../src/studio-document'
import type { StudioDocument } from '../src/studio-document'

export type StudioSession = { id: string, baseline: StudioDocument, draft: StudioDocument, exported?: StudioDocument, updatedAt: number, catalogKey?: string }
export function parseStudioSession(value: unknown): StudioSession {
  const item = value as StudioSession
  if (!item || typeof item.id !== 'string' || !/^[a-zA-Z0-9:_-]{1,200}$/.test(item.id) || !Number.isFinite(item.updatedAt)) throw new Error('Invalid saved project.')
  return { id: item.id, baseline: parseStudioDocument(item.baseline), draft: parseStudioDocument(item.draft), exported: item.exported ? parseStudioDocument(item.exported) : undefined, updatedAt: item.updatedAt, catalogKey: typeof item.catalogKey === 'string' && item.catalogKey.length <= 500 ? item.catalogKey : undefined }
}

/** A predictable tint/shade starting scale; the chosen color remains exactly 500. */
export function createStudioPalette(hex: string): Record<string, string> {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error('Choose a six-digit hex color.')
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16))
  const stops = [[50, 0.95], [100, 0.9], [200, 0.75], [300, 0.55], [400, 0.3], [500, 0], [600, -0.15], [700, -0.3], [800, -0.45], [900, -0.6], [950, -0.8]]
  return Object.fromEntries(stops.map(([stop, weight]) => [String(stop), '#' + rgb.map(channel => Math.round(weight! >= 0 ? channel + (255 - channel) * weight! : channel * (1 + weight!)).toString(16).padStart(2, '0')).join('')]))
}

/** Accept opaque computed sRGB colors only; don't guess for alpha or other spaces. */
export function contrastRatio(foreground: string, background: string): number | undefined {
  function luminance(value: string) {
    const match = value.match(/^rgb\(\s*(\d+(?:\.\d+)?)[, ]+\s*(\d+(?:\.\d+)?)[, ]+\s*(\d+(?:\.\d+)?)\s*\)$/)
    if (!match) return undefined
    const channels = match.slice(1).map(Number)
    if (channels.some(value => value < 0 || value > 255)) return undefined
    const linear = channels.map((value) => {
      const s = value / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
  }
  const a = luminance(foreground), b = luminance(background)
  return a === undefined || b === undefined ? undefined : (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
