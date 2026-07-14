const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { DataEntryFormPage } = require('../pages/DataEntryFormPage');
const { TablesPage } = require('../pages/TablesPage');
const { UploadFilesPage } = require('../pages/UploadFilesPage');
const { WidgetsPage } = require('../pages/WidgetsPage');
const { FooterPage } = require('../pages/FooterPage');
const path = require('path');

const BASE_URL = 'https://testautomationpractice.blogspot.com/';

test.describe('Automation Testing Practice - Complete Page Coverage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    // Maximize viewport to ensure all elements are visible
    await page.setViewportSize({ width: 1280, height: 3000 });
  });

  test.describe('Home Page & Navigation', () => {
    test('should verify page title and description', async ({ page }) => {
      const homePage = new HomePage(page);
      expect(await homePage.getTitle()).toContain('Automation Testing Practice');
      expect(await homePage.getDescription()).toContain('For Selenium, Cypress & Playwright');
    });

    test('should have all navigation links visible', async ({ page }) => {
      const homePage = new HomePage(page);
      await expect(page.locator('.tabs-outer a:has-text("Home")')).toBeVisible();
      await expect(homePage.navUdemyCourses).toBeVisible();
      await expect(homePage.navOnlineTrainings).toBeVisible();
      await expect(homePage.navBlog).toBeVisible();
      await expect(homePage.navPlaywrightPractice).toBeVisible();
    });
  });

  test.describe('Data Entry Form', () => {
    test('should fill in all form fields', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      await form.fillName('John Doe');
      await form.fillEmail('john@example.com');
      await form.fillPhone('1234567890');
      await form.fillAddress('123 Main Street, New York');

      expect(await form.nameInput.inputValue()).toBe('John Doe');
      expect(await form.emailInput.inputValue()).toBe('john@example.com');
      expect(await form.phoneInput.inputValue()).toBe('1234567890');
      expect(await form.addressTextarea.inputValue()).toBe('123 Main Street, New York');
    });

    test('should select gender radio buttons', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      await form.selectGender('male');
      expect(await form.maleRadio.isChecked()).toBeTruthy();
      expect(await form.femaleRadio.isChecked()).toBeFalsy();

      await form.selectGender('female');
      expect(await form.femaleRadio.isChecked()).toBeTruthy();
      expect(await form.maleRadio.isChecked()).toBeFalsy();
    });

    test('should check and uncheck day checkboxes', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      await form.checkDay('monday');
      await form.checkDay('wednesday');
      await form.checkDay('friday');
      
      expect(await form.mondayCheckbox.isChecked()).toBeTruthy();
      expect(await form.wednesdayCheckbox.isChecked()).toBeTruthy();
      expect(await form.fridayCheckbox.isChecked()).toBeTruthy();
      expect(await form.sundayCheckbox.isChecked()).toBeFalsy();

      await form.uncheckDay('monday');
      expect(await form.mondayCheckbox.isChecked()).toBeFalsy();
    });

    test('should select country from dropdown', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      await form.selectCountry('India');
      expect(await form.countrySelect.inputValue()).toBe('india');
      
      await form.selectCountry('Japan');
      expect(await form.countrySelect.inputValue()).toBe('japan');
    });

    test('should select multiple colors from multi-select', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      await form.selectColors(['Red', 'Blue', 'Green']);
      const selectedValues = await form.colorsSelect.evaluate(el => 
        Array.from(el.selectedOptions).map(o => o.value)
      );
      expect(selectedValues).toContain('red');
      expect(selectedValues).toContain('blue');
      expect(selectedValues).toContain('green');
    });

    test('should select animals from sorted list', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      await form.selectAnimals(['Lion', 'Elephant', 'Zebra']);
      const selectedValues = await form.animalsSelect.evaluate(el => 
        Array.from(el.selectedOptions).map(o => o.value)
      );
      expect(selectedValues).toContain('lion');
      expect(selectedValues).toContain('elephant');
      expect(selectedValues).toContain('zebra');
    });

    test('should fill date picker and date range', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      // Fill date picker 1 via typing (avoid jQuery UI datepicker overlay)
      await form.datePicker1.evaluate(el => el.value = '05/15/2025');
      
      // Scroll to date range section to ensure visibility
      await form.startDate.scrollIntoViewIfNeeded();
      
      // Fill date range and submit
      await form.startDate.fill('2025-06-01');
      await form.endDate.fill('2025-06-15');
      await form.dateRangeSubmit.click();
      const result = await form.getDateRangeResult();
      expect(result).toContain('You selected a range of 14 days');
    });

    test('should complete entire form submission', async ({ page }) => {
      const form = new DataEntryFormPage(page);
      
      const formData = {
        name: 'Jane Smith',
        email: 'jane@test.com',
        phone: '9876543210',
        address: '456 Oak Avenue',
        gender: 'female',
        days: ['monday', 'tuesday', 'wednesday'],
        country: 'Canada',
        colors: ['Yellow', 'White'],
        animals: ['Cat', 'Dog', 'Fox']
      };

      await form.fillCompleteForm(formData);
      
      // Verify all fields
      expect(await form.nameInput.inputValue()).toBe('Jane Smith');
      expect(await form.emailInput.inputValue()).toBe('jane@test.com');
      expect(await form.phoneInput.inputValue()).toBe('9876543210');
      expect(await form.femaleRadio.isChecked()).toBeTruthy();
      expect(await form.countrySelect.inputValue()).toBe('canada');
    });
  });

  test.describe('Static Web Table', () => {
    test('should verify static table structure', async ({ page }) => {
      const tables = new TablesPage(page);
      
      expect(await tables.getStaticTableRowCount()).toBe(6);
      expect(await tables.getStaticTableColumnCount()).toBe(4);
    });

    test('should read static table data', async ({ page }) => {
      const tables = new TablesPage(page);
      
      const data = await tables.getStaticTableData();
      expect(data[0][0]).toBe('Learn Selenium');
      expect(data[0][1]).toBe('Amit');
      expect(data[0][2]).toBe('Selenium');
      expect(data[0][3]).toBe('300');
    });

    test('should verify specific book exists in static table', async ({ page }) => {
      const tables = new TablesPage(page);
      
      expect(await tables.verifyBookInStaticTable('Master In Java')).toBeTruthy();
      expect(await tables.verifyBookInStaticTable('Non Existent Book')).toBeFalsy();
    });

    test('should verify all book entries', async ({ page }) => {
      const tables = new TablesPage(page);
      
      const expectedBooks = [
        ['Learn Selenium', 'Amit', 'Selenium', '300'],
        ['Learn Java', 'Mukesh', 'Java', '500'],
        ['Learn JS', 'Animesh', 'Javascript', '300'],
        ['Master In Selenium', 'Mukesh', 'Selenium', '3000'],
        ['Master In Java', 'Amod', 'JAVA', '2000'],
        ['Master In JS', 'Amit', 'Javascript', '1000']
      ];

      const actualData = await tables.getStaticTableData();
      for (let i = 0; i < expectedBooks.length; i++) {
        for (let j = 0; j < expectedBooks[i].length; j++) {
          expect(actualData[i][j].trim()).toBe(expectedBooks[i][j]);
        }
      }
    });
  });

  test.describe('Dynamic Web Table', () => {
    test('should read dynamic table data', async ({ page }) => {
      const tables = new TablesPage(page);
      
      const rowCount = await tables.getDynamicTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(3);
      
      const data = await tables.getDynamicTableData();
      // Should have name column
      const names = data.map(row => row[0].trim());
      expect(names).toContain('System');
      expect(names).toContain('Chrome');
      expect(names).toContain('Firefox');
    });

    test('should display process metrics below table', async ({ page }) => {
      const tables = new TablesPage(page);
      
      const chromeCpu = await tables.getChromeCpuLoad();
      const firefoxMemory = await tables.getFirefoxMemorySize();
      const chromeNetwork = await tables.getChromeNetworkSpeed();
      const firefoxDisk = await tables.getFirefoxDiskSpace();

      expect(chromeCpu).toBeTruthy();
      expect(firefoxMemory).toBeTruthy();
      expect(chromeNetwork).toBeTruthy();
      expect(firefoxDisk).toBeTruthy();
    });
  });

  test.describe('Pagination Web Table', () => {
    test('should have pagination links', async ({ page }) => {
      const tables = new TablesPage(page);
      
      expect(await tables.getProductTableRows()).toBe(5);
    });

    test('should navigate through pagination pages', async ({ page }) => {
      const tables = new TablesPage(page);
      
      // Get data from page 1
      let page1Data = await tables.getProductTableData();
      expect(page1Data[0].name).toBe('Smartphone');
      
      // Click page 2
      await tables.clickPaginationPage(2);
      let page2Data = await tables.getProductTableData();
      expect(page2Data.length).toBe(5);
      
      // Click page 3
      await tables.clickPaginationPage(3);
      let page3Data = await tables.getProductTableData();
      expect(page3Data.length).toBe(5);
    });

    test('should check product checkboxes', async ({ page }) => {
      const tables = new TablesPage(page);
      
      await tables.checkProductCheckbox(0);
      expect(await tables.isProductCheckboxChecked(0)).toBeTruthy();
      
      await tables.checkProductCheckbox(2);
      expect(await tables.isProductCheckboxChecked(2)).toBeTruthy();
    });
  });

  test.describe('Upload Files', () => {
    test('should upload a single file', async ({ page }) => {
      const uploadPage = new UploadFilesPage(page);
      
      const testFilePath = path.resolve(__dirname, '../../package.json');
      await uploadPage.uploadSingleFile(testFilePath);
      
      const status = await uploadPage.getSingleFileStatus();
      expect(status).toContain('Single file selected:');
      expect(status).toContain('package.json');
    });

    test('should upload multiple files', async ({ page }) => {
      const uploadPage = new UploadFilesPage(page);
      
      const testFile1 = path.resolve(__dirname, '../../package.json');
      const testFile2 = path.resolve(__dirname, '../../playwright.config.js');
      await uploadPage.uploadMultipleFiles([testFile1, testFile2]);
      
      const status = await uploadPage.getMultipleFilesStatus();
      expect(status).toContain('package.json');
      expect(status).toContain('playwright.config.js');
    });
  });

  test.describe('Alerts & Popups', () => {
    test('should handle simple alert', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('I am an alert box!');
        await dialog.accept();
      });
      
      await widgets.simpleAlertBtn.click();
    });

    test('should handle confirmation alert - accept', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Press a button!');
        await dialog.accept();
      });
      
      await widgets.confirmationAlertBtn.click();
      expect(await widgets.getAlertDemoText()).toBe('You pressed OK!');
    });

    test('should handle confirmation alert - cancel', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      page.on('dialog', async dialog => {
        await dialog.dismiss();
      });
      
      await widgets.confirmationAlertBtn.click();
      expect(await widgets.getAlertDemoText()).toBe('You pressed Cancel!');
    });

    test('should handle prompt alert', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Please enter your name');
        await dialog.accept('Test User');
      });
      
      await widgets.promptAlertBtn.click();
      expect(await widgets.getAlertDemoText()).toContain('Hello Test User');
    });
  });

  test.describe('Dynamic Button', () => {
    test('should toggle button text between START and STOP', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      expect(await widgets.getDynamicButtonText()).toBe('START');
      
      await widgets.clickDynamicButton();
      expect(await widgets.getDynamicButtonText()).toBe('STOP');
      
      await widgets.clickDynamicButton();
      expect(await widgets.getDynamicButtonText()).toBe('START');
    });
  });

  test.describe('New Tab & Popup Windows', () => {
    test('should open new tab', async ({ page, context }) => {
      const widgets = new WidgetsPage(page);
      
      const newPage = await widgets.clickNewTab();
      expect(newPage).not.toBeNull();
      await newPage.close();
    });
  });

  test.describe('Mouse Hover', () => {
    test('should display dropdown on hover', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      await widgets.hoverOnPointMe();
      await expect(widgets.hoverDropdownMobiles).toBeVisible();
      await expect(widgets.hoverDropdownLaptops).toBeVisible();
    });
  });

  test.describe('Double Click', () => {
    test('should copy text on double click', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      const field1Value = await widgets.getField1Value();
      expect(field1Value).toBe('Hello World!');
      expect(await widgets.getField2Value()).toBe('');
      
      await widgets.doubleClickCopyText();
      expect(await widgets.getField2Value()).toBe('Hello World!');
    });
  });

  test.describe('Drag and Drop', () => {
    test('should drag element to drop target', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      await widgets.dragAndDrop();
      const dropText = await widgets.getDroppableText();
      expect(dropText).toContain('Dropped!');
    });
  });

  test.describe('Slider', () => {
    test('should have default price range', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      const priceRange = await widgets.getPriceRange();
      expect(priceRange).toContain('$75');
      expect(priceRange).toContain('$300');
    });
  });

  test.describe('Scrolling Dropdown', () => {
    test('should select item from scrolling dropdown', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      await widgets.selectComboBoxItem('Item 5');
      expect(await widgets.getComboBoxValue()).toBe('Item 5');
    });
  });

  test.describe('Labels and Links', () => {
    test('should display mobile labels', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      expect(await widgets.getMobileLabelText('samsung')).toContain('Samsung');
      expect(await widgets.getMobileLabelText('realme')).toContain('Real Me');
      expect(await widgets.getMobileLabelText('moto')).toContain('Moto');
    });

    test('should have broken links section', async ({ page }) => {
      const widgets = new WidgetsPage(page);
      
      const count = await widgets.getBrokenLinksCount();
      expect(count).toBe(8);
      
      const href400 = await widgets.getBrokenLinkHref(0);
      expect(href400).toContain('error-page.asp?e=400');
    });
  });

  test.describe('Footer Section', () => {
    test('should verify footer form sections', async ({ page }) => {
      const footer = new FooterPage(page);
      
      expect(await footer.getSection1ParaText()).toContain('This is a paragraph in Section 1');
      expect(await footer.getSection2ParaText()).toContain('This is a paragraph in Section 2');
      expect(await footer.getSection3ParaText()).toContain('This is a paragraph in Section 3');
    });

    test('should fill footer form inputs', async ({ page }) => {
      const footer = new FooterPage(page);
      
      await footer.fillSection1Input('Test section 1');
      await footer.fillSection2Input('Test section 2');
      await footer.fillSection3Input('Test section 3');
      
      await footer.clickSection1Submit();
      await footer.clickSection2Submit();
      await footer.clickSection3Submit();
    });

    test('should have footer navigation links', async ({ page }) => {
      const footer = new FooterPage(page);
      
      const linkCount = await footer.getFooterLinkCount();
      expect(linkCount).toBe(3);
    });
  });
});