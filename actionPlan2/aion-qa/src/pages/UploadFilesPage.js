const path = require('path');

class UploadFilesPage {
  constructor(page) {
    this.page = page;

    // Single file upload
    this.singleFileInput = page.locator('#singleFileInput');
    this.singleFileForm = page.locator('#singleFileForm');
    this.singleFileSubmit = page.locator('#singleFileForm button[type="submit"]');
    this.singleFileStatus = page.locator('#singleFileStatus');

    // Multiple files upload
    this.multipleFilesInput = page.locator('#multipleFilesInput');
    this.multipleFilesForm = page.locator('#multipleFilesForm');
    this.multipleFilesSubmit = page.locator('#multipleFilesForm button[type="submit"]');
    this.multipleFilesStatus = page.locator('#multipleFilesStatus');
  }

  async uploadSingleFile(filePath) {
    await this.singleFileInput.setInputFiles(filePath);
    await this.singleFileSubmit.click();
  }

  async getSingleFileStatus() {
    return this.singleFileStatus.textContent();
  }

  async uploadMultipleFiles(filePaths) {
    await this.multipleFilesInput.setInputFiles(filePaths);
    await this.multipleFilesSubmit.click();
  }

  async getMultipleFilesStatus() {
    return this.multipleFilesStatus.innerHTML();
  }
}

module.exports = { UploadFilesPage };