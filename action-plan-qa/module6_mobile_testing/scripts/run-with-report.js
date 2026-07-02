// scripts/run-with-report.js
import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Ensure reports directory exists
const reportsDir = path.join(projectRoot, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Start Appium (if not already running)
console.log('Starting Appium server...');
const appium = spawn('appium', ['--allow-insecure', 'chromedriver_autodownload'], {
  cwd: projectRoot,
  stdio: ['ignore', 'pipe', 'pipe']
});

// Capture Appium logs
const logStream = fs.createWriteStream(path.join(reportsDir, 'appium.log'));
appium.stdout.pipe(logStream);
appium.stderr.pipe(logStream);

// Wait a moment for Appium to start
await new Promise(resolve => setTimeout(resolve, 5000));

// Run the tests with mochawesome
console.log('Running tests...');
const test = spawn('npm', ['run', 'test:report'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

test.on('close', (code) => {
  console.log(`Tests finished with code ${code}`);
  // Kill Appium
  appium.kill();
  // Merge reports
  exec('npm run merge-reports', { cwd: projectRoot }, (err, stdout) => {
    if (err) {
      console.error('Merge failed:', err);
      return;
    }
    // Generate final HTML report
    exec('npm run generate-report', { cwd: projectRoot }, (err2) => {
      if (err2) {
        console.error('Report generation failed:', err2);
      } else {
        console.log('Final report created: reports/final-report.html');
      }
    });
  });
});