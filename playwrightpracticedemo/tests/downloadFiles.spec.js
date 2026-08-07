const { test, expect } = require('@playwright/test');
const { DownloadFilesPage } = require('../pages/DownloadFilesPage');

test.describe('Download Files - Text File', () => {
  let downloadPage;

  test.beforeEach(async ({ page }) => {
    downloadPage = new DownloadFilesPage(page);
    await downloadPage.goto();
  });

  test('should verify page heading', async ({ page }) => {
    await expect(downloadPage.pageHeading).toBeVisible();
    await expect(page).toHaveTitle(/Download Files/);
  });

  test('should verify download section headings', async ({ page }) => {
    await expect(downloadPage.downloadTextPdfHeading).toBeVisible();
    await expect(downloadPage.pdfWithBrowserHeading).toBeVisible();
  });

  test('should enter text in the input field', async ({ page }) => {
    await downloadPage.enterText('This is test content for download');
    await expect(downloadPage.enterTextInput).toHaveValue('This is test content for download');
  });

  test('should verify download buttons are visible', async ({ page }) => {
    await expect(downloadPage.generateTextFileButton).toBeVisible();
    await expect(downloadPage.generatePdfFileButton).toBeVisible();
  });

  test('should click generate text download button', async ({ page }) => {
    await downloadPage.enterText('Test content');
    await downloadPage.generateTextFileButton.click();
  });

  test('should click generate PDF download button', async ({ page }) => {
    await downloadPage.enterText('Test content');
    await downloadPage.generatePdfFileButton.click();
  });
});