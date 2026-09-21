#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { gunzipSync } from 'node:zlib'
import { parseArgs } from 'node:util'

// Only copy an explicitly selected reviewed archive. Never search sibling repositories.
const { values } = parseArgs({ options: {
  'source': { type: 'string' },
  'public-dir': { type: 'string' },
  'sha256': { type: 'string' },
} })
if (!values.source || !values['public-dir']) throw new Error('Usage: id-studio-package --source vendor/id.tgz --public-dir docs/public [--sha256 <expected hash>]')
const bytes = await readFile(resolve(values.source))
if (bytes.length > 20_000_000) throw new Error('Archive exceeds 20 MB')
const sha256 = createHash('sha256').update(bytes).digest('hex')
if (values.sha256 && sha256 !== values.sha256.toLowerCase()) throw new Error('Archive SHA-256 does not match the reviewed package')
const tar = gunzipSync(bytes, { maxOutputLength: 100_000_000 })
let manifest
for (let offset = 0; offset + 512 <= tar.length;) {
  const header = tar.subarray(offset, offset + 512)
  const name = header.subarray(0, 100).toString().replace(/\0.*$/s, '')
  if (!name) break
  const size = Number.parseInt(header.subarray(124, 136).toString().replace(/\0.*$/s, '').trim(), 8)
  if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > tar.length) throw new Error('Invalid package archive')
  if (name === 'package/package.json') manifest = JSON.parse(tar.subarray(offset + 512, offset + 512 + size).toString())
  offset += 512 + Math.ceil(size / 512) * 512
}
if (manifest?.name !== '@happydesigns/id' || !/^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][a-zA-Z0-9.-]+)?$/.test(manifest.version)) throw new Error('Expected a versioned @happydesigns/id archive')
const filename = `id-${manifest.version}-${sha256.slice(0, 12)}.tgz`
const directory = join(resolve(values['public-dir']), 'studio-packages')
await mkdir(directory, { recursive: true })
await writeFile(join(directory, filename), bytes)
console.log(JSON.stringify({ packageAsset: `/studio-packages/${filename}`, version: manifest.version, sha256 }))
