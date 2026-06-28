import { readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

function readTemplateFile(template: string, file: string) {
  return readFileSync(join(rootDir, 'templates', template, file), 'utf8')
}

function expectTemplateFile(template: string, file: string) {
  expect(statSync(join(rootDir, 'templates', template, file)).isFile()).toBe(true)
}

describe('starter templates', () => {
  it('keeps the package nuxt export on the consumer-safe layer config', () => {
    const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')) as {
      exports: Record<string, unknown>
      files: string[]
    }

    expect(packageJson.exports['./nuxt']).toBe('./nuxt.layer.config.mjs')
    expect(packageJson.files).toContain('nuxt.layer.config.ts')
    expect(packageJson.files).toContain('nuxt.layer.config.mjs')
    expect(packageJson.files).not.toContain('templates')
    expect(packageJson.files).toContain('templates/brand-layer/app')
    expect(packageJson.files).toContain('templates/themed-app/app')
    expect(packageJson.files).not.toContain('nuxt.config.ts')
    expect(packageJson.files).not.toContain('modules')
  })

  it('keeps the brand-layer template shaped like an external brand repo', () => {
    expectTemplateFile('brand-layer', 'app/app.vue')
    expectTemplateFile('brand-layer', 'brand.ts')
    expectTemplateFile('brand-layer', 'app/app.config.ts')
    expectTemplateFile('brand-layer', 'nuxt.config.ts')

    expect(readTemplateFile('brand-layer', 'app/app.vue')).toContain('<UApp>')
    expect(readTemplateFile('brand-layer', 'app/app.config.ts')).toContain("from '../brand'")
    expect(readTemplateFile('brand-layer', 'nuxt.config.ts')).toContain("extends: ['@happydesigns/id/nuxt']")
    expect(readTemplateFile('brand-layer', 'nuxt.config.ts')).toContain("prefix: 'Brand'")
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('createBrandGuideAssets')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('defineBrandIdentity')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('brandIdentity.logoAssetPaths.logo')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain('const brandAssets')
    expect(readTemplateFile('brand-layer', 'brand.ts')).toContain("role: 'appIcon'")
  })

  it('keeps the themed-app template direct and Nuxt UI based', () => {
    expectTemplateFile('themed-app', 'app/app.vue')
    expectTemplateFile('themed-app', 'app/app.config.ts')
    expectTemplateFile('themed-app', 'app/pages/index.vue')
    expectTemplateFile('themed-app', 'nuxt.config.ts')

    expect(readTemplateFile('themed-app', 'app/app.vue')).toContain('<UApp>')
    expect(readTemplateFile('themed-app', 'nuxt.config.ts')).toContain("extends: ['@happydesigns/id/nuxt']")
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).toContain('<IdThemeSelect')
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).not.toContain('<UApp>')
    expect(readTemplateFile('themed-app', 'app/pages/index.vue')).not.toContain('#imports')
  })
})
