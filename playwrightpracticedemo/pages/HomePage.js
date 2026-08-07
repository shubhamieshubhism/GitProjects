const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.homeLink = page.getByRole('link', { name: 'Home' }).first();
    this.playwrightPracticeLink = page.getByRole('link', { name: 'PlaywrightPractice' });
    this.udemyCoursesLink = page.getByRole('link', { name: 'Udemy Courses' });
    this.onlineTrainingsLink = page.getByRole('link', { name: 'Online Trainings' });
    this.blogLink = page.locator('a[href="https://www.pavantestingtools.com/"]').first();

    // Data Entry Form section
    this.dataEntryFormHeading = page.getByRole('heading', { name: 'Data Entry Form' });
    this.nameInput = page.getByPlaceholder('Enter Name');
    this.emailInput = page.getByPlaceholder('Enter EMail');
    this.phoneInput = page.getByPlaceholder('Enter Phone');
    this.addressInput = page.locator('#textarea');
    this.maleRadio = page.getByRole('radio', { name: 'Male', exact: true });
    this.femaleRadio = page.getByRole('radio', { name: 'Female', exact: true });
    this.sundayCheckbox = page.getByRole('checkbox', { name: 'Sunday' });
    this.mondayCheckbox = page.getByRole('checkbox', { name: 'Monday' });
    this.tuesdayCheckbox = page.getByRole('checkbox', { name: 'Tuesday' });
    this.wednesdayCheckbox = page.getByRole('checkbox', { name: 'Wednesday' });
    this.thursdayCheckbox = page.getByRole('checkbox', { name: 'Thursday' });
    this.fridayCheckbox = page.getByRole('checkbox', { name: 'Friday' });
    this.saturdayCheckbox = page.getByRole('checkbox', { name: 'Saturday' });
    this.countryDropdown = page.locator('#country');
    this.colorsListbox = page.locator('#colors');
    this.sortedList = page.locator('#animals');
    this.datePicker1 = page.locator('#datepicker');
    this.datePicker2 = page.locator('#txtDate');
    this.startDateInput = page.getByPlaceholder('Start Date');
    this.endDateInput = page.getByPlaceholder('End Date');
    this.submitButton = page.locator('button.submit-btn');

    // Upload Files section
    this.uploadFilesHeading = page.getByRole('heading', { name: 'Upload Files' });
    this.singleFileInput = page.locator('input[type="file"]').first();
    this.uploadSingleFileButton = page.getByRole('button', { name: 'Upload Single File' });
    this.multipleFileInput = page.locator('input[type="file"]').nth(1);
    this.uploadMultipleFilesButton = page.getByRole('button', { name: 'Upload Multiple Files' });

    // Static Web Table
    this.staticTableHeading = page.getByRole('heading', { name: 'Static Web Table' });
    this.staticTable = page.locator('table').first();
    this.staticTableRows = this.staticTable.locator('tbody tr');

    // Dynamic Web Table
    this.dynamicTableHeading = page.getByRole('heading', { name: 'Dynamic Web Table' });
    this.dynamicTable = page.locator('table').nth(1);
    this.dynamicTableRows = this.dynamicTable.locator('tbody tr');
    this.chromeCpuLoad = page.locator('strong', { hasText: /%/ }).first();
    this.firefoxMemorySize = page.locator('strong', { hasText: /MB/ }).first();
    this.chromeNetworkSpeed = page.locator('strong', { hasText: /Mbps/ }).first();
    this.firefoxDiskSpace = page.locator('strong', { hasText: /MB\/s/ }).first();

    // Pagination Web Table
    this.paginationTableHeading = page.getByRole('heading', { name: 'Pagination Web Table' });
    this.paginationTable = page.locator('table').nth(2);
    this.paginationRows = this.paginationTable.locator('tbody tr');
    this.paginationLinks = page.locator('.pagination li a');
  }

  async goto() {
    await this.page.goto('https://testautomationpractice.blogspot.com/');
  }

  async gotoPlaywrightPractice() {
    await this.playwrightPracticeLink.click();
  }

  async fillDataEntryForm(userData) {
    await this.nameInput.fill(userData.name);
    await this.emailInput.fill(userData.email);
    await this.phoneInput.fill(userData.phone);
    await this.addressInput.fill(userData.address);
  }

  async selectGender(gender) {
    if (gender.toLowerCase() === 'male') {
      await this.maleRadio.check();
    } else if (gender.toLowerCase() === 'female') {
      await this.femaleRadio.check();
    }
  }

  async selectDays(days) {
    for (const day of days) {
      await this.page.getByRole('checkbox', { name: day }).check();
    }
  }

  async selectCountry(country) {
    await this.countryDropdown.selectOption({ label: country });
  }

  async selectColors(colors) {
    await this.colorsListbox.selectOption(colors);
  }

  async selectAnimal(animal) {
    await this.sortedList.selectOption({ label: animal });
  }

  async setDatePicker1(date) {
    await this.datePicker1.fill(date);
  }

  async setDatePicker2(date) {
    await this.datePicker2.evaluate((el, value) => {
      el.value = value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, date);
  }

  async setDateRange(startDate, endDate) {
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async uploadSingleFile(filePath) {
    await this.singleFileInput.setInputFiles(filePath);
    await this.uploadSingleFileButton.click();
  }

  async uploadMultipleFiles(filePaths) {
    await this.multipleFileInput.setInputFiles(filePaths);
    await this.uploadMultipleFilesButton.click();
  }

  async getStaticTableData() {
    const rows = await this.staticTableRows.all();
    const data = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      if (cells.length > 0) {
        data.push(cells.map(cell => cell.trim()));
      }
    }
    return data;
  }

  async getDynamicTableData() {
    const rows = await this.dynamicTableRows.all();
    const data = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      data.push(cells.map(cell => cell.trim()));
    }
    return data;
  }

  async getPaginationTableData() {
    const rows = await this.paginationRows.all();
    const data = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      data.push(cells.map(cell => cell.trim()));
    }
    return data;
  }

  async clickPaginationPage(pageNumber) {
    await this.page.locator('.pagination li a', { hasText: String(pageNumber) }).click();
  }

  async selectProductOnPage(productName) {
    const row = this.paginationTable.locator('tr', { hasText: productName });
    await row.locator('input[type="checkbox"]').check();
  }
};