module.exports = {
  id: 'aion_visual_regression',
  viewports: [
    { label: 'desktop', width: 1920, height: 1080 },
    { label: 'tablet', width: 1024, height: 768 },
    { label: 'mobile', width: 375, height: 812 },
  ],
  scenarios: [
    {
      label: 'Login Page',
      url: 'http://localhost:3000/login',
      selectors: ['document'],
      readySelector: 'body',
      delay: 1000,
      misMatchThreshold: 0.1,
      hideSelectors: [
        '.timestamp',
        '.live-counter',
        '.user-avatar',
      ],
    },
    {
      label: 'Dashboard',
      url: 'http://localhost:3000/dashboard',
      selectors: ['document'],
      readySelector: '.dashboard-loaded',
      delay: 2000,
      misMatchThreshold: 0.1,
      hideSelectors: [
        '.timestamp',
        '.live-counter',
        '.user-avatar',
      ],
    },
  ],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  report: ['browser', 'CI'],
  paths: {
    bitmaps_reference: 'src/visual-test/backstop/baseline',
    bitmaps_test: 'src/visual-test/backstop/test-results',
    engine_scripts: 'src/visual-test/backstop/engine_scripts',
    html_report: 'src/visual-test/backstop/html_report',
    ci_report: 'src/visual-test/backstop/ci_report',
  },
  ci: {
    format: 'json',
    testReportFileName: 'backstop-report.json',
    testSuiteName: 'AION Visual Regression',
  },
};
