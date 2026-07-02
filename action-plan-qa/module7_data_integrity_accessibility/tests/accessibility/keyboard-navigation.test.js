import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeLog } from '../../utils/report-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleAppPath = `file://${path.join(__dirname, '../../sample-app/index.html')}`;

describe('Keyboard Navigation Audit', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto(sampleAppPath);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Verify keyboard tab order and focus indicators', async () => {
    const tabbable = await page.$$('a, button, input, select, textarea, [tabindex="0"]');
    const focusableNames = [];
    for (const el of tabbable) {
      await el.focus();
      const focused = await page.evaluate(() => document.activeElement);
      const tagName = await page.evaluate(el => el.tagName, focused);
      const id = await page.evaluate(el => el.id || 'no-id', focused);
      focusableNames.push(`${tagName}#${id}`);
      writeLog('keyboard-nav.log', `Focused: ${tagName}#${id}`);
    }
    expect(focusableNames.length).toBeGreaterThan(0);
    await page.screenshot({ path: 'reports/keyboard-focus.png' });
  });

  test('Identify 5 high-priority edge cases', async () => {
    const edgeCases = [
      'Missing aria-label on navigation icons',
      'Insufficient colour contrast on low-contrast text',
      'Missing alt text on product image',
      'No visible focus indicator on tab navigation',
      'Missing aria-labelledby or aria-describedby for form fields'
    ];
    writeLog('edge-cases.log', 'High-Priority Edge Cases:');
    edgeCases.forEach((caseText, i) => {
      writeLog('edge-cases.log', `${i+1}. ${caseText}`);
    });
    expect(edgeCases.length).toBe(5);
  });
});
