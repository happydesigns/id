import { addComponentsDir, addImportsDir, addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { BrandRuntimeConfig } from './src'

export type ModuleOptions = BrandRuntimeConfig

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@happydesigns/id',
    configKey: 'id',
    compatibility: {
      nuxt: '>=4.0.0'
    }
  },
  defaults: {
    defaultTheme: undefined,
    themes: []
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const existing = (nuxt.options.appConfig.id ?? {}) as BrandRuntimeConfig

    nuxt.options.appConfig.id = {
      ...options,
      ...existing,
      defaultTheme: existing.defaultTheme ?? options.defaultTheme,
      themes: existing.themes ?? options.themes,
      guide: existing.guide ?? options.guide
    }

    nuxt.options.css.push(resolver.resolve('./app/assets/css/id.css'))

    addPlugin(resolver.resolve('./app/plugins/brand-theme'))
    addImportsDir(resolver.resolve('./app/composables'))
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      pathPrefix: false,
      prefix: 'Id'
    })

    addTypeTemplate({
      filename: 'types/happydesigns-id.d.ts',
      getContents: () => [
        'import type { BrandRuntimeConfig } from \'@happydesigns/id\'',
        '',
        'declare module \'nuxt/schema\' {',
        '  interface AppConfigInput {',
        '    id?: BrandRuntimeConfig',
        '  }',
        '',
        '  interface AppConfig {',
        '    id?: BrandRuntimeConfig',
        '  }',
        '}',
        '',
        'export {}'
      ].join('\n')
    })
  }
})
