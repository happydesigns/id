import { beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ addPlugin: vi.fn(), extendPages: vi.fn(), addCustomTab: vi.fn() }))
vi.mock('@nuxt/kit', () => ({ ...mocks, createResolver: () => ({ resolve: (path: string) => path }), defineNuxtModule: (definition: unknown) => definition }))
vi.mock('@nuxt/devtools-kit', () => ({ addCustomTab: mocks.addCustomTab }))
const { default: module } = await import('../devtools-module')
const setup = (module as unknown as { setup: (options: unknown, nuxt: unknown) => void }).setup
beforeEach(() => vi.clearAllMocks())
it('adds nothing to production or explicitly disabled DevTools', () => {
  for (const options of [{ dev: false }, { dev: true, devtools: false }, { dev: true, devtools: { enabled: false } }]) setup({}, { options })
  expect(mocks.addPlugin).not.toHaveBeenCalled()
  expect(mocks.extendPages).not.toHaveBeenCalled()
  expect(mocks.addCustomTab).not.toHaveBeenCalled()
})
it('registers the editor and host connection under the configured application base URL', () => {
  const nuxt = { options: { dev: true, devtools: true, css: [], app: { baseURL: '/portal/' }, runtimeConfig: { public: {} } } }
  setup({}, nuxt)
  expect(mocks.addCustomTab).toHaveBeenCalledWith(expect.objectContaining({ view: { type: 'iframe', src: '/portal/__id/theme' } }), nuxt)
  const pages: unknown[] = []
  mocks.extendPages.mock.calls[0]![0](pages)
  expect(pages).toEqual([expect.objectContaining({ path: '/__id/theme' })])
  expect(mocks.addPlugin).toHaveBeenCalledTimes(1)
})
