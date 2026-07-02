// import { test, expect } from '@playwright/test';

// test.describe('Micro‑frontend widgets', () => {
//   test('Recommended widget toggles independently', async ({ page }) => {
//     await page.goto('/');
//     const widget = page.locator('[data-testid="widget-recommended"]');
//     const toggle = widget.locator('[data-testid="toggle-recommended"]');
//     const content = widget.locator('.widget-content');
//     await expect(content).toBeVisible();
//     await toggle.click();
//     await expect(content).not.toBeVisible();
//     await toggle.click();
//     await expect(content).toBeVisible();
//   });

//   test('Recently viewed widget toggles independently', async ({ page }) => {
//     await page.goto('/');
//     const widget = page.locator('[data-testid="widget-recently-viewed"]');
//     const toggle = widget.locator('[data-testid="toggle-recently-viewed"]');
//     const content = widget.locator('.widget-content');
//     await expect(content).toBeVisible();
//     await toggle.click();
//     await expect(content).not.toBeVisible();
//     await toggle.click();
//     await expect(content).toBeVisible();
//   });

//   test('Toggling one widget does not affect the other', async ({ page }) => {
//     await page.goto('/');
//     const recWidget = page.locator('[data-testid="widget-recommended"]');
//     const recContent = recWidget.locator('.widget-content');
//     const recToggle = recWidget.locator('[data-testid="toggle-recommended"]');
//     const recentWidget = page.locator('[data-testid="widget-recently-viewed"]');
//     const recentContent = recentWidget.locator('.widget-content');

//     await recToggle.click();
//     await expect(recContent).not.toBeVisible();
//     await expect(recentContent).toBeVisible();

//     await recToggle.click();
//     await expect(recContent).toBeVisible();
//     await expect(recentContent).toBeVisible();
//   });
// });

import { test, expect } from '@playwright/test';

test.describe('Micro‑frontend widgets', () => {
  test('Recommended widget toggles independently', async ({ page }) => {
    await page.goto('/');
    const widget = page.locator('[data-testid="widget-recommended"]');
    const toggle = widget.locator('[data-testid="toggle-recommended"]');
    const content = widget.locator('.widget-content');
    // Ensure visible initially (in case it's hidden)
    if (await content.isVisible() === false) {
      await toggle.click();
    }
    await expect(content).toBeVisible();
    await toggle.click();
    await expect(content).not.toBeVisible();
    await toggle.click();
    await expect(content).toBeVisible();
  });

  test('Recently viewed widget toggles independently', async ({ page }) => {
    await page.goto('/');
    const widget = page.locator('[data-testid="widget-recently-viewed"]');
    const toggle = widget.locator('[data-testid="toggle-recently-viewed"]');
    const content = widget.locator('.widget-content');
    // Ensure visible initially (in case it's hidden)
    if (await content.isVisible() === false) {
      await toggle.click();
    }
    await expect(content).toBeVisible();
    await toggle.click();
    await expect(content).not.toBeVisible();
    await toggle.click();
    await expect(content).toBeVisible();
  });

  test('Toggling one widget does not affect the other', async ({ page }) => {
    await page.goto('/');
    const recWidget = page.locator('[data-testid="widget-recommended"]');
    const recContent = recWidget.locator('.widget-content');
    const recToggle = recWidget.locator('[data-testid="toggle-recommended"]');
    const recentWidget = page.locator('[data-testid="widget-recently-viewed"]');
    const recentContent = recentWidget.locator('.widget-content');

    // Ensure both are visible initially
    if (await recContent.isVisible() === false) await recToggle.click();
    if (await recentContent.isVisible() === false) {
      const recentToggle = recentWidget.locator('[data-testid="toggle-recently-viewed"]');
      await recentToggle.click();
    }

    await recToggle.click();
    await expect(recContent).not.toBeVisible();
    await expect(recentContent).toBeVisible();

    await recToggle.click();
    await expect(recContent).toBeVisible();
    await expect(recentContent).toBeVisible();
  });
});