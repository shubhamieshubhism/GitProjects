const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const path = require('path');

test.describe('Upload Files - Single File', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should verify upload files section is visible', async ({ page }) => {
    await expect(homePage.uploadFilesHeading).toBeVisible();
    await expect(homePage.uploadSingleFileButton).toBeVisible();
    await expect(homePage.uploadMultipleFilesButton).toBeVisible();
  });

  test('should upload a single file', async ({ page }) => {
    const testFilePath = path.join(__dirname, '..', 'test-data', 'sample.txt');
    await homePage.uploadSingleFile(testFilePath);
    await expect(page.locator('text=File uploaded successfully')).toBeVisible();
  });
});

test.describe('Upload Files - Multiple Files', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should upload multiple files', async ({ page }) => {
    const testFile1 = path.join(__dirname, '..', 'test-data', 'sample.txt');
    const testFile2 = path.join(__dirname, '..', 'test-data', 'sample1.txt');
    await homePage.uploadMultipleFiles([testFile1, testFile2]);
    await expect(page.locator('text=Files uploaded successfully')).toBeVisible();
  });
});