import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { createBlankStudioDocument } from '../../src/studio'
import { appearance, exerciseApp } from '../helpers/workflow'
import { createTestBrand } from '../helpers/brand.mjs'

for (const brand of ['violet', 'amber'] as const) test('edit, preview and export ' + brand, async ({ page }) => {
  test.setTimeout(180_000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
  })
  const document = createTestBrand(createBlankStudioDocument, brand)
  await page.goto('/editor?view=external&editor=colors&docked=true&mode=light')
  await page.locator('input[type="file"][accept=".json,application/json"]').setInputFiles({ name: brand + '.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(document)) })
  const draft = page.frameLocator('iframe[title="Draft brand preview"]')
  await expect(draft.locator('html')).toHaveAttribute('data-id-preview', 'ready', { timeout: 120_000 })
  await expect(draft.getByRole('img', { name: brand, exact: true })).toBeVisible()
  const before = (await appearance(draft)).primary
  await page.getByRole('button', { name: 'Use ' + brand, exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Accepted')
  await expect.poll(async () => (await appearance(draft)).primary).not.toBe(before)
  const kind = brand === 'violet' ? 'catalog' : 'dashboard'
  const view = kind === 'catalog' ? 'external' : 'dashboard'
  for (const [width, mode] of [[960, 'light'], [390, 'dark']] as const) {
    await page.goto('/editor?view=' + view + '&width=' + width + '&height=900&mode=' + mode)
    await expect(draft.locator('html')).toHaveAttribute('data-id-preview', 'ready', { timeout: 120_000 })
    await expect(draft.locator('html')).toHaveClass(new RegExp(mode))
    await expect(draft.locator('html')).toHaveJSProperty('clientWidth', width)
    await exerciseApp(draft, kind)
    expect(await draft.locator('body').evaluate(body => body.scrollWidth <= body.ownerDocument.documentElement.clientWidth)).toBe(true)
    await expect(draft.getByRole('img', { name: brand, exact: true })).toBeVisible()
  }
  await page.getByRole('button', { name: 'Export', exact: true }).click()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download JSON', exact: true }).click()
  const download = await pending
  const json = await readFile((await download.path())!, 'utf8')
  const exported = JSON.parse(json)
  expect(exported.theme.ui.colors.primary).toBe(brand)
  expect(exported.extension).toEqual({ preserved: 'workflow' })
  expect(exported.brand.typography).toEqual(document.brand.typography)
  expect(exported.brand.assets).toEqual(document.brand.assets)
  expect(errors).toEqual([])
})
