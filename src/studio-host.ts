import type { StudioDocument } from './studio.js'

/** Trusted host configuration, separate from portable brand JSON. */
export interface StudioHostConfig {
  document?: StudioDocument
  brands?: Record<string, StudioDocument>
  sourcePath?: string
  home?: string
  documentation?: string
  host?: {
    name: string
    logo?: { light: string, dark: string, kind?: 'symbol' | 'wordmark' }
  }
  templates?: Record<string, {
    label: string
    description?: string
    owner?: string
    thumbnail?: string
    route?: string
    routePrefix?: string
    component?: string
    pages?: { id: string, label: string }[]
  }>
  /** Same-origin reviewed development package, optionally bundled in project exports. */
  packageAsset?: string
}
