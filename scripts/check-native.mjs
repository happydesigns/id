import assert from 'node:assert/strict'
import { cpSync, existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const documents = resolve('.output/workflow')
for (const brand of ['violet', 'amber']) assert.ok(existsSync(join(documents, brand + '.json')), 'Run pnpm test:authoring before check:native')
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
for (const directory of ['app', 'guide', 'studio', 'src', 'themes', 'dist']) {
  for (const file of readdirSync(join(author, 'node_modules/@happydesigns/id', directory), { recursive: true })) {
    assert.ok(!String(file).split(/[\\/]/).some(part => ['.nuxt', '.output', '.tmp', '.agents', 'node_modules'].includes(part)), 'Generated file in package: ' + file)
  }
}
assert.ok(!existsSync(join(author, 'node_modules/@happydesigns/id/templates')), 'Workspace examples must not ship')
const manifest = JSON.parse(readFileSync(join(author, 'node_modules/@happydesigns/id/package.json'), 'utf8'))
for (const group of ['dependencies', 'devDependencies', 'peerDependencies']) {
  for (const version of Object.values(manifest[group] ?? {})) {
    assert.ok(!/^(catalog|workspace):/.test(version), 'Unresolved dependency in packed manifest: ' + version)
  }
}
for (const entry of Object.values(manifest.exports)) {
  for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) {
    assert.ok(existsSync(join(author, 'node_modules/@happydesigns/id', target)), 'Missing package export: ' + target)
  }
}
const entrypoints = Object.entries(manifest.exports).filter(([, entry]) => typeof entry !== 'string' || !entry.endsWith('.css')).map(([key]) => '@happydesigns/id' + (key === '.' ? '' : key.slice(1)))
write(author, 'imports.mjs', 'for (const entry of ' + JSON.stringify(entrypoints) + ') await import(entry, entry.endsWith("/package.json") ? { with: { type: "json" } } : {})')
run(process.execPath, ['imports.mjs'], author)
write(author, 'generate.mjs', `
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createBlankStudioDocument, createStudioProject } from '@happydesigns/id/studio/core'
for (const name of ['violet', 'amber', 'guide']) {
  const doc = name === 'guide' ? createBlankStudioDocument() : JSON.parse(readFileSync(resolve(${JSON.stringify(documents)}, name + '.json'), 'utf8'))
  if (name === 'guide') {
    doc.brand.name = name
    doc.brand.packageName = '@id-test/brand'
    doc.theme.label = name
  }
  const files = createStudioProject(doc, { guide: name === 'guide' })
  for (const [path, value] of Object.entries(files)) {
    const target = resolve('../' + name, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, value)
  }
}
`)
run(process.execPath, ['generate.mjs'], author)
for (const name of ['violet', 'amber']) {
  const brand = join(workspace, name)
  const manifest = JSON.parse(readFileSync(join(brand, 'package.json'), 'utf8'))
  manifest.version = '0.0.0'
  manifest.devDependencies['@happydesigns/id'] = 'file:' + archive.replaceAll('\\', '/')
  write(brand, 'package.json', JSON.stringify(manifest))
  write(brand, 'app/app.config.ts', readFileSync(join(brand, 'app/app.config.ts'), 'utf8').replace('defineAppConfig(brand)', 'defineAppConfig({ ...brand, appTitle: \'Custom application\' })'))
  assert.equal(manifest.dependencies['@happydesigns/id'], undefined)
  assert.equal(manifest.devDependencies.docus, undefined)
  run('npm', ['pack', '--ignore-scripts'], brand)
  for (const kind of ['catalog', 'dashboard']) {
    const outputName = name + (kind === 'dashboard' ? '-dashboard' : '')
    const consumer = join(workspace, 'consumer-' + outputName)
    write(consumer, 'package.json', JSON.stringify({ private: true, type: 'module', dependencies: {
      '@id-test/brand': 'file:../' + name + '/id-test-brand-0.0.0.tgz', 'nuxt': manifest.devDependencies.nuxt,
    } }))
    write(consumer, 'nuxt.config.ts', `export default defineNuxtConfig({ extends: ['@id-test/brand'], css: ['~/main.css'], compatibilityDate: '2026-08-01', ui: { fonts: false }, colorMode: { preference: 'light' } })`)
    cpSync(resolve('tests/fixtures', kind === 'catalog' ? 'preview' : 'dashboard', 'app'), join(consumer, 'app'), { recursive: true })
    const css = readFileSync(join(consumer, 'app/main.css'), 'utf8')
    write(consumer, 'app/main.css', css + '\n@import "@id-test/brand/styles.css";\n')
    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)
    const lock = JSON.parse(readFileSync(join(consumer, 'package-lock.json'), 'utf8'))
    for (const dependency of Object.keys(lock.packages)) {
      assert.ok(!/(?:^|\/)node_modules\/(?:@happydesigns\/id|docus)$/.test(dependency), 'Unexpected authoring runtime: ' + dependency)
    }
    run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate'], consumer)
    cpSync(join(consumer, '.output/public'), resolve('.output/native-consumers', outputName), { recursive: true })
    for (const file of readdirSync(join(consumer, '.output/public/_nuxt'))) {
      if (file.endsWith('.js')) assert.doesNotMatch(readFileSync(join(consumer, '.output/public/_nuxt', file), 'utf8'), /id-studio-route-preview|idStudioPreview/, 'Preview runtime shipped to production')
    }
  }
  if (name === 'violet') {
    // Validate the actual exported Studio host without Docus, not just its manifest.
    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], brand)
    write(brand, 'playground/nuxt.config.ts', readFileSync(join(brand, 'playground/nuxt.config.ts'), 'utf8').replace('compatibilityDate:', 'ui: { fonts: false }, compatibilityDate:'))
    run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate', 'playground'], brand)
    cpSync(join(brand, 'playground/.output/public'), resolve('.output/native-consumers/studio'), { recursive: true })
  }
}
for (const suffix of ['', '-dashboard']) {
  for (const file of ['app.vue', 'app.config.ts', 'pages/demo/index.vue']) {
    assert.equal(readFileSync(join(workspace, 'consumer-violet' + suffix, 'app', file), 'utf8'), readFileSync(join(workspace, 'consumer-amber' + suffix, 'app', file), 'utf8'), 'App source changed with brand: ' + file)
  }
}
console.log('PASS: browser-exported brands built in two independent apps without ID, preview runtime or Docus; application source preserved.')
console.log('Fixture retained for diagnosis:', workspace)

const guide = join(workspace, 'guide')
const guideManifest = JSON.parse(readFileSync(join(guide, 'package.json'), 'utf8'))
guideManifest.devDependencies['@happydesigns/id'] = 'file:' + archive.replaceAll('\\', '/')
write(guide, 'package.json', JSON.stringify(guideManifest))
write(guide, 'playground/nuxt.config.ts', readFileSync(join(guide, 'playground/nuxt.config.ts'), 'utf8').replace('compatibilityDate:', 'ui: { fonts: false }, compatibilityDate:'))
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], guide)
run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate', 'playground'], guide)
assert.match(readFileSync(join(guide, 'playground/.output/public/docs/introduction.html'), 'utf8'), /Use your brand/, 'Exported introduction missing')
assert.match(readFileSync(join(guide, 'playground/.output/public/docs/brand-reference.html'), 'utf8'), /Brand reference/, 'Exported reference missing')
console.log('PASS: exported Docus project installed and generated from the packed package.')
