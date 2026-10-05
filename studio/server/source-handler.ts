import { studioDocumentMaxBytes } from '@happydesigns/id/studio/core'
import { createError, defineEventHandler, isNuxtError, readBody } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'
import { basename } from 'node:path'
import { readStudioSource, StudioSourceConflict, writeStudioSource } from '../source'

type SourceConfig = { idStudioSource?: unknown, idStudioWriterToken?: unknown }

export function createStudioSourceHandler(getConfig: (event: RequestEvent) => SourceConfig) {
  return defineEventHandler(async (event) => {
    const config = getConfig(event)
    const url = event.url
    const origin = event.req.headers.get('origin')
    if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || (origin && origin !== url.origin) || !config.idStudioWriterToken || event.req.headers.get('x-id-studio-token') !== config.idStudioWriterToken) throw createError({ status: 403, statusText: 'Local Studio access required.' })
    const path = config.idStudioSource
    if (typeof path !== 'string') throw createError({ status: 404, statusText: 'No project source is connected.' })
    try {
      if (event.req.method === 'GET') return { ...await readStudioSource(path), source: basename(path) }
      if (event.req.method !== 'POST') throw createError({ status: 405, statusText: 'Method not allowed.' })
      const length = Number(event.req.headers.get('content-length'))
      if (!event.req.headers.get('content-type')?.startsWith('application/json') || !Number.isSafeInteger(length) || length <= 0 || length > studioDocumentMaxBytes) throw createError({ status: 400, statusText: 'A brand JSON document smaller than 8 MB with a Content-Length is required.' })
      const body = await readBody(event)
      if (!body || typeof body !== 'object' || !('revision' in body) || typeof body.revision !== 'string' || !('document' in body)) throw createError({ status: 400, statusText: 'Source revision required.' })
      return { ...await writeStudioSource(path, body.revision, body.document), source: basename(path) }
    }
    catch (error) {
      if (error instanceof StudioSourceConflict) throw createError({ status: 409, statusText: error.message })
      if (isNuxtError(error)) throw error
      throw createError({ status: 422, statusText: 'The brand source could not be read or written. Check its JSON and file permissions.' })
    }
  })
}
