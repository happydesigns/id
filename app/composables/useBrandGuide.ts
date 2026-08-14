import { useAppConfig } from '#imports'
import { idBrandGuide } from '../../src/defaults'
import type { BrandGuide, BrandGuideConfig } from '../../src'

type IdentityAppConfig = {
  id?: BrandGuideConfig
}

export function useBrandGuide(): BrandGuide {
  const appConfig = useAppConfig() as IdentityAppConfig

  return appConfig.id?.guide ?? idBrandGuide
}
