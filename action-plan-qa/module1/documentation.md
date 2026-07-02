# Module 1: QA Engineer Specialization – End‑to‑End Documentation

This document provides everything you need to understand, set up, and run the **Module 1** project – a complete QA automation suite that includes:
- A **demo e‑commerce web application** (single HTML page with dark mode, micro‑frontend widgets, cart, etc.)
- **Playwright** test suite (TypeScript)
- **Cypress** test suite (JavaScript)
- A **comparison script** that generates a Markdown report comparing test results

All code is self‑contained and ready to run locally.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
   - [1. Clone the Repository or Create the Files](#1-clone-the-repository-or-create-the-files)
   - [2. Install Dependencies](#2-install-dependencies)
   - [3. Verify the Application](#3-verify-the-application)
5. [Running the Application](#running-the-application)
   - [Option A – Using `http-server`](#option-a--using-http-server)
   - [Option B – With Playwright’s Built‑in Server (if configured)](#option-b--with-playwrights-builtin-server-if-configured)
6. [Running Playwright Tests](#running-playwright-tests)
7. [Running Cypress Tests](#running-cypress-tests)
8. [Generating Test Reports](#generating-test-reports)
   - [Playwright HTML Report](#playwright-html-report)
   - [Cypress JSON Report (with Mochawesome)](#cypress-json-report-with-mochawesome)
9. [Comparing Playwright and Cypress Results](#comparing-playwright-and-cypress-results)
   - [Using the Comparison Script](#using-the-comparison-script)
10. [Interpreting Test Results](#interpreting-test-results)
11. [Troubleshooting Common Issues](#troubleshooting-common-issues)
12. [CI/CD Integration (GitHub Actions)](#cicd-integration-github-actions)
13. [Glossary of Key Terms](#glossary-of-key-terms)

---

## Project Overview

**Module 1** is designed to demonstrate modern web application testing using two of the most popular tools: **Playwright** and **Cypress**. Both frameworks test the same e‑commerce application, covering:

*   **Dark mode toggle** – verification of theme persistence.
*   **Micro‑frontend widgets** – independent toggling of recommended/recently viewed widgets.
*   **Selector performance** – benchmarking different locator strategies (CSS, XPath, data‑testid, etc.).
*   **Cart functionality** – adding items, opening the cart modal, verifying contents.
*   **CI/CD readiness** – tests include configuration for parallel execution and reporting.

The application itself is a minimalist online store with dark mode, product listing (500+ items), recommended and recently viewed widgets, and a cart modal. All interactive elements have stable `data-testid` attributes, making tests reliable and maintainable.

---

## Folder Structure

```text
module1/
├── index.html                           # E‑commerce application (single HTML file)
├── compare-test-reports.js              # Script to compare Playwright & Cypress reports
├── test-report-comparison.md            # (generated comparison report)
│
├── playwright-tests/                    # Playwright test suite
│   ├── package.json
│   ├── playwright.config.ts
│   ├── playwright-report/               # (generated after running tests)
│   ├── test-results/                    # (generated after running tests)
│   ├── helpers/
│   │   └── snapshot-to-locators.ts
│   └── tests/
│       ├── dark-mode.spec.ts
│       ├── microfrontend.spec.ts
│       ├── performance.spec.ts
│       ├── locator-generation.spec.ts
│       ├── ci-comparison.spec.ts
│       └── cart.spec.ts
│
└── cypress-tests/                       # Cypress test suite
    ├── package.json
    ├── cypress.config.js
    ├── cypress/
    │   ├── results/                     # (generated JSON reports)
    │   ├── screenshots/                 # (screenshots on failures)
    │   ├── fixtures/
    │   ├── support/
    │   │   ├── commands.js
    │   │   └── e2e.js
    │   ├── helpers/
    │   │   └── snapshot-to-locators.js
    │   └── e2e/
    │       ├── dark-mode.cy.js
    │       ├── microfrontend.cy.js
    │       ├── performance.cy.js
    │       ├── locator-generation.cy.js
    │       ├── ci-comparison.cy.js
    │       └── cart.cy.js
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Minimum Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | 18+ | Runtime for test frameworks and utilities |
| **npm** | 8+ | Package manager |
| **Playwright** | latest | Test framework |
| **Cypress** | latest | Test framework |
| **`http-server`** | latest | To serve the e‑commerce application locally |

> **Note:** The application can also be served using any static HTTP server (e.g., Python's `http.server`, or VS Code Live Server). The commands below assume `http-server` is installed globally or via `npx`.

---

## Setup Instructions

### 1. Clone the Repository or Create the Files
If you have the repository, simply navigate to the root folder (e.g., `module1/`). If you are building from scratch, ensure the file structure above is in place.

### 2. Install Dependencies
Open two separate terminal windows (or tabs) – one for Playwright and one for Cypress.

#### Playwright Setup:
```bash
cd playwright-tests
npm install
npx playwright install   # Downloads required browser binaries
```

#### Cypress Setup:
```bash
cd cypress-tests
npm install
```

### 3. Verify the Application
The application is a single HTML file (`index.html`). You can open it directly in your browser to see the store. However, for automated testing, it must be served via HTTP.

---

## Running the Application

You need to serve the application on a local server so both Playwright and Cypress can access it.

### Option A – Using `http-server` (Recommended)
If you have `http-server` installed globally:
```bash
http-server . -p 3000
```
If not, use `npx`:
```bash
npx http-server . -p 3000
```
This serves the current directory (where `index.html` lives) on port 3000.
> **Note:** The application will be available at `http://localhost:3000`.

### Option B – With Playwright’s Built‑in Server (if configured)
Both Playwright and Cypress configurations include a `webServer` option that can start the server automatically when running tests. If you prefer this approach, simply run tests without manually starting the server – but ensure the `start:app` script in `package.json` points to the correct folder.

---

## Running Playwright Tests

From the `playwright-tests` folder, execution can be configured with the following flags:

*   **Run all tests (headless):**
```bash
    npx playwright test
    ```
*   **Run tests in interactive UI mode:**
```bash
    npx playwright test --ui
    ```
*   **Run a specific test file:**
```bash
    npx playwright test tests/dark-mode.spec.ts
    ```
*   **Run with a specific browser:**
```bash
    npx playwright test --project=chromium
    ```
*   **Run with reporting:**
```bash
    npx playwright test --reporter=html
    ```

After the run, an HTML report is generated in `playwright-report/`. You can view it with:
```bash
npx playwright show-report
```

*   **Run with JSON output (required for the comparison script):**
```bash
    npx playwright test --reporter=json > playwright-report/playwright-report.json
    ```

---

## Running Cypress Tests

From the `cypress-tests` folder, run the following commands:

*   **Run all tests headlessly:**
```bash
    npx cypress run
    ```
*   **Open the interactive test runner:**
```bash
    npx cypress open
    ```
*   **Run a specific spec file:**
```bash
    npx cypress run --spec "cypress/e2e/cart.cy.js"
    ```
*   **Run with Mochawesome reporter (required for JSON output):**
```bash
    npm install --save-dev mochawesome mochawesome-merge
    npx cypress run --reporter mochawesome --reporter-options reportDir=cypress/results,reportFilename=cypress-report,overwrite=false
    npx mochawesome-merge cypress/results/*.json > cypress/results/cypress-report.json
    ```

The merged JSON report is used directly by the comparison script.

---

## Generating Test Reports

### Playwright HTML Report
After running tests with the `html` reporter, open the report instantly via:
```bash
npx playwright show-report
```

### Cypress JSON Report (with Mochawesome)
The setup steps generate a merged JSON file at `cypress/results/cypress-report.json`. If you prefer a standalone HTML report, install `mochawesome-report-generator` and run:
```bash
npx marge cypress/results/cypress-report.json --reportDir cypress/results
```

---

## Comparing Playwright and Cypress Results

We provide a Node.js script named `compare-test-reports.js` in the root (`module1/`) folder. It automatically locates the JSON reports from both frameworks and generates a Markdown table highlighting:
*   Total tests run
*   Passed, failed, skipped, and flaky counts
*   Overall execution duration
*   A calculated verdict (which framework was faster, differences in stability, etc.)
*   Simple CLI bar charts

### Usage
1. Ensure both JSON reports exist in their expected paths:
   * **Playwright:** `playwright-tests/playwright-report/playwright-report.json`
   * **Cypress:** `cypress-tests/cypress/results/cypress-report.json`
2. From the root `module1` directory, execute:
```bash
   node compare-test-reports.js
   ```
3. Optionally, you can explicitly pass custom paths:
```bash
   node compare-test-reports.js path/to/playwright.json path/to/cypress.json
   ```

The script outputs a comprehensive file named `test-report-comparison.md` in the root directory.

### Example Generated Output
```markdown
# Test Report Comparison
Generated on 2026-06-22T10:00:00.000Z

## Summary Comparison
| Framework | Total | Passed | Failed | Skipped | Flaky | Duration |
|-----------|-------|--------|--------|---------|-------|----------|
| Playwright| 24    | 22     | 2      | 0       | 0     | 12.34s   |
| Cypress   | 24    | 20     | 4      | 0       | 0     | 15.67s   |

## Verdict
Playwright was faster. Playwright had fewer failed tests.

## Simple Comparison Charts
Playwright duration 12340ms [#############          ]
Cypress duration 15670ms    [################        ]
```

---

## Interpreting Test Results

### Playwright Metrics Overview
*   **`http_req_failed`** – Percentage of requests that failed.
*   **`http_req_duration`** – End-to-end response times (average, p95, etc.).
*   **`checks`** – Total balance of passed/failed assertions.
*   **`thresholds`** – Rules configured explicitly (e.g., error rate < 1%). If a threshold is crossed, the framework exits with a non‑zero code.

### Cypress Metrics Overview
*   Similar stability and execution metrics are outputted cleanly to the console.
*   Visual screenshots are automatically captured on failure and saved inside `cypress/screenshots/`.

If any test fails, evaluate the assertion error log alongside the failure artifacts. Common failures include:
1.  **Locator shifts:** Element structures changed; update target selector strategy.
2.  **Timing issues:** Dynamic animations or lazy elements loading slowly; scale up wait timers/timeouts.
3.  **State/Data drifts:** Ensure state conditions reset perfectly between test sequences.

---

## Troubleshooting Common Issues

| Problem | Likely Cause | Solution |
| :--- | :--- | :--- |
| Cannot find module `'@playwright/test'` | Dependencies not installed | Run `npm install` inside the `playwright-tests` directory. |
| `Cypress: command not found` | Dependencies not installed | Run `npm install` inside the `cypress-tests` directory. |
| Cannot connect to `localhost:3000` | Application server not running | Start the app with `http-server . -p 3000` or double-check your `webServer` configurations. |
| Port 3000 already in use | Another process is holding the port | Kill the conflicting process or change your designated port configurations. |
| Playwright timeout errors | Slow frontend or application response | Increase the default timeout settings inside `playwright.config.ts`. |
| Cypress `cy.wait()` failures | Flaky/delayed network resources | Increase the `defaultCommandTimeout` config property in `cypress.config.js`. |
| Comparison script fails to find reports | Reports not yet generated | Execute the respective suites with JSON reporters before running the script. |

---

## CI/CD Integration (GitHub Actions)

Both Playwright and Cypress can run effortlessly within automated CI loops. Example GitHub Action configurations are provided in their respective `.github/workflows/` folders.

The CI pipelines handle the following phases sequentially:
1.  Environment dependency provisioning (`npm install`)
2.  Background orchestration of the local application server
3.  Headless test engine execution
4.  Consolidated archive uploads of generated HTML/JSON reporting artifacts

To deploy them actively, copy the structural `.yml` workflow files directly into your repository’s global root `.github/workflows/` folder.

---

## Glossary of Key Terms

*   **Playwright:** A modern Node.js library designed by Microsoft for fast, reliable cross-browser automation.
*   **Cypress:** A developer-friendly front-end testing engine running natively directly inside the browser execution context.
*   **Data-testid:** A resilient, dedicated custom data attribute assigned to HTML elements explicitly for decoupling tests from style or structure changes.
*   **Locator:** An abstraction mapping strategy used to pinpoint specific DOM objects safely (CSS, XPath, Text, Roles).
*   **Threshold:** A structural pass/fail constraint set on a designated tracking metric (e.g., error rates or latency caps).
*   **Virtual User (VU):** A concurrent simulated browser agent used to emulate simultaneous client interactions during load/performance testing windows.
*   **Headless:** Browser engine runtime execution stripped of all graphical user interface layers, optimizing processing footprint inside server environments.
*   **CI/CD:** Continuous Integration / Continuous Delivery – The automated engine architecture that constructs, tests, and deploys applications seamlessly.
*   **Mochawesome:** A custom, customizable reporting plugin for Mocha/Cypress producing rich interactive charts and structured JSON outputs.