// import { Page } from '@playwright/test';

// export type ElementSnapshot = {
//   testId: string | null;
//   id: string | null;
//   tag: string;
//   text?: string;
//   recommendedLocator: string | null;
// };

// export async function generateLocatorsFromSnapshot(page: Page): Promise<{
//   snapshot: ElementSnapshot[];
//   locators: string[];
// }> {
//   const snapshot = await page.evaluate(() => {
//     const elements = Array.from(document.querySelectorAll('[data-testid], [id]'));
//     return elements.map(el => ({
//       testId: el.getAttribute('data-testid'),
//       id: el.id,
//       tag: el.tagName,
//       // ensure absent text is undefined (not null) to match ElementSnapshot.text?: string
//       text: el.textContent?.slice(0, 60) ?? undefined,
//     }));
//   });

//   const enriched: ElementSnapshot[] = snapshot.map(s => ({
//     ...s,
//     recommendedLocator: s.testId
//       ? `page.locator('[data-testid="${s.testId}"]')`
//       : s.id
//       ? `page.locator('#${s.id}')`
//       : null,
//   }));

//   const locators = enriched
//     .filter(s => s.recommendedLocator)
//     .map(s => s.recommendedLocator!);

//   return { snapshot: enriched, locators };
// }
import { Page } from '@playwright/test';

export type ElementSnapshot = {
  testId: string | null;
  id: string | null;
  tag: string;
  text?: string;
  recommendedLocator: string | null;
};

/**
 * Takes a Playwright page, extracts all elements with `data-testid` or `id`,
 * and returns a list of recommended locators.
 */
export async function generateLocatorsFromSnapshot(page: Page): Promise<{
  snapshot: ElementSnapshot[];
  locators: string[];
}> {
  // Run inside the browser context
  const rawSnapshot = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('[data-testid], [id]'));
    return elements.map((el) => ({
      testId: el.getAttribute('data-testid'),
      id: el.id,
      tag: el.tagName,
      text: el.textContent?.slice(0, 60) ?? undefined,
    }));
  });

  // Enrich with recommended locators
  const snapshot: ElementSnapshot[] = rawSnapshot.map((s) => ({
    ...s,
    recommendedLocator: s.testId
      ? `page.locator('[data-testid="${s.testId}"]')`
      : s.id
      ? `page.locator('#${s.id}')`
      : null,
  }));

  // Collect only those with a valid locator
  const locators = snapshot
    .filter((s) => s.recommendedLocator !== null)
    .map((s) => s.recommendedLocator!);

  return { snapshot, locators };
}

/**
 * Legacy export for compatibility (if used elsewhere)
 */
export default { generateLocatorsFromSnapshot };
