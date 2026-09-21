import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp, toWebHandler } from 'h3'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBlankStudioDocument } from '../src/studio'
import { createStudioSourceHandler } from '../studio/server/source-handler'

let directory: string
let source: string
let config: { idStudioSource?: string, idStudioWriterToken?: string }
const token = 'test-server-nonce'
const handle = toWebHandler(createApp().use(createStudioSourceHandler(() => config)))
function request(method = 'GET', headers: Record<string, string> = {}, body?: string, host = 'localhost') {
  return handle(new Request('http://' + host + '/api/id-studio/source', {
    method, headers: { host, 'x-id-studio-token': token, ...headers }, body,
  }))
}
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'id-http-test-'))
  source = join(directory, 'brand.json')
  await writeFile(source, JSON.stringify(createBlankStudioDocument()))
  config = { idStudioSource: source, idStudioWriterToken: token }
})
afterEach(async () => {
  if (!directory.startsWith(join(tmpdir(), 'id-http-test-'))) throw new Error('Unexpected fixture path')
  await rm(directory, { recursive: true, force: true })
})
describe('local Studio HTTP boundary', () => {
  it.each([
    ['missing token', { 'x-id-studio-token': '' }, 'localhost'],
    ['wrong token', { 'x-id-studio-token': 'wrong' }, 'localhost'],
    ['foreign origin', { origin: 'https://example.com' }, 'localhost'],
    ['foreign host', {}, 'example.com'],
  ])('rejects %s without modifying source', async (_name, headers, host) => {
    const before = await readFile(source)
    expect((await request('GET', headers, undefined, host)).status).toBe(403)
    expect(await readFile(source)).toEqual(before)
  })
  it('requires an enabled writer and a configured source', async () => {
    config.idStudioWriterToken = undefined
    expect((await request()).status).toBe(403)
    config = { idStudioWriterToken: token }
    expect((await request()).status).toBe(404)
  })
  it('rejects unsupported methods and malformed JSON requests', async () => {
    expect((await request('DELETE')).status).toBe(405)
    expect((await request('POST', {}, '{}')).status).toBe(400)
    expect((await request('POST', { 'content-type': 'application/json', 'content-length': '8000001' }, '{}')).status).toBe(400)
    expect((await request('POST', { 'content-type': 'application/json', 'content-length': '2' }, '{}')).status).toBe(400)
    expect((await request('POST', { 'content-type': 'application/json', 'content-length': '1' }, '{')).status).toBe(400)
  })
  it('reads and saves valid JSON, then rejects a stale revision', async () => {
    const response = await request('GET', { origin: 'http://localhost' })
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.source).toBe('brand.json')
    expect(JSON.stringify(data)).not.toContain(directory)
    data.document.theme.label = 'Edited via HTTP'
    const body = JSON.stringify({ revision: data.revision, document: data.document })
    const headers = { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(body)), 'origin': 'http://localhost' }
    expect((await request('POST', headers, body)).status).toBe(200)
    expect(JSON.parse(await readFile(source, 'utf8')).theme.label).toBe('Edited via HTTP')
    expect((await request('POST', headers, body)).status).toBe(409)
  })
})
