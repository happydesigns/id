import { useAppConfig } from '#imports'
import { idBrandGuide } from '../../src/defaults'
import type { BrandGuide, BrandRuntimeConfig } from '../../src'

type IdentityAppConfig = {
  id?: BrandRuntimeConfig
}

export function useBrandGuide(): BrandGuide {
  const appConfig = useAppConfig() as IdentityAppConfig

  return appConfig.id?.guide ?? idBrandGuide
}
