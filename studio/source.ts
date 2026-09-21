import { createHash, randomUUID } from 'node:crypto'
import { lstat, readFile, realpath, rename, unlink, writeFile } from 'node:fs/promises'
import { dirname, basename, join } from 'node:path'
import { diffStudioDocuments, parseStudioDocument, studioDocumentMaxBytes } from '@happydesigns/id/studio/core'

export class StudioSourceConflict extends Error {}

/** A single host-selected JSON source; browser input never selects a path. */
export async function readStudioSource(path: string) {
  const stat = await lstat(path)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > studioDocumentMaxBytes) throw new Error('Choose a regular brand JSON source smaller than 8 MB.')
  const content = await readFile(path, 'utf8')
  return { document: parseStudioDocument(content), revision: createHash('sha256').update(content).digest('hex') }
}

const writes = new Map<string, Promise<unknown>>()
export async function writeStudioSource(path: string, revision: string, input: unknown) {
  const document = parseStudioDocument(input)
  const content = `${JSON.stringify(document, null, 2)}\n`
  if (Buffer.byteLength(content, 'utf8') > studioDocumentMaxBytes) throw new Error('The brand source must be smaller than 8 MB.')
  const key = await realpath(path)
  const previous = writes.get(key) ?? Promise.resolve()
  const result = previous.catch(() => {}).then(async () => {
    const current = await readStudioSource(path)
    if (current.revision !== revision) throw new StudioSourceConflict('The source changed outside Studio. Reload the project before applying your draft.')
    if (!diffStudioDocuments(current.document, document).length) return { ...current, changed: false }
    const temporary = join(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`)
    try {
      await writeFile(temporary, content, { encoding: 'utf8', flag: 'wx' })
      if ((await readStudioSource(path)).revision !== revision) throw new StudioSourceConflict('The source changed while saving. Your draft has not replaced it.')
      await rename(temporary, path)
      return { ...await readStudioSource(path), changed: true }
    }
    finally {
      await unlink(temporary).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error
      })
    }
  })
  writes.set(key, result)
  try {
    return await result
  }
  finally {
    if (writes.get(key) === result) writes.delete(key)
  }
}
