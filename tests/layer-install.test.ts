import { describe, expect, it } from 'vitest'
import { createLayerInstallSnippets } from '../src'

describe('layer install snippets', () => {
  it('creates pnpm install and layer extension snippets by default', () => {
    expect(createLayerInstallSnippets({ packageName: ' @client/brand ' })).toEqual({
      packageName: '@client/brand',
      layer: '@client/brand',
      packageManager: 'pnpm',
      installCommand: 'pnpm add @client/brand',
      nuxtConfig: `export default defineNuxtConfig({
  extends: ['@client/brand']
})`
    })
  })

  it('supports a different published package and layer export', () => {
    expect(createLayerInstallSnippets({
      packageName: '@client/brand',
      layer: '@client/brand/nuxt',
      packageManager: 'npm'
    })).toMatchObject({
      packageName: '@client/brand',
      layer: '@client/brand/nuxt',
      packageManager: 'npm',
      installCommand: 'npm install @client/brand'
    })
  })
})
