import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { appearance, exerciseApp } from '../helpers/workflow'

for (const [brand, kind, port] of [
  ['violet', 'catalog', 3440], ['amber', 'catalog', 3441],
  ['violet', 'dashboard', 3446], ['amber', 'dashboard', 3447],
] as const) test('native workflow: ' + kind + ' / ' + brand, async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
  })
  const expected = JSON.parse(await readFile('.output/workflow/' + brand + '-appearance.json', 'utf8'))
  await page.goto('http://127.0.0.1:' + port + '/demo')
  await exerciseApp(page, kind)
  for (const mode of ['light', 'dark']) {
    if (mode === 'dark') await page.getByRole('button', { name: 'Toggle mode', exact: true }).click()
    await expect(page.locator('html')).toHaveClass(new RegExp(mode))
    await expect.poll(() => appearance(page)).toEqual(expected[kind + '-' + mode])
    const logo = page.getByRole('img', { name: brand, exact: true })
    await expect(logo).toBeVisible()
    await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  }
  await expect(page.locator('html')).not.toHaveAttribute('data-id-preview')
  expect(errors).toEqual([])
})

test('exported Studio runs without a Docus host', async ({ page }) => {
  await page.goto('http://127.0.0.1:3442/studio?browse=true')
  await expect(page.getByRole('main', { name: 'Brand Studio', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Documentation (opens in a new tab)', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Brand picker', exact: true }).click()
  await expect(page.getByRole('menu', { name: 'Brand picker', exact: true })).toBeVisible()
})
