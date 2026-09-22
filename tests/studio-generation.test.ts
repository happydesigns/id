import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { afterEach, expect, it } from 'vitest'
import { createBlankStudioDocument, createStudioProject, createStudioRuntimeFiles } from '../src/studio'

const exec = promisify(execFile)
const directories: string[] = []
afterEach(async () => {
  for (const directory of directories.splice(0)) {
    if (!resolve(directory).startsWith(resolve(tmpdir(), 'id-generation-'))) throw new Error('Unexpected cleanup directory')
    await rm(directory, { recursive: true, force: true })
  }
})
async function project(guide = false) {
  const directory = await mkdtemp(join(tmpdir(), 'id-generation-'))
  directories.push(directory)
  const document = createBlankStudioDocument()
  const files = createStudioProject(document, { guide })
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(directory, path)), { recursive: true })
    await writeFile(join(directory, path), content)
  }
  await mkdir(join(directory, 'node_modules/@happydesigns'), { recursive: true })
  await symlink(fileURLToPath(new URL('..', import.meta.url)), join(directory, 'node_modules/@happydesigns/id'), 'junction')
  const generate = () => exec(process.execPath, [join(directory, 'scripts/generate-brand.mjs')], { cwd: tmpdir() })
  return { directory, document, files, generate }
}

it.each([false, true])('regenerates only owned files and preserves custom code (guide: %s)', async (guide) => {
  const { directory, document, files, generate } = await project(guide)
  const custom = {
    'app/app.config.ts': files['app/app.config.ts']!.replace('defineAppConfig(brand)', 'defineAppConfig({ ...brand, appTitle: \'My application\' })'),
    'app/components/BrandLogo.vue': '<template><span>My logo</span></template>\n',
    'app/pages/custom.vue': '<template><h1>My page</h1></template>\n',
    'app/assets/css/custom.css': '.custom { display: grid; }\n',
    'nuxt.config.ts': files['nuxt.config.ts'] + '\n// Custom modules\n',
  }
  for (const [path, content] of Object.entries(custom)) {
    await mkdir(dirname(join(directory, path)), { recursive: true })
    await writeFile(join(directory, path), content)
  }
  document.theme.ui!.colors!.primary = 'violet'
  document.extension = { keep: true }
  const source = JSON.stringify(document, null, 4) + '\n'
  await writeFile(join(directory, 'brand.studio.json'), source)
  await generate()
  const output = createStudioRuntimeFiles(document, { styles: 'fragment', config: 'fragment' })
  expect(Object.keys(output)).toEqual(['app/brand.config.ts', 'app/assets/css/brand.css'])
  for (const [path, content] of Object.entries(output)) expect(await readFile(join(directory, path), 'utf8')).toBe(content)
  for (const [path, content] of Object.entries({ ...files, ...custom, 'brand.studio.json': source })) {
    if (!(path in output)) expect(await readFile(join(directory, path), 'utf8')).toBe(content)
  }
  const timestamps = await Promise.all(Object.keys(output).map(path => stat(join(directory, path)).then(info => info.mtimeMs)))
  await generate()
  expect(await Promise.all(Object.keys(output).map(path => stat(join(directory, path)).then(info => info.mtimeMs)))).toEqual(timestamps)
  expect(createStudioProject(document, { guide })).toEqual(createStudioProject(structuredClone(document), { guide }))
})

it('validates the entire source before writing output and removes obsolete generated overrides', async () => {
  const { directory, document, files, generate } = await project()
  document.theme.ui!.colors!.primary = 'missing-palette'
  await writeFile(join(directory, 'brand.studio.json'), JSON.stringify(document))
  await expect(generate()).rejects.toThrow()
  for (const path of Object.keys(createStudioRuntimeFiles(createBlankStudioDocument(), { config: 'fragment' }))) {
    expect(await readFile(join(directory, path), 'utf8')).toBe(files[path])
  }
  document.theme.ui = { colors: { primary: 'violet' }, button: { defaultVariants: { variant: 'soft' } } }
  await writeFile(join(directory, 'brand.studio.json'), JSON.stringify(document))
  await generate()
  expect(await readFile(join(directory, 'app/brand.config.ts'), 'utf8')).toContain('"button"')
  document.theme.ui = { colors: { primary: 'amber' } }
  await writeFile(join(directory, 'brand.studio.json'), JSON.stringify(document))
  await generate()
  expect(await readFile(join(directory, 'app/brand.config.ts'), 'utf8')).toContain('amber')
  expect(await readFile(join(directory, 'app/brand.config.ts'), 'utf8')).not.toContain('"button"')
})

it('reports unreadable output instead of overwriting it or earlier files', async () => {
  const { directory, document, files, generate } = await project()
  const target = join(directory, 'app/assets/css/brand.css')
  await rm(target)
  await mkdir(target)
  document.theme.ui!.colors!.primary = 'violet'
  await writeFile(join(directory, 'brand.studio.json'), JSON.stringify(document))
  await expect(generate()).rejects.toThrow()
  expect(await readFile(join(directory, 'app/brand.config.ts'), 'utf8')).toBe(files['app/brand.config.ts'])
})
