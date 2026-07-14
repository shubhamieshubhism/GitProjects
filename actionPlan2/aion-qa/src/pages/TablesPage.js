class TablesPage {
  constructor(page) {
    this.page = page;

    // Static Web Table
    this.staticTable = page.locator('table[name="BookTable"]');
    this.staticTableHeaders = page.locator('table[name="BookTable"] th');
    this.staticTableRows = page.locator('table[name="BookTable"] tbody tr');
    this.staticTableDataRows = page.locator('table[name="BookTable"] tbody tr:has(td)');

    // Dynamic Web Table
    this.dynamicTable = page.locator('#taskTable');
    this.dynamicTableHeaders = page.locator('#taskTable thead tr th');
    this.dynamicTableRows = page.locator('#taskTable tbody tr');
    this.chromeCpu = page.locator('.chrome-cpu');
    this.firefoxMemory = page.locator('.firefox-memory');
    this.chromeNetwork = page.locator('.chrome-network');
    this.firefoxDisk = page.locator('.firefox-disk');

    // Pagination Web Table
    this.productTable = page.locator('#productTable');
    this.productTableHeaders = page.locator('#productTable thead tr th');
    this.productTableBody = page.locator('#productTable tbody');
    this.productTableRows = page.locator('#productTable tbody tr');
    this.paginationLinks = page.locator('#pagination a');
  }

  // Static Table Methods
  async getStaticTableRowCount() {
    return this.staticTableDataRows.count();
  }

  async getStaticTableColumnCount() {
    return this.staticTableHeaders.count();
  }

  async getStaticTableCell(rowIndex, colIndex) {
    return this.staticTableDataRows.nth(rowIndex).locator('td').nth(colIndex).textContent();
  }

  async getStaticTableData() {
    const rows = await this.staticTableDataRows.count();
    const data = [];
    for (let i = 0; i < rows; i++) {
      const cols = await this.staticTableDataRows.nth(i).locator('td').count();
      const rowData = [];
      for (let j = 0; j < cols; j++) {
        rowData.push(await this.staticTableDataRows.nth(i).locator('td').nth(j).textContent());
      }
      data.push(rowData);
    }
    return data;
  }

  async verifyBookInStaticTable(bookName) {
    const rows = await this.staticTableDataRows.count();
    for (let i = 0; i < rows; i++) {
      const cellText = await this.staticTableDataRows.nth(i).locator('td').nth(0).textContent();
      if (cellText.trim() === bookName) {
        return true;
      }
    }
    return false;
  }

  // Dynamic Table Methods
  async getDynamicTableRowCount() {
    return this.dynamicTableRows.count();
  }

  async getDynamicTableData() {
    const rows = await this.dynamicTableRows.count();
    const data = [];
    for (let i = 0; i < rows; i++) {
      const cols = await this.dynamicTableRows.nth(i).locator('td').count();
      const rowData = [];
      for (let j = 0; j < cols; j++) {
        rowData.push(await this.dynamicTableRows.nth(i).locator('td').nth(j).textContent());
      }
      data.push(rowData);
    }
    return data;
  }

  async getChromeCpuLoad() {
    return this.chromeCpu.textContent();
  }

  async getFirefoxMemorySize() {
    return this.firefoxMemory.textContent();
  }

  async getChromeNetworkSpeed() {
    return this.chromeNetwork.textContent();
  }

  async getFirefoxDiskSpace() {
    return this.firefoxDisk.textContent();
  }

  // Pagination Table Methods
  async clickPaginationPage(pageNumber) {
    await this.paginationLinks.nth(pageNumber - 1).click();
  }

  async getActivePaginationPage() {
    return this.page.locator('#pagination a.active');
  }

  async getProductTableRows() {
    return this.productTableRows.count();
  }

  async getProductTableData() {
    const rows = await this.productTableRows.count();
    const data = [];
    for (let i = 0; i < rows; i++) {
      const id = await this.productTableRows.nth(i).locator('td').nth(0).textContent();
      const name = await this.productTableRows.nth(i).locator('td').nth(1).textContent();
      const price = await this.productTableRows.nth(i).locator('td').nth(2).textContent();
      data.push({ id: id.trim(), name: name.trim(), price: price.trim() });
    }
    return data;
  }

  async checkProductCheckbox(rowIndex) {
    await this.productTableRows.nth(rowIndex).locator('td').nth(3).locator('input[type="checkbox"]').check();
  }

  async isProductCheckboxChecked(rowIndex) {
    return this.productTableRows.nth(rowIndex).locator('td').nth(3).locator('input[type="checkbox"]').isChecked();
  }
}

module.exports = { TablesPage };