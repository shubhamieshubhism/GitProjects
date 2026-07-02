import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { axeConfig } from '../../config/axe-config.js';
import { writeHTMLReport, writeReport } from '../../utils/report-utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleAppPath = `file://${path.join(__dirname, '../../sample-app/index.html')}`;

describe('Accessibility – Axe Audits', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto(sampleAppPath);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('WCAG 2.2 AA compliance check', async () => {
    const axe = new AxePuppeteer(page);
    const results = await axe
      .options(axeConfig)
      .include('html')
      .exclude('footer')
      .analyze();

    writeReport('axe-results.json', results);
    const htmlReport = `
      <h1>Axe Accessibility Report</h1>
      <p>Violations found: ${results.violations.length}</p>
      <ul>
        ${results.violations.map(v => `
          <li>
            <strong>${v.id}</strong> – ${v.description}
            <br/>Impact: ${v.impact}
            <br/>Help URL: <a href="${v.helpUrl}">${v.helpUrl}</a>
            <ul>${v.nodes.map(n => `<li>${n.html}</li>`).join('')}</ul>
          </li>
        `).join('')}
      </ul>
    `;
    writeHTMLReport('axe-report.html', htmlReport);
    expect(results.violations.length).toBeGreaterThanOrEqual(1);
  });

  test('Specific violation: missing alt text on images', async () => {
    const results = await new AxePuppeteer(page)
      .options({ rules: { 'image-alt': { enabled: true } } })
      .analyze();
    const imageViolations = results.violations.filter(v => v.id === 'image-alt');
    expect(imageViolations.length).toBe(1);
    expect(imageViolations[0].nodes[0].html).toContain('img');
  });

  test('Specific violation: low colour contrast', async () => {
    const results = await new AxePuppeteer(page)
      .options({ rules: { 'color-contrast': { enabled: true } } })
      .analyze();
    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
    expect(contrastViolations.length).toBeGreaterThanOrEqual(1);
  });
});
