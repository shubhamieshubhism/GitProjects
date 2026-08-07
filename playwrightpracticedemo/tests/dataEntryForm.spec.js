const { test, expect } = require('@playwright/test');
const { DataEntryFormPage } = require('../pages/DataEntryFormPage');

test.describe('Data Entry Form - Personal Information', () => {
  let formPage;

  test.beforeEach(async ({ page }) => {
    formPage = new DataEntryFormPage(page);
    await formPage.goto();
  });

  test('should verify page heading', async ({ page }) => {
    await expect(formPage.pageHeading).toBeVisible();
    await expect(page).toHaveTitle(/Data Entry Form/);
  });

  test('should fill all personal information fields', async ({ page }) => {
    await formPage.fillPersonalInfo('John Doe', 'john@example.com', '1234567890', '123 Main St');

    await expect(formPage.nameInput).toHaveValue('John Doe');
    await expect(formPage.emailInput).toHaveValue('john@example.com');
    await expect(formPage.phoneInput).toHaveValue('1234567890');
    await expect(formPage.addressInput).toHaveValue('123 Main St');
  });

  test('should fill individual fields', async ({ page }) => {
    await formPage.fillName('Jane Doe');
    await formPage.fillEmail('jane@example.com');
    await formPage.fillPhone('9876543210');
    await formPage.fillAddress('456 Oak Ave');

    await expect(formPage.nameInput).toHaveValue('Jane Doe');
    await expect(formPage.emailInput).toHaveValue('jane@example.com');
    await expect(formPage.phoneInput).toHaveValue('9876543210');
    await expect(formPage.addressInput).toHaveValue('456 Oak Ave');
  });
});

test.describe('Data Entry Form - Gender & Days', () => {
  let formPage;

  test.beforeEach(async ({ page }) => {
    formPage = new DataEntryFormPage(page);
    await formPage.goto();
  });

  test('should select Male gender', async ({ page }) => {
    await formPage.selectGender('Male');
    expect(await formPage.isGenderSelected('Male')).toBe(true);
    expect(await formPage.isGenderSelected('Female')).toBe(false);
  });

  test('should select Female gender', async ({ page }) => {
    await formPage.selectGender('Female');
    expect(await formPage.isGenderSelected('Female')).toBe(true);
    expect(await formPage.isGenderSelected('Male')).toBe(false);
  });

  test('should select a single day', async ({ page }) => {
    await formPage.selectDay('Monday');
    expect(await formPage.isDayChecked('Monday')).toBe(true);
    expect(await formPage.isDayChecked('Sunday')).toBe(false);
  });

  test('should select multiple days', async ({ page }) => {
    await formPage.selectMultipleDays(['Sunday', 'Wednesday', 'Saturday']);
    
    expect(await formPage.isDayChecked('Sunday')).toBe(true);
    expect(await formPage.isDayChecked('Wednesday')).toBe(true);
    expect(await formPage.isDayChecked('Saturday')).toBe(true);
    expect(await formPage.isDayChecked('Monday')).toBe(false);
  });

  test('should select all days', async ({ page }) => {
    await formPage.selectMultipleDays(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    
    for (const day of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
      expect(await formPage.isDayChecked(day)).toBe(true);
    }
  });
});

test.describe('Data Entry Form - Dropdowns', () => {
  let formPage;

  test.beforeEach(async ({ page }) => {
    formPage = new DataEntryFormPage(page);
    await formPage.goto();
  });

  test('should verify default country is United States', async ({ page }) => {
    const selectedCountry = await formPage.getSelectedCountry();
    expect(selectedCountry).toBe('usa');
  });

  test('should select country from dropdown', async ({ page }) => {
    await formPage.selectCountry('India');
    expect(await formPage.getSelectedCountry()).toBe('india');

    await formPage.selectCountry('Australia');
    expect(await formPage.getSelectedCountry()).toBe('australia');

    await formPage.selectCountry('Japan');
    expect(await formPage.getSelectedCountry()).toBe('japan');
  });

  test('should select single color', async ({ page }) => {
    await formPage.selectColor('Blue');
    const selectedColors = await formPage.getSelectedColors();
    expect(selectedColors).toBe('blue');
  });

  test('should select multiple colors', async ({ page }) => {
    await formPage.selectMultipleColors(['Red', 'Green', 'Yellow']);
    const selectedValues = await formPage.colorsListbox.evaluate(el => 
      Array.from(el.selectedOptions).map(option => option.value)
    );
    expect(selectedValues).toContain('red');
    expect(selectedValues).toContain('green');
    expect(selectedValues).toContain('yellow');
  });

  test('should select animal from sorted list', async ({ page }) => {
    await formPage.selectAnimal('Elephant');
    expect(await formPage.getSelectedAnimal()).toBe('elephant');

    await formPage.selectAnimal('Zebra');
    expect(await formPage.getSelectedAnimal()).toBe('zebra');
  });

  test('should verify sorted list is alphabetically sorted', async ({ page }) => {
    const options = await formPage.sortedList.locator('option').allTextContents();
    const sortedOptions = [...options].sort();
    expect(options).toEqual(sortedOptions);
  });
});

test.describe('Data Entry Form - Date Pickers', () => {
  let formPage;

  test.beforeEach(async ({ page }) => {
    formPage = new DataEntryFormPage(page);
    await formPage.goto();
  });

  test('should set date picker 1 (mm/dd/yyyy)', async ({ page }) => {
    await formPage.setDatePicker1('12/25/2026');
    await expect(formPage.datePicker1).toHaveValue('12/25/2026');
  });

  test('should set date picker 2 (dd/mm/yyyy)', async ({ page }) => {
    await formPage.setDatePicker2('25/12/2026');
    await expect(formPage.datePicker2).toHaveValue('25/12/2026');
  });

  test('should set date range', async ({ page }) => {
    await formPage.setDateRange('2026-01-01', '2026-12-31');
    await expect(formPage.startDateInput).toHaveValue('2026-01-01');
    await expect(formPage.endDateInput).toHaveValue('2026-12-31');
  });

  test('should submit form with all data', async ({ page }) => {
    await formPage.fillPersonalInfo('Test User', 'test@example.com', '5551234567', '789 Pine St');
    await formPage.selectGender('Male');
    await formPage.selectMultipleDays(['Monday', 'Friday']);
    await formPage.selectCountry('Germany');
    await formPage.selectMultipleColors(['Blue', 'White']);
    await formPage.selectAnimal('Lion');
    await formPage.setDatePicker1('06/15/2026');
    await formPage.setDatePicker2('15/06/2026');
    await formPage.setDateRange('2026-06-01', '2026-06-30');
    await formPage.clickSubmit();
  });
});