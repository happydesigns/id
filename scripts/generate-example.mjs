import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStudioDocument, createStudioRuntimeFiles } from '../dist/src/studio.js'
import { brandIdentity, brandTheme } from '../templates/brand-layer/brand.ts'

const templateDir = fileURLToPath(new URL('../templates/brand-layer', import.meta.url))
const document = createStudioDocument(brandIdentity, brandTheme)
writeFileSync(join(templateDir, 'brand.studio.json'), JSON.stringify(document, null, 2) + '\n')
for (const [path, contents] of Object.entries(createStudioRuntimeFiles(document, { styles: 'fragment', config: 'fragment' }))) {
  const target = join(templateDir, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, contents)
}
