import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineNuxtModule } from '@nuxt/kit'

type NextFunction = (error?: unknown) => void
type Middleware = (request: IncomingMessage, response: ServerResponse, next: NextFunction) => void
type MiddlewareStack = {
  route: string
  handle: Middleware
}[]

export default defineNuxtModule({
  meta: {
    name: 'id-docus-css-dev'
  },
  setup(_options, nuxt) {
    const handler: Middleware = (request, response, next) => {
      const pathname = decodeURIComponent((request.url ?? '').split('?')[0] ?? '')

      if (!/^\/_nuxt\/[A-Za-z]:\//.test(pathname) || !pathname.endsWith('/.nuxt/docus.css')) {
        next()
        return
      }

      response.statusCode = 200
      response.setHeader('content-type', 'text/css; charset=utf-8')

      // Docus already serves the real stylesheet through Nuxt's encoded virtual URL.
      response.end('')
    }

    nuxt.hook('vite:serverCreated', (server) => {
      const stack = (server.middlewares as typeof server.middlewares & { stack?: MiddlewareStack }).stack

      if (Array.isArray(stack)) {
        stack.unshift({ route: '', handle: handler })
      } else {
        server.middlewares.use(handler)
      }
    })
  }
})
