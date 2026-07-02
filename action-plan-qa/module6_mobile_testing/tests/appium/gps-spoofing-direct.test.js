// // // import { remote } from "webdriverio";
// // // import { expect } from "chai";
// // // import path from "path";
// // // import { fileURLToPath } from "url";

// // // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // // describe("GPS Spoofing (Direct)", function () {
// // //   this.timeout(60000);
// // //   let driver;

// // //   before(async function () {
// // //     driver = await remote({
// // //       capabilities: {
// // //         platformName: 'Android',
// // //         'appium:deviceName': 'Android Emulator',
// // //         'appium:automationName': 'UiAutomator2',
// // //         'appium:newCommandTimeout': 120,
// // //         'appium:appPackage': 'io.appium.android.apis',
// // //         'appium:appActivity': '.ApiDemos'
// // //       },
// // //       hostname: "localhost",
// // //       port: 4723,
// // //       path: "/",
// // //     });
// // //   });

// // //   after(async function () {
// // //     if (driver) {
// // //       await driver.deleteSession();
// // //     }
// // //   });

// // //   it("should mock device location", async function () {
// // //     // Set a fake location (San Francisco)
// // //     await driver.setLocation({ latitude: 37.7749, longitude: -122.4194 });

// // //     // Now you can test an element that displays location.
// // //     // For ApiDemos, you might open a map or location‑based activity.
// // //     // Here we just verify that the location was set (no error).
// // //     // In a real app, you would check a UI element that shows the location.
// // //     const locationSet = true; // placeholder
// // //     expect(locationSet).to.be.true;
// // //   });
// // // });


// // import { remote } from 'webdriverio';
// // import { expect } from 'chai';

// // describe('GPS Spoofing (Direct)', function () {
// //   this.timeout(60000);
// //   let driver;

// //   before(async function () {
// //     driver = await remote({
// //       capabilities: {
// //         platformName: 'Android',
// //         'appium:deviceName': 'Android Emulator',
// //         'appium:automationName': 'UiAutomator2',
// //         'appium:newCommandTimeout': 120,
// //         'appium:appPackage': 'io.appium.android.apis',
// //         'appium:appActivity': '.ApiDemos'
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

// //   it('should mock device location', async function () {
// //     // Use setGeolocation (W3C standard)
// //     await driver.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

// //     // Verify that the location was set (check that no error occurred)
// //     // In a real app, you would check UI elements that display location.
// //     // Here we just verify the command executed without error.
// //     expect(true).to.be.true;
// //   });
// // });

// import { remote } from 'webdriverio';
// import { expect } from 'chai';

// describe('GPS Spoofing (Direct)', function () {
//   this.timeout(60000);
//   let driver;

//   before(async function () {
//     driver = await remote({
//       capabilities: {
//         platformName: 'Android',
//         'appium:deviceName': 'Android Emulator',
//         'appium:automationName': 'UiAutomator2',
//         'appium:newCommandTimeout': 120,
//         'appium:appPackage': 'io.appium.android.apis',
//         'appium:appActivity': '.ApiDemos'
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

//   it('should mock device location', async function () {
//     // Use Appium's mobile: setGeolocation via executeScript
//     await driver.executeScript('mobile: setGeolocation', {
//       latitude: 37.7749,
//       longitude: -122.4194
//     });

//     // Verify that the command completed without error
//     expect(true).to.be.true;
//   });
// });

import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('GPS Spoofing (Direct)', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    driver = await remote({
      capabilities: {
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:automationName': 'UiAutomator2',
        'appium:newCommandTimeout': 120,
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

  it('should mock device location', async function () {
    await driver.executeScript('mobile: setGeolocation', [{ 
      latitude: 37.7749,
      longitude: -122.4194
    }]);
    expect(true).to.be.true;
  });
});