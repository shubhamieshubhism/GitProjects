const { expect } = require('@playwright/test');

exports.HiddenElementsPage = class HiddenElementsPage {
  constructor(page) {
    this.page = page;

    // Heading
    this.pageHeading = page.getByRole('heading', { name: 'Hidden Elements & AJAX' });

    // Input Boxes
    this.inputBox1 = page.locator('#input1');
    this.inputBox2 = page.locator('#input2');
    this.checkbox1 = page.locator('#checkbox1');
    this.checkbox2 = page.locator('#checkbox2');

    // Toggle Buttons
    this.toggleInputBox2Button = page.locator('#toggleInput');
    this.toggleCheckbox2Button = page.locator('#toggleCheckbox');

    // AJAX
    this.loadAjaxContentButton = page.locator('#loadContent');
    this.statusText = page.locator('#statusLabel');
    this.ajaxContent = page.locator('#ajaxContent');
  }

  async goto() {
    await this.page.goto('https://testautomationpractice.blogspot.com/p/gui-elements-ajax-hidden.html');
    // Wait for iframe to load
    await this.page.waitForSelector('iframe', { timeout: 5000 }).catch(() => {});
  }

  async fillInputBox1(text) {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#input1').fill(text);
  }

  async fillInputBox2(text) {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#input2').fill(text);
  }

  async checkCheckbox1() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#checkbox1').check();
  }

  async uncheckCheckbox1() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#checkbox1').uncheck();
  }

  async checkCheckbox2() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#checkbox2').check();
  }

  async uncheckCheckbox2() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#checkbox2').uncheck();
  }

  async toggleInputBox2() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#toggleInput').click();
  }

  async toggleCheckbox2() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#toggleCheckbox').click();
  }

  async loadAjaxContent() {
    const frame = this.page.frameLocator('iframe').first();
    await frame.locator('#loadContent').click();
  }

  async getStatusText() {
    const frame = this.page.frameLocator('iframe').first();
    return await frame.locator('#statusLabel').textContent();
  }

  async isInputBox2Visible() {
    const frame = this.page.frameLocator('iframe').first();
    return await frame.locator('#input2').isVisible();
  }

  async isCheckbox2Visible() {
    const frame = this.page.frameLocator('iframe').first();
    return await frame.locator('#checkbox2').isVisible();
  }

  async getAjaxContent() {
    const frame = this.page.frameLocator('iframe').first();
    return await frame.locator('#ajaxContent').textContent();
  }
};