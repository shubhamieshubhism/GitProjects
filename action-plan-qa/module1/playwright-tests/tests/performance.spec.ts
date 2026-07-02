import { test } from '@playwright/test';

test('benchmark selector methods on a product card', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.product-card');
  const firstCard = page.locator('.product-card').first();
  const productId = await firstCard.getAttribute('data-product-id');
  const productName = await firstCard.locator('.product-name').innerText();
  const iterations = 100;

  const measure = async (name: string, action: () => Promise<any>) => {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await action();
      times.push(performance.now() - start);
    }
    const avg = times.reduce((a, b) => a + b, 0) / iterations;
    console.log(`${name}: avg ${avg.toFixed(3)} ms`);
    return avg;
  };

  await measure('CSS selector (.product-card[data-product-id="..."])', async () => {
    await page.locator(`.product-card[data-product-id="${productId}"]`).first();
  });

  await measure('XPath (//div[@data-product-id="..."])', async () => {
    await page.locator(`//div[@data-product-id='${productId}']`).first();
  });

  await measure('data-testid (add-to-cart button)', async () => {
    await page.locator(`[data-testid="add-to-cart-${productId}"]`).first();
  });

  await measure('getByText (product name)', async () => {
    await page.getByText(productName, { exact: true }).first();
  });

  await measure('getByRole (button with "Add to cart")', async () => {
    await page.getByRole('button', { name: /Add to cart/i }).first();
  });
});