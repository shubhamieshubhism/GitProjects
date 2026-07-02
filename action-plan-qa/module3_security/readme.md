# Module 3: Security Testing with OWASP Framework

Welcome to the security testing module! This project will help you learn and automate security testing using industry‑standard tools like ZAP (Zed Attack Proxy), OWASP WebGoat, and common vulnerability checkers.

---

## Table of Contents

1. [Purpose](#purpose)
2. [What You Will Learn](#what-you-will-learn)
3. [Prerequisites](#prerequisites)
4. [Quick Setup](#quick-setup)
5. [Exercises Overview](#exercises-overview)
6. [How to Run the Scripts](#how-to-run-the-scripts)
7. [Understanding the Results](#understanding-the-results)
8. [Integrating with Your Test Framework](#integrating-with-your-test-framework)
9. [Project Workflow (Mermaid)](#project-workflow-mermaid)
10. [Folder Structure](#folder-structure)
11. [Troubleshooting](#troubleshooting)
12. [Resources & References](#resources--references)

---

## Purpose

This module gives you **practical, hands-on experience** with web application security testing. You will:

- Learn about the **OWASP Top 10** vulnerabilities.
- Understand the difference between **API and UI security testing**.
- Use **ZAP (Zed Attack Proxy)** to automatically scan for vulnerabilities.
- Test **JWT tokens** for common flaws.
- Build an **automated security scanning workflow**.
- Optionally integrate security checks into your existing Playwright/Cypress tests.

All exercises run locally using Docker, so you don't need external services.

---

## What You Will Learn

| Topic | Description |
|-------|-------------|
| **OWASP Top 10** | The most critical web application risks, with real-world examples. |
| **API vs UI security** | How testing approaches differ for APIs vs user interfaces. |
| **Automated security audits** | Use ZAP to perform active scans and generate reports. |
| **JWT vulnerabilities** | Weak secrets, none algorithm, missing expiration, and how to test them. |
| **Security workflow orchestration** | A script that scans multiple URLs and aggregates findings. |
| **Integration** | Embed security checks into Playwright/Cypress test runs. |

---

## Prerequisites

- **Docker** and **Docker Compose** (to run WebGoat and ZAP).
- **Python 3.8+** (for the scanning scripts).
- **Node.js** (optional, for the integration example).
- Basic knowledge of HTTP and web applications is helpful but not required.

---

## Quick Setup

### 1. Clone or create this folder

Place this `module3_security` folder inside your project root (or anywhere you like).

### 2. Start the target application and ZAP

```bash
docker-compose up -d
```

This starts:

- **OWASP WebGoat** – a deliberately vulnerable training application, accessible at `http://localhost:8080/WebGoat`
- **ZAP** – in daemon mode, with its API available at `http://localhost:8090`

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Verify everything is running

Open `http://localhost:8080/WebGoat` in your browser – you should see the WebGoat login page.

---

## Exercises Overview

### Exercise 1 – Audit your app for SQLi/XSS

Run the ZAP active scan against WebGoat:

```bash
python scripts/zap_scan.py --target http://localhost:8080/WebGoat
```

This script:

- Spiders the target (discovers all links).
- Performs an active scan (including SQL injection and XSS checks).
- Generates an HTML report (`reports/zap_report.html`) and a JSON alerts file (`reports/zap_alerts.json`).
- Prints high‑risk findings to the console.

### Exercise 2 – Test JWT token vulnerabilities

Use `jwt_tester.py` to test a sample JWT:

```bash
python scripts/jwt_tester.py --token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

It will:

- Decode the token (without verification) to show the payload.
- Check if `alg: none` is accepted (a critical flaw).
- Verify if the token has an expiration (`exp`) claim.
- Test a list of common weak secrets (e.g., `secret`, `password`) to see if the token can be forged.

### Exercise 3 – Build a security scanning workflow

Scan multiple URLs at once:

```bash
python scripts/scan_workflow.py --urls "http://localhost:8080/WebGoat" "http://localhost:8080/WebGoat/start.mvc" --output reports/workflow_summary.json
```

This runs ZAP scans on each URL, consolidates all findings into a single JSON summary, and reports the total number of high‑risk issues.

### Exercise 4 – Add automated security validation in your existing test framework

See `scripts/integration_example.js` for a Playwright example that:

- Launches a ZAP scan.
- Waits for the scan to finish.
- Fails the test if any high‑severity vulnerabilities are found.

You can adapt this pattern to your own tests.

---

## How to Run the Scripts

All scripts are in the `scripts/` folder. Make sure Docker containers are running before you start.

| Command | Description |
|---------|-------------|
| `python scripts/zap_scan.py --target <URL>` | Run an active scan on a single URL. |
| `python scripts/jwt_tester.py --token <JWT>` | Check a JWT for common flaws. |
| `python scripts/scan_workflow.py --urls <URL1> <URL2> ... --output <file>` | Scan multiple URLs and produce a consolidated report. |
| `(optional) npx playwright test` | Run the integration example (if you have Playwright installed). |

You can always add `--help` to any script to see its options.

---

## Understanding the Results

### ZAP HTML Report
- Located at `reports/zap_report.html`.
- Lists each vulnerability with:
  - **Risk** (High, Medium, Low, Informational).
  - Description and remediation advice.
  - The exact URL and parameter where the issue was found.

### ZAP JSON Alerts
- Located at `reports/zap_alerts.json`.
- Machine‑readable format for further processing or CI/CD integration.

### Workflow Summary
- Located at the path you specify (e.g., `reports/workflow_summary.json`).
- Contains a summary per target (counts of High/Medium/Low) and a `total_high` field.

### JWT Tester Output
- Prints to the console: payload, expiration status, weak‑secret test results, and any `none` algorithm vulnerabilities.

---

## Integrating with Your Test Framework

You can embed security scanning into your existing tests (Playwright, Cypress, etc.) to ensure that new code doesn't introduce critical vulnerabilities.

**Example approach** (as shown in `integration_example.js`):

1. Before or after your UI tests, trigger a ZAP scan against the deployed application.
2. Poll for the scan results (or wait for a webhook).
3. Parse the JSON output and check for High‑severity issues.
4. If any exist, fail the test suite.

This gives you continuous security validation as part of your regular test pipeline.

---

## Project Workflow (Mermaid)

```mermaid
flowchart TD
    A[Start] --> B[Start Docker Compose]
    B --> C[WebGoat Running on port 8080]
    B --> D[ZAP Running on port 8090]
    C --> E{Choose Exercise}
    D --> E
    
    E --> F[Exercise 1: SQLi/XSS Scan]
    E --> G[Exercise 2: JWT Testing]
    E --> H[Exercise 3: Multi-URL Scan]
    E --> I[Exercise 4: Integration Example]
    
    F --> J[python scripts/zap_scan.py]
    J --> K[ZAP Spiders & Scans Target]
    K --> L[Generates HTML + JSON Reports]
    L --> M[Review Findings in reports/]
    
    G --> N[python scripts/jwt_tester.py]
    N --> O[Decodes Token & Checks Payload]
    O --> P[Tests for none Algorithm]
    P --> Q[Tests for Weak Secrets]
    Q --> R[Checks Expiration Claim]
    R --> S[Output Results to Console]
    
    H --> T[python scripts/scan_workflow.py]
    T --> U[Scans Multiple URLs]
    U --> V[Aggregates All Findings]
    V --> W[Generates Consolidated JSON Summary]
    W --> X[Review workflow_summary.json]
    
    I --> Y[npx playwright test]
    Y --> Z[Triggers ZAP Scan from Test]
    Z --> AA[Waits for Scan Completion]
    AA --> AB[Checks for High-Severity Issues]
    AB --> AC{High Issues Found?}
    AC --> AD[Yes: Test Fails]
    AC --> AE[No: Test Passes]
    AD --> AF[Fix Vulnerabilities & Re-test]
    AE --> AG[All Tests Pass]
    
    M --> AH[End]
    S --> AH
    X --> AH
    AF --> AH
    AG --> AH
```

---

## Folder Structure

```
module3_security/
├── README.md                         # This file
├── .gitignore                        # Excludes temp files, reports, Python cache
├── requirements.txt                  # Python dependencies
├── docker-compose.yml                # Starts WebGoat and ZAP
├── config/
│   └── zap-config.json               # Scan policy configuration (optional)
├── scripts/
│   ├── zap_scan.py                   # Active scan on a target
│   ├── jwt_tester.py                 # JWT vulnerability testing
│   ├── scan_workflow.py              # Scan multiple URLs and aggregate results
│   └── integration_example.js        # Playwright integration example
├── reports/                          # Generated reports (ignored by Git)
└── docs/
    ├── OWASP_Top10_Cheatsheet.md     # Quick reference for OWASP Top 10
    └── JWT_Vulnerabilities.md        # Detailed guide on JWT issues
```

---

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|--------------|----------|
| Error: Could not connect to ZAP | ZAP container not running | Run `docker-compose ps` to check. Start with `docker-compose up -d`. |
| ModuleNotFoundError: No module named 'zapv2' | Missing Python dependency | Run `pip install -r requirements.txt` again. |
| WebGoat not loading in browser | Port conflict or container not ready | Wait 30 seconds after `docker-compose up`, then refresh. Ensure port 8080 is free. |
| Scan takes too long | Large target or many endpoints | Reduce scan scope, or use passive scanning. For WebGoat it's usually quick. |
| Permission errors on reports/ folder | Folder not existing | The scripts will create it; ensure you have write permissions. |
| docker-compose command not found | Docker not installed or not in PATH | Install Docker Desktop (macOS/Windows) or Docker Engine (Linux). |
| API key or connection issues | ZAP API not ready | Wait a few seconds after starting containers; ZAP takes a moment to initialise. |

---

## Resources & References

- [OWASP Top 10](https://owasp.org/Top10/) – Official list.
- [OWASP WebGoat](https://github.com/WebGoat/WebGoat) – Vulnerable training app.
- [ZAP API Documentation](https://www.zaproxy.org/docs/api/) – How to interact with ZAP programmatically.
- [JWT.io](https://jwt.io) – Debug and decode JWTs.
- [Burp Suite Community Edition](https://portswigger.net/burp/communitydownload) – For manual security testing (alternative to ZAP).

---

## License

MIT – free to use and adapt for your own projects.