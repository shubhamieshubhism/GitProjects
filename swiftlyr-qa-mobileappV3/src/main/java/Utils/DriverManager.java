package Utils;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.net.URL;
import java.time.Duration;

public class DriverManager {

    private static ThreadLocal<AppiumDriver> driver = new ThreadLocal<>();
    private static PropertyManager prop = new PropertyManager();


    public static AppiumDriver getDriver() {
        AppiumDriver currentDriver = driver.get();
        if (currentDriver == null) {
            throw new IllegalStateException("Driver not initialized. Please call initializeDriver() first.");
        }
        return currentDriver;
    }

    public static void initializeDriver() {
        // Always quit any existing driver before initializing a new one
        quitDriver();
        
        // Initialize headless mode early
        HeadlessUtils.setHeadlessSystemProperties();
        
        AppiumDriver driverInstance;
        try {
            String platformName = prop.getProperty("platform.name");
            DesiredCapabilities capabilities = new DesiredCapabilities();
            URL appiumServer = new URL(prop.getProperty("appium.server.url"));

            capabilities.setCapability("platformName", platformName);
            
            // Apply headless configuration based on platform (skip for iOS to avoid conflicts)
            if (platformName.equalsIgnoreCase("ANDROID")) {
                HeadlessUtils.configureForHeadless(capabilities, platformName);
                HeadlessUtils.validateHeadlessEnvironment();
            }

            if (platformName.equalsIgnoreCase("ANDROID")) {
                capabilities.setCapability("automationName", "UiAutomator2");
                capabilities.setCapability("deviceName", prop.getProperty("device.name"));
                capabilities.setCapability("udid", prop.getProperty("udid"));
                capabilities.setCapability("app", prop.getProperty("app.path"));
                capabilities.setCapability("platformVersion", prop.getProperty("android.platform.version"));//done
                capabilities.setCapability("appPackage", prop.getProperty("android.app.package"));//done
                capabilities.setCapability("appActivity", prop.getProperty("android.app.activity"));
                capabilities.setCapability("noReset", false);//done

                /*capabilities.setCapability("autoAcceptAlerts", true);
                capabilities.setCapability("autoGrantPermissions", true);*/
                //capabilities.setCapability("fullReset", true);
                capabilities.setCapability("newCommandTimeout", 1200);
                capabilities.setCapability("commandTimeouts", 120000);

                driverInstance = new AndroidDriver(appiumServer, capabilities);
            } else {
                // iOS capabilities - complete setup without HeadlessUtils
                capabilities.setCapability("automationName", "XCUITest");
                capabilities.setCapability("deviceName", prop.getProperty("ios.device.name"));
                capabilities.setCapability("app", prop.getProperty("app.path.ios"));
                capabilities.setCapability("platformVersion", prop.getProperty("ios.platform.version"));

                capabilities.setCapability("appium:autoGrantPermissions", true);
                capabilities.setCapability("autoDismissAlerts", false); // Set to true to auto-dismiss


                capabilities.setCapability("udid", prop.getProperty("udid.ios"));
                //capabilities.setCapability("waitForQuiescence", false);
                capabilities.setCapability("newCommandTimeout", 1200);
                capabilities.setCapability("commandTimeouts", 120000);
                //capabilities.setCapability("noReset", false);
                capabilities.setCapability("nativeWebTap", true);
                //capabilities.setCapability("safariAllowPopups", true);
                //capabilities.setCapability("shouldUseSingletonTestManager", false);
                //capabilities.setCapability("useNewWDA", true);
                //capabilities.setCapability("clearSystemFiles", true);
                //capabilities.setCapability("wdaLaunchTimeout", 120000);
                //capabilities.setCapability("wdaConnectionTimeout", 120000);
                //capabilities.setCapability("appium:useNativeCachingStrategy", false);
                //capabilities.setCapability("permissions", "{\"" + prop.getProperty("ios.bundle.id") + "\": {\"photos\": \"yes\", \"photos-add\": \"yes\", \"camera\": \"yes\"}}");


                driverInstance = new IOSDriver(appiumServer, capabilities);
            }

           // driverInstance.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
            driverInstance.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.set(driverInstance);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize driver: " + e.getMessage());
        }
    }

    public static void quitDriver() {
        AppiumDriver currentDriver = driver.get();
        if (currentDriver != null) {
            try {
                currentDriver.quit();
            } catch (Exception e) {
                System.out.println("Warning: Error quitting driver: " + e.getMessage());
            } finally {
                driver.remove();
            }
        }
    }

}