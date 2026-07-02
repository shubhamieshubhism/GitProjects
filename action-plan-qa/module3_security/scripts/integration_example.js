// Example: Security check in a Playwright test
// Run with: npx playwright test

const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');
const fs = require('fs');

test('Security scan should pass', async ({ page }) => {
  // Step 1: Run ZAP scan as a separate process
  const scanProcess = spawn('python3', [
    'scripts/zap_scan.py',
    '--target', 'http://localhost:8080/WebGoat'
  ]);

  // Wait for scan to finish (or we could poll the API)
  // For simplicity, we'll wait for the JSON report to appear.
  let alerts = null;
  // We'll poll until the alerts JSON file exists.
  const maxAttempts = 30;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    if (fs.existsSync('reports/zap_alerts.json')) {
      alerts = JSON.parse(fs.readFileSync('reports/zap_alerts.json', 'utf8'));
      break;
    }
  }

  if (!alerts) {
    throw new Error('Scan did not complete within timeout');
  }

  // Check for high-risk vulnerabilities
  const highRisk = alerts.filter(a => a.risk === 'High');
  expect(highRisk.length, 'High-risk vulnerabilities found!').toBe(0);
});