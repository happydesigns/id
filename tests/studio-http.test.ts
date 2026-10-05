import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBlankStudioDocument } from '../src/studio'
import { createStudioSourceHandler } from '../studio/server/source-handler'

let directory: string
let source: string
let config: { idStudioSource?: string, idStudioWriterToken?: string }
const token = 'test-server-nonce'
const handle = createStudioSourceHandler(() => config)
function request(method = 'GET', headers: Record<string, string> = {}, body?: string, host = 'localhost') {
  const req = new Request('http://' + host + '/api/id-studio/source', {
    method, headers: { host, 'x-id-studio-token': token, ...headers }, body,
  })
  return handle({ req, url: new URL(req.url), res: { headers: new Headers() }, context: {} })
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
    await expect(request('GET', headers, undefined, host)).rejects.toMatchObject({ status: 403 })
    expect(await readFile(source)).toEqual(before)
  })
  it('requires an enabled writer and a configured source', async () => {
    config.idStudioWriterToken = undefined
    await expect(request()).rejects.toMatchObject({ status: 403 })
    config = { idStudioWriterToken: token }
    await expect(request()).rejects.toMatchObject({ status: 404 })
  })
  it('rejects unsupported methods and malformed JSON requests', async () => {
    await expect(request('DELETE')).rejects.toMatchObject({ status: 405 })
    await expect(request('POST', {}, '{}')).rejects.toMatchObject({ status: 400 })
    await expect(request('POST', { 'content-type': 'application/json', 'content-length': '8000001' }, '{}')).rejects.toMatchObject({ status: 400 })
    await expect(request('POST', { 'content-type': 'application/json', 'content-length': '2' }, '{}')).rejects.toMatchObject({ status: 400 })
    await expect(request('POST', { 'content-type': 'application/json', 'content-length': '1' }, '{')).rejects.toMatchObject({ status: 400 })
  })
  it('reads and saves valid JSON, then rejects a stale revision', async () => {
    const data = await request('GET', { origin: 'http://localhost' })
    expect(data.source).toBe('brand.json')
    expect(JSON.stringify(data)).not.toContain(directory)
    data.document.theme.label = 'Edited via HTTP'
    const body = JSON.stringify({ revision: data.revision, document: data.document })
    const headers = { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(body)), 'origin': 'http://localhost' }
    await expect(request('POST', headers, body)).resolves.toMatchObject({ source: 'brand.json' })
    expect(JSON.parse(await readFile(source, 'utf8')).theme.label).toBe('Edited via HTTP')
    await expect(request('POST', headers, body)).rejects.toMatchObject({ status: 409 })
  })
})
