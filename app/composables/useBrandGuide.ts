import { useAppConfig } from '#imports'
import { idBrandGuide } from '../../src/defaults'
import type { BrandGuide, BrandGuideConfig } from '../../src'

type IdentityAppConfig = {
  id?: BrandGuideConfig
}

export function useBrandGuide(): BrandGuide {
  // Guide layers may use Nuxt app-config merge functions for array replacement.
  const appConfig = useAppConfig() as unknown as IdentityAppConfig
  return appConfig.id?.guide ?? idBrandGuide
}
