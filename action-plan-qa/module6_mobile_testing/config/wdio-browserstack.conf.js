exports.config = {
    runner: 'local',
    specs: ['./tests/appium/parallel-test.js'],
    maxInstances: 3,
    capabilities: [
      {
        platformName: 'Android',
        'appium:platformVersion': '11.0',
        'appium:deviceName': 'Google Pixel 4',
        'appium:app': 'bs://<hashed_app_id>',
        'appium:automationName': 'UiAutomator2',
        'bstack:options': {
          projectName: 'Mobile Test Module',
          buildName: 'Parallel Demo',
          sessionName: 'Pixel 4 - Android 11'
        }
      },
      {
        platformName: 'Android',
        'appium:platformVersion': '10.0',
        'appium:deviceName': 'Samsung Galaxy S10',
        'appium:app': 'bs://<hashed_app_id>',
        'appium:automationName': 'UiAutomator2',
        'bstack:options': {
          projectName: 'Mobile Test Module',
          buildName: 'Parallel Demo',
          sessionName: 'Galaxy S10 - Android 10'
        }
      },
      {
        platformName: 'iOS',
        'appium:platformVersion': '14.0',
        'appium:deviceName': 'iPhone 12',
        'appium:app': 'bs://<hashed_app_id>',
        'appium:automationName': 'XCUITest',
        'bstack:options': {
          projectName: 'Mobile Test Module',
          buildName: 'Parallel Demo',
          sessionName: 'iPhone 12 - iOS 14'
        }
      }
    ],
    logLevel: 'info',
    framework: 'mocha',
    reporters: ['spec'],
    services: [
      ['browserstack', { browserstackLocal: true }]
    ],
    mochaOpts: {
      timeout: 60000
    }
  };
  