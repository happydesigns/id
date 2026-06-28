import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function getPublicValueExports() {
  const indexSource = readFileSync('src/index.ts', 'utf8')
  const exports = new Set<string>()

  for (const match of indexSource.matchAll(/export\s+\{([\s\S]*?)\}\s+from/g)) {
    const exportBlock = match[1]

    if (!exportBlock) {
      continue
    }

    for (const rawEntry of exportBlock.split(',')) {
      const entry = rawEntry.trim()

      if (!entry) {
        continue
      }

      const [exportName] = entry.split(/\s+as\s+/).reverse()

      if (exportName) {
        exports.add(exportName)
      }
    }
  }

  return [...exports].sort()
}

describe('api docs', () => {
  it('documents every root value export in the public reference page', () => {
    const apiReference = readFileSync('docs/content/4.reference/1.api.md', 'utf8')
    const missingExports = getPublicValueExports()
      .filter(exportName => !apiReference.includes(`\`${exportName}\``))

    expect(missingExports).toEqual([])
  })
})
