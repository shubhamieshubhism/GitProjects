const { test, expect } = require('@playwright/test');
const { PlaywrightPracticePage } = require('../pages/PlaywrightPracticePage');

test.describe('PlaywrightPractice Page - getByRole() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should verify page heading is visible', async ({ page }) => {
    await expect(practicePage.pageHeading).toBeVisible();
    await expect(page).toHaveTitle(/PlaywrightPractice/);
  });

  test('should click Primary Action button', async ({ page }) => {
    await practicePage.clickPrimaryAction();
    await expect(practicePage.primaryActionButton).toBeVisible();
  });

  test('should click Toggle Button', async ({ page }) => {
    await practicePage.clickToggleButton();
    await expect(practicePage.toggleButton).toBeVisible();
  });

  test('should click Div with button role', async ({ page }) => {
    await practicePage.clickDivWithButtonRole();
    await expect(practicePage.divWithButtonRole).toBeVisible();
  });

  test('should fill username field', async ({ page }) => {
    await practicePage.fillUsername('testuser');
    await expect(practicePage.usernameInput).toHaveValue('testuser');
  });

  test('should check and uncheck accept terms checkbox', async ({ page }) => {
    await practicePage.checkAcceptTerms();
    await expect(practicePage.acceptTermsCheckbox).toBeChecked();

    await practicePage.uncheckAcceptTerms();
    await expect(practicePage.acceptTermsCheckbox).not.toBeChecked();
  });

  test('should verify navigation links in getByRole section', async ({ page }) => {
    await expect(practicePage.navHomeLink).toBeVisible();
    await expect(practicePage.navProductsLink).toBeVisible();
    await expect(practicePage.navContactLink).toBeVisible();
  });

  test('should verify alert message is visible', async ({ page }) => {
    await expect(practicePage.alertMessage).toBeVisible();
    await expect(practicePage.alertMessage).toContainText('important alert message');
  });
});

test.describe('PlaywrightPractice Page - getByText() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should verify important text is visible', async ({ page }) => {
    await expect(practicePage.importantText).toBeVisible();
    await expect(practicePage.importantText).toHaveText('important');
  });

  test('should verify colored text paragraph', async ({ page }) => {
    await expect(practicePage.coloredTextParagraph).toBeVisible();
  });

  test('should verify list items', async ({ page }) => {
    await expect(practicePage.listItem1).toBeVisible();
    await expect(practicePage.listItem2).toBeVisible();
    await expect(practicePage.specialText).toBeVisible();
    await expect(practicePage.specialText).toContainText('Special: Unique text identifier');
  });

  test('should click Submit Form button', async ({ page }) => {
    await practicePage.clickSubmitForm();
    await expect(practicePage.submitFormButton).toBeVisible();
  });
});

test.describe('PlaywrightPractice Page - getByLabel() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should fill email, password and age fields', async ({ page }) => {
    await practicePage.fillEmail('test@example.com');
    await practicePage.fillPassword('password123');
    await practicePage.fillAge(30);

    await expect(practicePage.emailInput).toHaveValue('test@example.com');
    await expect(practicePage.passwordInput).toHaveValue('password123');
    await expect(practicePage.ageInput).toHaveValue('30');
  });

  test('should select Standard shipping method', async ({ page }) => {
    await practicePage.selectShippingMethod('Standard');
    await expect(practicePage.standardRadio).toBeChecked();
    await expect(practicePage.expressRadio).not.toBeChecked();
  });

  test('should select Express shipping method', async ({ page }) => {
    await practicePage.selectShippingMethod('Express');
    await expect(practicePage.expressRadio).toBeChecked();
    await expect(practicePage.standardRadio).not.toBeChecked();
  });
});

test.describe('PlaywrightPractice Page - getByPlaceholder() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should fill full name, phone and message fields', async ({ page }) => {
    await practicePage.fillFullName('John Doe');
    await practicePage.fillPhone('123-456-7890');
    await practicePage.fillMessage('Hello, this is a test message');

    await expect(practicePage.fullNameInput).toHaveValue('John Doe');
    await expect(practicePage.phoneInput).toHaveValue('123-456-7890');
    await expect(practicePage.messageInput).toHaveValue('Hello, this is a test message');
  });

  test('should search products', async ({ page }) => {
    await practicePage.searchProducts('laptop');
    await expect(practicePage.searchInput).toHaveValue('laptop');
  });
});

test.describe('PlaywrightPractice Page - getByAltText() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should verify logo image is visible', async ({ page }) => {
    await expect(practicePage.logoImage).toBeVisible();
    await expect(practicePage.logoImage).toHaveAttribute('alt', 'logo image');
  });
});

test.describe('PlaywrightPractice Page - getByTitle() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should verify title elements exist', async ({ page }) => {
    await expect(practicePage.titleHomeLink).toBeVisible();
    await expect(practicePage.htmlListItem).toBeVisible();
    await expect(practicePage.tooltipText).toBeVisible();
  });

  test('should hover over title elements', async ({ page }) => {
    await practicePage.hoverOverTitleElements();
    await expect(practicePage.saveButton).toBeVisible();
  });

  test('should click Save button', async ({ page }) => {
    await practicePage.clickSave();
    await expect(practicePage.saveButton).toBeVisible();
  });
});

test.describe('PlaywrightPractice Page - getByTestId() Locators', () => {
  let practicePage;

  test.beforeEach(async ({ page }) => {
    practicePage = new PlaywrightPracticePage(page);
    await practicePage.goto();
  });

  test('should verify profile information', async ({ page }) => {
    await expect(practicePage.profileName).toHaveText('John Doe');
    await expect(practicePage.profileEmail).toHaveText('john.doe@example.com');
  });

  test('should click Edit Profile button', async ({ page }) => {
    await practicePage.clickEditProfile();
    await expect(practicePage.editProfileButton).toBeVisible();
  });

  test('should verify product prices', async ({ page }) => {
    const productAPrice = await practicePage.getProductPrice('product-card-1');
    const productBPrice = await practicePage.getProductPrice('product-card-2');
    const productCPrice = await practicePage.getProductPrice('product-card-3');

    expect(productAPrice.trim()).toBe('$19.99');
    expect(productBPrice.trim()).toBe('$29.99');
    expect(productCPrice.trim()).toBe('$39.99');
  });

  test('should verify testid navigation links', async ({ page }) => {
    await expect(practicePage.testIdNavHome).toBeVisible();
    await expect(practicePage.testIdNavProducts).toBeVisible();
    await expect(practicePage.testIdNavContact).toBeVisible();
  });

  test('should click Top button', async ({ page }) => {
    await practicePage.clickTopButton();
    await expect(practicePage.topButton).toBeVisible();
  });
});