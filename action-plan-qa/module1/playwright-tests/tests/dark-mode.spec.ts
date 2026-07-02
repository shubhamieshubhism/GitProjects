import { test, expect } from '@playwright/test';

test('dark mode toggles and persists after reload', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('[data-testid="dark-mode-toggle"]');
  await expect(page.locator('body')).not.toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/dark/);
});