const { expect } = require('@playwright/test');

exports.DownloadFilesPage = class DownloadFilesPage {
  constructor(page) {
    this.page = page;

    // Heading
    this.pageHeading = page.getByRole('heading', { name: 'Download Files' });

    // Download Text/PDF section
    this.downloadTextPdfHeading = page.getByRole('heading', { name: 'Download a Text or PDF File' });
    this.enterTextInput = page.locator('#inputText');
    this.generateTextFileButton = page.locator('#generateTxt');
    this.generatePdfFileButton = page.locator('#generatePdf');
    this.downloadTextLink = page.locator('#txtDownloadLink');

    // PDF with Browser section
    this.pdfWithBrowserHeading = page.getByRole('heading', { name: 'PDF File with the Browser' });
    this.downloadPdfButton = page.getByRole('button', { name: 'Download PDF File' });
  }

  async goto() {
    await this.page.goto('https://testautomationpractice.blogspot.com/p/download-files_25.html');
  }

  async enterText(text) {
    await this.enterTextInput.fill(text);
  }

  async downloadTextFile() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generateTextFileButton.click();
    return await downloadPromise;
  }

  async downloadPdfFile() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generatePdfFileButton.click();
    return await downloadPromise;
  }

  async downloadPdfWithBrowser() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadPdfButton.click();
    return await downloadPromise;
  }
};