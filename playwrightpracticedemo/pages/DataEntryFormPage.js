const { expect } = require('@playwright/test');

exports.DataEntryFormPage = class DataEntryFormPage {
  constructor(page) {
    this.page = page;

    // Heading
    this.pageHeading = page.getByRole('heading', { name: 'Data Entry Form' });

    // Personal Information
    this.nameInput = page.getByPlaceholder('Enter Name');
    this.emailInput = page.getByPlaceholder('Enter EMail');
    this.phoneInput = page.getByPlaceholder('Enter Phone');
    this.addressInput = page.locator('#textarea');

    // Gender
    this.maleRadio = page.getByRole('radio', { name: 'Male', exact: true });
    this.femaleRadio = page.getByRole('radio', { name: 'Female', exact: true });

    // Days checkboxes
    this.sundayCheckbox = page.getByRole('checkbox', { name: 'Sunday' });
    this.mondayCheckbox = page.getByRole('checkbox', { name: 'Monday' });
    this.tuesdayCheckbox = page.getByRole('checkbox', { name: 'Tuesday' });
    this.wednesdayCheckbox = page.getByRole('checkbox', { name: 'Wednesday' });
    this.thursdayCheckbox = page.getByRole('checkbox', { name: 'Thursday' });
    this.fridayCheckbox = page.getByRole('checkbox', { name: 'Friday' });
    this.saturdayCheckbox = page.getByRole('checkbox', { name: 'Saturday' });

    // Dropdowns
    this.countryDropdown = page.locator('#country');
    this.colorsListbox = page.locator('#colors');
    this.sortedList = page.locator('#animals');

    // Date Pickers
    this.datePicker1 = page.locator('#datepicker');
    this.datePicker2 = page.locator('#txtDate');
    this.startDateInput = page.getByPlaceholder('Start Date');
    this.endDateInput = page.getByPlaceholder('End Date');
    this.submitButton = page.locator('button.submit-btn');
  }

  async goto() {
    await this.page.goto('https://testautomationpractice.blogspot.com/2018/09/automation-form.html');
  }

  async fillName(name) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone) {
    await this.phoneInput.fill(phone);
  }

  async fillAddress(address) {
    await this.addressInput.fill(address);
  }

  async fillPersonalInfo(name, email, phone, address) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPhone(phone);
    await this.fillAddress(address);
  }

  async selectGender(gender) {
    if (gender.toLowerCase() === 'male') {
      await this.maleRadio.check();
    } else if (gender.toLowerCase() === 'female') {
      await this.femaleRadio.check();
    }
  }

  async selectDay(day) {
    await this.page.getByRole('checkbox', { name: day }).check();
  }

  async selectMultipleDays(days) {
    for (const day of days) {
      await this.selectDay(day);
    }
  }

  async selectCountry(country) {
    await this.countryDropdown.selectOption({ label: country });
  }

  async selectColor(color) {
    await this.colorsListbox.selectOption({ label: color });
  }

  async selectMultipleColors(colors) {
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

  async getSelectedCountry() {
    return await this.countryDropdown.inputValue();
  }

  async getSelectedColors() {
    return await this.colorsListbox.inputValue();
  }

  async getSelectedAnimal() {
    return await this.sortedList.inputValue();
  }

  async isDayChecked(day) {
    return await this.page.getByRole('checkbox', { name: day }).isChecked();
  }

  async isGenderSelected(gender) {
    if (gender.toLowerCase() === 'male') {
      return await this.maleRadio.isChecked();
    }
    return await this.femaleRadio.isChecked();
  }
};