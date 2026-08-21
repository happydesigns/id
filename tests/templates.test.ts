import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

function readTemplateFile(template: string, file: string) {
  return readFileSync(join(rootDir, 'templates', template, file), 'utf8')
}

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(rootDir, file), 'utf8')) as T
}

function expectTemplateFile(template: string, file: string) {
  expect(statSync(join(rootDir, 'templates', template, file)).isFile()).toBe(true)
}

type PackageJson = {
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

describe('starter templates', () => {
  it('keeps the package nuxt export on the consumer-safe layer config', () => {
    const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')) as {
      exports: Record<string, unknown>
      files: string[]
    }

    expect(packageJson.exports['./nuxt']).toBe('./nuxt.layer.config.mjs')
    expect(packageJson.exports['./guide']).toBe('./guide/nuxt.config.mjs')
    expect(packageJson.exports['./themes/sample-brand']).toBeTruthy()
    expect(packageJson.exports['./themes/sample-brand/tokens.css']).toBe('./dist/themes/sample-brand/tokens.css')
    expect(packageJson.exports['./adapters/nuxt-ui']).toBeTruthy()
    expect(packageJson.exports['./adapters/css-variables']).toBeTruthy()
    expect(packageJson.exports).not.toHaveProperty('./themes/happydesigns')
    expect(packageJson.files).toContain('nuxt.layer.config.ts')
    expect(packageJson.files).toContain('nuxt.layer.config.mjs')
    expect(packageJson.files).toContain('guide')
    expect(packageJson.files).not.toContain('templates')
    expect(packageJson.files).toContain('templates/brand-layer/app')
    expect(packageJson.files).toContain('templates/brand-layer/docs')
    expect(packageJson.files).toContain('templates/themed-app/app')
    expect(packageJson.files).not.toContain('nuxt.config.ts')
    expect(packageJson.files).not.toContain('modules')
  })

  it('keeps the module path self-contained for direct app usage', () => {
    const moduleSource = readFileSync(join(rootDir, 'module.ts'), 'utf8')

    expect(moduleSource).toContain('moduleDependencies')
    expect(moduleSource).toContain("'@nuxt/ui'")
    expect(moduleSource).not.toContain('installModule')
    expect(moduleSource).toContain('addComponentsDir')
    expect(moduleSource).toContain('addImportsDir')
  })

  it('keeps the brand-layer template shaped like an external brand repo', () => {
    expectTemplateFile('brand-layer', 'brand.ts')
    expectTemplateFile('brand-layer', 'app/app.config.ts')
    expectTemplateFile('brand-layer', 'nuxt.config.ts')
    expectTemplateFile('brand-layer', 'docs/nuxt.config.ts')
    expectTemplateFile('brand-layer', 'docs/app/app.config.ts')
    expectTemplateFile('brand-layer', 'docs/content/index.md')

    expect(existsSync(join(rootDir, 'templates/brand-layer/app/app.vue'))).toBe(false)
    expect(existsSync(join(rootDir, 'templates/brand-layer/app/pages/index.vue'))).toBe(false)
    expect(readTemplateFile('brand-layer', 'app/app.config.ts')).toContain("from '../brand'")
    expect(readTemplateFile('brand-layer', 'nuxt.config.ts')).toContain("extends: ['@happydesigns/id/nuxt']")
    expect(readTemplateFile('brand-layer', 'nuxt.config.ts')).not.toContain('docus')
    expect(readTemplateFile('brand-layer', 'docs/nuxt.config.ts')).toContain("extends: ['..', '@happydesigns/id/guide', 'docus']")
    expect(readTemplateFile('brand-layer', 'nuxt.config.ts')).toContain("prefix: 'Brand'")
    expect(readTemplateFile('brand-layer', 'docs/content/index.md')).toContain('::brand-logo')
    expect(readTemplateFile('brand-layer', 'docs/content/index.md')).toContain('rel: noopener noreferrer')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('defineBrand')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('nuxtUiAdapter.transform')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('assets: {')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('brandIdentity.assets')
    expect(readTemplateFile('brand-layer', 'brand.ts')).not.toContain('logoAssetPaths')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain("role: 'appIcon'")
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain("media: 'any'")
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain("alt: 'Example Brand'")
    expect(readTemplateFile('brand-layer', 'app/app.config.ts')).toContain('assets: brandRuntimeAssets')
    expect(readTemplateFile('brand-layer', 'app/app.config.ts')).not.toContain('guide: brandGuide')
    expect(readTemplateFile('brand-layer', 'docs/app/app.config.ts')).toContain('guide: brandGuide')
    expect(readTemplateFile('brand-layer', 'app/components/Logo.vue')).toContain('<IdLogo')
  })

  it('keeps guide-only components out of the runtime layer', () => {
    expect(readFileSync(join(rootDir, 'app', 'app.config.ts'), 'utf8')).not.toContain('idBrandGuide')

    for (const component of ['ColorModeButton.vue', 'Logo.vue', 'ThemeSelect.vue']) {
      expect(statSync(join(rootDir, 'app', 'components', component)).isFile()).toBe(true)
    }

    for (const component of ['BrandSwatch.vue', 'ComponentCoverageTable.vue', 'ComponentExample.vue', 'ExampleFrame.vue', 'LayerInstall.vue', 'NuxtUiDocsLink.vue']) {
      expect(statSync(join(rootDir, 'guide', 'components', component)).isFile()).toBe(true)
      expect(existsSync(join(rootDir, 'app', 'components', component))).toBe(false)
    }
  })

  it('keeps the themed-app template direct and Nuxt UI based', () => {
    expectTemplateFile('themed-app', 'app/app.vue')
    expectTemplateFile('themed-app', 'app/app.config.ts')
    expectTemplateFile('themed-app', 'app/pages/index.vue')
    expectTemplateFile('themed-app', 'nuxt.config.ts')

    expect(readTemplateFile('themed-app', 'app/app.vue')).toContain('<UApp>')
    expect(readTemplateFile('themed-app', 'nuxt.config.ts')).toContain("extends: ['@happydesigns/id/nuxt']")
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).toContain('<IdThemeSelect')
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).toContain('rel="noopener noreferrer"')
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).not.toContain('<UApp>')
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).not.toContain('#imports')
  })

  it('keeps starter runtime dependencies aligned with the validated workspace stack', () => {
    const rootPackage = readJson<PackageJson>('package.json')

    for (const template of ['brand-layer', 'themed-app']) {
      const templatePackage = readJson<PackageJson>(`templates/${template}/package.json`)

      expect(templatePackage.dependencies?.['@nuxt/ui']).toBe(rootPackage.dependencies?.['@nuxt/ui'])
      expect(templatePackage.dependencies?.nuxt).toBe(rootPackage.dependencies?.nuxt)
      expect(templatePackage.devDependencies?.typescript).toBe(rootPackage.devDependencies?.typescript)
      expect(templatePackage.devDependencies?.['vue-tsc']).toBe(rootPackage.devDependencies?.['vue-tsc'])
      expect(templatePackage.scripts?.typecheck).toBe('nuxt typecheck')
      expect(templatePackage.scripts?.verify).toBe(template === 'brand-layer' ? 'pnpm typecheck && pnpm build' : 'pnpm typecheck')
    }
  })
})
