import assert from 'node:assert/strict'
import { cpSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
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
for (const file of readdirSync(join(author, 'node_modules/@happydesigns/id/templates'), { recursive: true })) {
  assert.ok(!String(file).split(/[\\/]/).some(part => ['.nuxt', '.output', 'node_modules'].includes(part)), 'Generated file in package: ' + file)
}
write(author, 'generate.mjs', `
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createBlankStudioDocument, createStudioProject } from '@happydesigns/id/studio/core'
for (const name of ['violet', 'amber']) {
  const doc = createBlankStudioDocument()
  doc.brand.name = name
  doc.brand.packageName = '@id-test/brand'
  doc.theme.label = name
  doc.theme.ui.colors.primary = name
  doc.brand.typography.sans = name === 'violet' ? 'Georgia, serif' : 'Arial, sans-serif'
  doc.theme.cssVariables = { light: { '--ui-primary': name === 'violet' ? '#7c3aed' : '#b45309' }, dark: { '--ui-primary': name === 'violet' ? '#c4b5fd' : '#fcd34d' } }
  doc.brand.assets = { logos: Object.fromEntries(['wordmark', 'wordmarkInverse'].map(role => [role, { name: role, role, src: '/' + name + '-' + role + '.svg', alt: name }])) }
  const files = createStudioProject(doc)
  for (const asset of Object.values(doc.brand.assets.logos)) files['public' + asset.src] = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="24"><text x="0" y="18">' + name + '</text></svg>'
  for (const [path, value] of Object.entries(files)) {
    const target = resolve('../' + name, path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, value)
  }
}
`)
run(process.execPath, ['generate.mjs'], author)
const app = `<script setup lang="ts">
const count = ref(0)
const mode = useColorMode()
</script>
<template><UApp><main class="font-sans"><BrandLogo /><h1>Independent consumer</h1><UButton @click="count++">Continue {{ count }}</UButton><UButton color="neutral" @click="mode.preference = mode.value === 'dark' ? 'light' : 'dark'">Toggle mode</UButton></main></UApp></template>`
for (const name of ['violet', 'amber']) {
  const brand = join(workspace, name)
  const manifest = JSON.parse(readFileSync(join(brand, 'package.json'), 'utf8'))
  manifest.version = '0.0.0'
  manifest.devDependencies['@happydesigns/id'] = 'file:' + archive.replaceAll('\\', '/')
  write(brand, 'package.json', JSON.stringify(manifest))
  assert.equal(manifest.dependencies['@happydesigns/id'], undefined)
  assert.equal(manifest.devDependencies.docus, undefined)
  run('npm', ['pack', '--ignore-scripts'], brand)
  const consumer = join(workspace, 'consumer-' + name)
  write(consumer, 'package.json', JSON.stringify({ private: true, type: 'module', dependencies: {
    '@id-test/brand': 'file:../' + name + '/id-test-brand-0.0.0.tgz', 'nuxt': manifest.devDependencies.nuxt,
  } }))
  write(consumer, 'nuxt.config.ts', `export default defineNuxtConfig({ extends: ['@id-test/brand'], css: ['~/assets/css/main.css'], compatibilityDate: '2026-08-01', ui: { fonts: false }, colorMode: { preference: 'light' } })`)
  write(consumer, 'app/assets/css/main.css', '@import "tailwindcss";\n@import "@nuxt/ui";\n@import "@id-test/brand/styles.css";\n')
  write(consumer, 'app/app.vue', app)
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer)
  const lock = JSON.parse(readFileSync(join(consumer, 'package-lock.json'), 'utf8'))
  for (const dependency of Object.keys(lock.packages)) {
    assert.ok(!/(?:^|\/)node_modules\/(?:@happydesigns\/id|docus)$/.test(dependency), 'Unexpected authoring runtime: ' + dependency)
  }
  run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate'], consumer)
  cpSync(join(consumer, '.output/public'), resolve('.output/native-consumers', name), { recursive: true })
  if (name === 'violet') {
    // Validate the actual exported Studio host without Docus, not just its manifest.
    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], brand)
    write(brand, 'playground/nuxt.config.ts', readFileSync(join(brand, 'playground/nuxt.config.ts'), 'utf8').replace('compatibilityDate:', 'ui: { fonts: false }, compatibilityDate:'))
    run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate', 'playground'], brand)
    cpSync(join(brand, 'playground/.output/public'), resolve('.output/native-consumers/studio'), { recursive: true })
  }
}
assert.equal(readFileSync(join(workspace, 'consumer-violet/app/app.vue'), 'utf8'), readFileSync(join(workspace, 'consumer-amber/app/app.vue'), 'utf8'))
console.log('PASS: identical application generated with two packed native brands without ID or Docus; exported Studio generated without Docus.')
console.log('Fixture retained for diagnosis:', workspace)
