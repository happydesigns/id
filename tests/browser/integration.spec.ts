import { expect, test } from '@playwright/test'

test('guide controls: translated Select and keyboard coverage', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 390, height: 1000 })
  await page.goto('/smoke')
  const select = page.locator('[data-example="select"]').getByRole('combobox')
  await select.click()
  await page.getByRole('option', { name: 'Bereit zur Prüfung', exact: true }).click()
  await page.getByTestId('locale').click()
  await expect(select).toHaveText(/Ready for review/)
  await expect(select).toHaveAttribute('aria-label', 'Status')
  const coverage = page.getByRole('region', { name: 'Component coverage', exact: true })
  await expect(coverage).toHaveAttribute('tabindex', '0')
  await coverage.focus()
  await expect(coverage).toBeFocused()
  await coverage.press('ArrowRight')
  await expect.poll(() => coverage.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('Studio starts and opens its native brand menu in both modes', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const mode of ['light', 'dark']) {
    await page.goto('/studio?browse=true&mode=' + mode)
    await expect(page.getByRole('main', { name: 'Brand Studio', exact: true })).toHaveAttribute('data-mode', mode)
    await page.getByRole('button', { name: 'Brand picker', exact: true }).click()
    await expect(page.getByRole('menu', { name: 'Brand picker', exact: true })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Brand picker', exact: true })).toBeFocused()
    await page.getByRole('button', { name: 'Randomize entire look', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Undo change', exact: true })).toBeEnabled()
    await page.getByRole('button', { name: 'Undo change', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Redo change', exact: true })).toBeEnabled()
  }
  expect(errors).toEqual([])
})

for (const route of ['/', '/smoke']) test('known Docus host label-ID mismatch: ' + route, async ({ page }) => {
  await page.goto(route)
  // An actual interaction ensures hydration completed before examining associations.
  await page.getByTestId('locale').click()
  const missing = await page.locator('label[for]').evaluateAll(labels =>
    labels.filter(label => !document.getElementById(label.getAttribute('for')!)).map(label => label.textContent)
  )
  test.fail(true, 'GUIDE-001: documented in tests/fixtures/guide/README.md; an unexpected pass requires removing the workaround.')
  expect(missing).toEqual([])
})
