import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createStudioRuntimeFiles } from '@happydesigns/id/studio/core'

const root = fileURLToPath(new URL('..', import.meta.url))

export function generateBrand() {
  const source = JSON.parse(readFileSync(resolve(root, 'brand.studio.json'), 'utf8'))
  const files = createStudioRuntimeFiles(source, { styles: 'fragment', config: 'fragment' })
  const changed = Object.entries(files).filter(([path, content]) => {
    const target = resolve(root, path)
    let previous
    try {
      previous = readFileSync(target, 'utf8')
    }
    catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    return previous !== content
  })
  for (const [path, content] of changed) {
    const target = resolve(root, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content, 'utf8')
  }
}

generateBrand()
