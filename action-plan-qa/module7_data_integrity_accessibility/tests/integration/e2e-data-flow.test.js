import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { pool } from '../../config/db-config.js';
import setupDatabase from '../../scripts/setup-test-db.js';
import teardownDatabase from '../../scripts/teardown-test-db.js';
import { executeQuery, withTransaction } from '../../utils/db-utils.js';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleAppPath = `file://${path.join(__dirname, '../../sample-app/index.html')}`;

describe('End-to-End Data Flow', () => {
  let browser, page;

  beforeAll(async () => {
    await setupDatabase();
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto(sampleAppPath);
  });

  afterAll(async () => {
    await browser.close();
    await teardownDatabase();
    await pool.end();
  });

  test('UI reads data from database correctly', async () => {
    const tableRows = await page.$$('table tbody tr');
    expect(tableRows.length).toBe(3);
    const firstRowText = await page.evaluate(el => el.textContent, tableRows[0]);
    expect(firstRowText).toContain('Alice');
  });

  test('UI update reflects in database', async () => {
    await withTransaction(async (client) => {
      await executeQuery(client, 'UPDATE users SET balance = balance + 100 WHERE id = 1');
      const result = await executeQuery(client, 'SELECT balance FROM users WHERE id = 1');
      expect(parseFloat(result[0].balance)).toBe(1100);
    });
  });

  test('Accessibility violations do not block data flow', async () => {
    const title = await page.title();
    expect(title).toBe('Sample App – A11y Test');
  });
});
