export type BrandColorShade =
  | 50
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

export type BrandColorScale = Partial<Record<BrandColorShade, string>>

export type BrandPalette = Record<string, string | BrandColorScale>

export type NuxtUiColorRole =
  | 'primary'
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

export type BrandTypography = {
  sans?: string
  mono?: string
  display?: string
}

export type BrandAsset = {
  name: string
  src: string
  role: string
  media?: 'light' | 'dark' | 'any'
  alt?: string
}

export type BrandLogoRole =
  | 'logo'
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

export type BrandGuide = {
  name: string
  packageName?: string
  title: string
  description: string
  homepage?: string
  repository?: string
  assets?: {
    logos?: BrandLogoSet
    files?: BrandAsset[]
  }
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
    sections?: {
      title: string
      description: string
      to: string
    }[]
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
  updateAppConfig?: (config: Record<string, unknown>) => void
}

export type BrandRuntimeConfig = {
  name?: string
  theme?: BrandTheme
  defaultTheme?: string
  themes?: BrandTheme[]
  guide?: BrandGuide
}

export type BrandModuleOptions = BrandRuntimeConfig & {
  componentPrefix?: string
}
