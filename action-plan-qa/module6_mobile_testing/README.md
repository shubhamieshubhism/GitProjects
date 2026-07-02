# Module 6: Mobile Application Testing

Welcome to the mobile testing module! This project teaches you how to test mobile apps using Appium, Maestro, and cloud device farms like BrowserStack. You will learn to design device matrices, automate sign‑up flows, spoof GPS locations, and run parallel tests on real devices.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Exercises Overview](#exercises-overview)
- [How to Run the Tests](#how-to-run-the-tests)
- [Device Matrix Generator](#device-matrix-generator)
- [BrowserStack Parallel Execution](#browserstack-parallel-execution)
- [Appium vs. Maestro Comparison](#appium-vs-maestro-comparison)
- [Mermaid Workflow](#mermaid-workflow)
- [Troubleshooting](#troubleshooting)

## Prerequisites
- **Node.js** (v18+) and npm
- **Java** (JDK 8 or 11) – for Appium
- **Android Studio** (with SDK tools) – for Android emulators
- **Appium CLI** (`npm install -g appium`)
- **Maestro CLI** – install via `curl -Ls "https://get.maestro.mobile.dev" | bash`
- **BrowserStack** account (optional, for cloud tests)
- A sample `.apk` or `.ipa` file (we will use `ApiDemos.apk`)

## Quick Setup
1. Clone or create this folder.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Download the sample APK (ApiDemos) into `apps/`:
   ```bash
   curl -o apps/ApiDemos.apk https://github.com/appium/appium/raw/master/sample-code/apps/ApiDemos/bin/ApiDemos.apk
   ```
4. Start an Android emulator (AVD) or connect a real device.
5. Run the Appium server (if not using the Docker version):
   ```bash
   appium
   ```
6. (Optional) Start Maestro server: `maestro studio` for interactive test writing.

## Exercises Overview
| Exercise | Description | Tool |
|----------|-------------|------|
| 1 | Automate sign‑up flow on an emulator | Appium |
| 2 | Implement cross‑platform test using Maestro (YAML) | Maestro |
| 3 | Test 3 unique devices/OS versions in parallel on BrowserStack | Appium + BrowserStack |
| 4 | Implement GPS spoofing with Appium | Appium |

## How to Run the Tests

### Appium – Sign‑up Flow
```bash
npm run test:signup
```
Runs `tests/appium/signup-flow.test.js` using WebDriverIO.

### Appium – GPS Spoofing
```bash
npm run test:gps
```
Runs `tests/appium/gps-spoofing.test.js` which mocks device location.

### Appium – BrowserStack Parallel
```bash
npm run test:parallel
```
Runs `tests/appium/parallel-test.js` on 3 different devices in parallel (requires `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in `.env`).

### Maestro – Sign‑up Flow
```bash
npm run maestro:signup
```
This runs the Maestro YAML test using the Maestro CLI (ensure Maestro is installed).

## Device Matrix Generator
Run the utility to generate a risk-based device matrix:
```bash
npm run matrix
```
Outputs a table of devices prioritised by market share, OS version, and screen size.

## BrowserStack Parallel Execution
Make sure you have a `.env` file with:
```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```
Then run:
```bash
npm run test:parallel
```
The test will run on three device‑OS combinations (defined in `config/browserstack-config.json`).

## Appium vs. Maestro Comparison

| Feature | Appium (Code) | Maestro (YAML) |
|---------|---------------|----------------|
| **Language** | JavaScript (or any) | YAML |
| **Learning Curve** | Steeper | Very low |
| **Flexibility** | High – custom logic, conditional flows | Limited to built‑in actions |
| **Maintenance** | Requires code changes | Easier to maintain |
| **Cross‑platform** | Yes (Android/iOS) | Yes (Android/iOS) |
| **Visual Testing** | Possible with screenshot comparison | Not built‑in |
| **CI/CD Integration** | Full | Good |
| **Best Use Case** | Complex flows, custom assertions | Simple e2e flows, smoke tests |

## Mermaid Workflow

```mermaid
flowchart TD
    A[Start] --> B[Select Device Matrix]
    B --> C{Choose Test Type}
    C --> D[Appium (Code)]
    C --> E[Maestro (YAML)]
    C --> F[BrowserStack Parallel]
    D --> G[Run sign-up flow]
    E --> H[Run YAML test]
    F --> I[Run on 3 devices]
    G --> J[GPS spoofing]
    J --> K[Generate Report]
    H --> K
    I --> K
    K --> L[Review Results]
```

## Troubleshooting

- **Appium not found**: Install globally with `npm install -g appium`.
- **Maestro not found**: Install via `curl -Ls "https://get.maestro.mobile.dev" | bash` and restart terminal.
- **Emulator not starting**: Ensure Android SDK is set up and `ANDROID_HOME` environment variable is set.
- **BrowserStack errors**: Verify your credentials and that the devices are available in your plan.

Happy testing!
