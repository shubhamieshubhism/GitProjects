// // // const path = require('path');

// // // exports.config = {
// // //   runner: 'local',
// // //   specs: [
// // //     path.join(__dirname, 'tests/appium/**/*.test.js')
// // //   ],
// // //   maxInstances: 1,
// // //   capabilities: [{
// // //     platformName: 'Android',
// // //     'appium:platformVersion': '11.0',
// // //     'appium:deviceName': 'Android Emulator',
// // //     'appium:app': path.join(__dirname, 'apps/ApiDemos.apk'),
// // //     'appium:automationName': 'UiAutomator2',
// // //     'appium:newCommandTimeout': 120
// // //   }],
// // //   logLevel: 'info',
// // //   framework: 'mocha',
// // //   reporters: ['spec'],
// // //   services: ['appium'],
// // //   appium: {
// // //     command: 'appium',
// // //     logPath: path.join(__dirname, 'reports/appium-logs')
// // //   },
// // //   mochaOpts: {
// // //     timeout: 60000
// // //   }
// // // };

// // exports.config = {
// //     runner: 'local',
// //     specs: ['./tests/appium/*.test.js'],
// //     maxInstances: 1,
// //     capabilities: [{
// //       platformName: 'Android',
// //       'appium:platformVersion': '11.0',
// //       'appium:deviceName': 'Android Emulator',
// //       'appium:app': './apps/ApiDemos.apk',
// //       'appium:automationName': 'UiAutomator2',
// //       'appium:newCommandTimeout': 120
// //     }],
// //     logLevel: 'info',
// //     framework: 'mocha',
// //     reporters: ['spec'],
// //     services: ['appium'],
// //     appium: {
// //       command: 'appium',
// //       logPath: './reports/appium-logs'
// //     },
// //     mochaOpts: {
// //       timeout: 60000
// //     }
// //   };

// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const config = {
//   runner: 'local',
//   specs: [
//     path.join(__dirname, 'tests/appium/**/*.test.js')
//   ],
//   maxInstances: 1,
//   capabilities: [{
//     platformName: 'Android',
//     'appium:platformVersion': '11.0',
//     'appium:deviceName': 'Android Emulator',
//     'appium:app': path.join(__dirname, 'apps/ApiDemos.apk'),
//     'appium:automationName': 'UiAutomator2',
//     'appium:newCommandTimeout': 120
//   }],
//   logLevel: 'info',
//   framework: 'mocha',
//   reporters: ['spec'],
//   services: ['appium'],
//   appium: {
//     command: 'appium',
//     logPath: path.join(__dirname, 'reports/appium-logs')
//   },
//   mochaOpts: {
//     timeout: 60000
//   }
// };
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  runner: 'local',
  specs: [
    path.join(__dirname, 'tests/appium/**/*.test.js')
  ],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    // Remove platformVersion to auto-detect (your device is Android 16)
    'appium:deviceName': 'Android Emulator',
    'appium:app': path.join(__dirname, 'apps/native-demo-app.apk'), // or ApiDemos-debug.apk
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 120
  }],
  logLevel: 'info',
  framework: 'mocha',
  reporters: ['spec'],
  services: ['appium'],
  appium: {
    command: 'appium',
    logPath: path.join(__dirname, 'reports/appium-logs')
  },
  mochaOpts: {
    timeout: 60000
  }
};