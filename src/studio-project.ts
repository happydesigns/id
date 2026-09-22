import { projectTemplates } from './project-templates.generated.js'
import { parseStudioDocument } from './studio-document.js'
import type { StudioDocument } from './studio-document.js'
import { createStudioCss, createStudioRuntimeFiles } from './studio-generation.js'

export type StudioProjectOptions = { bundledPackage?: boolean, legacyRuntime?: boolean, guide?: boolean }

/** Assemble bundled starter files; only brand data and explicit options vary. */
export function createStudioProject(input: StudioDocument, options: StudioProjectOptions = {}): Record<string, string> {
  const doc = parseStudioDocument(input)
  const legacy = !!options.legacyRuntime
  const guide = !legacy && !!options.guide
  const files: Record<string, string> = { ...projectTemplates[legacy ? 'legacy' : 'native'] }
  const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
  const manifest = JSON.parse(files['package.json']!)
  if (guide) {
    const { 'package.json': dependencies, ...guideFiles } = projectTemplates.guide
    Object.assign(files, guideFiles)
    Object.assign(manifest.devDependencies, JSON.parse(dependencies!).devDependencies)
    // Docus supplies the host app; the minimal Studio host supplies its own UApp.
    delete files['playground/app/app.vue']
    delete files['playground/app/pages/index.vue']
  }
  manifest.name = doc.brand.packageName || doc.brand.name
  const dependencies = legacy ? manifest.dependencies : manifest.devDependencies
  if (options.bundledPackage) dependencies['@happydesigns/id'] = 'file:./vendor/id.tgz'
  files['package.json'] = json(manifest)
  files['brand.studio.json'] = json(doc)
  if (legacy) {
    files['app/assets/css/brand.css'] = [
      '/* Regenerated from brand.studio.json when Nuxt starts. */',
      '@import "tailwindcss";', '@import "@nuxt/ui";',
      '@source "../../../brand.studio.json";', createStudioCss(doc), '',
    ].join('\n')
  }
  else Object.assign(files, createStudioRuntimeFiles(doc, { styles: 'fragment', config: 'fragment' }))
  const text: Record<string, string> = {
    brandName: doc.theme.label,
    packageName: manifest.name,
    packageNote: options.bundledPackage
      ? 'The reviewed id development package is bundled in vendor/id.tgz.'
      : 'Install the reviewed id package as the development dependency.',
  }
  for (const path of Object.keys(files)) {
    if (path.endsWith('.md')) files[path] = files[path]!.replace(/\{\{(brandName|packageName|packageNote)\}\}/g, (_, key: string) => text[key]!)
  }
  return files
}
