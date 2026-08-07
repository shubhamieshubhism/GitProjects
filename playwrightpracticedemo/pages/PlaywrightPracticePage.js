const { expect } = require('@playwright/test');

exports.PlaywrightPracticePage = class PlaywrightPracticePage {
  constructor(page) {
    this.page = page;

    // Heading
    this.pageHeading = page.getByRole('heading', { name: 'PlaywrightPractice' });

    // 1. getByRole() Locators section
    this.getByRoleHeading = page.getByRole('heading', { name: '1. getByRole() Locators' });
    this.primaryActionButton = page.getByRole('button', { name: 'Primary Action' });
    this.toggleButton = page.getByRole('button', { name: 'Toggle Button' });
    this.divWithButtonRole = page.getByRole('button', { name: 'Div with button role' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username:' });
    this.acceptTermsCheckbox = page.getByRole('checkbox', { name: 'Accept terms' });
    this.navHomeLink = page.locator('nav').first().getByRole('link', { name: 'Home' });
    this.navProductsLink = page.locator('nav').first().getByRole('link', { name: 'Products' });
    this.navContactLink = page.locator('nav').first().getByRole('link', { name: 'Contact' });
    this.alertMessage = page.getByRole('alert');

    // 2. getByText() Locators section
    this.getByTextHeading = page.getByRole('heading', { name: '2. getByText() Locators' });
    this.importantText = page.locator('strong', { hasText: 'important' });
    this.coloredTextParagraph = page.locator('p', { hasText: 'Another paragraph with colored text' });
    this.listItem1 = page.locator('li', { hasText: 'List item 1' });
    this.listItem2 = page.locator('li', { hasText: 'List item 2' });
    this.specialText = page.locator('li', { hasText: 'Special: Unique text identifier' });
    this.submitFormButton = page.getByRole('button', { name: 'Submit Form' });

    // 3. getByLabel() Locators section
    this.getByLabelHeading = page.getByRole('heading', { name: '3. getByLabel() Locators' });
    this.emailInput = page.getByLabel('Email Address:');
    this.passwordInput = page.getByLabel('Password:');
    this.ageInput = page.getByLabel('Your Age:');
    this.standardRadio = page.getByLabel('Standard');
    this.expressRadio = page.getByLabel('Express');

    // 4. getByPlaceholder() Locators section
    this.getByPlaceholderHeading = page.getByRole('heading', { name: '4. getByPlaceholder() Locators' });
    this.fullNameInput = page.getByPlaceholder('Enter your full name');
    this.phoneInput = page.getByPlaceholder('Phone number (xxx-xxx-xxxx)');
    this.messageInput = page.getByPlaceholder('Type your message here...');
    this.searchInput = page.getByPlaceholder('Search products...');
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // 5. getByAltText() Locators section
    this.getByAltTextHeading = page.getByRole('heading', { name: '5. getByAltText() Locators' });
    this.logoImage = page.getByAltText('logo image');

    // 6. getByTitle() Locators section
    this.getByTitleHeading = page.getByRole('heading', { name: '6. getByTitle() Locators' });
    this.titleHomeLink = page.getByTitle('Home');
    this.htmlListItem = page.locator('li', { hasText: 'HTML' });
    this.tooltipText = page.locator('li', { hasText: 'This text has a tooltip' });
    this.saveButton = page.getByRole('button', { name: 'Save' });

    // 7. getByTestId() Locators section
    this.getByTestIdHeading = page.getByRole('heading', { name: '7. getByTestId() Locators' });
    this.profileName = page.getByTestId('profile-name');
    this.profileEmail = page.getByTestId('profile-email');
    this.editProfileButton = page.getByTestId('edit-profile-btn');
    this.productA = page.getByTestId('product-card-1');
    this.productB = page.getByTestId('product-card-2');
    this.productC = page.getByTestId('product-card-3');
    this.testIdNavHome = page.getByTestId('nav-home');
    this.testIdNavProducts = page.getByTestId('nav-products');
    this.testIdNavContact = page.getByTestId('nav-contact');

    // Footer
    this.footerText = page.locator('footer p');
    this.topButton = page.getByRole('button', { name: '↑ Top' });
  }

  async goto() {
    await this.page.goto('https://testautomationpractice.blogspot.com/p/playwrightpractice.html');
  }

  // getByRole() methods
  async clickPrimaryAction() {
    await this.primaryActionButton.click();
  }

  async clickToggleButton() {
    await this.toggleButton.click();
  }

  async clickDivWithButtonRole() {
    await this.divWithButtonRole.click();
  }

  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async checkAcceptTerms() {
    await this.acceptTermsCheckbox.check();
  }

  async uncheckAcceptTerms() {
    await this.acceptTermsCheckbox.uncheck();
  }

  // getByText() methods
  async clickSubmitForm() {
    await this.submitFormButton.click();
  }

  // getByLabel() methods
  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async fillAge(age) {
    await this.ageInput.fill(String(age));
  }

  async selectShippingMethod(method) {
    if (method.toLowerCase() === 'standard') {
      await this.standardRadio.check();
    } else if (method.toLowerCase() === 'express') {
      await this.expressRadio.check();
    }
  }

  // getByPlaceholder() methods
  async fillFullName(name) {
    await this.fullNameInput.fill(name);
  }

  async fillPhone(phone) {
    await this.phoneInput.fill(phone);
  }

  async fillMessage(message) {
    await this.messageInput.fill(message);
  }

  async searchProducts(searchTerm) {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  // getByTitle() methods
  async hoverOverTitleElements() {
    await this.titleHomeLink.hover();
    await this.htmlListItem.hover();
    await this.tooltipText.hover();
  }

  async clickSave() {
    await this.saveButton.click();
  }

  // getByTestId() methods
  async clickEditProfile() {
    await this.editProfileButton.click();
  }

  async getProductPrice(productTestId) {
    return await this.page.getByTestId(productTestId).locator('p').textContent();
  }

  async clickTopButton() {
    await this.topButton.click();
  }
};