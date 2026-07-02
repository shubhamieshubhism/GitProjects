// import { test, expect } from '@playwright/test';

// test('add product to cart, open modal, verify item appears', async ({ page }) => {
//   await page.goto('/');
//   const firstAddButton = page.locator('.add-to-cart-btn').first();
//   const productId = await firstAddButton.getAttribute('data-id');

//   await firstAddButton.click();

//   // Cart badge should increment
//   const cartBadge = page.locator('[data-testid="cart-indicator"]');
//   await expect(cartBadge).toContainText('1 items');

//   // Open cart modal
//   await cartBadge.click();
//   const modal = page.locator('#cartModal');
//   await expect(modal).toBeVisible();

//   // Check that product appears in modal
//   const cartItem = modal.locator(`.cart-item:has-text("${productId?.slice(0, 8)}")`);
//   await expect(cartItem).toBeVisible();

//   // Close modal
//   await modal.locator('.close-modal').click();
//   await expect(modal).not.toBeVisible();
// });

import { test, expect } from '@playwright/test';

test('add product to cart, open modal, verify item appears', async ({ page }) => {
  await page.goto('/');

  // Get first product's name and add to cart
  const firstProductCard = page.locator('.product-card').first();
  const productName = await firstProductCard.locator('.product-name').innerText();
  const addButton = firstProductCard.locator('.add-to-cart-btn');
  await addButton.click();

  // Cart badge should update
  const cartBadge = page.locator('[data-testid="cart-indicator"]');
  await expect(cartBadge).toContainText('1 items');

  // Open cart modal
  await cartBadge.click();
  const modal = page.locator('#cartModal');
  await expect(modal).toBeVisible();

  // Verify the product appears in modal by its name
  const cartItem = modal.locator(`.cart-item:has-text("${productName}")`);
  await expect(cartItem).toBeVisible();

  // Close modal
  await modal.locator('.close-modal').click();
  await expect(modal).not.toBeVisible();
});