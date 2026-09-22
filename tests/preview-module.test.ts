import { expect, it, vi } from 'vitest'
import { studioTemplates, studioOrigin, studioFrameUrl, acceptsStudioFrame, withinStudioRoute } from '../studio/templates'

const addPlugin = vi.hoisted(() => vi.fn())
vi.mock('@nuxt/kit', () => ({ addPlugin, createResolver: () => ({ resolve: (path: string) => path }), defineNuxtModule: (options: unknown) => options }))
const { default: module } = await import('../preview-module')
const setup = (module as unknown as { setup: (options: unknown, nuxt: unknown) => void }).setup

it('registers only the preview plugin in development and nothing in production', () => {
  const options = { studioOrigin: 'http://localhost:3000', id: 'shop', routePrefix: '/shop' }
  const production = { options: { dev: false, runtimeConfig: { public: {} } } }
  setup(options, production)
  expect(addPlugin).not.toHaveBeenCalled()
  expect(production.options.runtimeConfig.public).toEqual({})
  const dev = { options: { dev: true, runtimeConfig: { public: {} } } }
  setup(options, dev)
  expect(addPlugin).toHaveBeenCalledTimes(1)
  expect(dev.options.runtimeConfig.public).toHaveProperty('idStudioPreview.studioOrigin', options.studioOrigin)
})

it('requires exact origins and bounded app routes', () => {
  for (const invalid of ['*', '//localhost:3000', 'javascript:alert(1)', 'https://user:pass@example.com', 'https://example.com/path', 'https://example.com?x=1']) {
    expect(studioOrigin(invalid)).toBeUndefined()
    expect(() => setup({ studioOrigin: invalid, id: 'shop' }, { options: { dev: true } })).toThrow()
    expect(studioTemplates({ shop: { label: 'Shop', origin: invalid, route: '/', routePrefix: '/' } })).toHaveLength(1)
  }
  expect(withinStudioRoute('/products', '/')).toBe(true)
  expect(withinStudioRoute('/shop/details', '/shop/')).toBe(true)
  expect(withinStudioRoute('/api/private', '/')).toBe(false)
  expect(withinStudioRoute('/shop-other', '/shop')).toBe(false)
})

it('binds frame messages to their configured origin, window and session', () => {
  const template = studioTemplates({ shop: { label: 'Shop', origin: 'http://localhost:3444', route: '/shop', routePrefix: '/shop' } })[1]!
  const src = studioFrameUrl(template, 'draft', 'http://localhost:3000', 'session')
  const source = {} as Window
  const frame = { src, contentWindow: source } as HTMLIFrameElement
  const event = { source, origin: template.origin, data: { session: 'session' } } as MessageEvent
  expect(acceptsStudioFrame(event, frame)).toBe(true)
  expect(acceptsStudioFrame({ ...event, origin: 'http://localhost:9999' } as MessageEvent, frame)).toBe(false)
  expect(acceptsStudioFrame({ ...event, source: {} } as MessageEvent, frame)).toBe(false)
  expect(acceptsStudioFrame({ ...event, data: { session: 'old' } } as MessageEvent, frame)).toBe(false)
})
