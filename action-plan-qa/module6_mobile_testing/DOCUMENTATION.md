# Module 6: Mobile Application Testing — Documentation

Project path: /Users/techverito/Action Plan 01_ QA Engineer Specialization/action-plan-qa/module6_mobile_testing

## Directory Structure

```
.
├── README.md
├── package.json
├── .env.example
├── docker-compose.yml
├── wdio.conf.js
├── wdio.conf.cjs
├── apps/
│  └── README.md
├── docs/
│  ├── Appium_Guide.md
│  ├── Maestro_Guide.md
│  └── Device_Matrix_Guide.md
├── config/
│  ├── wdio.conf.js
│  ├── wdio-browserstack.conf.js
│  └── maestro-config.yaml
├── scripts/
│  ├── run-with-report.js
│  └── download-sample-app.sh
├── tests/
│  ├── appium/
│  │  ├── signup-flow.test.js
│  │  ├── simple-signup.test.js
│  │  ├── gps-spoofing.test.js
│  │  └── parallel-test.js
│  └── maestro/
│     └── signup-flow.yaml
├── utils/
│  ├── browserstack-helper.js
│  └── device-matrix.js
├── config/
│  └── reports/
└── .gitignore
```

## Project Structure & File Purposes

### Root Configuration Files

- **README.md**: Overview of the mobile testing module, includes quick setup, exercises, and troubleshooting.
- **package.json**: Node.js project metadata and npm scripts for running tests, generating reports, and executing utilities.
- **.env.example**: Template for environment variables (BrowserStack credentials).
- **docker-compose.yml**: Single-service configuration that runs an Appium server in a Docker container on port 4723.
- **wdio.conf.js** & **wdio.conf.cjs**: Main WebDriverIO configurations for local Appium testing. Specs path, capabilities (Android emulator, API level 11, UiAutomator2), Appium service config.

### Directories

- **apps/**: Storage for mobile application binaries (`.apk` for Android, `.ipa` for iOS). Default is ApiDemos.apk.
- **config/**: Alternative config files for different test scenarios:
  - `wdio-browserstack.conf.js`: WebDriverIO config for running parallel tests on BrowserStack cloud devices (Pixel 4, Galaxy S10, iPhone 12).
  - `maestro-config.yaml`: Configuration for Maestro (low-code mobile testing).
- **docs/**: Detailed guides for each testing framework:
  - `Appium_Guide.md`: Appium usage instructions and code examples.
  - `Maestro_Guide.md`: Maestro YAML-based test automation guide.
  - `Device_Matrix_Guide.md`: Device matrix generation and prioritization strategy.
- **scripts/**: Utility scripts:
  - `run-with-report.js`: Helper to execute tests with reporting.
  - `download-sample-app.sh`: Script to download ApiDemos.apk.
- **tests/appium/**: Mocha-based Appium tests (WebDriverIO):
  - `signup-flow.test.js`: Main test case for automating a sign-up flow (fill username, password, click sign-up, verify welcome message).
  - `simple-signup.test.js`: Simpler version runnable directly with Mocha.
  - `gps-spoofing.test.js`: Demonstrates device location spoofing using Appium capabilities.
  - `parallel-test.js`: Test designed to run in parallel on multiple BrowserStack devices.
- **tests/maestro/**: Maestro YAML test definitions:
  - `signup-flow.yaml`: Declarative YAML test for a sign-up flow (easier to maintain, no code needed).
- **utils/**: Helper modules:
  - `device-matrix.js`: Generates a risk-scored device matrix based on market share, OS version, and screen size.
  - `browserstack-helper.js**: Helper utilities for BrowserStack integration.
- **reports/**: Output directory for test reports (mochawesome HTML/JSON reports).

## How to Run the Project

### Prerequisites

- **Node.js** (v18 or higher) and npm
- **Java** (JDK 8 or 11) – required by Appium
- **Android Studio** with SDK tools (for Android emulators and SDK platform)
- **Appium CLI**: `npm install -g appium` (or installed as devDependency)
- **Maestro CLI** (optional, for YAML tests): `curl -Ls "https://get.maestro.mobile.dev" | bash`
- **BrowserStack account** (optional, for cloud device testing)
- **Docker** (optional, for containerized Appium server)

### Setup Steps

#### 1. Install Node dependencies

```bash
cd /Users/techverito/Action\ Plan\ 01_\ QA\ Engineer\ Specialization/action-plan-qa/module6_mobile_testing
npm install
```

#### 2. Download sample application

```bash
curl -o apps/ApiDemos.apk https://github.com/appium/appium/raw/master/sample-code/apps/ApiDemos/bin/ApiDemos.apk
```

Or run the provided script:

```bash
bash scripts/download-sample-app.sh
```

#### 3. Set up environment variables (for BrowserStack)

Copy `.env.example` to `.env` and add your BrowserStack credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

(Only required if running BrowserStack cloud tests.)

#### 4. Prepare Android emulator or device

**Local Emulator:**
- Open Android Studio → SDK Manager and ensure Android 11 (API level 30) or similar is installed.
- Create or start an AVD: `emulator -avd <avd_name>`

**Real Device:**
- Connect via USB with USB debugging enabled.
- Verify connection: `adb devices`

### Running Tests

#### Option 1: Using Appium (Code-based, WebDriverIO)

**Sign-up flow test:**

```bash
npm run test:signup
```

Executes `tests/appium/signup-flow.test.js` on a local Android emulator.

**GPS spoofing test:**

```bash
npm run test:gps
```

Runs `tests/appium/gps-spoofing.test.js` which tests location mocking.

**Direct Mocha runner (no WebDriverIO):**

```bash
npm run test:direct
```

Runs `tests/appium/simple-signup.test.js` directly with Mocha.

**With HTML/JSON Report:**

```bash
npm run test:report
```

Generates a report in `reports/test-report.html` and `reports/test-report.json`.

#### Option 2: Using Maestro (YAML-based, Low-code)

**Run Maestro test:**

```bash
npm run maestro:signup
```

Executes `tests/maestro/signup-flow.yaml` using the Maestro CLI.

#### Option 3: BrowserStack Parallel Execution (Cloud Devices)

Ensure `.env` is populated with BrowserStack credentials, then:

```bash
npm run test:parallel
```

Runs `tests/appium/parallel-test.js` on three devices simultaneously:
- Google Pixel 4 (Android 11)
- Samsung Galaxy S10 (Android 10)
- iPhone 12 (iOS 14)

#### Option 4: Docker Appium Server

Start Appium in a container:

```bash
docker-compose up -d
```

Appium will be available at `http://localhost:4723`. Then run tests normally; they will connect to the containerized Appium.

To stop:

```bash
docker-compose down
```

### Device Matrix Utility

Generate a risk-based device prioritization matrix:

```bash
npm run matrix
```

Output example:

```
┌─────────────────────────┬──────────┬────────────┬────────────┐
│ name                    │ os       │ riskScore  │ marketShare│
├─────────────────────────┼──────────┼────────────┼────────────┤
│ iPhone 13               │ iOS 15   │ 80         │ 22         │
│ Samsung Galaxy S21      │ Android  │ 78         │ 18         │
│ iPhone 12               │ iOS 14   │ 75         │ 15         │
...
```

### Report Generation & Merging

**Generate individual test report:**

```bash
npm run test:report
```

**Run all tests and merge reports:**

```bash
npm run test:all:report
npm run merge-reports
npm run generate-report
```

Final HTML report: `reports/final-report.html`

## Test Frameworks & Tools

### Appium (Code-based)

- **Framework**: WebDriverIO + Mocha
- **Language**: JavaScript
- **File location**: `tests/appium/*.test.js`
- **Config**: `wdio.conf.js`
- **Use case**: Complex automated flows, conditional logic, advanced assertions
- **Best for**: Production-grade test automation with CI/CD integration

**Example snippet from `signup-flow.test.js`:**

```javascript
const usernameField = await $('~usernameInput');
await usernameField.setValue('testuser');
const successMessage = await $('~welcomeMessage');
expect(message).to.include('Welcome, testuser');
```

### Maestro (YAML-based)

- **Framework**: Maestro CLI
- **Language**: YAML
- **File location**: `tests/maestro/*.yaml`
- **Config**: `config/maestro-config.yaml`
- **Use case**: Simple e2e flows, smoke tests, no coding required
- **Best for**: Non-technical users, quick test creation, easy maintenance

### BrowserStack

- **Service**: Cloud device farm
- **Config**: `config/wdio-browserstack.conf.js`
- **Capabilities**: 3 devices (Pixel 4, Galaxy S10, iPhone 12)
- **Requires**: `.env` with credentials
- **Use case**: Real device testing without hardware, parallel execution, multiple OS/device combinations

## Environment Variables

From `.env.example`:

- `BROWSERSTACK_USERNAME`: Your BrowserStack username (required for cloud tests)
- `BROWSERSTACK_ACCESS_KEY`: Your BrowserStack access key (required for cloud tests)

Optional variables (can be added):

- `APPIUM_HOST`: Appium server host (default: localhost)
- `APPIUM_PORT`: Appium server port (default: 4723)
- `ANDROID_HOME`: Path to Android SDK (auto-detected or set manually)

## Notes & Next Steps

### Current State

- **Appium** tests use WebDriverIO and run against local Android emulators.
- **Maestro** provides a low-code alternative using YAML definitions.
- **BrowserStack** integration is configured for parallel cloud testing (3 devices).
- **Device matrix** generator calculates risk scores based on market share, OS version, and screen size.
- **Report generation** uses Mochawesome for HTML/JSON output.

### Recommended Enhancements

1. **Add iOS testing**: Expand Appium capabilities to run on iOS simulators/devices (requires `.ipa` file).
2. **Extend test coverage**: Add more test cases (login, logout, error handling).
3. **Visual testing**: Integrate screenshot comparison or visual regression tools (e.g., BackstopJS, Percy).
4. **Performance testing**: Add Appium performance metrics (memory, CPU, network latency).
5. **CI/CD pipeline**: Create GitHub Actions or GitLab CI workflows to auto-run tests on PR/push.
6. **API mocking**: Integrate Appium with local API mocks (e.g., Mockoon) for offline testing.

### Troubleshooting

- **Appium server not starting**: Check Java is installed (`java -version`), and Appium is accessible (`appium --version`).
- **Emulator not detected**: Verify Android SDK path and run `adb devices` to list connected emulators/devices.
- **BrowserStack auth errors**: Confirm username and access key are correct in `.env`.
- **Maestro not found**: Reinstall via `curl -Ls "https://get.maestro.mobile.dev" | bash` and restart terminal.
- **Port 4723 already in use**: Kill existing Appium process (`lsof -i :4723` on macOS/Linux, then `kill <PID>`).

For more details, see the guides in `docs/` (Appium_Guide.md, Maestro_Guide.md, Device_Matrix_Guide.md).
