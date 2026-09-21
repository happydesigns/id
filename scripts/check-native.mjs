import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const archive = resolve(process.argv[2] || '.output/studio-package/id.tgz')
const workspace = mkdtempSync(join(tmpdir(), 'id-native-consumer-'))
console.log('Isolated package check:', workspace)
function write(directory, path, content) {
  const target = join(directory, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}
function run(command, args, cwd) {
  // Invoke the standard Node-distribution npm CLI directly on Windows; no shell.
  const windowsNpm = process.platform === 'win32' && command === 'npm'
  const executable = windowsNpm ? process.execPath : command
  const parameters = windowsNpm ? [join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'), ...args] : args
  const result = spawnSync(executable, parameters, { cwd, stdio: 'inherit', env: { ...process.env, CI: 'true' } })
  if (result.error) throw result.error
  assert.equal(result.status, 0, command + ' ' + args.join(' '))
}
const author = join(workspace, 'author')
write(author, 'package.json', JSON.stringify({ private: true, type: 'module', dependencies: { '@happydesigns/id': 'file:' + archive.replaceAll('\\', '/') } }))
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], author)
write(author, 'generate.mjs', `
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createBlankStudioDocument, createStudioProject } from '@happydesigns/id/studio/core'
const doc = createBlankStudioDocument()
doc.brand.name = 'integration-brand'
doc.brand.packageName = '@id-test/brand'
doc.theme.label = 'Integration brand'
doc.theme.ui.colors.primary = 'violet'
for (const [path, value] of Object.entries(createStudioProject(doc))) {
  const target = resolve('../brand', path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, value)
}
`)
run(process.execPath, ['generate.mjs'], author)
const brand = join(workspace, 'brand')
const projectManifest = JSON.parse(readFileSync(join(brand, 'package.json'), 'utf8'))
projectManifest.version = '0.0.0'
write(brand, 'package.json', JSON.stringify(projectManifest))
run('npm', ['pack', '--ignore-scripts'], brand)
const manifest = JSON.parse(readFileSync(join(brand, 'package.json'), 'utf8'))
assert.equal(manifest.dependencies['@happydesigns/id'], undefined)
const consumer = join(workspace, 'consumer')
write(consumer, 'package.json', JSON.stringify({ private: true, type: 'module', dependencies: {
  '@id-test/brand': 'file:../brand/id-test-brand-0.0.0.tgz',
  nuxt: manifest.devDependencies.nuxt
} }))
// The test gives the generated private project a fixture release version.
write(consumer, 'nuxt.config.ts', `export default defineNuxtConfig({
  extends: ['@id-test/brand'], css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-08-01', ui: { fonts: false }
})
`)
write(consumer, 'app/assets/css/main.css', '@import "tailwindcss";\n@import "@nuxt/ui";\n@import "@id-test/brand/styles.css";\n')
write(consumer, 'app/app.vue', '<template><UApp><main><BrandLogo /><h1>Independent consumer</h1><UButton>Continue</UButton></main></UApp></template>')
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)
const lock = JSON.parse(readFileSync(join(consumer, 'package-lock.json'), 'utf8'))
for (const name of Object.keys(lock.packages)) {
  assert.ok(!/(?:^|\/)node_modules\/(?:@happydesigns\/id|docus)$/.test(name), 'Unexpected authoring runtime: ' + name)
}
run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'build'], consumer)
console.log('PASS: packed ID generated a packed native brand; a fresh consumer built without ID or Docus.')
console.log('Fixture retained for diagnosis:', workspace)
