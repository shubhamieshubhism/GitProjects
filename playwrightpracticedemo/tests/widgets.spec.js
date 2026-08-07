const { test, expect } = require('@playwright/test');
const { WidgetsPage } = require('../pages/WidgetsPage');

test.describe('Widgets - Alerts & Popups', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should handle simple alert', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    await widgetsPage.clickSimpleAlert();
  });

  test('should handle confirmation alert - accept', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    await widgetsPage.clickConfirmationAlert();
  });

  test('should handle confirmation alert - dismiss', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();
    });
    await widgetsPage.clickConfirmationAlert();
  });

  test('should handle prompt alert with text', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Test Input');
    });
    await widgetsPage.clickPromptAlert();
  });

  test('should handle prompt alert - dismiss', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.dismiss();
    });
    await widgetsPage.clickPromptAlert();
  });
});

test.describe('Widgets - New Tab & Popup Windows', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should open new tab', async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      widgetsPage.clickNewTab()
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).not.toBe(page.url());
  });

  test('should open popup window', async ({ page, context }) => {
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      widgetsPage.clickPopupWindows()
    ]);
    await popup.waitForLoadState();
    expect(popup.url()).not.toBe(page.url());
  });
});

test.describe('Widgets - Mouse Hover', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should hover over Point Me button and show dropdown', async ({ page }) => {
    await widgetsPage.hoverPointMe();
    await expect(page.locator('.dropdown-menu')).toBeVisible();
  });
});

test.describe('Widgets - Double Click', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should copy text from Field1 to Field2 on double click', async ({ page }) => {
    const field1Value = await widgetsPage.getField1Value();
    expect(field1Value).toBe('Hello World!');

    await widgetsPage.doubleClickCopyText();
    const field2Value = await widgetsPage.getField2Value();
    expect(field2Value).toBe(field1Value);
  });
});

test.describe('Widgets - Drag and Drop', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should drag element to drop target', async ({ page }) => {
    await widgetsPage.dragAndDrop();
    await expect(page.locator('.droppable')).toContainText('Dropped');
  });
});

test.describe('Widgets - Slider', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should verify price range slider value', async ({ page }) => {
    const priceRange = await widgetsPage.getPriceRange();
    expect(priceRange).toContain('$');
  });
});

test.describe('Widgets - Labels And Links', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should verify mobile labels are visible', async ({ page }) => {
    await expect(widgetsPage.samsungLabel).toBeVisible();
    await expect(widgetsPage.realMeLabel).toBeVisible();
    await expect(widgetsPage.motoLabel).toBeVisible();
  });

  test('should verify laptop links are visible', async ({ page }) => {
    await expect(widgetsPage.appleLink).toBeVisible();
    await expect(widgetsPage.lenovoLink).toBeVisible();
    await expect(widgetsPage.dellLink).toBeVisible();
  });

  test('should verify all broken links exist', async ({ page }) => {
    await expect(widgetsPage.error400Link).toBeVisible();
    await expect(widgetsPage.error401Link).toBeVisible();
    await expect(widgetsPage.error403Link).toBeVisible();
    await expect(widgetsPage.error404Link).toBeVisible();
    await expect(widgetsPage.error408Link).toBeVisible();
    await expect(widgetsPage.error500Link).toBeVisible();
    await expect(widgetsPage.error502Link).toBeVisible();
    await expect(widgetsPage.error503Link).toBeVisible();
  });

  test('should get all broken link hrefs', async ({ page }) => {
    const hrefs = await widgetsPage.getAllBrokenLinks();
    expect(hrefs.length).toBe(8);
    for (const href of hrefs) {
      expect(href).toContain('deadlinkcity');
    }
  });
});

test.describe('Widgets - Dynamic Button', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should click START button and wait for dynamic button', async ({ page }) => {
    await widgetsPage.clickStartButton();
    await widgetsPage.waitForDynamicButton();
    await expect(page.getByRole('button', { name: 'STOP' })).toBeVisible();
  });
});

test.describe('Widgets - Tabs', () => {
  let widgetsPage;

  test.beforeEach(async ({ page }) => {
    widgetsPage = new WidgetsPage(page);
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  test('should verify tabs section elements', async ({ page }) => {
    await expect(widgetsPage.tabsHeading).toBeVisible();
    await expect(widgetsPage.wikipediaLink).toBeVisible();
    await expect(widgetsPage.tabSearchInput).toBeVisible();
    await expect(widgetsPage.tabSubmitButton).toBeVisible();
  });
});