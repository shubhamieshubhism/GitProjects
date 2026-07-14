// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '../src/tests',
  testMatch: 'practice-page.spec.js',
  fullyParallel: true,
  retries: 0,
  workers: 3,
  reporter: [
    ['html'],
    ['list'],
  ],
  
  use: {
    baseURL: 'https://testautomationpractice.blogspot.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});