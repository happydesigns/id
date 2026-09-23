import { presetFonts, presetIcons } from './presets'
import { ICON_PACKS, studioIcons, studioIconOverrides, themeIcons } from '../studio/icon-sets'
import { auditedIconOverrides } from '../studio/icon-overrides'
import docsPackage from './package.json'
import rootPackage from '../package.json'
import { createFirstPaintScript } from './first-paint'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// `nuxt prepare` also enables dev mode. Isolate the running CLI server explicitly.
const devServer = process.argv.includes('dev')

const iconPrefixes = Object.keys({ ...rootPackage.devDependencies, ...docsPackage.devDependencies })
  .filter(name => name.startsWith('@iconify-json/')).map(name => name.slice('@iconify-json/'.length))
  .sort((a, b) => b.length - a.length)
function bundleIcon(name: string) {
  const prefix = iconPrefixes.find(prefix => name.startsWith('i-' + prefix + '-'))
  return prefix ? prefix + ':' + name.slice(prefix.length + 3) : name
}

const currentDir = dirname(fileURLToPath(import.meta.url))
const firstPaintRevision = createHash('sha256')
  .update(readFileSync(resolve(currentDir, 'app/data/nuxt-ui-presets.json')))
  .update(readFileSync(resolve(currentDir, 'app/app.config.ts')))
  .digest('hex').slice(0, 12)

export default defineNuxtConfig({
  extends: ['../studio', '../guide', 'docus'],
  modules: [
    resolve(currentDir, '../module.ts'),
  ],
  app: { head: { script: [{ innerHTML: createFirstPaintScript(firstPaintRevision), tagPriority: -10 }] } },
  content: {
    _localDatabase: { type: 'sqlite', filename: devServer ? '.data/content/dev.sqlite' : '.data/content/contents.sqlite' },
  },
  appConfig: { idStudio: { firstPaintRevision } },
  buildDir: devServer ? '.nuxt-dev' : '.nuxt',
  compatibilityDate: 'latest',
  fonts: { families: presetFonts.map(name => ({ name })) },
  icon: {
    clientBundle: {
      sizeLimitKb: 512,
      // Theme-selected names are dynamic and cannot be found by template scanning.
      icons: [...new Set([
        ...Object.values(presetIcons),
        ...Object.values(themeIcons).flatMap(icons => Object.values(icons)),
        ...Object.values(studioIcons),
        ...Object.values(studioIconOverrides).flatMap(icons => Object.values(icons)),
        ...Object.values(auditedIconOverrides).flatMap(icons => Object.values(icons)),
        ...ICON_PACKS.map(pack => pack.icon),
        'vscode-icons:file-type-nuxt',
        'vscode-icons:file-type-css',
      ].map(bundleIcon))],
    },
  },
  llms: {
    domain: 'https://id.happydesigns.de',
    title: 'happydesigns id',
    description: 'Reusable identity contracts, Nuxt UI theme runtime, and brand-layer tooling for Nuxt projects.',
  },
})
