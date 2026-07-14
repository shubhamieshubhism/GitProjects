const { expect } = require('@playwright/test');

class DataEntryFormPage {
  constructor(page) {
    this.page = page;
    // Form fields
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.addressTextarea = page.locator('#textarea');
    
    // Gender radio buttons
    this.maleRadio = page.locator('#male');
    this.femaleRadio = page.locator('#female');
    
    // Day checkboxes
    this.sundayCheckbox = page.locator('#sunday');
    this.mondayCheckbox = page.locator('#monday');
    this.tuesdayCheckbox = page.locator('#tuesday');
    this.wednesdayCheckbox = page.locator('#wednesday');
    this.thursdayCheckbox = page.locator('#thursday');
    this.fridayCheckbox = page.locator('#friday');
    this.saturdayCheckbox = page.locator('#saturday');
    
    // Country dropdown
    this.countrySelect = page.locator('#country');
    
    // Colors multi-select
    this.colorsSelect = page.locator('#colors');
    
    // Sorted List multi-select
    this.animalsSelect = page.locator('#animals');
    
    // Date pickers
    this.datePicker1 = page.locator('#datepicker');
    this.datePicker2 = page.locator('#txtDate');
    this.startDate = page.locator('#start-date');
    this.endDate = page.locator('#end-date');
    this.dateRangeSubmit = page.locator('button.submit-btn');
    this.dateRangeResult = page.locator('#result');
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
    await this.addressTextarea.fill(address);
  }

  async selectGender(gender) {
    if (gender.toLowerCase() === 'male') {
      await this.maleRadio.check();
    } else if (gender.toLowerCase() === 'female') {
      await this.femaleRadio.check();
    }
  }

  async checkDay(day) {
    const dayMap = {
      'sunday': this.sundayCheckbox,
      'monday': this.mondayCheckbox,
      'tuesday': this.tuesdayCheckbox,
      'wednesday': this.wednesdayCheckbox,
      'thursday': this.thursdayCheckbox,
      'friday': this.fridayCheckbox,
      'saturday': this.saturdayCheckbox
    };
    if (dayMap[day.toLowerCase()]) {
      await dayMap[day.toLowerCase()].check();
    }
  }

  async uncheckDay(day) {
    const dayMap = {
      'sunday': this.sundayCheckbox,
      'monday': this.mondayCheckbox,
      'tuesday': this.tuesdayCheckbox,
      'wednesday': this.wednesdayCheckbox,
      'thursday': this.thursdayCheckbox,
      'friday': this.fridayCheckbox,
      'saturday': this.saturdayCheckbox
    };
    if (dayMap[day.toLowerCase()]) {
      await dayMap[day.toLowerCase()].uncheck();
    }
  }

  async selectCountry(country) {
    await this.countrySelect.selectOption(country);
  }

  async selectColors(colors) {
    await this.colorsSelect.selectOption(colors);
  }

  async selectAnimals(animals) {
    await this.animalsSelect.selectOption(animals);
  }

  async fillDatePicker1(date) {
    await this.datePicker1.fill(date);
  }

  async fillDateRange(startDate, endDate) {
    await this.startDate.fill(startDate);
    await this.endDate.fill(endDate);
    // Remove the datepicker overlay that blocks the submit button
    await this.page.evaluate(() => {
      const dp = document.getElementById('ui-datepicker-div');
      if (dp) dp.style.display = 'none';
    });
    await this.page.waitForTimeout(300);
    await this.dateRangeSubmit.click();
  }

  async getDateRangeResult() {
    return this.dateRangeResult.textContent();
  }

  async fillCompleteForm(data) {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    await this.fillAddress(data.address);
    if (data.gender) await this.selectGender(data.gender);
    if (data.days) {
      for (const day of data.days) {
        await this.checkDay(day);
      }
    }
    if (data.country) await this.selectCountry(data.country);
    if (data.colors) await this.selectColors(data.colors);
    if (data.animals) await this.selectAnimals(data.animals);
  }
}

module.exports = { DataEntryFormPage };