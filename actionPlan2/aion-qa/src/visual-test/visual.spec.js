const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  
  test('dashboard page visual regression', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-loaded', { timeout: 10000 });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dashboard.png', {
      threshold: 0.1,
      maxDiffPixels: 100,
      mask: [
        page.locator('.timestamp'),
        page.locator('.live-counter'),
        page.locator('.user-avatar'),
        page.locator('[data-dynamic="true"]'),
      ],
      style: `
        .timestamp, .live-counter, .user-avatar {
          background: #f0f0f0 !important;
          color: #f0f0f0 !important;
          opacity: 0 !important;
        }
      `,
      animations: 'disabled',
      fullPage: false,
    });
  });
});
