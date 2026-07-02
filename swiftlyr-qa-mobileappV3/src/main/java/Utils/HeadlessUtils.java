package Utils;

import org.openqa.selenium.remote.DesiredCapabilities;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for handling headless execution in CI/CD environments.
 * Provides methods to detect headless mode and configure capabilities accordingly.
 */
public class HeadlessUtils {
    
    private static final String HEADLESS_PROPERTY = "headless";
    private static final String CI_MODE_PROPERTY = "ci_mode";
    private static final String DISPLAY_ENV = "DISPLAY";
    private static final String CI_ENV = "CI";
    
    /**
     * Determines if the current execution environment is headless.
     * Checks multiple indicators: system properties, environment variables.
     * 
     * @return true if running in headless mode, false otherwise
     */
    public static boolean isHeadlessMode() {
        // Check system properties
        String headlessProperty = System.getProperty(HEADLESS_PROPERTY, "false");
        String ciModeProperty = System.getProperty(CI_MODE_PROPERTY, "false");
        
        // Check environment variables
        String displayEnv = System.getenv(DISPLAY_ENV);
        String ciEnv = System.getenv(CI_ENV);
        String headlessEnv = System.getenv("HEADLESS");
        
        boolean isHeadless = "true".equalsIgnoreCase(headlessProperty) ||
                           "true".equalsIgnoreCase(ciModeProperty) ||
                           "true".equalsIgnoreCase(ciEnv) ||
                           "1".equals(headlessEnv);
        
        if (isHeadless) {
            System.out.println("🖥️  Headless mode detected");
            logHeadlessEnvironment();
        } else {
            System.out.println("🖥️  GUI mode detected");
        }
        
        return isHeadless;
    }
    
    /**
     * Configures Appium capabilities for headless execution.
     * Adds platform-specific headless settings to ensure proper CI execution.
     * 
     * @param capabilities The DesiredCapabilities object to configure
     * @param platform The target platform (android/iOS)
     */
    public static void configureForHeadless(DesiredCapabilities capabilities, String platform) {
        if (!isHeadlessMode()) {
            System.out.println("⚡ Skipping headless configuration - GUI mode detected");
            return;
        }
        
        System.out.println("🔧 Applying headless configuration for platform: " + platform);
        
        // Common headless capabilities
        capabilities.setCapability("isHeadless", true);
        
        if ("android".equalsIgnoreCase(platform)) {
            configureAndroidHeadless(capabilities);
        } else if ("iOS".equalsIgnoreCase(platform)) {
            configureiOSHeadless(capabilities);
        }
        
        System.out.println("✅ Headless configuration applied successfully");
    }
    
    /**
     * Applies Android-specific headless configurations.
     * 
     * @param capabilities The DesiredCapabilities object to configure
     */
    private static void configureAndroidHeadless(DesiredCapabilities capabilities) {
        // Android emulator headless options
        Map<String, Object> androidOptions = new HashMap<>();
        androidOptions.put("avd.args", "-no-window -no-ui -no-audio");
        androidOptions.put("isHeadless", true);
        
        capabilities.setCapability("appium:avdArgs", "-no-window -no-audio");
        capabilities.setCapability("appium:suppressKillServer", true);
        capabilities.setCapability("appium:disableWindowAnimation", true);
        
        // Performance optimizations for headless - disable problematic settings for instrumentation
        capabilities.setCapability("appium:skipDeviceInitialization", false);
        capabilities.setCapability("appium:skipServerInstallation", false);
        
        System.out.println("🤖 Android headless configuration applied");
    }
    
    /**
     * Applies iOS-specific headless configurations.
     * 
     * @param capabilities The DesiredCapabilities object to configure
     */
    private static void configureiOSHeadless(DesiredCapabilities capabilities) {
        // iOS simulator headless options
        capabilities.setCapability("appium:isHeadless", true);
        capabilities.setCapability("appium:showXcodeLog", false);
        capabilities.setCapability("appium:suppressKillServer", true);
        capabilities.setCapability("appium:autoGrantPermissions", true);
        
        // WebDriverAgent optimizations for CI
        capabilities.setCapability("appium:useNewWDA", true);
        capabilities.setCapability("appium:clearSystemFiles", true);
        capabilities.setCapability("appium:wdaStartupRetries", 3);
        capabilities.setCapability("appium:wdaStartupRetryInterval", 10000);
        
        // Performance optimizations
        capabilities.setCapability("appium:waitForQuiescence", false);
        capabilities.setCapability("appium:reduceMotion", true);
        
        System.out.println("🍎 iOS headless configuration applied");
    }
    
    /**
     * Sets headless system properties for Java AWT operations.
     * Call this early in test initialization to ensure all UI operations are headless.
     */
    public static void setHeadlessSystemProperties() {
        if (isHeadlessMode()) {
            System.setProperty("java.awt.headless", "true");
            System.setProperty("webdriver.chrome.args", "--headless");
            System.setProperty("headless", "true");
            System.setProperty("ci_mode", "true");
            System.out.println("🛠️  Java headless system properties set");
        }
    }
    
    /**
     * Validates that the current environment is properly configured for headless execution.
     * Logs warnings if potential issues are detected.
     * 
     * @return true if environment passes headless validation, false if issues detected
     */
    public static boolean validateHeadlessEnvironment() {
        boolean isValid = true;
        System.out.println("🔍 Validating headless environment...");
        
        // Check DISPLAY environment
        String display = System.getenv(DISPLAY_ENV);
        if (display != null && !display.trim().isEmpty()) {
            System.out.println("⚠️  Warning: DISPLAY environment variable is set: " + display);
            isValid = false;
        } else {
            System.out.println("✅ DISPLAY environment properly cleared for headless mode");
        }
        
        // Check Java AWT headless property
        String javaHeadless = System.getProperty("java.awt.headless");
        if (!"true".equalsIgnoreCase(javaHeadless)) {
            System.out.println("⚠️  Warning: java.awt.headless not set to true: " + javaHeadless);
            isValid = false;
        } else {
            System.out.println("✅ Java AWT headless mode confirmed");
        }
        
        // Check CI environment indicators
        String ci = System.getenv(CI_ENV);
        if (!"true".equalsIgnoreCase(ci)) {
            System.out.println("ℹ️  CI environment variable not set (may be running locally)");
        } else {
            System.out.println("✅ CI environment detected");
        }
        
        System.out.println(isValid ? "🏁 Headless environment validation passed" : 
                                   "⚠️  Headless environment validation completed with warnings");
        return isValid;
    }
    
    /**
     * Logs current environment details for debugging headless issues.
     */
    private static void logHeadlessEnvironment() {
        System.out.println("📊 Headless Environment Details:");
        System.out.println("   • DISPLAY: " + System.getenv(DISPLAY_ENV));
        System.out.println("   • CI: " + System.getenv(CI_ENV));
        System.out.println("   • HEADLESS: " + System.getenv("HEADLESS"));
        System.out.println("   • java.awt.headless: " + System.getProperty("java.awt.headless"));
        System.out.println("   • headless property: " + System.getProperty(HEADLESS_PROPERTY));
        System.out.println("   • ci_mode property: " + System.getProperty(CI_MODE_PROPERTY));
    }
}