import type { BrandAsset, BrandGuide, BrandGuideAssetEntry, BrandLogoSet } from './types'

export type BrandAssetEntry = {
  role: string
  asset: BrandAsset
}

export type BrandGuideAssetMappingOptions = {
  alt?: (entry: BrandGuideAssetEntry) => string | undefined
}

export type BrandAssetSelection = {
  role?: string
  variant?: string
  media?: BrandAsset['media']
  fallbackRoles?: string[]
}

export const defaultBrandAssetRoles = ['logo', 'wordmark', 'symbol', 'mark', 'appIcon', 'wordmarkInverse', 'symbolInverse'] as const

const darkBrandAssetRoles = ['logo', 'wordmarkInverse', 'symbolInverse', 'wordmark', 'symbol', 'mark', 'appIcon'] as const

function defaultFallbackRoles(media?: BrandAsset['media']) {
  return [...(media === 'dark' ? darkBrandAssetRoles : defaultBrandAssetRoles)]
}

export function createBrandAsset(
  entry: BrandGuideAssetEntry,
  options: BrandGuideAssetMappingOptions = {}
): BrandAsset {
  return {
    name: entry.name,
    src: entry.path,
    role: entry.role,
    media: entry.media,
    alt: entry.alt ?? options.alt?.(entry) ?? entry.name
  }
}

export function createBrandLogoSet(
  entries: readonly BrandGuideAssetEntry[],
  options: BrandGuideAssetMappingOptions = {}
): BrandLogoSet {
  return Object.fromEntries(
    entries.map(entry => [entry.role, createBrandAsset(entry, options)])
  ) as BrandLogoSet
}

export function createBrandGuideAssets(
  entries: readonly BrandGuideAssetEntry[],
  options: BrandGuideAssetMappingOptions = {}
): NonNullable<BrandGuide['assets']> {
  return {
    logos: createBrandLogoSet(entries, options),
    files: entries.map(entry => createBrandAsset(entry, options))
  }
}

function matchesMedia(asset: BrandAsset, media?: BrandAsset['media']) {
  return !media || !asset.media || asset.media === 'any' || asset.media === media
}

function matchesRole(entry: BrandAssetEntry, role: string) {
  return entry.role === role || entry.asset.role === role
}

function selectFromEntries(entries: BrandAssetEntry[], selection: BrandAssetSelection = {}) {
  const requestedRole = selection.role ?? selection.variant
  const fallbackRoles = selection.fallbackRoles ?? defaultFallbackRoles(selection.media)

  if (requestedRole) {
    return entries.find(entry => matchesRole(entry, requestedRole))?.asset
  }

  for (const role of fallbackRoles) {
    const asset = entries.find(entry => matchesRole(entry, role))?.asset
    if (asset) {
      return asset
    }
  }

  return entries[0]?.asset
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
