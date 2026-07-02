// import { test, expect } from '@playwright/test';
// import { generateLocatorsFromSnapshot } from '../helpers/snapshot-to-locators';

// test('auto‑generate locators from DOM snapshot and use one to interact', async ({ page }) => {
//   await page.goto('/');
//   const { snapshot, locators } = await generateLocatorsFromSnapshot(page);
//   console.log('Generated locators sample:', locators.slice(0, 5));

//   // Find the dark mode toggle in the snapshot
//   const darkModeEntry = snapshot.find(s => s.testId === 'dark-mode-toggle');
//   expect(darkModeEntry).toBeDefined();
//   expect(darkModeEntry?.recommendedLocator).toBeTruthy();

//   // Use the recommended locator string to create a Playwright locator
//   // We'll directly use the attribute selector
//   const dynamicLocator = page.locator('[data-testid="dark-mode-toggle"]');
//   await dynamicLocator.click();
//   await expect(page.locator('body')).toHaveClass(/dark/);
// });

import { test, expect } from '@playwright/test';

test('auto‑generate locators from DOM snapshot and use one to interact', async ({ page }) => {
  await page.goto('/');

  // --- Inline helper: generate locators from snapshot ---
  const rawSnapshot = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('[data-testid], [id]'));
    return elements.map((el) => ({
      testId: el.getAttribute('data-testid'),
      id: el.id,
      tag: el.tagName,
      text: el.textContent?.slice(0, 60) || null,
    }));
  });

  const snapshot = rawSnapshot.map((s) => ({
    ...s,
    recommendedLocator: s.testId
      ? `page.locator('[data-testid="${s.testId}"]')`
      : s.id
      ? `page.locator('#${s.id}')`
      : null,
  }));

  const locators = snapshot
    .filter((s) => s.recommendedLocator !== null)
    .map((s) => s.recommendedLocator!);

  console.log('Generated locators sample:', locators.slice(0, 5));
  // --- End of inline helper ---

  // Find dark‑mode toggle in the snapshot
  const darkModeEntry = snapshot.find((s) => s.testId === 'dark-mode-toggle');
  expect(darkModeEntry).toBeDefined();
  expect(darkModeEntry?.recommendedLocator).toBeTruthy();

  // Use the recommended locator to click
  const dynamicLocator = page.locator('[data-testid="dark-mode-toggle"]');
  await dynamicLocator.click();
  await expect(page.locator('body')).toHaveClass(/dark/);
});