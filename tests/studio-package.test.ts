import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'

function archive(name: string) {
  const manifest = Buffer.from(JSON.stringify({ name, version: '0.1.0' }))
  const header = Buffer.alloc(512)
  header.write('package/package.json')
  header.write(manifest.length.toString(8).padStart(11, '0') + '\0', 124)
  return gzipSync(Buffer.concat([header, manifest, Buffer.alloc(512 - manifest.length), Buffer.alloc(1024)]))
}

describe('reviewed Studio package provisioning', () => {
  it('copies exactly the selected archive and rejects mismatched checksums and identities', () => {
    const directory = mkdtempSync(join(tmpdir(), 'id-package-test-'))
    if (!directory.startsWith(join(tmpdir(), 'id-package-test-'))) throw new Error('Unexpected fixture path')
    try {
      const source = join(directory, 'id.tgz')
      const bytes = archive('@happydesigns/id')
      writeFileSync(source, bytes)
      const checksum = createHash('sha256').update(bytes).digest('hex')
      const args = [resolve('scripts/prepare-studio-package.mjs'), '--source', source, '--public-dir', join(directory, 'public')]
      const run = (hash: string) => execFileSync(process.execPath, [...args, '--sha256', hash], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
      const result = JSON.parse(run(checksum))
      expect(result.sha256).toBe(checksum)
      expect(result.packageAsset).toBe(`/studio-packages/id-0.1.0-${checksum.slice(0, 12)}.tgz`)
      expect(readFileSync(join(directory, 'public', result.packageAsset))).toEqual(bytes)
      expect(run(checksum)).toBe(JSON.stringify(result) + '\n')
      expect(() => run('0'.repeat(64))).toThrow(/SHA-256/)
      const other = archive('@example/other')
      writeFileSync(source, other)
      expect(() => run(createHash('sha256').update(other).digest('hex'))).toThrow(/versioned @happydesigns\/id/)
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
