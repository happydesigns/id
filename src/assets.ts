import type { BrandAsset, BrandGuide } from './types'

export type BrandAssetEntry = {
  role: string
  asset: BrandAsset
}

export type BrandAssetSelection = {
  role?: string
  variant?: string
  media?: BrandAsset['media']
  fallbackRoles?: string[]
}

export const defaultBrandAssetRoles = ['logo', 'wordmark', 'symbol', 'mark', 'appIcon'] as const

function matchesMedia(asset: BrandAsset, media?: BrandAsset['media']) {
  return !media || !asset.media || asset.media === 'any' || asset.media === media
}

function matchesRole(entry: BrandAssetEntry, role: string) {
  return entry.role === role || entry.asset.role === role
}

function selectFromEntries(entries: BrandAssetEntry[], selection: BrandAssetSelection = {}) {
  const requestedRole = selection.role ?? selection.variant
  const fallbackRoles = selection.fallbackRoles ?? [...defaultBrandAssetRoles]

  if (requestedRole) {
    return entries.find(entry => matchesRole(entry, requestedRole))?.asset
  }

  return entries.find(entry => fallbackRoles.includes(entry.role) || fallbackRoles.includes(entry.asset.role))?.asset
    ?? entries[0]?.asset
}

export function collectBrandAssets(guide?: Pick<BrandGuide, 'assets'> | null): BrandAssetEntry[] {
  const logos = Object.entries(guide?.assets?.logos ?? {})
    .map(([role, asset]) => asset ? { role, asset } : undefined)
    .filter((entry): entry is BrandAssetEntry => Boolean(entry))
  const files = (guide?.assets?.files ?? []).map(asset => ({ role: asset.role, asset }))

  return [...logos, ...files]
}

export function selectBrandAsset(entries: BrandAssetEntry[], selection: BrandAssetSelection = {}) {
  const mediaEntries = entries.filter(entry => matchesMedia(entry.asset, selection.media))

  return selectFromEntries(mediaEntries, selection) ?? selectFromEntries(entries, selection)
}
