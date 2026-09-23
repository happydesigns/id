import { studioDocumentMaxBytes } from '@happydesigns/id/studio/core'
import { createError, defineEventHandler, getHeader, getMethod, getRequestURL, readBody } from 'h3'
import type { H3Event } from 'h3'
import { basename } from 'node:path'
import { readStudioSource, StudioSourceConflict, writeStudioSource } from '../source'

type SourceConfig = { idStudioSource?: unknown, idStudioWriterToken?: unknown }

export function createStudioSourceHandler(getConfig: (event: H3Event) => SourceConfig) {
  return defineEventHandler(async (event) => {
    const config = getConfig(event)
    const url = getRequestURL(event)
    const origin = getHeader(event, 'origin')
    if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || (origin && origin !== url.origin) || !config.idStudioWriterToken || getHeader(event, 'x-id-studio-token') !== config.idStudioWriterToken) throw createError({ statusCode: 403, statusMessage: 'Local Studio access required.' })
    const path = config.idStudioSource
    if (typeof path !== 'string') throw createError({ statusCode: 404, statusMessage: 'No project source is connected.' })
    try {
      if (getMethod(event) === 'GET') return { ...await readStudioSource(path), source: basename(path) }
      if (getMethod(event) !== 'POST') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
      const length = Number(getHeader(event, 'content-length'))
      if (!getHeader(event, 'content-type')?.startsWith('application/json') || !Number.isSafeInteger(length) || length <= 0 || length > studioDocumentMaxBytes) throw createError({ statusCode: 400, statusMessage: 'A brand JSON document smaller than 8 MB with a Content-Length is required.' })
      const body = await readBody(event)
      if (typeof body?.revision !== 'string') throw createError({ statusCode: 400, statusMessage: 'Source revision required.' })
      return { ...await writeStudioSource(path, body.revision, body.document), source: basename(path) }
    }
    catch (error) {
      if (error instanceof StudioSourceConflict) throw createError({ statusCode: 409, statusMessage: error.message })
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({ statusCode: 422, statusMessage: 'The brand source could not be read or written. Check its JSON and file permissions.' })
    }
  })
}
