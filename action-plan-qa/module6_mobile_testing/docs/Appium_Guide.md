# Appium Guide

Appium is an open-source tool for automating native, hybrid, and mobile web apps. It uses the WebDriver protocol.

## Key Concepts
- **Desired Capabilities**: Key‑value pairs that tell Appium which device and app to use.
- **Locators**: Use accessibility IDs (`~`) for best stability.
- **Waits**: Use explicit waits to handle network delays.

## Running Appium Tests
1. Start Appium server: `appium`
2. Run tests with WebDriverIO: `npx wdio run config/appium-config.json --spec <test-file>`

For GPS spoofing, use `driver.setLocation()`.

For more, refer to [Appium Docs](http://appium.io/docs/en/about-appium/intro/).
