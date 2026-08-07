const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

test.describe('Home Page - Data Entry Form Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should verify page title and navigation links', async ({ page }) => {
    await expect(page).toHaveTitle('Automation Testing Practice');
    await expect(homePage.dataEntryFormHeading).toBeVisible();
    await expect(homePage.uploadFilesHeading).toBeVisible();
    await expect(homePage.staticTableHeading).toBeVisible();
    await expect(homePage.dynamicTableHeading).toBeVisible();
    await expect(homePage.paginationTableHeading).toBeVisible();
  });

  test('should fill data entry form with all fields', async ({ page }) => {
    await homePage.fillDataEntryForm({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main Street, New York'
    });

    await expect(homePage.nameInput).toHaveValue('John Doe');
    await expect(homePage.emailInput).toHaveValue('john.doe@example.com');
    await expect(homePage.phoneInput).toHaveValue('1234567890');
    await expect(homePage.addressInput).toHaveValue('123 Main Street, New York');
  });

  test('should select gender radio buttons', async ({ page }) => {
    await homePage.selectGender('Male');
    await expect(homePage.maleRadio).toBeChecked();
    await expect(homePage.femaleRadio).not.toBeChecked();

    await homePage.selectGender('Female');
    await expect(homePage.femaleRadio).toBeChecked();
    await expect(homePage.maleRadio).not.toBeChecked();
  });

  test('should select multiple day checkboxes', async ({ page }) => {
    await homePage.selectDays(['Sunday', 'Monday', 'Tuesday']);
    
    await expect(homePage.sundayCheckbox).toBeChecked();
    await expect(homePage.mondayCheckbox).toBeChecked();
    await expect(homePage.tuesdayCheckbox).toBeChecked();
    await expect(homePage.wednesdayCheckbox).not.toBeChecked();
  });

  test('should select country from dropdown', async ({ page }) => {
    await homePage.selectCountry('India');
    await expect(homePage.countryDropdown).toHaveValue('india');

    await homePage.selectCountry('Germany');
    await expect(homePage.countryDropdown).toHaveValue('germany');
  });

  test('should select multiple colors from listbox', async ({ page }) => {
    await homePage.selectColors(['Red', 'Blue', 'Green']);
    const selectedValues = await homePage.colorsListbox.evaluate(el => 
      Array.from(el.selectedOptions).map(option => option.value)
    );
    expect(selectedValues).toContain('red');
    expect(selectedValues).toContain('blue');
    expect(selectedValues).toContain('green');
  });

  test('should select animal from sorted list', async ({ page }) => {
    await homePage.selectAnimal('Lion');
    await expect(homePage.sortedList).toHaveValue('lion');
  });

  test('should set date pickers', async ({ page }) => {
    await homePage.setDatePicker1('01/15/2026');
    await homePage.setDatePicker2('15/01/2026');
    await homePage.setDateRange('2026-01-01', '2026-01-31');

    await expect(homePage.datePicker1).toHaveValue('01/15/2026');
    await expect(homePage.datePicker2).toHaveValue('15/01/2026');
    await expect(homePage.startDateInput).toHaveValue('2026-01-01');
    await expect(homePage.endDateInput).toHaveValue('2026-01-31');
  });

  test('should submit the form', async ({ page }) => {
    await homePage.fillDataEntryForm({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543210',
      address: '456 Oak Avenue'
    });
    await homePage.selectGender('Female');
    await homePage.selectDays(['Monday', 'Wednesday', 'Friday']);
    await homePage.selectCountry('Canada');
    await homePage.clickSubmit();
  });
});

test.describe('Home Page - Table Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should verify static web table data', async ({ page }) => {
    const tableData = await homePage.getStaticTableData();
    
    expect(tableData.length).toBe(6);
    expect(tableData[0]).toEqual(['Learn Selenium', 'Amit', 'Selenium', '300']);
    expect(tableData[1]).toEqual(['Learn Java', 'Mukesh', 'Java', '500']);
    expect(tableData[2]).toEqual(['Learn JS', 'Animesh', 'Javascript', '300']);
    expect(tableData[3]).toEqual(['Master In Selenium', 'Mukesh', 'Selenium', '3000']);
    expect(tableData[4]).toEqual(['Master In Java', 'Amod', 'JAVA', '2000']);
    expect(tableData[5]).toEqual(['Master In JS', 'Amit', 'Javascript', '1000']);
  });

  test('should verify static table headers', async ({ page }) => {
    const headers = await homePage.staticTable.locator('tr th').allTextContents();
    expect(headers.map(h => h.trim())).toEqual(['BookName', 'Author', 'Subject', 'Price']);
  });

  test('should verify dynamic web table has data', async ({ page }) => {
    const tableData = await homePage.getDynamicTableData();
    expect(tableData.length).toBeGreaterThan(0);
    
    for (const row of tableData) {
      expect(row.length).toBe(5);
    }
  });

  test('should verify dynamic table summary values', async ({ page }) => {
    const cpuLoad = await homePage.chromeCpuLoad.textContent();
    const memorySize = await homePage.firefoxMemorySize.textContent();
    const networkSpeed = await homePage.chromeNetworkSpeed.textContent();
    const diskSpace = await homePage.firefoxDiskSpace.textContent();

    expect(cpuLoad).toMatch(/%$/);
    expect(memorySize).toMatch(/MB$/);
    expect(networkSpeed).toMatch(/Mbps$/);
    expect(diskSpace).toMatch(/MB\/s$/);
  });

  test('should verify pagination table initial data', async ({ page }) => {
    const tableData = await homePage.getPaginationTableData();
    expect(tableData.length).toBe(5);
    expect(tableData[0]).toEqual(['1', 'Smartphone', '$10.99', '']);
    expect(tableData[1]).toEqual(['2', 'Laptop', '$19.99', '']);
  });

  test('should navigate through pagination pages', async ({ page }) => {
    await homePage.clickPaginationPage(2);
    const tableData = await homePage.getPaginationTableData();
    expect(tableData.length).toBeGreaterThan(0);
  });

  test('should select product checkbox in pagination table', async ({ page }) => {
    await homePage.selectProductOnPage('Smartphone');
    const checkbox = homePage.paginationTable.locator('tr', { hasText: 'Smartphone' }).locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked();
  });
});

test.describe('Home Page - Navigation Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should navigate to PlaywrightPractice page', async ({ page }) => {
    await homePage.gotoPlaywrightPractice();
    await expect(page).toHaveURL(/playwrightpractice/);
    await expect(page.getByRole('heading', { name: 'PlaywrightPractice' })).toBeVisible();
  });

  test('should verify all navigation links are visible', async ({ page }) => {
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.playwrightPracticeLink).toBeVisible();
    await expect(homePage.udemyCoursesLink).toBeVisible();
    await expect(homePage.onlineTrainingsLink).toBeVisible();
    await expect(homePage.blogLink).toBeVisible();
  });
});