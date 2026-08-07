const { test, expect } = require('@playwright/test');
const { HiddenElementsPage } = require('../pages/HiddenElementsPage');

test.describe('Hidden Elements & AJAX - Input Boxes', () => {
  let hiddenPage;

  test.beforeEach(async ({ page }) => {
    hiddenPage = new HiddenElementsPage(page);
    await hiddenPage.goto();
  });

  test('should verify page heading', async ({ page }) => {
    await expect(hiddenPage.pageHeading).toBeVisible();
    await expect(page).toHaveTitle(/Hidden Elements & AJAX/);
  });

  test('should fill Input Box 1', async ({ page }) => {
    await hiddenPage.fillInputBox1('Test input 1');
    await expect(hiddenPage.inputBox1).toHaveValue('Test input 1');
  });

  test('should verify Input Box 2 is not visible initially', async ({ page }) => {
    await expect(hiddenPage.inputBox2).not.toBeVisible();
  });

  test('should toggle Input Box 2 visibility', async ({ page }) => {
    await hiddenPage.toggleInputBox2();
    await expect(hiddenPage.inputBox2).toBeVisible();

    await hiddenPage.fillInputBox2('Test input 2');
    await expect(hiddenPage.inputBox2).toHaveValue('Test input 2');

    await hiddenPage.toggleInputBox2();
    await expect(hiddenPage.inputBox2).not.toBeVisible();
  });
});

test.describe('Hidden Elements & AJAX - Checkboxes', () => {
  let hiddenPage;

  test.beforeEach(async ({ page }) => {
    hiddenPage = new HiddenElementsPage(page);
    await hiddenPage.goto();
  });

  test('should check and uncheck Checkbox 1', async ({ page }) => {
    await hiddenPage.checkCheckbox1();
    await expect(hiddenPage.checkbox1).toBeChecked();

    await hiddenPage.uncheckCheckbox1();
    await expect(hiddenPage.checkbox1).not.toBeChecked();
  });

  test('should verify Checkbox 2 is not visible initially', async ({ page }) => {
    await expect(hiddenPage.checkbox2).not.toBeVisible();
  });

  test('should toggle Checkbox 2 visibility and check it', async ({ page }) => {
    await hiddenPage.toggleCheckbox2();
    await expect(hiddenPage.checkbox2).toBeVisible();

    await hiddenPage.checkCheckbox2();
    await expect(hiddenPage.checkbox2).toBeChecked();

    await hiddenPage.toggleCheckbox2();
    await expect(hiddenPage.checkbox2).not.toBeVisible();
  });
});

test.describe('Hidden Elements & AJAX - AJAX Content', () => {
  let hiddenPage;

  test.beforeEach(async ({ page }) => {
    hiddenPage = new HiddenElementsPage(page);
    await hiddenPage.goto();
  });

  test('should verify initial status is Ready', async ({ page }) => {
    const status = await hiddenPage.getStatusText();
    expect(status).toContain('Ready');
  });

  test('should load AJAX content', async ({ page }) => {
    await hiddenPage.loadAjaxContent();
    await hiddenPage.page.waitForTimeout(2000);
    const ajaxContent = await hiddenPage.getAjaxContent();
    expect(ajaxContent).toContain('AJAX Content Loaded');
  });
});
