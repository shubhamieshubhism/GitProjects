// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:3000',
//     supportFile: 'cypress/support/e2e.js',
//     specPattern: 'cypress/e2e/**/*.cy.js',
//     video: false,
//     screenshotOnRunFailure: true,
//     defaultCommandTimeout: 15000,  // increased from 10000
//   },
// }); 
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      reportFilename: 'cypress-report',
      overwrite: false,
      html: false,
      json: true,
    },
  },
});