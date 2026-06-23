import { computed, useAppConfig } from '#imports'
import { collectBrandAssets, selectBrandAsset } from '../../src'
import type { BrandAssetSelection, BrandRuntimeConfig } from '../../src'

type IdentityAppConfig = {
  id?: BrandRuntimeConfig
}

export function useBrandAssets() {
  const appConfig = useAppConfig() as IdentityAppConfig

  const guide = computed(() => appConfig.id?.guide)
  const entries = computed(() => collectBrandAssets(guide.value))
  const brandLabel = computed(() => guide.value?.title ?? appConfig.id?.name ?? 'Brand')

  function resolveAsset(selection: BrandAssetSelection = {}) {
    return selectBrandAsset(entries.value, selection)
  }

  return {
    guide,
    entries,
    brandLabel,
    resolveAsset
  }
}
