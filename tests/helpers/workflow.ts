import { expect, type Page, type FrameLocator } from '@playwright/test'

export async function exerciseApp(app: Page | FrameLocator, kind: 'catalog' | 'dashboard') {
  await expect(app.getByText(kind === 'catalog' ? 'Catalog workspace' : 'Operations workspace', { exact: true })).toBeVisible()
  await expect(app.getByTestId('primary-action')).toHaveClass(/tracking-wide/)
  let errorColor: string | undefined
  if (kind === 'catalog') {
    await app.getByRole('textbox', { name: 'Search products' }).fill('lamp')
    await expect(app.getByRole('heading', { name: 'Notebook', exact: true })).toHaveCount(0)
    await app.getByRole('button', { name: 'Add Desk lamp', exact: true }).click()
    await expect(app.getByTestId('primary-action')).toHaveText('Count 1')
  }
  else {
    await app.getByRole('button', { name: 'Save preferences', exact: true }).click()
    await expect(app.getByText('Enter a valid email', { exact: true })).toBeVisible()
    errorColor = await app.getByText('Enter a valid email', { exact: true }).evaluate(el => getComputedStyle(el).color)
    await app.getByRole('textbox', { name: 'Notification email' }).fill('reader@example.com')
    await app.getByRole('textbox', { name: 'Notification email' }).press('Tab')
    await expect(app.getByText('Enter a valid email', { exact: true })).toHaveCount(0)
    await app.getByRole('button', { name: 'Save preferences', exact: true }).click()
    await expect(app.getByText('Preferences saved', { exact: true })).toBeVisible()
    await expect(app.getByText('reader@example.com', { exact: true })).toBeVisible()
  }
  await app.getByRole('button', { name: 'Help', exact: true }).click()
  const popover = app.getByTestId('brand-popover')
  await expect(popover).toBeVisible()
  const overlay = await popover.evaluate((el) => {
    const style = getComputedStyle(el.parentElement!)
    return { background: style.backgroundColor, color: style.color, radius: style.borderRadius, shadow: style.boxShadow }
  })
  await app.getByRole('button', { name: 'Help', exact: true }).press('Escape')
  await expect(popover).toBeHidden()
  return { overlay, ...(errorColor ? { errorColor } : {}) }
}

export function appearance(app: Page | FrameLocator) {
  return app.getByTestId('primary-action').evaluate((element) => {
    const style = getComputedStyle(element)
    const document = element.ownerDocument
    const properties = ['backgroundColor', 'color', 'borderRadius', 'borderColor', 'fontFamily', 'fontSize', 'fontWeight', 'boxShadow'] as const
    const styles = (selector: string) => {
      const target = document.querySelector(selector)
      if (!target) throw new Error('Missing appearance target: ' + selector)
      const computed = getComputedStyle(target)
      return Object.fromEntries(properties.map(property => [property, computed[property]]))
    }
    const logo = document.querySelector('[data-testid="brand-logo"]')
    return { surface: styles('[data-testid="brand-surface"]'), heading: styles('[data-testid="brand-heading"]'), input: styles('input'),
      logo: logo ? { width: getComputedStyle(logo).width, height: getComputedStyle(logo).height } : null,
      primary: style.getPropertyValue('--ui-primary').trim(), font: style.fontFamily, radius: style.borderRadius, fontSize: style.fontSize, letterSpacing: style.letterSpacing, background: style.backgroundColor, color: style.color, shadow: style.boxShadow }
  })
}
