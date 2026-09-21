import { addComponentsDir, addImportsDir, addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { BrandGuideAppConfig, BrandModuleOptions } from './src'

export type ModuleOptions = BrandModuleOptions

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@happydesigns/id',
    configKey: 'id',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  moduleDependencies: {
    '@nuxt/ui': {
      version: '^4.0.0',
    },
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const { componentPrefix = 'Id', ...runtimeOptions } = options
    const existing = (nuxt.options.appConfig.id ?? {}) as BrandGuideAppConfig
    nuxt.options.appConfig.id = {
      ...runtimeOptions,
      ...existing,
      name: existing.name ?? runtimeOptions.name,
      theme: existing.theme ?? runtimeOptions.theme,
      defaultTheme: existing.defaultTheme ?? runtimeOptions.defaultTheme,
      themes: existing.themes ?? runtimeOptions.themes,
      assets: existing.assets ?? runtimeOptions.assets,
      guide: existing.guide ?? runtimeOptions.guide,
    }
    nuxt.options.css.push(resolver.resolve('./app/assets/css/id.css'))
    addPlugin(resolver.resolve('./app/plugins/brand-theme'))
    addImportsDir(resolver.resolve('./app/composables'))
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      pathPrefix: false,
      prefix: componentPrefix,
    })
    addTypeTemplate({
      filename: 'types/id-app-config.d.ts',
      getContents: () => [
        'import type { BrandGuideAppConfig } from \'@happydesigns/id\'',
        '',
        'declare module \'nuxt/schema\' {',
        '  interface AppConfigInput {',
        '    id?: BrandGuideAppConfig',
        '  }',
        '',
        '  interface AppConfig {',
        '    id?: BrandGuideAppConfig',
        '  }',
        '}',
        '',
        'export {}',
      ].join('\n'),
    })
  },
})
