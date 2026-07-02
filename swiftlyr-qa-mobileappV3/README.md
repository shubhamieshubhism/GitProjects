# Swiftlyr Mobile Automation – Full Project Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Framework & Tech Stack](#2-framework--tech-stack)
3. [Project Structure](#3-project-structure)
4. [Configuration Files](#4-configuration-files)
5. [Steps to Run the Tests](#5-steps-to-run-the-tests)
6. [Test Reports](#6-test-reports)
7. [Common Issues & Troubleshooting](#7-common-issues--troubleshooting)

---

## 1. Project Overview

This project is an end-to-end mobile test automation suite for the **Swiftlyr** driver application (`com.swiftlyr.app.dev`). The app is a field-operations platform used by truck drivers to accept dispatch jobs, complete pre-trip inspections, track travel and load/unload tasks, log breaks (downtime/wait-time), scan job tickets, and submit timecards at end of workday.

### Purpose

- Validate the complete driver workflow from login through timecard submission
- Cover arrival-timing scenarios (on-time, early, late) at both load and unload sites
- Verify job acceptance, decline, and geofence-triggered task transitions
- Test offline/airplane-mode resilience and data sync on reconnection
- Regression-test login screen UI rules (field validation, error messages, button states)

### App Under Test

| Property       | Value                                          |
| -------------- | ---------------------------------------------- |
| App ID         | `com.swiftlyr.app.dev`                         |
| Android APK    | `app-development-release.apk`                  |
| iOS bundle     | `Runner.app`                                   |
| Main Activity  | `com.swiftlyr.app.MainActivity`                |

### Technologies Used

- **Language:** Java 17
- **Automation:** Appium Java Client 8.6.0 (UiAutomator2 for Android, XCUITest for iOS)
- **Test framework:** TestNG 7.6.1
- **Build tool:** Apache Maven (Surefire 3.0.0-M7)
- **Reporting:** ExtentReports 5.1.2 (HTML) + TestNG Surefire XML
- **API calls (in-test dispatch creation):** RestAssured 5.5.0
- **Config/secrets:** dotenv-java 3.0.0 (`.env` file or OS environment variables)
- **Utilities:** Apache Commons IO 2.18.0, Google Guava 32.1.2, Log4j 2.19.0

---

## 2. Framework & Tech Stack

### Dependency Versions (from `pom.xml`)

| Dependency             | Version       |
| ---------------------- | ------------- |
| Java                   | 17            |
| Appium Java Client     | 8.6.0         |
| Selenium Java          | 4.15.0        |
| TestNG                 | 7.6.1         |
| Maven Surefire Plugin  | 3.0.0-M7      |
| ExtentReports          | 5.1.2         |
| RestAssured            | 5.5.0         |
| Log4j API + Core       | 2.19.0        |
| Commons IO             | 2.18.0        |
| dotenv-java            | 3.0.0         |
| Byte Buddy             | 1.14.9        |
| Google Guava           | 32.1.2-jre    |
| Appium Server (external) | 3.2.2+      |
| UiAutomator2 driver    | 5.0.3+        |

### Appium Configuration

#### Android Capabilities (set in `DriverManager.java`)

| Capability             | Value / Source                                 |
| ---------------------- | ---------------------------------------------- |
| `platformName`         | `android` (from `config.properties`)           |
| `automationName`       | `UiAutomator2`                                 |
| `deviceName`           | `device.name` property                         |
| `udid`                 | `udid` property                                |
| `app`                  | `app.path` property (relative to repo root)    |
| `platformVersion`      | `android.platform.version` property (API level)|
| `appPackage`           | `android.app.package` property                 |
| `appActivity`          | `android.app.activity` property                |
| `noReset`              | `false`                                        |
| `newCommandTimeout`    | `1200` seconds                                 |
| `commandTimeouts`      | `120000` ms                                    |
| `implicitWait`         | `10` seconds                                   |

#### iOS Capabilities (set in `DriverManager.java`)

| Capability                   | Value / Source                              |
| ---------------------------- | ------------------------------------------- |
| `platformName`               | `iOS` (from `config-ios.properties`)        |
| `automationName`             | `XCUITest`                                  |
| `deviceName`                 | `ios.device.name` property                  |
| `app`                        | `app.path.ios` property                     |
| `platformVersion`            | `ios.platform.version` property             |
| `udid`                       | `udid.ios` property                         |
| `appium:autoGrantPermissions`| `true`                                      |
| `autoDismissAlerts`          | `false`                                     |
| `nativeWebTap`               | `true`                                      |
| `newCommandTimeout`          | `1200` seconds                              |
| `commandTimeouts`            | `120000` ms                                 |
| `implicitWait`               | `10` seconds                                |

### Appium Server Auto-Start Logic (`AppiumServer.java`)

The framework manages the Appium server lifecycle automatically:

1. On `@BeforeSuite`, calls `AppiumServer.start()`.
2. Probes port `4723` with a socket connection. If an Appium server is already running, it is reused — no second instance is launched.
3. If the port is busy but not responding as Appium, it kills stale processes:
   - macOS/Linux: `pkill -9 -f appium` and `lsof -ti:4723 | xargs kill -9`
   - Windows: `taskkill /F /IM node.exe`
4. Waits up to 5 retries (2 s each) for the port to become free.
5. Locates the Node.js executable in this order:
   - `APPIUM_NODE_PATH` environment variable (set in `.env` or OS env)
   - `/usr/local/bin/node`
   - `/opt/homebrew/bin/node`
   - `~/.nvm/versions/node/v22.12.0/bin/node`
6. Locates the Appium main script with a similar fallback chain across `/usr/local/lib`, `/opt/homebrew/lib`, and the NVM path.
7. `AppiumServer.stop()` is called in `@AfterSuite`.

> **Tip:** For reliability, start Appium manually before running tests (see [Step 5](#5-steps-to-run-the-tests)). The auto-start is a convenience fallback, not a guarantee on all machines.

### Page Object Model

The framework uses the Appium `PageFactory` / `AppiumFieldDecorator` pattern. Each page class extends `BasePage` and declares elements with dual locators:

```java
@AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"SIGN IN\"]")
@iOSXCUITFindBy(accessibility = "SIGN IN")
private WebElement signInField;
```

The correct locator is resolved automatically based on the active driver type at runtime.

### Thread Safety

`DriverManager` stores the `AppiumDriver` instance in a `ThreadLocal<AppiumDriver>`, making the framework safe for future parallel test execution.

---

## 3. Project Structure

```
swiftlyr-qa-mobileappV3/
│
├── pom.xml                                      # Maven build config — deps, compiler (Java 17), Surefire
├── DriverE2EFlowTest.xml                        # Parameterised driver E2E suite (2 test blocks)
│
├── src/
│   ├── main/java/
│   │   ├── Base/
│   │   │   └── AppiumServer.java                # Appium server lifecycle (start/stop, port detection, process cleanup)
│   │   └── Utils/
│   │       ├── DriverManager.java               # Creates AndroidDriver / IOSDriver; ThreadLocal storage
│   │       ├── EnvManager.java                  # Loads .env via dotenv-java; converts property keys to UPPER_SNAKE_CASE env keys
│   │       ├── PropertyManager.java             # Reads config.properties; env var takes precedence over file value
│   │       ├── CredentialsPropertyManager.java  # Reads credentials.properties; env var takes precedence
│   │       ├── TestUtils.java                   # Reusable helpers: clicks, waits, swipes, network mode, text extraction
│   │       ├── HeadlessUtils.java               # Detects CI/headless mode; applies -no-window/-no-audio AVD args
│   │       └── TimeGenerator.java               # Generates IST timestamps for dispatch API payloads
│   │
│   └── test/
│       ├── java/
│       │   ├── Pages/
│       │   │   ├── BasePage.java                # Screenshot capture, performStep wrapper, PageFactory init
│       │   │   ├── LoginPage.java               # Login screen locators and actions (sign-in, email, password, permissions)
│       │   │   └── JobTicketPage.java           # Full job-flow locators and actions (dispatch, pre-trip, geofence, tasks, timecard)
│       │   └── tests/
│       │       ├── BaseTest.java                # TestNG lifecycle: ExtentReports init, driver setup per method, teardown/logout
│       │       ├── LoginTests.java              # 11 login UI validation tests
│       │       ├── DriverTest.java              # 18+ driver arrival/break timing E2E scenarios
│       │       └── JobsTicketTest.java          # Job accept/decline, pre-trip, task progression, offline scenarios
│       │
│       └── resources/
│           ├── config.properties                # Android device & Appium config (active platform settings)
│           ├── config-ios.properties            # iOS device & Appium config
│           ├── credentials.properties           # Test user credentials — GITIGNORED, create from .example
│           ├── credentials.properties.example   # Template for credentials.properties
│           ├── testng.xml                       # Default suite: LoginTests only
│           ├── App/                             # APK / .app binaries — GITIGNORED, placed manually
│           └── suites/
│               └── android-e2e-suite.xml        # Full Android suite: all 3 test classes
│
└── target/
    ├── Report <timestamp>/                      # Generated per run
    │   ├── ExtentReport/ExtentReport.html       # Rich HTML report
    │   └── screenshots/                         # Failure + step screenshots
    └── surefire-reports/                        # TestNG/JUnit XML + emailable HTML
```

### Key Class Responsibilities

| Class                         | Responsibility                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `AppiumServer`                | Manages Appium server process: detects existing server on port 4723, cleans up stale processes, starts new instance       |
| `DriverManager`               | Builds `AndroidDriver` or `IOSDriver` from capabilities read out of `PropertyManager`. Stored in `ThreadLocal`            |
| `EnvManager`                  | Singleton; loads `.env` file silently (no crash if absent). Converts dot-notation property keys to `UPPER_SNAKE_CASE`     |
| `PropertyManager`             | Reads `config.properties` (or `config-ios.properties` via `-Dplatform=ios`). Always checks env var override first        |
| `CredentialsPropertyManager`  | Reads `credentials.properties`. Checks env var override first — CI supplies credentials as secrets                        |
| `HeadlessUtils`               | Checks `CI`, `HEADLESS`, `DISPLAY` env vars and `headless`/`ci_mode` system properties; configures AVD headless args      |
| `TimeGenerator`               | Produces IST-formatted timestamps (`+05:30`) for dispatch job creation via the REST API                                   |
| `BasePage`                    | Wraps `PageFactory.initElements`, provides `captureAndAttachScreenshot()` and `performStep()` for all page objects        |
| `BaseTest`                    | `@BeforeSuite`: initialise ExtentReports + start Appium. `@BeforeMethod`: create driver + page objects. `@AfterMethod`: capture screenshot on failure, logout, quit driver. `@AfterSuite`: flush report + stop Appium |

---

## 4. Configuration Files

### `src/test/resources/config.properties` (Android — default)

```properties
# Appium server endpoint
appium.server.url=http://127.0.0.1:4723

# Platform: "android" or "iOS"
platform.name=android

# Path to APK relative to repo root
app.path=src/test/resources/App/app-development-release.apk

# Android emulator/device identifiers
udid=emulator-5556                         # from: adb devices
device.name=sdk_gphone64_x86_64            # from: adb shell getprop ro.product.model

# Android SDK API level — NOT the OS version name
# Run: adb shell getprop ro.build.version.sdk
android.platform.version=34

# App package and launch activity
android.app.package=com.swiftlyr.app.dev
android.app.activity=com.swiftlyr.app.MainActivity

# iOS capabilities (used when platform.name=iOS)
ios.platform.version=18.2
ios.device.name=SwiftLyr Test iPhone
ios.bundle.id=com.swiftlyr.app.dev
udid.ios=D0274BCB-FF35-40F3-A339-3699FD13BC53
app.path.ios=src/test/resources/App/Runner.app

# Execution mode flags
headless=true        # adds -no-window/-no-audio AVD args when true
ci_mode=false        # enables CI-specific behaviours when true
local_testing=true   # informational flag
```

> **`android.platform.version` must be the SDK API level** (integer), not the Android OS marketing name.
> Run `adb shell getprop ro.build.version.sdk` on your emulator to get the correct value.

### `src/test/resources/config-ios.properties` (iOS)

```properties
appium.server.url=http://127.0.0.1:4723
platform.name=iOS
app.path.ios=src/test/resources/App/Runner.app
udid.ios=D0274BCB-FF35-40F3-A339-3699FD13BC53
ios.platform.version=18.2
ios.device.name=SwiftLyr Test iPhone
ios.bundle.id=com.swiftlyr.app.dev
device.name=SwiftLyr Test iPhone
headless=false
ci_mode=false
local_testing=true
```

Activated by passing `-Dplatform=ios` on the Maven command line (handled by `PropertyManager.getConfigFileName()`).

### `src/test/resources/credentials.properties` (gitignored)

This file is **not committed**. Create it from the example before running any test:

```bash
cp src/test/resources/credentials.properties.example \
   src/test/resources/credentials.properties
```

Then fill in real test-account values:

```properties
shubhamEmail=driver-account@example.com
shubhamPass=YourPassword
elonmuskEmail=second-driver-account@example.com
elonmuskPass=YourPassword
```

The keys `shubhamEmail`, `shubhamPass`, `elonmuskEmail`, `elonmuskPass` are referenced directly in `DriverE2EFlowTest.xml` as `<parameter>` values and resolved via `CredentialsPropertyManager.getProperty(key)`.

### `.env` file (optional, gitignored)

Any property can be overridden by setting an environment variable. `PropertyManager` and `CredentialsPropertyManager` call `EnvManager.getInstance().get(envKey)` before reading the `.properties` file. The key conversion rule is:

```
appium.server.url  →  APPIUM_SERVER_URL
android.platform.version  →  ANDROID_PLATFORM_VERSION
shubhamEmail  →  SHUBHAM_EMAIL
udid.ios  →  UDID_IOS
```

Create a `.env` file in the repo root for local overrides (it is ignored by git):

```dotenv
APPIUM_NODE_PATH=/Users/yourname/.nvm/versions/node/v22.12.0/bin/node
SHUBHAM_EMAIL=driver@example.com
SHUBHAM_PASS=MyPassword
```

In CI, set the same keys as OS-level environment variables / repository secrets — `dotenv-java` is configured with `.ignoreIfMissing()` so it will not crash if the `.env` file is absent.

### Config File Selection Logic (`PropertyManager`)

| Condition                                  | Config file loaded                               |
| ------------------------------------------ | ------------------------------------------------ |
| `-Dconfig.file=my-config.properties`       | `src/test/resources/my-config.properties`        |
| `-Dplatform=ios`                           | `src/test/resources/config-ios.properties`       |
| `-Dplatform=android` or no platform flag   | `src/test/resources/config.properties` (default) |

---

## 5. Steps to Run the Tests

### Prerequisites

| Requirement         | Version / Notes                                                          |
| ------------------- | ------------------------------------------------------------------------ |
| JDK                 | 17+                                                                      |
| Maven               | 3.6+                                                                     |
| Node.js             | 18+ (required by Appium)                                                 |
| Appium Server       | 3.2.2+ — install globally: `npm install -g appium`                       |
| UiAutomator2 driver | `appium driver install uiautomator2`                                     |
| XCUITest driver     | `appium driver install xcuitest` (macOS only)                            |
| Android SDK         | API 34 emulator image recommended; set `ANDROID_HOME`                   |
| Xcode               | 15+ (macOS, for iOS testing only)                                        |

### Step 1 — Set Android environment variables

Add to `~/.zshrc` (or equivalent):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
```

Reload: `source ~/.zshrc`

### Step 2 — Clone and install Maven dependencies

```bash
git clone git@github.com:Swiftlyr/swiftlyr-qa-mobileapp.git
cd swiftlyr-qa-mobileapp/swiftlyr-qa-mobileappV3
mvn install -DskipTests
```

### Step 3 — Place the app binary

APK and app files are gitignored. Copy them to the expected paths:

```bash
# Android
mkdir -p src/test/resources/App
cp /path/to/app-development-release.apk \
   src/test/resources/App/app-development-release.apk

# iOS (macOS only)
cp -r /path/to/Runner.app \
   src/test/resources/App/Runner.app
```

To build the APK from the Flutter source:

```bash
cd ../swiftlyr-mobile
flutter build apk --debug --flavor development --target lib/main_development.dart
cp build/app/outputs/flutter-apk/app-development-debug.apk \
   ../swiftlyr-qa-mobileappV3/src/test/resources/App/app-development-release.apk
```

### Step 4 — Create the credentials file

```bash
cp src/test/resources/credentials.properties.example \
   src/test/resources/credentials.properties
# Open the file and fill in valid test-account credentials
```

### Step 5 — Configure `config.properties`

Edit `src/test/resources/config.properties` and set values for your environment:

```bash
# Get API level
adb shell getprop ro.build.version.sdk   # e.g. 34 → set android.platform.version=34

# Get device name
adb shell getprop ro.product.model       # e.g. sdk_gphone64_x86_64

# Get UDID of running emulator
adb devices                              # e.g. emulator-5556
```

For iOS:

```bash
# Get simulator UDID
xcrun simctl list devices | grep "SwiftLyr Test iPhone"
# Paste the UDID into udid.ios in config-ios.properties
```

### Step 6 — Boot the emulator (Android)

```bash
# GUI mode
emulator -avd <AVD_NAME>

# Headless (no window — use when headless=true in config.properties)
emulator -avd <AVD_NAME> -no-window -no-audio -no-snapshot-save

# Wait until fully booted
adb wait-for-device && adb shell getprop sys.boot_completed
# Returns "1" when ready
```

### Step 7 — Start Appium server (recommended)

The framework will attempt to auto-start Appium if it is not already running, but starting it manually is more reliable:

```bash
appium -a 127.0.0.1 -p 4723
```

Verify it is running:

```bash
curl http://127.0.0.1:4723/status
```

---

### Running Tests

#### Default suite (LoginTests only)

```bash
mvn test
```

Runs the suite defined in `src/test/resources/testng.xml` — all 11 `LoginTests` validation tests. This is the quickest sanity check.

#### Full Android suite (all 3 test classes)

```bash
mvn test -Dsurefire.suiteXmlFiles=src/test/resources/suites/android-e2e-suite.xml
```

Runs `LoginTests`, `DriverTest`, and `JobsTicketTest` sequentially (`thread-count=1`).

#### Driver E2E flow suite (`DriverE2EFlowTest.xml`)

```bash
mvn test -Dsurefire.suiteXmlFiles=DriverE2EFlowTest.xml
```

Runs 2 parameterised test blocks against `tests.JobsTicketTest`:

| Test Block         | Username param    | Method called          | Description                                  |
| ------------------ | ----------------- | ---------------------- | -------------------------------------------- |
| `RefactoringFlow`  | `shubhamEmail`    | `refactoringAutomation`| Multi-geofence scan-ticket flow              |
| `OfflineScenarios` | `elonmuskEmail`   | `offlineScenarios`     | Airplane-mode offline sync validation        |

#### iOS

```bash
mvn test -Dplatform=ios
```

Loads `config-ios.properties` automatically and initialises `IOSDriver`.

#### Single test class

```bash
mvn test -Dtest=LoginTests
```

#### Single test method

```bash
mvn test -Dtest="LoginTests#verifySignInButtonShouldBeDisplayed"
```

#### CI / headless mode

```bash
CI=true HEADLESS=true mvn test -Dsurefire.suiteXmlFiles=DriverE2EFlowTest.xml
```

`HeadlessUtils` picks up `CI=true` or `HEADLESS=true` and appends `-no-window -no-audio` to AVD args automatically.

---

### Modifying the TestNG Suite XML Files

#### `src/test/resources/suites/android-e2e-suite.xml` — add or remove a test class

```xml
<suite name="Android Local E2E Test Suite" parallel="methods" thread-count="1">
  <test name="Android E2E Tests - Local Execution">
    <classes>
      <class name="tests.DriverTest" />       <!-- remove this line to exclude DriverTest -->
      <class name="tests.JobsTicketTest" />
      <class name="tests.LoginTests" />
    </classes>
  </test>
</suite>
```

#### Include or exclude specific methods within a class

```xml
<class name="tests.DriverTest">
  <methods>
    <include name="driverArrivesOnTime" />
    <include name="driverArrivesEarly" />
    <!-- all other methods in DriverTest are excluded -->
  </methods>
</class>
```

#### `DriverE2EFlowTest.xml` — change which user runs a test block

```xml
<test name="RefactoringFlow">
  <parameter name="username" value="shubhamEmail"/>   <!-- key in credentials.properties -->
  <parameter name="password" value="shubhamPass"/>
  <classes>
    <class name="tests.JobsTicketTest">
      <methods>
        <include name="refactoringAutomation"/>
      </methods>
    </class>
  </classes>
</test>
```

The `username` and `password` parameter values are **keys** (not the credentials themselves). They are resolved by `CredentialsPropertyManager.getProperty(key)` at runtime, which looks up the corresponding value in `credentials.properties` (or from an environment variable).

---

### All Available Test Methods

#### `LoginTests` (11 tests)

| Method                                                                                        | Description                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `verifySignInButtonShouldBeDisplayed`                                                         | Sign-in button is visible on app launch                  |
| `VerifySignInPageShouldBeDisplayedFieldsSuchAsEmailAddressPasswordAndSingInWithEmailButton`   | All fields present on sign-in page                       |
| `VerifyEmailAddressIsTextInputFieldAndUserAbleToEnterTheValidEmailAddress`                    | Email field accepts text input                           |
| `VerifyPasswordFieldIsTextInputFieldAndUserAbleToEnterThePassword`                            | Password field accepts text input                        |
| `verifySignInWithEmailButtonEnablesWhenEmailAndPasswordFieldsEntered`                         | Sign-in button enabled only when both fields filled      |
| `verifyEmailFieldShouldBeInValidFormat`                                                       | Email format validation (valid vs invalid)               |
| `verifyTheErrorMessageWhenPasswordIsLessThanEightCharacter`                                   | Error shown when password < 8 characters                 |
| `verifyErrorMessageIfPasswordNotContainUppercase_lowercaseNumberAndSpecialCharacter`          | Error shown for weak password                            |
| `VerifyPasswordShouldNotAbleToEnterMoreThan_33_characters`                                    | Password capped at 33 characters                         |
| `verifyThatTheSignInButtonRemainsDisabledUntilBothFieldsArefFilledIn`                         | Button disabled when only one field filled               |

#### `DriverTest` (18 tests)

| Method                                         | Scenario                                              |
| ---------------------------------------------- | ----------------------------------------------------- |
| `driverArrivesOnTime`                          | Driver arrives at load site on time                   |
| `driverArrivesEarly`                           | Driver arrives early, uses early arrival flow         |
| `driverArrivesAfterTime`                       | Driver arrives late (2-min wait injected)             |
| `driverArrivesOnTimeOnLoadWithDownTimeBreak`   | On-time arrival + downtime break at load site         |
| `driverArrivesEarlyOnLoadWithDownTimeBreak`    | Early arrival + downtime break at load site           |
| `driverArrivesAfterOnLoadWithDownTime`         | Late arrival + downtime break at load site            |
| `driverArrivesOnTimeOnUnloadWithDownTimeBreak` | On-time arrival + downtime break at unload site       |
| `driverArrivesEarlyOnUnloadWithDownTimeBreak`  | Early arrival + downtime break at unload site         |
| `driverArrivesAfterOnUnloadWithDownTime`       | Late arrival + downtime break at unload site          |
| `driverArrivesOnTimeOnLoadWithWaitTimeBreak`   | On-time arrival + wait-time break at load site        |
| `driverArrivesEarlyOnLoadWithWaitTimeBreak`    | Early arrival + wait-time break at load site          |
| `driverArrivesAfterOnLoadWithWatTime`          | Late arrival + wait-time break at load site           |
| `driverArrivesOnTimeOnUnloadWithWaitTimeBreak` | On-time arrival + wait-time break at unload site      |
| `driverArrivesEarlyOnUnloadWithWaitTimeBreak`  | Early arrival + wait-time break at unload site        |

#### `JobsTicketTest` (15 tests)

| Method                                                                              | Description                                                  |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `assignJobToDriver`                                                                 | Full assign + accept + pre-trip inspection flow              |
| `assignJobToDriver_driverAcceptedJob`                                               | Assign and accept job only                                   |
| `assignJobToDriver_driverDeclineJob`                                                | Assign then decline job                                      |
| `assignJobToDriver_driverAcceptedJob_thenDecline`                                   | Accept then decline with reason                              |
| `assignJobToDriver_driverAcceptedJob_completePreTripInspectionProcess_proceedTillTask5` | Full flow up to Task 5 / scan ticket                    |
| `assignJobToDriver_driverAcceptedJob_completePreTripInspectionProcess_proceedTillTask5_EndWorkDay` | Same + downtime break + end workday             |
| `add_Break_At_WaitTime_SubmitTimeCard_EndWorkday`                                   | Wait-time break + timecard submission                        |
| `endToEndDriverFlow`                                                                | E2E geofence-based happy path                                |
| `driverEndToEndHappyFlow`                                                           | Multi-trip happy path (3 trips)                              |
| `driverEndToEndFlowWithWait`                                                        | E2E with both downtime and wait-time breaks                  |
| `driverEndToEndFlowWithAnomalyAndBreak`                                             | E2E with anomaly (5 trips)                                   |
| `refactoringAutomation` _(parameterised)_                                           | Multi-geofence BPLRC scan-ticket flow (used in `DriverE2EFlowTest.xml`) |
| `testScenarios`                                                                     | BPLRC single job iteration flow                              |
| `offlineScenarios` _(parameterised)_                                                | Airplane-mode + reconnect data sync (used in `DriverE2EFlowTest.xml`)   |
| `offlineScenarioForIos`                                                             | iOS airplane-mode toggle                                     |

---

## 6. Test Reports

After every test run, a timestamped report folder is created under `target/`:

```
target/
└── Report 20260402-164901/
    ├── ExtentReport/
    │   └── ExtentReport.html          ← Open this in a browser
    └── screenshots/
        └── <TestName>_<timestamp>.png ← Auto-captured on step failure
```

### Opening the ExtentReport

```bash
open target/Report\ */ExtentReport/ExtentReport.html
```

Or open the HTML file directly in any browser. The report includes:

- Pass / Fail / Skip status per test method
- Step-by-step log entries (written by `test.log(Status.INFO, ...)` and `performStep()`)
- Failure screenshots embedded inline (relative path `../screenshots/<file>.png`)
- System info: OS, Java version, Appium version, report generation time

### Screenshot Behaviour

Screenshots are taken automatically by `BasePage.captureAndAttachScreenshot()`:

- **On failure:** `@AfterMethod` in `BaseTest` calls `captureAndAttachScreenshot("Test_Failure")` when `ITestResult.FAILURE`
- **Mid-step failures:** `performStep()` wraps any step action and calls `captureAndAttachScreenshot("Failed_<stepName>")` on exception
- Screenshots are saved to `target/Report <timestamp>/screenshots/` and attached to the ExtentReport node as inline images

### TestNG / Surefire Reports

Maven Surefire also generates standard XML and HTML reports:

```
target/surefire-reports/
├── TEST-<SuiteName>.xml           # JUnit-format XML (parseable by CI systems)
├── emailable-report.html          # TestNG summary email report
└── junitreports/
    └── TEST-tests.<ClassName>.xml # Per-class breakdown
```

These are used by GitHub Actions to publish results to the job summary.

---

## 7. Common Issues & Troubleshooting

### Port 4723 already in use

**Symptom:** `RuntimeException: Port 4723 is still in use after multiple cleanup attempts`

```bash
# Find what is using the port
lsof -i :4723

# Kill the process
lsof -ti:4723 | xargs kill -9

# Or kill all Appium/Node processes
pkill -f appium

# Verify port is free
lsof -i :4723   # should return nothing

# Start Appium fresh
appium -a 127.0.0.1 -p 4723
```

---

### "Application does not exist or is not accessible"

**Cause:** Appium resolves `app.path` relative to its own working directory, not Maven's project root.

**Fix:** Always start Appium from the repo root:

```bash
cd /path/to/swiftlyr-qa-mobileappV3
appium -a 127.0.0.1 -p 4723
```

Or use an absolute path in `config.properties`:

```properties
app.path=/Users/yourname/Projects/swiftlyr-qa-mobileappV3/src/test/resources/App/app-development-release.apk
```

---

### Emulator not detected / `adb devices` shows nothing

```bash
# Check emulator is running
adb devices
# Expected: "emulator-5556   device"

# If offline, restart ADB
adb kill-server && adb start-server

# Wait for full boot
adb wait-for-device
adb shell getprop sys.boot_completed   # must return "1"
```

Ensure `udid` in `config.properties` matches the UDID shown by `adb devices` exactly (e.g. `emulator-5556`).

---

### `credentials.properties` not found

**Symptom:** `RuntimeException: Failed to load config properties: ...credentials.properties`

```bash
cp src/test/resources/credentials.properties.example \
   src/test/resources/credentials.properties
# Edit the file with real test-account values
```

In CI, set the values as OS environment variables:

```bash
export SHUBHAM_EMAIL="driver@example.com"
export SHUBHAM_PASS="MyPassword"
export ELONMUSK_EMAIL="driver2@example.com"
export ELONMUSK_PASS="MyPassword2"
```

---

### Node.js / Appium not found (auto-start fails)

**Symptom:** `Failed to build the appium service` or `Cannot find node executable`

`AppiumServer.java` probes a fixed set of paths. If your Node.js is installed elsewhere, set `APPIUM_NODE_PATH` in `.env` or as an OS environment variable:

```dotenv
APPIUM_NODE_PATH=/Users/yourname/.nvm/versions/node/v20.0.0/bin/node
```

Then restart the test run. Alternatively, start Appium manually before running Maven (the auto-start is skipped when port 4723 is already responding).

---

### Wrong `android.platform.version` causes session creation failure

**Symptom:** `org.openqa.selenium.SessionNotCreatedException` mentioning platform version mismatch.

`android.platform.version` must be the **SDK API level integer**, not the Android OS marketing version.

```bash
# Get the correct value from the running emulator
adb shell getprop ro.build.version.sdk
# Example output: 34
```

Update `config.properties`:

```properties
android.platform.version=34
```

---

### Tests fail with `IllegalStateException: Driver not initialized`

**Cause:** `DriverManager.getDriver()` was called before `initializeDriver()`, or the driver was not initialised in `@BeforeMethod`.

**Fix:** Ensure the test class extends `BaseTest`. `BaseTest.setupTest()` calls `DriverManager.initializeDriver()` in `@BeforeMethod`.

---

### iOS Simulator: `WebDriverAgentRunner` launch timeout

**Symptom:** XCUITest session times out during startup on iOS Simulator.

```bash
# Ensure the simulator is booted before running tests
xcrun simctl boot "SwiftLyr Test iPhone"
# Verify UDID in config-ios.properties matches:
xcrun simctl list devices | grep "SwiftLyr Test iPhone"
```

Also verify Xcode Command Line Tools are installed:

```bash
xcode-select --install
```

