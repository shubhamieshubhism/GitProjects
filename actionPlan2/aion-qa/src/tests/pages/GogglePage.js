
const { Page } = require('@playwright/test');

class GooglePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Get "About" link.
   *
   * @return {Promise<Locator>}
   */
  get aboutLink() {
    return this.page.getByRole('link', { name: 'About' });
  }

  /**
   * Get "Store" link.
   *
   * @return {Promise<Locator>}
   */
  get storeLink() {
    return this.page.getByRole('link', { name: 'Store' });
  }

  /**
   * Get "Gmail" link.
   *
   * @return {Promise<Locator>}
   */
  get gmailLink() {
    return this.page.getByRole('link', { name: 'Gmail' });
  }

  /**
   * Get "Images" link.
   *
   * @return {Promise<Locator>}
   */
  get imagesLink() {
    return this.page.getByRole('link', { name: 'Images' });
  }

  /**
   * Get "Apps" button.
   *
   * @return {Promise<Locator>}
   */
  get appsButton() {
    return this.page.getByRole('button');
  }

  /**
   * Get "Sign in" link.
   *
   * @return {Promise<Locator>}
   */
  get signInLink() {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  /**
   * Get "Search by voice" button.
   *
   * @return {Promise<Locator>}
   */
  get searchByVoiceButton() {
    return this.page.getByRole('button', { hasText: 'Search by voice' });
  }

  /**
   * Get "Share" button.
   *
   * @return {Promise<Locator>}
   */
  get shareButton() {
    return this.page.getByRole('button');
  }

  /**
   * Get "See more" button.
   *
   * @return {Promise<Locator>}
   */
  get seeMoreButton() {
    return this.page.getByRole('button', { hasText: 'See more' });
  }

  /**
   * Get "Word pronunciation" button.
   *
   * @return {Promise<Locator>}
   */
  get wordPronunciationButton() {
    return this.page.getByRole('button');
  }

  /**
   * Get search input.
   *
   * @return {Promise<Locator>}
   */
  get searchInput() {
    return this.page.getByPlaceholder('');
  }

  /**
   * Click the "Search" button.
   *
   * @param {string} query
   * @return {Promise<void>}
   */
  async search(query) {
    await this.searchInput.fill(query);
    await this.page.getByRole('button', { hasText: 'Google Search' }).click();
  }

  /**
   * Click the "I'm Feeling Lucky" button.
   *
   * @param {string} query
   * @return {Promise<void>}
   */
  async imFeelingLucky(query) {
    await this.searchInput.fill(query);
    await this.page.getByRole('button', { hasText: 'I\'m Feeling Lucky' }).click();
  }

  /**
   * Click the "Settings" button.
   *
   * @return {Promise<void>}
   */
  async settings() {
    await this.page.getByRole('button').click();
  }
}

module.exports = { GooglePage };
