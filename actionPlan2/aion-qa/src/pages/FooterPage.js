class FooterPage {
  constructor(page) {
    this.page = page;

    // Form sections in footer
    this.section1Heading = page.locator('#section1 h4');
    this.section1Para = page.locator('#para1');
    this.section1Input = page.locator('#input1');
    this.section1Btn = page.locator('#btn1');

    this.section2Heading = page.locator('#section2 h4');
    this.section2Para = page.locator('#para2');
    this.section2Input = page.locator('#input2');
    this.section2Btn = page.locator('#btn2');

    this.section3Heading = page.locator('#section3 h4');
    this.section3Para = page.locator('#para3');
    this.section3Input = page.locator('#input3');
    this.section3Btn = page.locator('#btn3');

    // Footer Links
    this.footerLinks = page.locator('.footer-outer .PageList a');
  }

  async fillSection1Input(text) {
    await this.section1Input.fill(text);
  }

  async clickSection1Submit() {
    await this.section1Btn.click();
  }

  async getSection1ParaText() {
    return this.section1Para.textContent();
  }

  async fillSection2Input(text) {
    await this.section2Input.fill(text);
  }

  async clickSection2Submit() {
    await this.section2Btn.click();
  }

  async getSection2ParaText() {
    return this.section2Para.textContent();
  }

  async fillSection3Input(text) {
    await this.section3Input.fill(text);
  }

  async clickSection3Submit() {
    await this.section3Btn.click();
  }

  async getSection3ParaText() {
    return this.section3Para.textContent();
  }

  async getFooterLinkCount() {
    return this.footerLinks.count();
  }

  async clickFooterLink(index) {
    await this.footerLinks.nth(index).click();
  }
}

module.exports = { FooterPage };