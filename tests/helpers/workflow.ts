import { expect, type Page, type FrameLocator } from '@playwright/test'

export async function exerciseApp(app: Page | FrameLocator, kind: 'catalog' | 'dashboard') {
  await expect(app.getByText(kind === 'catalog' ? 'Catalog workspace' : 'Operations workspace', { exact: true })).toBeVisible()
  await expect(app.getByTestId('primary-action')).toHaveClass(/tracking-wide/)
  if (kind === 'catalog') {
    await app.getByRole('textbox', { name: 'Search products' }).fill('lamp')
    await expect(app.getByRole('heading', { name: 'Notebook', exact: true })).toHaveCount(0)
    await app.getByRole('button', { name: 'Add Desk lamp', exact: true }).click()
    await expect(app.getByTestId('primary-action')).toHaveText('Count 1')
  }
  else {
    await app.getByRole('button', { name: 'Save preferences', exact: true }).click()
    await expect(app.getByText('Enter a valid email', { exact: true })).toBeVisible()
    await app.getByRole('textbox', { name: 'Notification email' }).fill('reader@example.com')
    await app.getByRole('textbox', { name: 'Notification email' }).press('Tab')
    await expect(app.getByText('Enter a valid email', { exact: true })).toHaveCount(0)
    await app.getByRole('button', { name: 'Save preferences', exact: true }).click()
    await expect(app.getByText('Preferences saved', { exact: true })).toBeVisible()
    await expect(app.getByText('reader@example.com', { exact: true })).toBeVisible()
  }
}

export function appearance(app: Page | FrameLocator) {
  return app.getByTestId('primary-action').evaluate((element) => {
    const style = getComputedStyle(element)
    return { primary: style.getPropertyValue('--ui-primary').trim(), font: style.fontFamily, radius: style.borderRadius, fontSize: style.fontSize, letterSpacing: style.letterSpacing }
  })
}
