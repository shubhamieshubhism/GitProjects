import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.join(__dirname, '../reports');

export function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

export function writeReport(filename, content, format = 'json') {
  ensureReportsDir();
  const filePath = path.join(REPORTS_DIR, filename);
  if (format === 'json' && typeof content !== 'string') {
    content = JSON.stringify(content, null, 2);
  }
  fs.writeFileSync(filePath, content);
  console.log(`📊 Report saved: ${filePath}`);
}

export function writeHTMLReport(filename, html) {
  ensureReportsDir();
  const filePath = path.join(REPORTS_DIR, filename);
  fs.writeFileSync(filePath, html);
  console.log(`📊 HTML report saved: ${filePath}`);
}

export function writeLog(filename, logText) {
  ensureReportsDir();
  const filePath = path.join(REPORTS_DIR, filename);
  fs.appendFileSync(filePath, logText + '\\n');
}
