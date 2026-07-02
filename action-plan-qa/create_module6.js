#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------
const PROJECT_NAME = 'module6_mobile_testing';
const PROJECT_ROOT = path.join(process.cwd(), PROJECT_NAME);

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created: ${dirPath}`);
  }
}

function writeFile(filePath, content) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  const dir = path.dirname(fullPath);
  createDir(dir);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Wrote: ${filePath}`);
}

// ----------------------------------------------------------------------------
// MAIN SCRIPT
// ----------------------------------------------------------------------------
console.log(`Creating project: ${PROJECT_NAME}`);

// 1. Create top-level folder
createDir(PROJECT_ROOT);

// 2. Define all files and their content
const files = {
  // README.md
  'README.md': `# Module 6: Mobile Application Testing

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
- **Appium CLI** (\`npm install -g appium\`)
- **Maestro CLI** – install via \`curl -Ls "https://get.maestro.mobile.dev" | bash\`
- **BrowserStack** account (optional, for cloud tests)
- A sample \`.apk\` or \`.ipa\` file (we will use \`ApiDemos.apk\`)

## Quick Setup
1. Clone or create this folder.
2. Install Node dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Download the sample APK (ApiDemos) into \`apps/\`:
   \`\`\`bash
   curl -o apps/ApiDemos.apk https://github.com/appium/appium/raw/master/sample-code/apps/ApiDemos/bin/ApiDemos.apk
   \`\`\`
4. Start an Android emulator (AVD) or connect a real device.
5. Run the Appium server (if not using the Docker version):
   \`\`\`bash
   appium
   \`\`\`
6. (Optional) Start Maestro server: \`maestro studio\` for interactive test writing.

## Exercises Overview
| Exercise | Description | Tool |
|----------|-------------|------|
| 1 | Automate sign‑up flow on an emulator | Appium |
| 2 | Implement cross‑platform test using Maestro (YAML) | Maestro |
| 3 | Test 3 unique devices/OS versions in parallel on BrowserStack | Appium + BrowserStack |
| 4 | Implement GPS spoofing with Appium | Appium |

## How to Run the Tests

### Appium – Sign‑up Flow
\`\`\`bash
npm run test:signup
\`\`\`
Runs \`tests/appium/signup-flow.test.js\` using WebDriverIO.

### Appium – GPS Spoofing
\`\`\`bash
npm run test:gps
\`\`\`
Runs \`tests/appium/gps-spoofing.test.js\` which mocks device location.

### Appium – BrowserStack Parallel
\`\`\`bash
npm run test:parallel
\`\`\`
Runs \`tests/appium/parallel-test.js\` on 3 different devices in parallel (requires \`BROWSERSTACK_USERNAME\` and \`BROWSERSTACK_ACCESS_KEY\` in \`.env\`).

### Maestro – Sign‑up Flow
\`\`\`bash
npm run maestro:signup
\`\`\`
This runs the Maestro YAML test using the Maestro CLI (ensure Maestro is installed).

## Device Matrix Generator
Run the utility to generate a risk-based device matrix:
\`\`\`bash
npm run matrix
\`\`\`
Outputs a table of devices prioritised by market share, OS version, and screen size.

## BrowserStack Parallel Execution
Make sure you have a \`.env\` file with:
\`\`\`env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
\`\`\`
Then run:
\`\`\`bash
npm run test:parallel
\`\`\`
The test will run on three device‑OS combinations (defined in \`config/browserstack-config.json\`).

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

\`\`\`mermaid
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
\`\`\`

## Troubleshooting

- **Appium not found**: Install globally with \`npm install -g appium\`.
- **Maestro not found**: Install via \`curl -Ls "https://get.maestro.mobile.dev" | bash\` and restart terminal.
- **Emulator not starting**: Ensure Android SDK is set up and \`ANDROID_HOME\` environment variable is set.
- **BrowserStack errors**: Verify your credentials and that the devices are available in your plan.

Happy testing!
`,

  // .gitignore
  '.gitignore': `node_modules/
reports/
*.log
.env
.DS_Store
*.apk
*.ipa
*.zip
*.tar.gz
`,

  // package.json
  'package.json': `{
  "name": "module6_mobile_testing",
  "version": "1.0.0",
  "description": "Mobile testing with Appium, Maestro, and BrowserStack",
  "scripts": {
    "test:signup": "npx wdio run config/appium-config.json --spec tests/appium/signup-flow.test.js",
    "test:gps": "npx wdio run config/appium-config.json --spec tests/appium/gps-spoofing.test.js",
    "test:parallel": "npx wdio run config/browserstack-config.json",
    "maestro:signup": "maestro test tests/maestro/signup-flow.yaml",
    "matrix": "node utils/device-matrix.js"
  },
  "devDependencies": {
    "@wdio/cli": "^8.10.0",
    "@wdio/local-runner": "^8.10.0",
    "@wdio/mocha-framework": "^8.10.0",
    "@wdio/appium-service": "^8.10.0",
    "@wdio/browserstack-service": "^8.10.0",
    "appium": "^2.0.0",
    "chai": "^4.3.7",
    "dotenv": "^16.0.3"
  }
}
`,

  // docker-compose.yml
  'docker-compose.yml': `version: '3.8'
services:
  appium:
    image: appium/appium:latest
    container_name: appium-server
    ports:
      - "4723:4723"
    environment:
      - ANDROID_HOME=/opt/android-sdk
    volumes:
      - /dev/bus/usb:/dev/bus/usb
    command: appium --allow-insecure chromedriver_autodownload
`,

  // config/appium-config.json
  'config/appium-config.json': `{
  "runner": "local",
  "specs": [
    "./tests/appium/*.test.js"
  ],
  "maxInstances": 1,
  "capabilities": [
    {
      "platformName": "Android",
      "appium:platformVersion": "11.0",
      "appium:deviceName": "Android Emulator",
      "appium:app": "./apps/ApiDemos.apk",
      "appium:automationName": "UiAutomator2",
      "appium:newCommandTimeout": 120
    }
  ],
  "logLevel": "info",
  "framework": "mocha",
  "reporters": ["spec"],
  "services": ["appium"],
  "appium": {
    "command": "appium",
    "logPath": "./reports/appium-logs"
  },
  "mochaOpts": {
    "timeout": 60000
  }
}
`,

  // config/maestro-config.yaml
  'config/maestro-config.yaml': `# Maestro configuration – test file is in tests/maestro/
`,

  // config/browserstack-config.json
  'config/browserstack-config.json': `{
  "runner": "local",
  "specs": [
    "./tests/appium/parallel-test.js"
  ],
  "maxInstances": 3,
  "capabilities": [
    {
      "platformName": "Android",
      "appium:platformVersion": "11.0",
      "appium:deviceName": "Google Pixel 4",
      "appium:app": "bs://<hashed_app_id>",
      "appium:automationName": "UiAutomator2",
      "bstack:options": {
        "projectName": "Mobile Test Module",
        "buildName": "Parallel Demo",
        "sessionName": "Pixel 4 - Android 11"
      }
    },
    {
      "platformName": "Android",
      "appium:platformVersion": "10.0",
      "appium:deviceName": "Samsung Galaxy S10",
      "appium:app": "bs://<hashed_app_id>",
      "appium:automationName": "UiAutomator2",
      "bstack:options": {
        "projectName": "Mobile Test Module",
        "buildName": "Parallel Demo",
        "sessionName": "Galaxy S10 - Android 10"
      }
    },
    {
      "platformName": "iOS",
      "appium:platformVersion": "14.0",
      "appium:deviceName": "iPhone 12",
      "appium:app": "bs://<hashed_app_id>",
      "appium:automationName": "XCUITest",
      "bstack:options": {
        "projectName": "Mobile Test Module",
        "buildName": "Parallel Demo",
        "sessionName": "iPhone 12 - iOS 14"
      }
    }
  ],
  "logLevel": "info",
  "framework": "mocha",
  "reporters": ["spec"],
  "services": [
    ["browserstack", {
      "browserstackLocal": true
    }]
  ],
  "mochaOpts": {
    "timeout": 60000
  }
}
`,

  // tests/appium/signup-flow.test.js
  'tests/appium/signup-flow.test.js': `const { expect } = require('chai');

describe('Sign-up Flow', () => {
  it('should complete the sign-up process', async () => {
    const usernameField = await $('~usernameInput');
    const passwordField = await $('~passwordInput');
    const signUpButton = await $('~signUpButton');
    const successMessage = await $('~welcomeMessage');

    await usernameField.waitForDisplayed({ timeout: 10000 });
    await usernameField.setValue('testuser');
    await passwordField.setValue('securePass123');
    await signUpButton.click();

    await successMessage.waitForDisplayed({ timeout: 10000 });
    const message = await successMessage.getText();
    expect(message).to.include('Welcome, testuser');
  });
});
`,

  // tests/appium/gps-spoofing.test.js
  'tests/appium/gps-spoofing.test.js': `const { expect } = require('chai');

describe('GPS Spoofing', () => {
  it('should mock device location', async () => {
    await driver.setLocation({ latitude: 37.7749, longitude: -122.4194 });
    const locationElement = await $('~locationDisplay');
    const text = await locationElement.getText();
    expect(text).to.include('San Francisco');
  });
});
`,

  // tests/appium/parallel-test.js
  'tests/appium/parallel-test.js': `const { expect } = require('chai');

describe('Cross-device sign-up', () => {
  it('should sign up on different devices', async () => {
    const usernameField = await $('~usernameInput');
    const passwordField = await $('~passwordInput');
    const signUpButton = await $('~signUpButton');

    await usernameField.setValue('parallelUser');
    await passwordField.setValue('parallelPass');
    await signUpButton.click();

    const success = await $('~welcomeMessage');
    await expect(success).toBeDisplayed();
  });
});
`,

  // tests/maestro/signup-flow.yaml
  'tests/maestro/signup-flow.yaml': `appId: com.example.app
---
- launchApp
- tapOn: "Username"
- inputText: "maestroUser"
- tapOn: "Password"
- inputText: "maestroPass"
- tapOn: "Sign Up"
- assertVisible: "Welcome, maestroUser"
`,

  // utils/device-matrix.js
  'utils/device-matrix.js': `const deviceData = [
  { name: 'Google Pixel 6', os: 'Android 12', marketShare: 12, screenSize: 6.4 },
  { name: 'Samsung Galaxy S21', os: 'Android 11', marketShare: 18, screenSize: 6.2 },
  { name: 'OnePlus 9', os: 'Android 11', marketShare: 8, screenSize: 6.55 },
  { name: 'Xiaomi Mi 11', os: 'Android 11', marketShare: 10, screenSize: 6.81 },
  { name: 'iPhone 13', os: 'iOS 15', marketShare: 22, screenSize: 6.1 },
  { name: 'iPhone 12', os: 'iOS 14', marketShare: 15, screenSize: 6.1 },
  { name: 'iPhone SE', os: 'iOS 15', marketShare: 5, screenSize: 4.7 }
];

function calculateRisk(device) {
  let score = 0;
  if (device.marketShare > 15) score += 30;
  else if (device.marketShare > 10) score += 20;
  else score += 10;
  const osVer = parseInt(device.os.split(' ')[1]);
  if (osVer >= 15) score += 25;
  else if (osVer >= 14) score += 15;
  else score += 5;
  if (device.screenSize >= 6.0) score += 20;
  else if (device.screenSize >= 5.0) score += 10;
  else score += 5;
  return score;
}

const sorted = deviceData.map(d => ({
  ...d,
  riskScore: calculateRisk(d)
})).sort((a, b) => b.riskScore - a.riskScore);

console.table(sorted);
`,

  // utils/browserstack-helper.js
  'utils/browserstack-helper.js': `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadApp(filePath) {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
  const url = \`https://api-cloud.browserstack.com/app-automate/upload\`;
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  const response = await axios.post(url, formData, {
    auth: { username, password: accessKey },
    headers: formData.getHeaders()
  });
  return response.data.app_url;
}

module.exports = { uploadApp };
`,

  // docs/Appium_Guide.md
  'docs/Appium_Guide.md': `# Appium Guide

Appium is an open-source tool for automating native, hybrid, and mobile web apps. It uses the WebDriver protocol.

## Key Concepts
- **Desired Capabilities**: Key‑value pairs that tell Appium which device and app to use.
- **Locators**: Use accessibility IDs (\`~\`) for best stability.
- **Waits**: Use explicit waits to handle network delays.

## Running Appium Tests
1. Start Appium server: \`appium\`
2. Run tests with WebDriverIO: \`npx wdio run config/appium-config.json --spec <test-file>\`

For GPS spoofing, use \`driver.setLocation()\`.

For more, refer to [Appium Docs](http://appium.io/docs/en/about-appium/intro/).
`,

  // docs/Maestro_Guide.md
  'docs/Maestro_Guide.md': `# Maestro Guide

Maestro is a YAML‑based mobile testing framework that is very easy to write and read.

## Key Concepts
- **Flows**: A sequence of actions (tap, input, assert).
- **Commands**: \`tapOn\`, \`inputText\`, \`assertVisible\`, \`launchApp\`.
- **YAML**: No coding required – ideal for smoke tests.

## Running Maestro Tests
Install Maestro CLI, then run:
\`\`\`bash
maestro test tests/maestro/signup-flow.yaml
\`\`\`

For interactive editing:
\`\`\`bash
maestro studio
\`\`\`

Maestro is great for fast feedback and non‑technical team members.
`,

  // docs/Device_Matrix_Guide.md
  'docs/Device_Matrix_Guide.md': `# Device Matrix Guide

A device matrix helps you decide which devices to test on, based on market usage, OS version, and screen size. The risk‑based approach prioritises devices that your users actually use.

## Usage
Run the generator:
\`\`\`bash
npm run matrix
\`\`\`

You can customise the device list in \`utils/device-matrix.js\` with real market data.

## Example Output
| Device | OS | Market Share | Risk Score |
|--------|----|--------------|------------|
| iPhone 13 | iOS 15 | 22% | 75 |
| Samsung Galaxy S21 | Android 11 | 18% | 65 |
| Google Pixel 6 | Android 12 | 12% | 55 |

Add new devices and update scores as your user base changes.
`,

  // apps/README.md
  'apps/README.md': `# Sample Apps

Download the ApiDemos APK from:
https://github.com/appium/appium/raw/master/sample-code/apps/ApiDemos/bin/ApiDemos.apk

Save it as \`ApiDemos.apk\` in this folder.
`,

  // .env.example
  '.env.example': `# BrowserStack credentials
BROWSERSTACK_USERNAME=
BROWSERSTACK_ACCESS_KEY=
`,

  // scripts/download-sample-app.sh
  'scripts/download-sample-app.sh': `#!/bin/bash
curl -o ../apps/ApiDemos.apk https://github.com/appium/appium/raw/master/sample-code/apps/ApiDemos/bin/ApiDemos.apk
echo "Downloaded ApiDemos.apk"
`
};

// 3. Write all files
Object.keys(files).forEach(filePath => {
  writeFile(filePath, files[filePath]);
});

// 4. Make the shell script executable (on Unix-like systems)
const scriptPath = path.join(PROJECT_ROOT, 'scripts/download-sample-app.sh');
if (fs.existsSync(scriptPath)) {
  try {
    fs.chmodSync(scriptPath, 0o755);
    console.log('Made scripts/download-sample-app.sh executable');
  } catch (_) { /* ignore */ }
}

console.log(`\n✅ Project successfully created at: ${PROJECT_ROOT}`);

// 5. Optionally zip the folder
const zipFileName = `${PROJECT_NAME}.zip`;
console.log(`\nAttempting to create ZIP archive: ${zipFileName}`);

try {
  // Check if `zip` command is available (Unix-like)
  execSync('which zip', { stdio: 'ignore' });
  execSync(`zip -r "${zipFileName}" "${PROJECT_NAME}"`, { stdio: 'inherit' });
  console.log(`✅ Created ZIP: ${zipFileName}`);
} catch (_) {
  console.warn(`\n⚠️  'zip' command not found. You can manually zip the folder by running:\n  zip -r ${zipFileName} ${PROJECT_NAME}`);
  console.warn('   (or create an archive using your preferred tool)');
}

console.log('\nDone.');