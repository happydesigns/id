import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { createBlankStudioDocument } from '../../src/studio'
import { appearance, exerciseApp } from '../helpers/workflow'

for (const brand of ['violet', 'amber']) test('edit, preview and export ' + brand, async ({ page }) => {
  test.setTimeout(180_000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
  })
  const document = createBlankStudioDocument()
  document.brand.name = brand
  document.brand.packageName = '@id-test/brand'
  document.theme.label = brand
  document.brand.typography = { sans: brand === 'violet' ? 'Georgia, serif' : 'Arial, sans-serif' }
  document.theme.cssVariables = { light: { '--ui-radius': brand === 'violet' ? '0.75rem' : '0rem' } }
  document.theme.ui!.button = { defaultVariants: { size: brand === 'violet' ? 'lg' : 'sm' } }
  const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1WQAAAAASUVORK5CYII='
  document.brand.assets = { logos: Object.fromEntries(['wordmark', 'wordmarkInverse'].map(role => [role, { name: role, role, src, alt: brand }])) }
  document.extension = { preserved: 'workflow' }
  await page.goto('/editor?view=external&editor=colors&docked=true&mode=light')
  await page.locator('input[type="file"][accept=".json,application/json"]').setInputFiles({ name: brand + '.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(document)) })
  const draft = page.frameLocator('iframe[title="Draft brand preview"]')
  await expect(draft.locator('html')).toHaveAttribute('data-id-preview', 'ready', { timeout: 120_000 })
  await expect(draft.getByRole('img', { name: brand, exact: true })).toBeVisible()
  const before = (await appearance(draft)).primary
  await page.getByRole('button', { name: 'Use ' + brand, exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Accepted')
  await expect.poll(async () => (await appearance(draft)).primary).not.toBe(before)
  const measurements: Record<string, unknown> = {}
  for (const [kind, view] of [['catalog', 'external'], ['dashboard', 'dashboard']] as const) {
    for (const mode of ['light', 'dark']) {
      await page.goto('/editor?view=' + view + '&editor=colors&mode=' + mode)
      await expect(draft.locator('html')).toHaveAttribute('data-id-preview', 'ready', { timeout: 120_000 })
      await expect(draft.locator('html')).toHaveClass(new RegExp(mode))
      await exerciseApp(draft, kind)
      measurements[kind + '-' + mode] = await appearance(draft)
      await expect(draft.getByRole('img', { name: brand, exact: true })).toBeVisible()
    }
  }
  await page.getByRole('button', { name: 'Export', exact: true }).click()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download JSON', exact: true }).click()
  const download = await pending
  const json = await readFile((await download.path())!, 'utf8')
  const exported = JSON.parse(json)
  expect(exported.theme.ui.colors.primary).toBe(brand)
  expect(exported.extension).toEqual({ preserved: 'workflow' })
  await mkdir('.output/workflow', { recursive: true })
  await writeFile('.output/workflow/' + brand + '.json', json)
  await writeFile('.output/workflow/' + brand + '-appearance.json', JSON.stringify(measurements))
  expect(errors).toEqual([])
})
