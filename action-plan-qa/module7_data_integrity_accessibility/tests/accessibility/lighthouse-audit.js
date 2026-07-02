import { describe, test, expect } from '@jest/globals';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { writeReport } from '../../utils/report-utils.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleAppPath = `file://${path.join(__dirname, '../../sample-app/index.html')}`;

describe('Lighthouse Accessibility Audit', () => {
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Generate Lighthouse accessibility report', async () => {
    const port = 9222;
    const url = sampleAppPath;

    const options = {
      port,
      output: 'json',
      onlyCategories: ['accessibility', 'best-practices']
    };

    const runnerResult = await lighthouse(url, options, undefined);
    const report = runnerResult.report;

    writeReport('lighthouse-report.json', JSON.parse(report));
    const a11yScore = runnerResult.lhr.categories.accessibility.score * 100;

    console.log(`Lighthouse Accessibility Score: ${a11yScore}%`);
    expect(a11yScore).toBeLessThan(100);
  });
});
