import { useAppConfig } from '#imports'
import { computed } from 'vue'
import { collectBrandAssets, selectBrandAsset } from '../../src'
import type { BrandAssetSelection, BrandGuideAppConfig } from '../../src'

type IdentityAppConfig = {
  id?: BrandGuideAppConfig
}

export function useBrandAssets() {
  // Host layers can narrow Nuxt's generated AppConfig with merge helpers that
  // are not structurally identical to the portable contract at type-check time.
  const appConfig = useAppConfig() as unknown as IdentityAppConfig

  const guide = computed(() => appConfig.id?.guide)
  const assets = computed(() => appConfig.id?.assets ?? guide.value?.assets)
  const entries = computed(() => collectBrandAssets(assets.value))
  const brandLabel = computed(() => guide.value?.title ?? appConfig.id?.name ?? 'Brand')

  function resolveAsset(selection: BrandAssetSelection = {}) {
    return selectBrandAsset(entries.value, selection)
  }

  return {
    guide,
    assets,
    entries,
    brandLabel,
    resolveAsset
  }
}
