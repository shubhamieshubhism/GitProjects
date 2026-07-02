// // // // // import { remote } from 'webdriverio';
// // // // // import { expect } from 'chai';
// // // // // import path from 'path';
// // // // // import { fileURLToPath } from 'url';

// // // // // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // // // // describe('Sign-up Flow (Direct Appium)', function () {
// // // // //   this.timeout(60000);
// // // // //   let driver;

// // // // //   before(async function () {
// // // // //     // Start Appium session
// // // // //     driver = await remote({
// // // // //       capabilities: {
// // // // //         platformName: 'Android',
// // // // //         'appium:platformVersion': '11.0',
// // // // //         'appium:deviceName': 'Android Emulator',
// // // // //         'appium:app': path.join(__dirname, '../../apps/ApiDemos.apk'),
// // // // //         'appium:automationName': 'UiAutomator2',
// // // // //         'appium:newCommandTimeout': 120
// // // // //       },
// // // // //       hostname: 'localhost',
// // // // //       port: 4723,
// // // // //       path: '/'
// // // // //     });
// // // // //   });

// // // // //   after(async function () {
// // // // //     if (driver) {
// // // // //       await driver.deleteSession();
// // // // //     }
// // // // //   });

// // // // //   it('should complete the sign-up process', async function () {
// // // // //     // Locators – adjust based on actual app
// // // // //     const usernameField = await driver.$('~usernameInput');
// // // // //     const passwordField = await driver.$('~passwordInput');
// // // // //     const signUpButton = await driver.$('~signUpButton');
// // // // //     const successMessage = await driver.$('~welcomeMessage');

// // // // //     await usernameField.waitForDisplayed({ timeout: 10000 });
// // // // //     await usernameField.setValue('testuser');
// // // // //     await passwordField.setValue('securePass123');
// // // // //     await signUpButton.click();

// // // // //     await successMessage.waitForDisplayed({ timeout: 10000 });
// // // // //     const message = await successMessage.getText();
// // // // //     expect(message).to.include('Welcome, testuser');
// // // // //   });
// // // // // });


// // // // import { remote } from 'webdriverio';
// // // // import { expect } from 'chai';
// // // // import path from 'path';
// // // // import { fileURLToPath } from 'url';

// // // // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // // // describe('ApiDemos – App Launch', function () {
// // // //   this.timeout(60000);
// // // //   let driver;

// // // //   before(async function () {
// // // //     driver = await remote({
// // // //       capabilities: {
// // // //         platformName: 'Android',
// // // //         'appium:platformVersion': '16',          // matches your emulator API level
// // // //         'appium:deviceName': 'Android Emulator',
// // // //         'appium:app': path.join(__dirname, '../../apps/ApiDemos.apk'),
// // // //         'appium:automationName': 'UiAutomator2',
// // // //         'appium:newCommandTimeout': 120
// // // //       },
// // // //       hostname: 'localhost',
// // // //       port: 4723,
// // // //       path: '/'
// // // //     });
// // // //   });

// // // //   after(async function () {
// // // //     if (driver) {
// // // //       await driver.deleteSession();
// // // //     }
// // // //   });

// // // //   it('should open the app and display the main title', async function () {
// // // //     // Wait for a known element – the "API Demos" title is usually a TextView at the top
// // // //     const titleElement = await driver.$('//android.widget.TextView[@text="API Demos"]');
// // // //     await titleElement.waitForDisplayed({ timeout: 10000 });
// // // //     const text = await titleElement.getText();
// // // //     expect(text).to.equal('API Demos');
// // // //   });
// // // // });
// // // import { remote } from 'webdriverio';
// // // import { expect } from 'chai';
// // // import path from 'path';
// // // import { fileURLToPath } from 'url';

// // // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // // describe('Android Sample App – Sign-up Flow', function () {
// // //   this.timeout(60000);
// // //   let driver;

// // //   before(async function () {
// // //     driver = await remote({
// // //       capabilities: {
// // //         platformName: 'Android',
// // //         // Remove platformVersion to let Appium auto-detect, or set to actual API (e.g., 30)
// // //         // 'appium:platformVersion': '30',
// // //         'appium:deviceName': 'Android Emulator',
// // //         'appium:app': path.join(__dirname, '../../apps/Android-Sample-App.apk'),
// // //         'appium:automationName': 'UiAutomator2',
// // //         'appium:newCommandTimeout': 120
// // //       },
// // //       hostname: 'localhost',
// // //       port: 4723,
// // //       path: '/'
// // //     });
// // //   });

// // //   after(async function () {
// // //     if (driver) {
// // //       await driver.deleteSession();
// // //     }
// // //   });

// // //   it('should open the app and display the login screen', async function () {
// // //     // Wait for a known element – the login screen usually has an email field
// // //     const emailField = await driver.$('~input-email'); // accessibility ID may be "input-email"
// // //     await emailField.waitForDisplayed({ timeout: 10000 });
// // //     const isDisplayed = await emailField.isDisplayed();
// // //     expect(isDisplayed).to.be.true;
// // //   });
// // // });

// // import { remote } from 'webdriverio';
// // import { expect } from 'chai';
// // import path from 'path';
// // import { fileURLToPath } from 'url';

// // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // describe('Android Sample App – Sign-up Flow', function () {
// //   this.timeout(60000);
// //   let driver;

// //   before(async function () {
// //     driver = await remote({
// //       capabilities: {
// //         platformName: 'Android',
// //         'appium:deviceName': 'Android Emulator',
// //         'appium:app': path.join(__dirname, '../../apps/appium-sample-app.apk'),
// //         'appium:automationName': 'UiAutomator2',
// //         'appium:newCommandTimeout': 120
// //       },
// //       hostname: 'localhost',
// //       port: 4723,
// //       path: '/'
// //     });
// //   });

// //   after(async function () {
// //     if (driver) {
// //       await driver.deleteSession();
// //     }
// //   });

// //   it('should open the app and display the email input', async function () {
// //     // Use a resource ID (common for Android apps)
// //     const emailField = await driver.$('android=new UiSelector().resourceId("com.example.androidapp:id/email")');
// //     await emailField.waitForDisplayed({ timeout: 10000 });
// //     expect(await emailField.isDisplayed()).to.be.true;
// //   });
// // });

// import { remote } from 'webdriverio';
// import { expect } from 'chai';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// describe('Native Demo App – Login Screen', function () {
//   this.timeout(60000);
//   let driver;

//   before(async function () {
//     driver = await remote({
//       capabilities: {
//         platformName: 'Android',
//         'appium:deviceName': 'Android Emulator',
//         'appium:app': path.join(__dirname, '../../apps/native-demo-app.apk'),
//         'appium:automationName': 'UiAutomator2',
//         'appium:newCommandTimeout': 120
//       },
//       hostname: 'localhost',
//       port: 4723,
//       path: '/'
//     });
//   });

//   after(async function () {
//     if (driver) {
//       await driver.deleteSession();
//     }
//   });

//   it('should display the login screen', async function () {
//     // The app has a "Login" button
//     const loginButton = await driver.$('~Login');
//     await loginButton.waitForDisplayed({ timeout: 10000 });
//     expect(await loginButton.isDisplayed()).to.be.true;
//   });
// });

import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('ApiDemos – App Launch', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    driver = await remote({
      capabilities: {
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:automationName': 'UiAutomator2',
        'appium:newCommandTimeout': 120,
        // Launch the installed ApiDemos app
        'appium:appPackage': 'io.appium.android.apis',
        'appium:appActivity': '.ApiDemos'
      },
      hostname: 'localhost',
      port: 4723,
      path: '/'
    });
  });

  after(async function () {
    if (driver) {
      await driver.deleteSession();
    }
  });

  it('should open the app and display the title', async function () {
    // Wait for the "API Demos" title (TextView)
    const titleElement = await driver.$('//android.widget.TextView[@text="API Demos"]');
    await titleElement.waitForDisplayed({ timeout: 10000 });
    expect(await titleElement.isDisplayed()).to.be.true;
  });
});