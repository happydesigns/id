import { expect, test } from '@playwright/test'

for (const [index, brand] of ['violet', 'amber'].entries()) test('same application with native brand: ' + brand, async ({ page }) => {
  await page.goto('http://127.0.0.1:' + (3440 + index))
  await expect(page.getByText('Custom application', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Continue 0', exact: true }).click()
  const action = page.getByRole('button', { name: 'Continue 1', exact: true })
  await expect(action).toBeVisible()
  // Check the resting brand color after the interaction, not Nuxt UI's hover tint.
  await page.getByRole('heading', { name: 'Independent consumer', exact: true }).hover()
  await expect(page.getByRole('main')).toHaveCSS('font-family', brand === 'violet' ? 'Georgia, serif' : 'Arial, sans-serif')
  await expect(action).toHaveCSS('background-color', brand === 'violet' ? 'rgb(124, 58, 237)' : 'rgb(180, 83, 9)')
  await expect(page.getByRole('img', { name: brand })).toHaveAttribute('src', '/' + brand + '-wordmark.svg')
  await page.getByRole('button', { name: 'Toggle mode', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(action).toHaveCSS('background-color', brand === 'violet' ? 'rgb(196, 181, 253)' : 'rgb(252, 211, 77)')
  await expect(page.getByRole('img', { name: brand })).toHaveAttribute('src', '/' + brand + '-wordmarkInverse.svg')
})

test('exported Studio runs without a Docus host', async ({ page }) => {
  await page.goto('http://127.0.0.1:3442/studio?browse=true')
  await expect(page.getByRole('main', { name: 'Brand Studio', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Documentation (opens in a new tab)', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Brand picker', exact: true }).click()
  await expect(page.getByRole('menu', { name: 'Brand picker', exact: true })).toBeVisible()
})
