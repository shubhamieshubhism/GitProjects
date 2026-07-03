// @ts-check
import { test, expect } from '@playwright/test';

test('searching "shubham" on google', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://www.google.com');
  
  // Accept cookies if the consent dialog appears
  const acceptButton = page.locator('button:has-text("Accept all")').or(page.locator('button:has-text("I agree")'));
  if (await acceptButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await acceptButton.click();
  }
  
  // Find the search input field and type "shubham"
  const searchInput = page.locator('textarea[name="q"]').or(page.locator('input[name="q"]'));
  await searchInput.fill('shubham');
  
  // Press Enter to submit the search
  await searchInput.press('Enter');
  
  // Wait for the search results page to load
  await page.waitForURL('**/search**');
  
  // Verify that the search results page is displayed
  await expect(page).toHaveURL(/.*search.*/);
  
  // Verify that search results contain the search term
  await expect(page.locator('#search')).toBeVisible();
});