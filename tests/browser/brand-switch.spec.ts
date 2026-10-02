import { expect, test } from '@playwright/test'
import colors from 'tailwindcss/colors'
import { appearance, exerciseApp } from '../helpers/workflow'

for (const [brand, kind, port] of [
  ['violet', 'catalog', 3440], ['amber', 'dashboard', 3447],
] as const) test('native workflow: ' + kind + ' / ' + brand, async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
  })
  for (const width of [390, 960]) {
    await page.setViewportSize({ width, height: 900 })
    for (const mode of ['light', 'dark']) {
      await page.goto('http://127.0.0.1:' + port + '/demo')
      if (await page.locator('html').evaluate(el => el.classList.contains('dark')) !== (mode === 'dark')) await page.getByRole('button', { name: 'Toggle mode', exact: true }).click()
      await expect(page.locator('html')).toHaveClass(new RegExp(mode))
      await exerciseApp(page, kind)
      // The host's explicit outline variant must win over the brand's solid default.
      await expect(page.getByTestId('primary-action')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
      await expect.poll(() => page.locator('html').evaluate(element => getComputedStyle(element).getPropertyValue('--ui-primary').trim()))
        .toBe(colors[brand][mode === 'dark' ? 400 : 500])
      expect((await appearance(page)).font).toContain(brand === 'violet' ? 'Georgia' : 'Arial')
      const logo = page.getByRole('img', { name: brand, exact: true })
      await expect(logo).toBeVisible()
      await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    }
    expect(await page.evaluate(() => document.body.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: '.output/tests/' + kind + '-' + brand + '-' + width + '.png', fullPage: true })
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
