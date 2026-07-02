package Pages;

import Utils.CredentialsPropertyManager;
import Utils.PropertyManager;
import com.aventstack.extentreports.ExtentTest;
import com.google.common.collect.ImmutableMap;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.nativekey.AndroidKey;
import io.appium.java_client.android.nativekey.KeyEvent;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import io.appium.java_client.remote.SupportsContextSwitching;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import javax.swing.text.Utilities;
import java.security.PrivateKey;
import java.time.Duration;


public class LoginPage extends BasePage {
    CredentialsPropertyManager credProp = new CredentialsPropertyManager();
    private static PropertyManager prop = new PropertyManager();

    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"SIGN IN\"]")
    @iOSXCUITFindBy(accessibility = "SIGN IN")
    private WebElement signInField;

    @AndroidFindBy(uiAutomator = "new UiSelector().className(\"android.widget.EditText\").instance(0)")
    @iOSXCUITFindBy(accessibility = "Email")
    private WebElement emailField;

    @AndroidFindBy(uiAutomator = "new UiSelector().className(\"android.widget.EditText\").instance(1)")
    @iOSXCUITFindBy(accessibility = "Password")
    private WebElement passwordField;

    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"SIGN IN WITH EMAIL\"]")
    @iOSXCUITFindBy(accessibility = "SIGN IN WITH EMAIL")
    private WebElement signInWithEmailButton;

    @AndroidFindBy(xpath = "//android.widget.ImageView")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeButton")
    private WebElement passwordEyeIcon;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Please enter a valid email address\"]")
    @iOSXCUITFindBy(accessibility = "Please enter a valid email address")
    private WebElement errorMessageForEmailFiled;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Password must contain letters, numbers, and special characters\"]")
    @iOSXCUITFindBy(accessibility = "Password must contain letters, numbers, and special characters")
    private WebElement passwordErrorMessage;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Jobs\"]")
    @iOSXCUITFindBy(accessibility = "Jobs")
    private WebElement jobs;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_one_time_button\"]")
    @iOSXCUITFindBy(accessibility = "SWIFTLYR")
    private WebElement allowOnceLocationAccessButton;

    @AndroidFindBy(xpath = "//android.widget.RadioButton[@resource-id=\"com.android.permissioncontroller:id/permission_location_accuracy_radio_fine\"]")
    private WebElement preciseLocationPermissionButton;

    @AndroidFindBy(xpath = "//android.widget.RadioButton[@resource-id=\"com.android.permissioncontroller:id/permission_location_accuracy_radio_coarse\"]")
    private WebElement approximateLocationPermissionButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\"]")
     @iOSXCUITFindBy(accessibility ="Allow While Using App")
    private WebElement whileUsingAppLocationAccessButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_deny_button\"]")
    // @iOSXCUITFindBy() ---> Not able to locate need to find
    private WebElement denyLocationPermissionButton;

//    @AndroidFindBy(xpath = "//android.widget.ImageView[@content-desc=\"Map\n" +
//                           "Tab 2 of 4\"]")
//    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[@name=\"Map\n" +
//                            "Tab 2 of 4\"]")
//    private WebElement mapButton;

    @AndroidFindBy(xpath = "//android.widget.ImageView[@content-desc=\"Map\n" +
            "Tab 2 of 4\"]")
    @iOSXCUITFindBy(accessibility = "Map")
    private WebElement mapButton;

    @AndroidFindBy(xpath = "//android.widget.ImageView[@content-desc=\"Map\n" +
            "Tab 2 of 4\"]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@name=\"Map\"]")
    private WebElement mapHeading;

    @AndroidFindBy(xpath = "//android.widget.ImageView[@content-desc=\"Home\n" +
            "Tab 1 of 4\"]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[@name=\"Home\n" +
            "Tab 1 of 4\"]")
    private WebElement homeButton;

    @AndroidFindBy(accessibility = "Accept & Continue")
    @iOSXCUITFindBy(accessibility = "Accept & Continue")
    private WebElement acceptAndContinue;

    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"Accept & Continue\"]")
    @iOSXCUITFindBy(accessibility = "Change to Always Allow")
    private WebElement changeToAlwaysAllow;


    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"Decline\"]")
    private WebElement Decline;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\"]")
    private WebElement While_using_the_app_location;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\"]")
    private WebElement Donot_allow_location;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_button\"]")
    private WebElement Allow_notification;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_deny_button\"]")
    private WebElement Donot_Allow_notification;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"android:id/button1\"]")
    private WebElement locationAccuracyTurnOnButton;

    @AndroidFindBy(accessibility = "Allow Permissions")
    @iOSXCUITFindBy(accessibility = "Allow Permissions")
    private WebElement allowPermissions;

    @AndroidFindBy(xpath = "@AndroidFindBy(accessibility = \"Allow Permissions\")\n" +
            "    @iOSXCUITFindBy(accessibility = \"Allow Permissions\")\n" +
            "    private WebElement allowPermissions;")
    private WebElement allowAllTheTimeRadioButton;

    @AndroidFindBy(accessibility = "Navigate up")
    private WebElement backArrow;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"android:id/button1\"]")
    private WebElement backgroundPermissionAllow;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"android:id/button2\"]")
    private WebElement backgroundPermissionDeny;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_button\"]")
    private WebElement notificationPermissionAllow;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_deny_button\"]")
    private WebElement notificationPermissionDoNotAllow;



    public LoginPage(AppiumDriver driver, ExtentTest test, String screenshotFolderPath) {
        super(driver, test, screenshotFolderPath);
    }


    public void verifyAcceptAppNotification() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
        captureAndAttachScreenshot("Notification Alert is Displayed");
    }

    public void verifyDismissAppNotification() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().dismiss();
        captureAndAttachScreenshot("Notification Alert is Displayed");
    }

    public void clickOnAcceptAndContinue() {
        testUtils.clickOnElement(acceptAndContinue);
    }

    public void verifyAllowOnceButtonDisplayed() {
        performStep("Verify Allow Once button is displayed", () -> {
            testUtils.waitForElementToBeVisible(allowOnceLocationAccessButton);
            Assert.assertTrue(allowOnceLocationAccessButton.isDisplayed(), "Allow Once Location Access Button not displayed");
            captureAndAttachScreenshot("allowOnceLocationAccessButton_Displayed");
        });
    }

    public void verifyPreciseLocationButtonDisplayed() {
        performStep("Verify If Precise Location Button Is Displayed", () -> {
            testUtils.waitForElementToBeVisible(preciseLocationPermissionButton);
            Assert.assertTrue(preciseLocationPermissionButton.isDisplayed(), "Precise Location Button is Not Displayed");
        });
    }

    public void clickOnPreciseLocationButton() {
        performStep("Click on Precise Location Button", () -> {
            testUtils.clickOnElement(preciseLocationPermissionButton);
            captureAndAttachScreenshot("Click On Precise Location Button");
        });
    }

    public void verifyApproxLocationButtonIsDisplayed() {
        performStep("Verify Approximate Location Radio button is present on Android", () -> {
            testUtils.waitForElementToBeVisible(approximateLocationPermissionButton);
            Assert.assertTrue(approximateLocationPermissionButton.isDisplayed(), "Approximate Location Radio Button is not displayed");
        });
    }

    public void verifyDenyLocationButtonIsDisplayed() {
        performStep("Verify Deny location Permission Button is displayed.", () -> {
            testUtils.waitForElementToBeVisible(denyLocationPermissionButton);
            Assert.assertTrue(denyLocationPermissionButton.isDisplayed(), "Deny Location Permission Button is not displayed");
        });
    }


    public void clickOnApproximateLocationButton() {
        performStep("Verify Approximate Location Radio Button is clickable", () -> {
            testUtils.clickOnElement(approximateLocationPermissionButton);
            captureAndAttachScreenshot("Click On Approximate Location Button");
        });
    }

    public void verifyAllowWhileUsingAppButtonDisplayedAndClick() {
        performStep("Verify Allow location while using app Button is displayed", () -> {
            testUtils.waitForElementToBeVisible(whileUsingAppLocationAccessButton);
            Assert.assertTrue(whileUsingAppLocationAccessButton.isDisplayed(), "Location permission button for while using app button is not displayed");
            testUtils.clickOnElement(whileUsingAppLocationAccessButton);
        });
    }

    public void verifyMapButtonDisplayed() {
        performStep("Verify Map button is displayed", () -> {
//            testUtils.waitForElementToBeVisible(mapButton);
//            Assert.assertTrue(mapButton.isDisplayed(), "Map Button is not visible");
        });
    }

    public void clickOnMapButton() {
        performStep("click on Map Button", () -> {
//            testUtils.waitForElement();
//            testUtils.clickOnElement(mapButton);
//            captureAndAttachScreenshot("Performed Click on Map button");
//            Assert.assertTrue(mapHeading.isDisplayed(), "Heading of Page as Map not displayed");
        });
    }

    public void verifyHomeButtonDisplayed() {
        performStep("Verify Home button is displayed", () -> {
//                testUtils.waitForElementToBeVisible(homeButton);
//                Assert.assertTrue(homeButton.isDisplayed(), "Map Button is not visible");
        });
    }

    public void clickOnHomeButton() {
        performStep("click on Home Button", () -> {
            testUtils.clickOnElement(homeButton);
            captureAndAttachScreenshot("Performed Click on Home button");
            Assert.assertTrue(jobs.isDisplayed(), "Jobs as Title is displayed");
        });
    }


    public void clickOnAllowOnceButton() {
        performStep("Click on Allow Once Button", () -> {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.elementToBeClickable(allowOnceLocationAccessButton));
            //wait.until(ExpectedConditions.elementToBeSelected(allowOnceLocationAccessButton));
            //testUtils.forceTap(allowOnceLocationAccessButton);
            testUtils.clickOnElement(allowOnceLocationAccessButton);
            captureAndAttachScreenshot("Click on allow Once Button");
        });
    }

    public void clickOnAllowOnceButtonIOS() {
        performStep("Click on Allow Once Button", () -> {
            driver.executeScript("mobile: alert", ImmutableMap.of(
                    "action", "accept",
                    "buttonLabel", "Allow While Using App"
            ));

            captureAndAttachScreenshot("Click on allow Once Button");
        });
    }
    // Click on While using app and Don't allow button methods are remaining.

    public void verifySignInButtonDisplayed() {
        performStep("Verifying Sign In button is displayed", () -> {
//            try {
//                Thread.sleep(10000);
//            } catch (InterruptedException e) {
//                throw new RuntimeException(e);
//            }
            testUtils.waitForElementToBeVisible(signInField);
            Assert.assertTrue(signInField.isDisplayed(), "Sign in button not displayed");
            captureAndAttachScreenshot("SignIn_Button_Displayed");
        });
    }

    public void clickOnSignButton() {
        performStep("Click on sign in button", () -> {
            testUtils.waitForElementToBeClickable(signInField);
            testUtils.clickOnElement(signInField);
            captureAndAttachScreenshot("Click on sign button");
        });
    }

    public void verifySignInPageDisplayedAllFields() {
        performStep("Sign page field verification", () -> {
            Assert.assertTrue(emailField.isDisplayed(), "Email Id field not display");
            test.pass("Email Id field is display");
            Assert.assertTrue(passwordField.isDisplayed(), "Password field not display");
            test.pass("Password field is display");
            Assert.assertTrue(signInWithEmailButton.isDisplayed(), "Sign in with email button field not display");
            test.pass("Sign in with email button field is display");
            captureAndAttachScreenshot("Sign page field verification success");
        });
    }

    public void enterEmailAddress(String email) {
        performStep("Enter email address", () -> {
            testUtils.clickOnElement(emailField);
            testUtils.typeText(emailField, email);
            Assert.assertEquals(emailField.getText(), email, "User not able to entered the email address");
            captureAndAttachScreenshot("User able to entered the email address");
        });
    }

    public void enterPassword(String password) {
        performStep("Enter Password", () -> {
            testUtils.clickOnElement(passwordField);
            testUtils.typeText(passwordField, password);
//            testUtils.clickOnElement(passwordEyeIcon);
//            Assert.assertEquals(passwordField.getText(), password, "User not able to entered the password");
            captureAndAttachScreenshot("User is able to entered the password");
        });
    }

    public void verifySignInWithEmailButtonEnabled() {
        performStep("verify sign in with email button enable", () -> {
            testUtils.waitForElementToBeClickable(signInWithEmailButton);
            Assert.assertTrue(signInWithEmailButton.isEnabled(), "Sign In With Email Button not enabled");
            testUtils.waitForElement();
            captureAndAttachScreenshot("Sign In With Email Button is enabled");
        });

    }

    public void verifyEmailIsInValidFormatForSign(String validEmail) {
        performStep("Verify if email is invalid  format", () -> {
            testUtils.waitForElementToBeVisible(emailField);
            testUtils.clickOnElement(emailField);
            testUtils.typeText(emailField, validEmail);
            String emailPattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
            if (validEmail.matches(emailPattern)) {
                Assert.assertTrue(emailField.isDisplayed(), "Email field is not visible");
                captureAndAttachScreenshot("Email field is valid format");
            } else {
                Assert.fail("The email " + validEmail + " should not be in valid format");
                captureAndAttachScreenshot("Email field is not in valid format");
            }
        });


    }

    public void verifyEmailIsInvalidFormat(String invalidEmail) {
        performStep("Verify email is in invalid format", () -> {
            testUtils.waitForElementToBeVisible(emailField);
            testUtils.clickOnElement(emailField);
            testUtils.typeText(emailField, invalidEmail);
            String emailPattern = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
            if (invalidEmail.matches(emailPattern)) {
                System.out.println("Valid email entered: " + invalidEmail);
                captureAndAttachScreenshot("Email is valid format");
            } else {
                Assert.assertTrue(errorMessageForEmailFiled.isDisplayed(), "Error message is not visible for invalid email");
                captureAndAttachScreenshot("Email is invalid format");
            }
        });
    }

    public void verifyErrorMessageForPassword(String password) {
        performStep("Verify Error Message For Password", () -> {
            testUtils.clickOnElement(passwordField);
            testUtils.typeText(passwordField, password);
            Assert.assertTrue(passwordErrorMessage.isDisplayed(), "Error message not appeared for password");
            captureAndAttachScreenshot("Error message is appeared for password");
        });
    }

    public void verifySignInWithEmailButtonDisable() {
        performStep("verify Sign In With Email Button Disable", () -> {
            Assert.assertFalse(signInWithEmailButton.isEnabled(), "Sign in with email button is enabled, expected it should not enabled");
            captureAndAttachScreenshot("Sign in with email button is not enabled");
        });

    }

    public void clickOnSignInWithEmailButton() {
        performStep("Click on sign with email button", () -> {
            testUtils.clickOnElement(signInWithEmailButton);
            captureAndAttachScreenshot("Click on sign in with email button");
        });
    }

    public void verifyJobsIsVisible() {
        performStep("Jobs page is displaying", () -> {
            testUtils.waitForElementToBeVisible(jobs);
            Assert.assertTrue(jobs.isDisplayed(), "Jobs page is not displaying");
            captureAndAttachScreenshot("Jobs page");
        });
    }

    public void clickOnKeepOnlyWhileUsingButton() {
        performStep("Click on sign with email button", () -> {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            try {
                WebElement keepWhileUsing = wait.until(
                        ExpectedConditions.presenceOfElementLocated(
                                MobileBy.iOSNsPredicateString("label CONTAINS 'While Using'")
                        )
                );
                keepWhileUsing.click();
            } catch (Exception e) {
                System.out.println("Location popup not found: " + e.getMessage());
            }

            captureAndAttachScreenshot("Click on keep only while using button");
        });
    }

    public void clickOnChangeToAlwaysAllowButton() {
        performStep("Click on sign with email button", () -> {
            {
                performStep("Click on sign with email button", () -> {
                    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

                    try {
                        WebElement keepWhileUsing = wait.until(
                                ExpectedConditions.presenceOfElementLocated(
                                        MobileBy.iOSNsPredicateString("label CONTAINS 'While Using'")
                                )
                        );
                        keepWhileUsing.click();
                    } catch (Exception e) {
                        System.out.println("Location popup not found: " + e.getMessage());
                    }

                    captureAndAttachScreenshot("Click on keep only while using button");
                });
            }

            captureAndAttachScreenshot("Click on keep only while using button");
        });
    }

    public void clickOnAllowPermissionButton() {
        performStep("Click on Allow permissions Button", () -> {
            testUtils.clickOnElement(allowPermissions);
            captureAndAttachScreenshot("Click On Allow permission Button");
        });
    }

    public void clickOnWhileUsingAppButton() {
        performStep("Click on while using app Button", () -> {
            testUtils.clickOnElement(whileUsingAppLocationAccessButton);
            captureAndAttachScreenshot("Click On While using app Button");
        });
    }

    public void clickOnAllowAllTheTimeButton() {
        performStep("Click on allow all the time Button", () -> {
            SupportsContextSwitching ctx = (SupportsContextSwitching) driver;

            for (String context : ctx.getContextHandles()) {
                System.out.println("Available context: " + context);
            }

            try {
                WebElement allowAllTime = driver.findElement(
                        AppiumBy.androidUIAutomator(
                                "new UiSelector().textContains(\"Allow all the time\")"
                        )
                );
                allowAllTime.click();
                System.out.println("Clicked 'Allow all the time' using UiSelector");
            } catch (Exception e2) {
                System.out.println("Strategy 2 failed, trying strategy 3...");
            }
            captureAndAttachScreenshot("Click On allow all the time Button");
        });
    }

    public void clickOnBackArrowButton() {
        performStep("Click on back arrow  Button", () -> {

            driver.findElement(MobileBy.AccessibilityId("Navigate up")).click();

            //testUtils.swipeBack();
            captureAndAttachScreenshot("Click On back arrow Button");
        });
    }

    public void clickOnBackgroundPermissionALlowButton() {
        performStep("Click on background permission allow Button", () -> {
            testUtils.clickOnElement(backgroundPermissionAllow);
            captureAndAttachScreenshot("Click On background permission allow Button");
        });
    }

    public void clickOnBackgroundPermissionDenyButton() {
        performStep("Click on background permission deny Button", () -> {
            testUtils.clickOnElement(backgroundPermissionDeny);
            captureAndAttachScreenshot("Click On background permission deny Button");
        });
    }

    public void clickOnNotificationPermissionAllowButton() {
        performStep("Click on notification permission allow Button", () -> {
            //testUtils.clickOnElement(notificationPermissionAllow);
            driver.switchTo().alert().accept();
            captureAndAttachScreenshot("Click On notification permission allow Button");
        });
    }

    public void clickOnNotificationPermissionDoNotAllowButton() {
        performStep("Click on notification permission Do not allow Button", () -> {
            testUtils.clickOnElement(notificationPermissionDoNotAllow);
            captureAndAttachScreenshot("Click On notification permission DO not allow Button");
        });
    }


    public void loginSteps() {
        //verifyPreciseLocationButtonDisplayed();
        //verifyApproxLocationButtonIsDisplayed();
        //verifyAcceptAppNotification();
        clickOnAcceptAndContinue();
        testUtils.waitForElement();
        verifyAllowOnceButtonDisplayed();
        verifyAllowWhileUsingAppButtonDisplayedAndClick();
        clickOnChangeToAlwaysAllow();
        // verifyDenyLocationButtonIsDisplayed();
        clickOnAllowOnceButton();
        verifyDismissAppNotification();
        verifySignInButtonDisplayed();
        clickOnSignButton();
        enterEmailAddress("shubham.tirpude+driver@techverito.com");
        enterPassword("Shubham@20");
        clickOnSignInWithEmailButton();
    }

    public void logInToApp(String username, String password) {
        testUtils.waitForElementToBeClickable(signInField);
        clickOnSignButton();
        enterEmailAddress(username);
        enterPassword(password);
        clickOnSignInWithEmailButton();

        String platformNme = prop.getProperty("platform.name");
        if(platformNme.equalsIgnoreCase("ios")) {
            handleIOSPermissionsIfPresent();
        } else {
            handleAndroidPermissionsIfPresent();
        }
    }

    public void logInToApp() {
        testUtils.waitForElementToBeClickable(signInField);
        clickOnSignButton();
        enterEmailAddress(credProp.getProperty("shubhamEmail"));
        enterPassword(credProp.getProperty("shubhamPass"));
        clickOnSignInWithEmailButton();

        String platformNme = prop.getProperty("platform.name");
        if(platformNme.equalsIgnoreCase("ios")) {
            handleIOSPermissionsIfPresent();
        } else {
            handleAndroidPermissionsIfPresent();
        }
    }

    /**
     * Handles iOS permissions only if they appear (first login after install).
     * On subsequent logins, permissions are already granted and are skipped.
     * Uses conditional checks to avoid failing on missing dialogs.
     */
    private void handleIOSPermissionsIfPresent() {
        try {
            if (testUtils.isElementDisplayed(allowPermissions)) {
                performStep("Click Allow Permissions button", () -> {
                    clickOnAllowPermissionButton();
                });
            }
            try {
                testUtils.tapCenterOfScreen();
            } catch (Exception e) {
                System.out.println("ℹ️ [INFO] Center screen tap skipped - not required");
            }
            try {
                clickOnAllowOnceButtonIOS();
            } catch (Exception e) {
                System.out.println("ℹ️ [INFO] Location permission alert not present (already granted)");
            }
            try {
                verifyAcceptAppNotification();
            } catch (Exception e) {
                System.out.println("ℹ️ [INFO] Notification alert not present (already granted)");
            }
            try {
                testUtils.handleIOSAlert();
            } catch (Exception e) {
                System.out.println("ℹ️ [INFO] No additional iOS alerts to handle");
            }
        } catch (Exception e) {
            System.out.println("⚠️ [WARN] iOS permission handling encountered issue: " + e.getMessage());
        }
    }

    /**
     * Handles Android permissions only if they appear (first login after install).
     * On subsequent logins, permissions are already granted and are skipped.
     * Uses conditional checks to avoid blocking on missing dialogs.
     */
    private void handleAndroidPermissionsIfPresent() {
        try {
            if (testUtils.isElementDisplayed(allowPermissions)) {
                performStep("Click Allow Permissions button", () -> {
                    clickOnAllowPermissionButton();
                });
            }
            if (testUtils.isElementDisplayed(whileUsingAppLocationAccessButton)) {
                performStep("Click While Using App location permission", () -> {
                    verifyAllowWhileUsingAppButtonDisplayedAndClick();
                });
            } else {
                System.out.println("ℹ️ [INFO] Location permission dialog not present (already granted)");
            }
            try {
                if (testUtils.isElementDisplayed(driver.findElement(
                        AppiumBy.androidUIAutomator("new UiSelector().textContains(\"Allow all the time\")")))) {
                    performStep("Click Allow all the time button", () -> {
                        clickOnAllowAllTheTimeButton();
                    });
                }
            } catch (Exception e) {
                System.out.println("ℹ️ [INFO] 'Allow all the time' button not present (already granted)");
            }
            if (testUtils.isElementDisplayed(backArrow)) {
                performStep("Click back arrow button", () -> {
                    clickOnBackArrowButton();
                });
            } else {
                System.out.println("ℹ️ [INFO] Back arrow button not required");
            }
            if (testUtils.isElementDisplayed(backgroundPermissionAllow)) {
                performStep("Click background permission allow", () -> {
                    clickOnBackgroundPermissionALlowButton();
                });
            } else {
                System.out.println("ℹ️ [INFO] Background permission already granted");
            }
            if (testUtils.isElementDisplayed(notificationPermissionAllow)) {
                performStep("Click notification permission allow", () -> {
                    clickOnNotificationPermissionAllowButton();
                });
            } else {
                System.out.println("ℹ️ [INFO] Notification permission already granted");
            }
        } catch (Exception e) {
            System.out.println("⚠️ [WARN] Android permission handling encountered issue: " + e.getMessage());
        }
    }

    public void clickOnChangeToAlwaysAllow() {
        testUtils.waitForElement();
        testUtils.clickOnElement(changeToAlwaysAllow);
    }

    public void verifyTurnOnButtonDisplayed() {
        performStep("Verify turn on button is displayed", () -> {
            testUtils.waitForElementToBeVisible(locationAccuracyTurnOnButton);
            Assert.assertTrue(locationAccuracyTurnOnButton.isDisplayed(), "Turn On Button not displayed");
            captureAndAttachScreenshot("TurnOnButton_Displayed");
        });
    }

    public void clickOnTurnOnButton() {
        performStep("Click on Turn on button", () -> {
            testUtils.waitForElementToBeVisible(locationAccuracyTurnOnButton);
            testUtils.clickOnElement(locationAccuracyTurnOnButton);
            captureAndAttachScreenshot("Click on Turn on button");
        });
    }



    public void checkJobIsVisible() {
        verifyMapButtonDisplayed();
        clickOnMapButton();
        verifyHomeButtonDisplayed();
        clickOnHomeButton();
        verifyJobsIsVisible();
    }
}