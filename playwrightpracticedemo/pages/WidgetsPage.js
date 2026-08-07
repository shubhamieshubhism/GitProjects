const { expect } = require('@playwright/test');

exports.WidgetsPage = class WidgetsPage {
  constructor(page) {
    this.page = page;

    // Tabs section
    this.tabsHeading = page.getByRole('heading', { name: 'Tabs' });
    this.wikipediaLink = page.locator('a[href="https://wikipedia.org/wiki/"]');
    this.tabSearchInput = page.locator('.widget-content input[type="text"]').first();
    this.tabSubmitButton = page.locator('.widget-content button').first();

    // Dynamic Button section
    this.dynamicButtonHeading = page.getByRole('heading', { name: 'Dynamic Button' });
    this.startButton = page.getByRole('button', { name: 'START' });

    // Alerts & Popups section
    this.alertsHeading = page.getByRole('heading', { name: 'Alerts & Popups' });
    this.simpleAlertButton = page.getByRole('button', { name: 'Simple Alert' });
    this.confirmationAlertButton = page.getByRole('button', { name: 'Confirmation Alert' });
    this.promptAlertButton = page.getByRole('button', { name: 'Prompt Alert' });

    // New Tab & Popup Windows
    this.newTabButton = page.getByRole('button', { name: 'New Tab' });
    this.popupWindowsButton = page.getByRole('button', { name: 'Popup Windows' });

    // Mouse Hover section
    this.mouseHoverHeading = page.getByRole('heading', { name: 'Mouse Hover' });
    this.pointMeButton = page.getByRole('button', { name: 'Point Me' });

    // Double Click section
    this.doubleClickHeading = page.getByRole('heading', { name: 'Double Click' });
    this.field1Input = page.locator('#field1');
    this.field2Input = page.locator('#field2');
    this.copyTextButton = page.getByRole('button', { name: 'Copy Text' });

    // Drag and Drop section
    this.dragAndDropHeading = page.getByRole('heading', { name: 'Drag and Drop' });
    this.draggableElement = page.locator('.draggable');
    this.dropTarget = page.locator('.droppable');

    // Slider section
    this.sliderHeading = page.getByRole('heading', { name: 'Slider' });
    this.priceRangeInput = page.getByLabel('Price range:');

    // SVG Elements
    this.svgHeading = page.getByRole('heading', { name: 'SVG Elements' });

    // Scrolling DropDown
    this.scrollingDropdownHeading = page.getByRole('heading', { name: 'Scrolling DropDown' });
    this.scrollingDropdownInput = page.getByLabel('Select an item');

    // Labels And Links
    this.labelsAndLinksHeading = page.getByRole('heading', { name: 'Labels And Links' });
    this.mobileLabelsHeading = page.getByRole('heading', { name: 'Mobile Labels' });
    this.samsungLabel = page.locator('text=Samsung');
    this.realMeLabel = page.locator('text=Real Me');
    this.motoLabel = page.locator('text=Moto');
    this.laptopLinksHeading = page.getByRole('heading', { name: 'Laptop Links' });
    this.appleLink = page.getByRole('link', { name: 'Apple' });
    this.lenovoLink = page.getByRole('link', { name: 'Lenovo' });
    this.dellLink = page.getByRole('link', { name: 'Dell' });
    this.brokenLinksHeading = page.getByRole('heading', { name: 'Broken Links' });
    this.error400Link = page.getByRole('link', { name: 'Errorcode 400' });
    this.error401Link = page.getByRole('link', { name: 'Errorcode 401' });
    this.error403Link = page.getByRole('link', { name: 'Errorcode 403' });
    this.error404Link = page.getByRole('link', { name: 'Errorcode 404' });
    this.error408Link = page.getByRole('link', { name: 'Errorcode 408' });
    this.error500Link = page.getByRole('link', { name: 'Errorcode 500' });
    this.error502Link = page.getByRole('link', { name: 'Errorcode 502' });
    this.error503Link = page.getByRole('link', { name: 'Errorcode 503' });
  }

  // Tabs methods
  async clickWikipediaLink() {
    await this.wikipediaLink.click();
  }

  async searchOnTab(searchTerm) {
    await this.tabSearchInput.fill(searchTerm);
    await this.tabSubmitButton.click();
  }

  // Dynamic Button methods
  async clickStartButton() {
    await this.startButton.click();
  }

  async waitForDynamicButton() {
    await this.page.waitForTimeout(5000);
  }

  // Alert methods
  async clickSimpleAlert() {
    await this.simpleAlertButton.click();
  }

  async clickConfirmationAlert() {
    await this.confirmationAlertButton.click();
  }

  async clickPromptAlert() {
    await this.promptAlertButton.click();
  }

  // New Tab & Popup methods
  async clickNewTab() {
    await this.newTabButton.click();
  }

  async clickPopupWindows() {
    await this.popupWindowsButton.click();
  }

  // Mouse Hover methods
  async hoverPointMe() {
    await this.pointMeButton.hover();
  }

  // Double Click methods
  async doubleClickCopyText() {
    await this.copyTextButton.dblclick();
  }

  async getField1Value() {
    return await this.field1Input.inputValue();
  }

  async getField2Value() {
    return await this.field2Input.inputValue();
  }

  // Drag and Drop methods
  async dragAndDrop() {
    await this.draggableElement.dragTo(this.dropTarget);
  }

  // Slider methods
  async getPriceRange() {
    return await this.priceRangeInput.inputValue();
  }

  async setPriceRange(value) {
    await this.priceRangeInput.fill(value);
  }

  // Scrolling DropDown methods
  async selectScrollingItem(item) {
    await this.scrollingDropdownInput.click();
    await this.page.locator('text=' + item).click();
  }

  // Links methods
  async clickAppleLink() {
    await this.appleLink.click();
  }

  async clickLenovoLink() {
    await this.lenovoLink.click();
  }

  async clickDellLink() {
    await this.dellLink.click();
  }

  async clickBrokenLink(errorCode) {
    await this.page.getByRole('link', { name: 'Errorcode ' + errorCode }).click();
  }

  async getAllBrokenLinks() {
    const links = await this.page.locator('a[href*="deadlinkcity"]').all();
    const hrefs = [];
    for (const link of links) {
      hrefs.push(await link.getAttribute('href'));
    }
    return hrefs;
  }
};