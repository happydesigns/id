import { addComponentsDir, addImportsDir, addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import type { BrandModuleOptions, BrandRuntimeConfig } from './src'

export type ModuleOptions = BrandModuleOptions

type RuntimeMdcOptions = {
  highlight?: {
    noApiRoute?: boolean
  }
}

function applyRuntimeCompatibility(nuxt: Nuxt) {
  const options = nuxt.options as Nuxt['options'] & {
    mdc?: RuntimeMdcOptions
  }

  options.mdc = {
    ...options.mdc,
    highlight: {
      ...options.mdc?.highlight,
      noApiRoute: false
    }
  }

  options.vite.optimizeDeps ??= {}
  options.vite.optimizeDeps.include ??= []
}

function applyDocusTemplateCompatibility(nuxt: Nuxt) {
  nuxt.hook('modules:done', () => {
    const template = nuxt.options.build.templates.find((candidate) => {
      return candidate.filename === 'docus.css'
    })

    if (template) {
      template.write = true
    }
  })
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@happydesigns/id',
    configKey: 'id',
    compatibility: {
      nuxt: '>=4.0.0'
    }
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const { componentPrefix = 'Id', ...runtimeOptions } = options
    const existing = (nuxt.options.appConfig.id ?? {}) as BrandRuntimeConfig

    applyRuntimeCompatibility(nuxt)
    applyDocusTemplateCompatibility(nuxt)

    nuxt.options.appConfig.id = {
      ...runtimeOptions,
      ...existing,
      name: existing.name ?? runtimeOptions.name,
      theme: existing.theme ?? runtimeOptions.theme,
      defaultTheme: existing.defaultTheme ?? runtimeOptions.defaultTheme,
      themes: existing.themes ?? runtimeOptions.themes,
      guide: existing.guide ?? runtimeOptions.guide
    }

    nuxt.options.css.push(resolver.resolve('./app/assets/css/id.css'))

    addPlugin(resolver.resolve('./app/plugins/brand-theme'))
    addImportsDir(resolver.resolve('./app/composables'))
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      pathPrefix: false,
      prefix: componentPrefix
    })

    addTypeTemplate({
      filename: 'types/id-app-config.d.ts',
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
