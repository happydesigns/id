import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')
const tscBin = join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc')

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
  })
  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function copyRuntimeFiles() {
  cpSync(join(rootDir, 'app'), join(distDir, 'app'), {
    recursive: true,
  })
  const themesDir = join(rootDir, 'themes')
  for (const themeDir of readdirSync(themesDir)) {
    const tokenSource = join(themesDir, themeDir, 'tokens.css')
    if (!existsSync(tokenSource)) {
      continue
    }
    const tokenTarget = join(distDir, 'themes', themeDir, 'tokens.css')
    mkdirSync(dirname(tokenTarget), {
      recursive: true,
    })
    copyFileSync(tokenSource, tokenTarget)
  }
}

function listFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const file = join(dir, entry)
    const stat = statSync(file)
    if (stat.isDirectory()) {
      listFiles(file, files)
    }
    else {
      files.push(file)
    }
  }
  return files
}

function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    return specifier
  }
  if (extname(specifier)) {
    return specifier
  }
  const target = resolve(dirname(fromFile), specifier)
  if (existsSync(`${target}.js`)) {
    return `${specifier}.js`
  }
  if (existsSync(join(target, 'index.js'))) {
    return `${specifier}/index.js`
  }
  return specifier
}

function rewriteImports(file) {
  const source = readFileSync(file, 'utf8')
  const rewritten = source
    .replace(/(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_match, before, specifier, after) => {
      return `${before}${resolveSpecifier(file, specifier)}${after}`
    })
    .replace(/(import\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_match, before, specifier, after) => {
      return `${before}${resolveSpecifier(file, specifier)}${after}`
    })
  if (rewritten !== source) {
    writeFileSync(file, rewritten)
  }
}

rmSync(distDir, {
  force: true,
  recursive: true,
})

const projectTemplates = {}
for (const variant of ['native', 'guide', 'legacy']) {
  const directory = join(rootDir, 'templates/project', variant)
  projectTemplates[variant] = Object.fromEntries(listFiles(directory).sort().map(file => [
    file.slice(directory.length + 1).replaceAll('\\', '/'), readFileSync(file, 'utf8').replaceAll('\r\n', '\n'),
  ]))
}
writeFileSync(join(rootDir, 'src/project-templates.generated.ts'),
  '// Generated from templates/project by build:package. Do not edit.\n'
  + 'export const projectTemplates: Record<"native" | "guide" | "legacy", Record<string, string>> = '
  + JSON.stringify(projectTemplates, null, 2) + '\n')

run(process.execPath, [tscBin, '-p', 'tsconfig.package.json'])
copyRuntimeFiles()

for (const file of listFiles(distDir)) {
  if (file.endsWith('.js') || file.endsWith('.d.ts')) {
    rewriteImports(file)
  }
}

// This example consumes the public generator; its runtime is not hand-maintained.
const { createStudioDocument, createStudioRuntimeFiles } = await import('../dist/src/studio.js')
const { brandIdentity, brandTheme } = await import('../templates/brand-layer/brand.ts')
const document = createStudioDocument(brandIdentity, brandTheme)
const templateDir = join(rootDir, 'templates/brand-layer')
writeFileSync(join(templateDir, 'brand.studio.json'), JSON.stringify(document, null, 2) + '\n')
for (const [path, contents] of Object.entries(createStudioRuntimeFiles(document, { styles: 'fragment' }))) {
  const target = join(templateDir, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, contents)
}
