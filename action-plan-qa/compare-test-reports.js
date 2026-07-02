// cd module1/playwright-tests
// npx playwright test --reporter=json > playwright-report/playwright-report.json

// cd ../cypress-tests
// npx cypress run --reporter json --reporter-options output=cypress/results/cypress-report.json
const fs = require('fs').promises;
const path = require('path');

const ROOT = path.resolve(__dirname);
const PLAYWRIGHT_ROOT = path.join(ROOT, 'playwright-tests');
const CYPRESS_ROOT = path.join(ROOT, 'cypress-tests');
const OUTPUT_MARKDOWN = path.join(ROOT, 'test-report-comparison.md');

const PLAYWRIGHT_HINT = `
Playwright JSON report not found.
Generate one by running:
  cd module1/playwright-tests
  npx playwright test --reporter=json > playwright-report/playwright-report.json

If you already have an HTML report, use:
  cd module1/playwright-tests
  npx playwright show-report
`;

const CYPRESS_HINT = `
Cypress JSON report not found.
Generate one by running:
  cd module1/cypress-tests
  npx cypress run --reporter json --reporter-options output=cypress/results/cypress-report.json

Or use mochawesome JSON:
  cd module1/cypress-tests
  npx cypress run --reporter mochawesome --reporter-options reportDir=cypress/results,reportFilename=cypress-report
`;

function formatDuration(ms) {
  if (ms == null || Number.isNaN(ms)) {
    return 'N/A';
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const rest = seconds - mins * 60;
  return `${mins}m ${rest.toFixed(2)}s`;
}

function safeNumber(value) {
  if (value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function scorePlaywrightCandidate(filePath) {
  const normalized = filePath.toLowerCase();
  let score = 0;
  if (normalized.includes('playwright')) score += 50;
  if (normalized.includes('report')) score += 20;
  if (normalized.includes('results')) score += 15;
  if (normalized.includes('json')) score += 5;
  if (normalized.includes('test-results')) score += 30;
  if (normalized.includes('playwright-report')) score += 30;
  return score;
}

function scoreCypressCandidate(filePath) {
  const normalized = filePath.toLowerCase();
  let score = 0;
  if (normalized.includes('cypress')) score += 40;
  if (normalized.includes('mochawesome')) score += 30;
  if (normalized.includes('report')) score += 20;
  if (normalized.includes('results')) score += 15;
  if (normalized.includes('json')) score += 5;
  return score;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git'].includes(entry.name.toLowerCase())) {
        continue;
      }
      files.push(...(await collectJsonFiles(entryPath)));
      continue;
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.json')) {
      continue;
    }
    const ignoredNames = ['package.json', 'package-lock.json', '.package-lock.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json', 'jsconfig.json', '.last-run.json'];
    if (ignoredNames.includes(entry.name.toLowerCase())) {
      continue;
    }
    files.push(entryPath);
  }
  return files;
}

async function findBestReport(root, scoreFn) {
  if (!(await fileExists(root))) {
    return null;
  }
  const jsonFiles = await collectJsonFiles(root);
  if (!jsonFiles.length) return null;

  const scored = await Promise.all(
    jsonFiles.map(async (file) => ({
      file,
      score: scoreFn(file),
      mtime: (await fs.stat(file)).mtimeMs,
    }))
  );

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.mtime - a.mtime;
  });

  return scored[0].score > 0 ? scored[0].file : null;
}

function joinTitleParts(parts) {
  return Array.isArray(parts) ? parts.filter(Boolean).join(' > ') : parts;
}

function collectPlaywrightErrors(data) {
  const errors = [];

  function addError(testName, err) {
    if (!err) return;
    let message = typeof err === 'string' ? err : err.message ?? err.stack ?? JSON.stringify(err);
    message = message.trim();
    if (!message) return;
    errors.push({ testName, message });
  }

  function traverseSuite(suite, parentTitle = []) {
    if (!suite) return;
    const titlePath = [...parentTitle, suite.title].filter(Boolean);

    if (Array.isArray(suite.tests)) {
      for (const test of suite.tests) {
        const name = joinTitleParts([...titlePath, test.title]);
        if (Array.isArray(test.results)) {
          for (const result of test.results) {
            if (result.status === 'failed') {
              addError(name, result.error || result.errors?.[0]);
            }
          }
        }
      }
    }

    if (Array.isArray(suite.suites)) {
      for (const nested of suite.suites) {
        traverseSuite(nested, titlePath);
      }
    }
  }

  if (data.suites) {
    traverseSuite(data.suites);
  }

  if (Array.isArray(data.tests)) {
    for (const test of data.tests) {
      const name = joinTitleParts([test.location?.file || '', test.title]);
      if (test.status === 'failed') {
        addError(name, test.error || test.errors?.[0]);
      }
    }
  }

  return errors;
}

function parsePlaywrightJson(data) {
  const summary = {
    total: null,
    passed: null,
    failed: null,
    skipped: null,
    flaky: null,
    durationMs: null,
    errors: [],
    raw: data,
  };

  if (Array.isArray(data)) {
    let startMs = null;
    let endMs = null;
    for (const record of data) {
      if (!record || typeof record !== 'object') continue;
      const event = record.event || record.type;
      if (event === 'testEnd' || event === 'test:end') {
        const status = record.result?.status ?? record.data?.status;
        const title = record.test?.title ?? record.data?.test?.title ?? record.data?.title;
        if (status === 'passed') summary.passed = (summary.passed ?? 0) + 1;
        if (status === 'failed') summary.failed = (summary.failed ?? 0) + 1;
        if (status === 'skipped') summary.skipped = (summary.skipped ?? 0) + 1;
        if (status === 'flaky' || record.result?.flaky || record.data?.flaky) {
          summary.flaky = (summary.flaky ?? 0) + 1;
        }
        if (status === 'failed') {
          addErrorMessage(summary, title, record.result?.error || record.data?.error);
        }
      }
      if (event === 'begin' && record.data?.startTime) {
        startMs = new Date(record.data.startTime).getTime();
      }
      if (event === 'end' && record.data?.duration != null) {
        summary.durationMs = safeNumber(record.data.duration);
      }
      if (event === 'end' && record.data?.endTime) {
        endMs = new Date(record.data.endTime).getTime();
      }
    }
    if (summary.durationMs == null && startMs && endMs) {
      summary.durationMs = endMs - startMs;
    }
    summary.total = [summary.passed, summary.failed, summary.skipped]
      .filter((v) => v != null)
      .reduce((sum, v) => sum + v, 0);
    return summary;
  }

  const stats = data.stats || data;
  summary.passed = safeNumber(stats.passed ?? stats.ok ?? stats.passed ?? stats.passedTests ?? null);
  summary.failed = safeNumber(stats.failed ?? stats.failures ?? null);
  summary.skipped = safeNumber(stats.skipped ?? stats.pending ?? null);
  summary.flaky = safeNumber(stats.flaky ?? null);
  summary.total = safeNumber(stats.total ?? stats.tests ?? null);
  summary.durationMs = safeNumber(stats.duration ?? stats.wallClockDuration ?? stats.wallDuration ?? null);

  if (data.results) {
    const counts = { passed: 0, failed: 0, skipped: 0, flaky: 0 };
    for (const result of data.results) {
      const status = result.status;
      if (status === 'passed') counts.passed += 1;
      if (status === 'failed') counts.failed += 1;
      if (status === 'skipped') counts.skipped += 1;
      if (status === 'flaky') counts.flaky += 1;
      if (status === 'failed' && result.error) {
        addErrorMessage(summary, result.title || result.fullTitle || result.name, result.error);
      }
    }
    summary.passed = summary.passed ?? counts.passed;
    summary.failed = summary.failed ?? counts.failed;
    summary.skipped = summary.skipped ?? counts.skipped;
    summary.flaky = summary.flaky ?? counts.flaky;
    summary.total = summary.total ?? counts.passed + counts.failed + counts.skipped;
  }

  if (!summary.errors.length) {
    summary.errors = collectPlaywrightErrors(data);
  }

  return summary;
}

function addErrorMessage(summary, title, err) {
  if (!err) return;
  const text = typeof err === 'string' ? err : err.message ?? err.stack ?? JSON.stringify(err);
  if (!text) return;
  summary.errors.push({ testName: title || 'unknown', message: text.trim() });
}

function parseCypressJson(data) {
  const summary = {
    total: null,
    passed: null,
    failed: null,
    skipped: null,
    flaky: null,
    durationMs: null,
    errors: [],
    raw: data,
  };

  const stats = data.stats || (data.results && data.results[0] && data.results[0].stats) || null;
  if (stats) {
    summary.total = safeNumber(stats.tests);
    summary.passed = safeNumber(stats.passes);
    summary.failed = safeNumber(stats.failures);
    summary.skipped = safeNumber(stats.pending ?? stats.skipped);
    summary.durationMs = safeNumber(stats.duration);
  }

  if (Array.isArray(data.tests)) {
    parseCypressTestsArray(data.tests, summary);
  }

  if (Array.isArray(data.results)) {
    for (const result of data.results) {
      if (Array.isArray(result.suites?.tests)) {
        parseCypressTestsArray(result.suites.tests, summary);
      }
      if (Array.isArray(result.tests)) {
        parseCypressTestsArray(result.tests, summary);
      }
      if (result.stats && summary.total == null) {
        summary.total = safeNumber(result.stats.tests);
        summary.passed = summary.passed ?? safeNumber(result.stats.passes);
        summary.failed = summary.failed ?? safeNumber(result.stats.failures);
        summary.skipped = summary.skipped ?? safeNumber(result.stats.pending ?? result.stats.skipped);
        summary.durationMs = summary.durationMs ?? safeNumber(result.stats.duration);
      }
    }
  }

  if (summary.total == null && summary.passed != null && summary.failed != null && summary.skipped != null) {
    summary.total = summary.passed + summary.failed + summary.skipped;
  }

  return summary;
}

function parseCypressTestsArray(tests, summary) {
  for (const test of tests) {
    const state = test.state;
    if (state === 'passed') summary.passed = (summary.passed ?? 0) + 1;
    if (state === 'failed') summary.failed = (summary.failed ?? 0) + 1;
    if (state === 'pending' || state === 'skipped') summary.skipped = (summary.skipped ?? 0) + 1;
    if (state === 'flaky') summary.flaky = (summary.flaky ?? 0) + 1;
    if (state === 'failed') {
      const title = Array.isArray(test.title) ? test.title.join(' ') : test.title;
      addErrorMessage(summary, title, test.err || test.error);
    }
    if (Array.isArray(test.tests)) {
      parseCypressTestsArray(test.tests, summary);
    }
  }
}

function summarizeMetrics(parsed) {
  return {
    total: parsed.total ?? 'N/A',
    passed: parsed.passed ?? 'N/A',
    failed: parsed.failed ?? 'N/A',
    skipped: parsed.skipped ?? 'N/A',
    flaky: parsed.flaky ?? 'N/A',
    duration: formatDuration(parsed.durationMs),
    durationMs: parsed.durationMs,
    errors: parsed.errors?.slice(0, 10) ?? [],
  };
}

function compareValues(a, b) {
  if (a == null || b == null || Number.isNaN(a) || Number.isNaN(b)) {
    return 'N/A';
  }
  const delta = b - a;
  const sign = delta > 0 ? '+' : delta < 0 ? '' : '';
  return `${sign}${delta}`;
}

function makeTable(rows) {
  const lines = ['| Framework | Total | Passed | Failed | Skipped | Flaky | Duration |', '|---|---|---|---|---|---|---|'];
  for (const row of rows) {
    lines.push(`| ${row.framework} | ${row.total} | ${row.passed} | ${row.failed} | ${row.skipped} | ${row.flaky} | ${row.duration} |`);
  }
  return lines.join('\n');
}

function makeChart(value, maxValue) {
  if (value == null || maxValue == null || maxValue <= 0) return '';
  const width = 24;
  const filled = Math.round((value / maxValue) * width);
  const empty = width - filled;
  return `[${'#'.repeat(filled)}${' '.repeat(empty)}]`;
}

function makeMetricRow(name, left, right, better) {
  const leftValue = left == null ? 'N/A' : left;
  const rightValue = right == null ? 'N/A' : right;
  const verdict = better === 'left' ? '✅' : better === 'right' ? '✅' : '';
  return `- **${name}**: Playwright=${leftValue}, Cypress=${rightValue} ${verdict}`.trim();
}

function makeSummary(playwright, cypress) {
  const lines = [];
  const leftDur = playwright.durationMs;
  const rightDur = cypress.durationMs;
  if (leftDur != null && rightDur != null) {
    if (leftDur < rightDur) {
      lines.push('Playwright was faster.');
    } else if (rightDur < leftDur) {
      lines.push('Cypress was faster.');
    } else {
      lines.push('Both frameworks had the same reported duration.');
    }
  }

  const leftFailed = playwright.failed;
  const rightFailed = cypress.failed;
  if (leftFailed != null && rightFailed != null) {
    if (leftFailed < rightFailed) {
      lines.push('Playwright had fewer failed tests.');
    } else if (rightFailed < leftFailed) {
      lines.push('Cypress had fewer failed tests.');
    } else {
      lines.push('Both frameworks reported the same number of failed tests.');
    }
  }

  const leftFlaky = playwright.flaky;
  const rightFlaky = cypress.flaky;
  if (leftFlaky != null && rightFlaky != null) {
    if (leftFlaky < rightFlaky) {
      lines.push('Playwright reported fewer flaky tests.');
    } else if (rightFlaky < leftFlaky) {
      lines.push('Cypress reported fewer flaky tests.');
    } else {
      lines.push('Both frameworks reported the same flaky test count.');
    }
  }

  return lines.length ? lines.join(' ') : 'Comparison did not produce a verdict because one or both report files were incomplete.';
}

async function parseJsonFile(filePath) {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${filePath}: ${error.message}`);
  }
}

async function run() {
  const [playwrightFile, cypressFile] = process.argv.slice(2);
  const detectedPlaywrightFile = playwrightFile || (await findBestReport(PLAYWRIGHT_ROOT, scorePlaywrightCandidate));
  const detectedCypressFile = cypressFile || (await findBestReport(CYPRESS_ROOT, scoreCypressCandidate));

  const outputLines = [];
  outputLines.push('# Test Report Comparison');
  outputLines.push('');
  outputLines.push(`Generated on ${new Date().toISOString()}`);
  outputLines.push('');

  if (!detectedPlaywrightFile) {
    const message = 'No Playwright JSON report was found under module1/playwright-tests/.';
    console.error(message);
    console.error(PLAYWRIGHT_HINT);
    outputLines.push('## Playwright Report');
    outputLines.push(message);
    outputLines.push('');
  }

  if (!detectedCypressFile) {
    const message = 'No Cypress JSON report was found under module1/cypress-tests/.';
    console.error(message);
    console.error(CYPRESS_HINT);
    outputLines.push('## Cypress Report');
    outputLines.push(message);
    outputLines.push('');
  }

  if (!detectedPlaywrightFile || !detectedCypressFile) {
    outputLines.push('> Please generate the missing JSON reports and rerun this script.');
    await fs.writeFile(OUTPUT_MARKDOWN, outputLines.join('\n'), 'utf8');
    console.log(`Comparison file written to ${OUTPUT_MARKDOWN}`);
    return;
  }

  let playwrightData;
  let cypressData;
  try {
    playwrightData = await parseJsonFile(detectedPlaywrightFile);
  } catch (error) {
    console.error(error.message);
    outputLines.push('## Playwright Parsing Error');
    outputLines.push(error.message);
    await fs.writeFile(OUTPUT_MARKDOWN, outputLines.join('\n'), 'utf8');
    return;
  }

  try {
    cypressData = await parseJsonFile(detectedCypressFile);
  } catch (error) {
    console.error(error.message);
    outputLines.push('## Cypress Parsing Error');
    outputLines.push(error.message);
    await fs.writeFile(OUTPUT_MARKDOWN, outputLines.join('\n'), 'utf8');
    return;
  }

  const playwrightParsed = parsePlaywrightJson(playwrightData);
  const cypressParsed = parseCypressJson(cypressData);
  const playwrightMetrics = summarizeMetrics(playwrightParsed);
  const cypressMetrics = summarizeMetrics(cypressParsed);

  const rows = [
    {
      framework: 'Playwright',
      ...playwrightMetrics,
    },
    {
      framework: 'Cypress',
      ...cypressMetrics,
    },
  ];

  const markdownTable = makeTable(rows);
  outputLines.push('## Summary Comparison');
  outputLines.push('');
  outputLines.push(markdownTable);
  outputLines.push('');
  outputLines.push('## Verdict');
  outputLines.push('');
  outputLines.push(makeSummary(playwrightParsed, cypressParsed));
  outputLines.push('');
  outputLines.push('## Report Sources');
  outputLines.push('');
  outputLines.push(`- Playwright JSON: \`${detectedPlaywrightFile.replace(/\\/g, '/')}\``);
  outputLines.push(`- Cypress JSON: \`${detectedCypressFile.replace(/\\/g, '/')}\``);
  outputLines.push('');

  const maxDuration = Math.max(playwrightParsed.durationMs || 0, cypressParsed.durationMs || 0, 1);
  const maxTotal = Math.max(playwrightParsed.total || 0, cypressParsed.total || 0, 1);

  outputLines.push('## Simple Comparison Charts');
  outputLines.push('');
  outputLines.push(`Playwright duration ${playwrightParsed.durationMs ?? 'N/A'}ms ${makeChart(playwrightParsed.durationMs, maxDuration)}`);
  outputLines.push(`Cypress duration ${cypressParsed.durationMs ?? 'N/A'}ms ${makeChart(cypressParsed.durationMs, maxDuration)}`);
  outputLines.push('');
  outputLines.push(`Playwright total tests ${playwrightParsed.total ?? 'N/A'} ${makeChart(playwrightParsed.total, maxTotal)}`);
  outputLines.push(`Cypress total tests ${cypressParsed.total ?? 'N/A'} ${makeChart(cypressParsed.total, maxTotal)}`);
  outputLines.push('');

  if (playwrightMetrics.errors.length) {
    outputLines.push('## Playwright Failures');
    outputLines.push('');
    playwrightMetrics.errors.forEach((err) => {
      outputLines.push(`- **${err.testName}**: ${err.message}`);
    });
    outputLines.push('');
  }

  if (cypressMetrics.errors.length) {
    outputLines.push('## Cypress Failures');
    outputLines.push('');
    cypressMetrics.errors.forEach((err) => {
      outputLines.push(`- **${err.testName}**: ${err.message}`);
    });
    outputLines.push('');
  }

  const outputText = outputLines.join('\n');
  await fs.writeFile(OUTPUT_MARKDOWN, outputText, 'utf8');
  console.log(outputText);
  console.log('\nComparison file written to', OUTPUT_MARKDOWN);
}

run().catch((error) => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});
