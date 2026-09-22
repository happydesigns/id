import { mkdirSync, writeFileSync, cpSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createStudioDocument } from '../../dist/src/studio-document.js'
import { createStudioRuntimeFiles } from '../../dist/src/studio-generation.js'

// Explicit local inputs keep customer sources and capability implementations outside ID.
const [brandRoot, courseRoot, bookingRoot, editedSource] = process.argv.slice(2).map(path => resolve(path))
if (!brandRoot || !courseRoot || !bookingRoot) throw new Error('Usage: node --experimental-strip-types tests/helpers/prepare-capability-proof.mjs BRAND COURSE BOOKING')
const { brand } = await import(pathToFileURL(resolve(brandRoot, 'brand.ts')).href)
const { theme } = await import(pathToFileURL(resolve(brandRoot, 'theme.ts')).href)
const document = createStudioDocument(brand, theme)
const root = resolve('.output/capability-proof')
const write = (path, value) => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, value)
}
write(resolve(root, 'brand.json'), JSON.stringify(document, null, 2))
write(resolve(root, 'brand-ui.json'), JSON.stringify(document.theme.ui))
const documents = [['original', document]]
if (editedSource) documents.push(['edited', JSON.parse(readFileSync(editedSource, 'utf8'))])
for (const [name, doc] of documents) {
  const layer = resolve(root, name)
  for (const [path, content] of Object.entries(createStudioRuntimeFiles(doc, { styles: 'fragment' }))) write(resolve(layer, path), content)
  write(resolve(layer, 'nuxt.config.ts'), 'export default defineNuxtConfig({})\n')
  cpSync(resolve(brandRoot, 'public'), resolve(layer, 'public'), { recursive: true })
  write(resolve(root, name + '.json'), JSON.stringify(doc, null, 2))
  for (const [kind, app] of [['course', courseRoot], ['booking', bookingRoot]]) {
    const paths = [resolve(app, 'playground/app/assets/css/main.css'), resolve(brandRoot, 'app/assets/css/brand.css'), resolve(layer, 'app/assets/css/brand.css')]
    write(resolve(root, name + '-' + kind + '.css'), paths.map(path => '@import ' + JSON.stringify(path.replaceAll('\\', '/')) + ';').join('\n') + '\n')
  }
}
console.log('Prepared local brand exports and shared-application CSS in ' + root)
