export {
  collectBrandAssets,
  createBrandAsset,
  createBrandGuideAssets,
  createBrandLogoSet,
  defaultBrandAssetRoles,
  selectBrandAsset,
} from './assets.js'
export { defineBrandAdapter } from './adapter.js'
export type { BrandAdapter } from './adapter.js'
export { cssVariablesAdapter } from './adapters/css-variables.js'
export type { CssVariablesAdapterOptions, CssVariablesAdapterOutput } from './adapters/css-variables.js'
export { nuxtUiAdapter } from './adapters/nuxt-ui.js'
export type { NuxtUiAdapterOptions } from './adapters/nuxt-ui.js'
export type {
  BrandAssetEntry,
  BrandGuideAssetMappingOptions,
  BrandAssetSelection,
} from './assets.js'
export {
  applyCssVariables,
  createThemeCssDeclarations,
  createThemeCssVars,
} from './css.js'
export {
  componentCoverageStatuses,
  componentCoverageStatusMeta,
  normalizeComponentCoverage,
  summarizeComponentCoverage,
} from './component-coverage.js'
export type {
  ComponentCoverageStatus,
  ComponentCoverageStatusMeta,
  ComponentCoverageSummary,
} from './component-coverage.js'
export {
  componentExampleFamilies,
  componentExampleGroups,
  componentExampleNames,
  componentExampleOwnSurfaceNames,
  createComponentExampleContext,
  defineComponentExampleContext,
  getComponentExampleDefinition,
  isComponentExampleName,
} from './component-examples.js'
export type {
  ComponentExampleContext,
  ComponentExampleContextInput,
  ComponentExampleDefinition,
  ComponentExampleFamily,
  ComponentExampleFrame,
  ComponentExampleGroup,
} from './component-examples.js'
export {
  idBrandGuide,
  neutralBrandTheme,
  nuxtUiBrandTheme,
} from './defaults.js'
export { parseDocsLinks } from './docs-links.js'
export type { DocsLink } from './docs-links.js'
export {
  createLayerInstallSnippets,
  layerInstallCommands,
  layerInstallPackageManagers,
} from './layer-install.js'
export type {
  LayerInstallOptions,
  LayerInstallPackageManager,
  LayerInstallSnippets,
} from './layer-install.js'
export {
  createGuideDocsSections,
  createGuideSectionPath,
  defineGuideSections,
  findGuideSection,
  normalizeGuideSections,
} from './guide-sections.js'
export type { GuideSectionPathOptions } from './guide-sections.js'
export { createNuxtUiAppConfig } from './nuxt-ui.js'
export {
  applyBrandTheme,
  brandThemeCookiePrefix,
  brandThemeStatePrefix,
  brandThemeStyleElementId,
  createBrandThemeCookieName,
  createBrandThemeStateKey,
} from './runtime.js'
export { brandAssetsSchema, brandDefinitionSchema, brandGuideSchema, brandIdentitySchema, brandThemeSchema } from './schema.js'
export { normalizeBrandThemes, resolveBrandThemeName, resolveBrandThemes } from './themes.js'
export type {
  ApplyBrandThemeOptions,
  BrandAsset,
  BrandAssets,
  BrandColorName,
  BrandColorRoles,
  BrandColorScale,
  BrandColorShade,
  BrandComponentCoverage,
  BrandCssVariables,
  BrandDefinition,
  BrandGuideConfig,
  BrandGuideAppConfig,
  BrandGuideAssetEntry,
  BrandGuideColorEntry,
  BrandGuideComponentEntry,
  BrandGuideContent,
  BrandGuide,
  BrandGuideDocsSection,
  BrandGuideFontEntry,
  BrandGuidePrinciple,
  BrandGuideSection,
  BrandGuideSectionInput,
  BrandIdentity,
  BrandLogoRole,
  BrandLogoSet,
  BrandModuleOptions,
  BrandPalette,
  BrandRuntimeConfig,
  BrandRuntimeOnlyConfig,
  BrandSemanticColors,
  BrandTheme,
  BrandTypography,
  BrandTypographyRole,
  BrandVoice,
  NuxtUiAppConfig,
  NuxtUiColorRole,
  ThemeCssOptions,
  ThemeMode,
} from './types.js'
export {
  BrandValidationError,
  defineBrand,
  defineBrandIdentity,
  defineBrandGuide,
  defineBrandTheme,
  validateBrandIdentity,
  validateBrandDefinition,
  validateBrandGuide,
  validateBrandTheme,
} from './validation.js'
export { createBrandReference } from './guide-reference.js'

export { componentExampleMessages, resolveComponentExampleMessage } from './component-example-messages.js'
export type { ComponentExampleMessages, ComponentExampleMessageKey } from './component-example-messages.js'
export { resolveComponentCoverageStatus } from './component-coverage.js'
export type { ComponentCoverageLabels } from './component-coverage.js'

export type { StudioHostConfig } from './studio-host.js'
