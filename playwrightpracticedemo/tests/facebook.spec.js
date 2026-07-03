// @ts-check
import { test, expect } from '@playwright/test';

test('navigate to facebook and verify logo', async ({ page }) => {
  // Navigate to Facebook
  await page.goto('https://www.facebook.com');
  
  // Verify Facebook page loaded successfully
  await expect(page).toHaveURL(/facebook\.com/);
  await expect(page).toHaveTitle(/Facebook/);
});