class WidgetsPage {
  constructor(page) {
    this.page = page;

    // Tabs / Wikipedia
    this.wikipediaInput = page.locator('#Wikipedia1_wikipedia-search-input');
    this.wikipediaSubmit = page.locator('.wikipedia-search-button');
    this.wikipediaResults = page.locator('.wikipedia-search-results');

    // Dynamic Button
    this.dynamicButton = page.locator('button[name="start"], button[name="stop"]');

    // Alerts & Popups
    this.simpleAlertBtn = page.locator('#alertBtn');
    this.confirmationAlertBtn = page.locator('#confirmBtn');
    this.promptAlertBtn = page.locator('#promptBtn');
    this.alertDemoText = page.locator('#demo');

    // New Tab
    this.newTabBtn = page.locator('button:has-text("New Tab")');

    // Popup Windows
    this.popupWindowsBtn = page.locator('#PopUp');

    // Mouse Hover
    this.pointMeBtn = page.locator('.dropbtn');
    this.hoverDropdownMobiles = page.locator('.dropdown-content a:has-text("Mobiles")');
    this.hoverDropdownLaptops = page.locator('.dropdown-content a:has-text("Laptops")');

    // Double Click
    this.field1 = page.locator('#field1');
    this.field2 = page.locator('#field2');
    this.copyTextBtn = page.locator('button:has-text("Copy Text")');

    // Drag and Drop
    this.draggable = page.locator('#draggable');
    this.droppable = page.locator('#droppable');

    // Slider
    this.sliderRange = page.locator('#slider-range');
    this.priceRangeInput = page.locator('#amount');

    // SVG Elements
    this.svgCircle = page.locator('svg circle');
    this.svgRect = page.locator('svg rect');
    this.svgPolygon = page.locator('svg polygon');

    // Scrolling DropDown
    this.comboBox = page.locator('#comboBox');
    this.comboBoxDropdown = page.locator('#dropdown');

    // Labels And Links
    this.mobileLabelSamsung = page.locator('#samsung');
    this.mobileLabelRealme = page.locator('#realme');
    this.mobileLabelMoto = page.locator('#moto');
    this.laptopLinkApple = page.locator('#apple');
    this.laptopLinkLenovo = page.locator('#lenovo');
    this.laptopLinkDell = page.locator('#dell');
    this.brokenLinks = page.locator('#broken-links a');
  }

  // Wikipedia / Tabs
  async searchWikipedia(query) {
    await this.wikipediaInput.fill(query);
    await this.wikipediaSubmit.click();
  }

  // Dynamic Button
  async clickDynamicButton() {
    await this.dynamicButton.click();
  }

  async getDynamicButtonText() {
    return this.dynamicButton.textContent();
  }

  // Alerts
  async clickSimpleAlert() {
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await this.simpleAlertBtn.click();
  }

  async clickConfirmationAlert(accept = true) {
    this.page.once('dialog', async dialog => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
    await this.confirmationAlertBtn.click();
  }

  async clickPromptAlert(inputText = '') {
    this.page.once('dialog', async dialog => {
      await dialog.accept(inputText);
    });
    await this.promptAlertBtn.click();
  }

  async getAlertDemoText() {
    return this.alertDemoText.textContent();
  }

  // New Tab
  async clickNewTab() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.newTabBtn.click()
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  // Popup Windows
  async clickPopupWindows() {
    const [newPage1, newPage2] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.context().waitForEvent('page'),
      this.popupWindowsBtn.click()
    ]);
    return { seleniumPage: newPage1, playwrightPage: newPage2 };
  }

  // Mouse Hover
  async hoverOnPointMe() {
    await this.pointMeBtn.hover();
  }

  async clickHoverOption(option) {
    if (option.toLowerCase() === 'mobiles') {
      await this.hoverDropdownMobiles.click();
    } else if (option.toLowerCase() === 'laptops') {
      await this.hoverDropdownLaptops.click();
    }
  }

  // Double Click
  async doubleClickCopyText() {
    await this.copyTextBtn.dblclick();
  }

  async getField1Value() {
    return this.field1.inputValue();
  }

  async getField2Value() {
    return this.field2.inputValue();
  }

  // Drag and Drop
  async dragAndDrop() {
    await this.draggable.dragTo(this.droppable);
  }

  async getDroppableText() {
    return this.droppable.locator('p').textContent();
  }

  // Slider
  async getPriceRange() {
    return this.priceRangeInput.inputValue();
  }

  // Scrolling Dropdown
  async focusComboBox() {
    await this.comboBox.focus();
  }

  async selectComboBoxItem(itemText) {
    await this.comboBox.focus();
    await this.page.locator(`#dropdown .option`).getByText(itemText, { exact: true }).click();
  }

  async getComboBoxValue() {
    return this.comboBox.inputValue();
  }

  // Labels and Links
  async getMobileLabelText(labelId) {
    const locators = {
      samsung: this.mobileLabelSamsung,
      realme: this.mobileLabelRealme,
      moto: this.mobileLabelMoto
    };
    return locators[labelId].textContent();
  }

  async clickLaptopLink(brand) {
    const links = {
      apple: this.laptopLinkApple,
      lenovo: this.laptopLinkLenovo,
      dell: this.laptopLinkDell
    };
    await links[brand.toLowerCase()].click();
  }

  async getBrokenLinksCount() {
    return this.brokenLinks.count();
  }

  async getBrokenLinkHref(index) {
    return this.brokenLinks.nth(index).getAttribute('href');
  }

  async clickBrokenLink(index) {
    await this.brokenLinks.nth(index).click();
  }
}

module.exports = { WidgetsPage };