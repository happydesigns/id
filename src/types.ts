import type { AppConfigInput } from 'nuxt/schema'

export type BrandColorShade
  = | 50
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 950
    | (number & {})

export type BrandColorScale = Partial<Record<BrandColorShade, string>>

export type BrandPalette = Record<string, string | BrandColorScale>

export type BrandColorName<TColors extends BrandPalette = BrandPalette> = Extract<keyof TColors, string>

export type BrandColorRoles<TColors extends BrandPalette = BrandPalette> = Record<string, BrandColorName<TColors>>

export type NuxtUiColorRole
  = | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'neutral'
    | (string & {})

export type BrandSemanticColors = Partial<Record<NuxtUiColorRole, string>>

export type BrandThemeUi = Record<string, unknown> & {
  colors?: BrandSemanticColors
}

export type BrandCssVariables = {
  light?: Record<string, string>
  dark?: Record<string, string>
}

export type BrandTypographyRole
  = | 'sans'
    | 'mono'
    | 'display'
    | (string & {})

export type BrandTypography = Partial<Record<BrandTypographyRole, string>>

export type BrandAsset = {
  name: string
  src: string
  role: string
  media?: 'light' | 'dark' | 'any'
  alt?: string
}

export type BrandLogoRole
  = | 'logo'
    | 'wordmark'
    | 'wordmarkInverse'
    | 'symbol'
    | 'symbolInverse'
    | 'mark'
    | 'appIcon'
    | (string & {})

export type BrandLogoSet = {
  [role: string]: BrandAsset | undefined
  logo?: BrandAsset
  wordmark?: BrandAsset
  wordmarkInverse?: BrandAsset
  symbol?: BrandAsset
  symbolInverse?: BrandAsset
  mark?: BrandAsset
  appIcon?: BrandAsset
}

export type BrandAssets = {
  logos?: BrandLogoSet
  files?: readonly BrandAsset[]
}

export type BrandVoice = {
  attributes?: string[]
  dos?: string[]
  donts?: string[]
  examples?: {
    label: string
    text: string
  }[]
}

export type BrandComponentCoverage = {
  family: string
  components: string[]
  status: 'planned' | 'tokenized' | 'documented' | 'verified'
  notes?: string
}

export type BrandIdentity<
  TLogoAssetPaths extends Record<string, string> = Record<string, string>,
  TColors extends BrandPalette = BrandPalette,
> = {
  name: string
  packageName?: string
  claim?: string
  logoAssetPaths?: TLogoAssetPaths
  colors?: TColors
}

export type BrandDefinition<
  TColors extends BrandPalette = BrandPalette,
  TRoles extends BrandColorRoles<TColors> = BrandColorRoles<TColors>,
  TAssets extends BrandAssets = BrandAssets,
> = {
  name: string
  packageName?: string
  claim?: string
  colors: TColors
  roles?: TRoles
  typography?: BrandTypography
  assets?: TAssets
}

export type BrandGuideSectionInput = {
  slug: string
  title: string
  description: string
  summary?: string
  eyebrow?: string
  icon?: string
  to?: string
  anchors?: readonly string[]
}

export type BrandGuideSection = Omit<BrandGuideSectionInput, 'anchors'> & {
  anchors?: string[]
}

export type BrandGuideDocsSection = {
  title: string
  description: string
  to: string
}

export type BrandGuideColorEntry = {
  name: string
  token: string
  hex: string
  role: string
  usage: string
}

export type BrandGuideFontEntry = {
  name: string
  role: string
  stack: string
  sample: string
  notes: string
}

export type BrandGuideComponentEntry = {
  name: string
  purpose: string
  guidance: string
}

export type BrandGuidePrinciple = {
  title: string
  description: string
  icon: string
}

export type BrandGuideAssetEntry = {
  name: string
  role: string
  path: string
  usage: string
  media?: BrandAsset['media']
  alt?: string
}

export type BrandGuideContent<TBrand = BrandIdentity> = {
  brand: TBrand
  principles: BrandGuidePrinciple[]
  sections: readonly BrandGuideSectionInput[]
  colors: BrandGuideColorEntry[]
  fonts: BrandGuideFontEntry[]
  components: BrandGuideComponentEntry[]
  voice: BrandVoice & {
    attributes: string[]
    dos: string[]
    donts: string[]
  }
  assets: BrandGuideAssetEntry[]
}

export type BrandGuide = {
  name: string
  packageName?: string
  title: string
  description: string
  homepage?: string
  repository?: string
  assets?: BrandAssets
  palette?: BrandPalette
  semanticColors?: BrandSemanticColors
  cssVariables?: BrandCssVariables
  typography?: BrandTypography
  voice?: BrandVoice
  componentCoverage?: BrandComponentCoverage[]
  usage?: {
    useFor?: string[]
    avoid?: string[]
    runtimeLimits?: string[]
  }
  docs?: {
    sections?: BrandGuideDocsSection[]
  }
  ui?: Record<string, unknown>
}

export type BrandTheme = {
  name: string
  label: string
  description?: string
  cssVariables?: BrandCssVariables
  typography?: BrandTypography
  ui?: BrandThemeUi
}

export type ThemeMode = 'light' | 'dark'

export type ThemeCssOptions = {
  lightSelector?: string
  darkSelector?: string
  includeTypography?: boolean
}

export type BrandThemeStyleTarget = {
  style: {
    setProperty: (name: string, value: string) => void
    removeProperty: (name: string) => void
  }
}

export type ApplyBrandThemeOptions = {
  target?: BrandThemeStyleTarget | null
  mode?: ThemeMode
  updateAppConfig?: (config: NuxtUiAppConfig) => void
}

export type NuxtUiAppConfig = {
  ui: NonNullable<AppConfigInput['ui']>
}

export type BrandRuntimeOnlyConfig = {
  name?: string
  theme?: BrandTheme
  defaultTheme?: string
  themes?: BrandTheme[]
  assets?: BrandAssets
}

export type BrandGuideConfig = {
  guide?: BrandGuide
}

export type BrandGuideAppConfig = BrandRuntimeOnlyConfig & BrandGuideConfig

/** Backward-compatible combined app-config name. */
export type BrandRuntimeConfig = BrandGuideAppConfig

export type BrandModuleOptions = BrandGuideAppConfig & {
  componentPrefix?: string
}
