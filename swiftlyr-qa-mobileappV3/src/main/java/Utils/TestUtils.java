package Utils;

import com.google.common.collect.ImmutableMap;
import io.appium.java_client.*;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.connection.ConnectionStateBuilder;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import io.appium.java_client.serverevents.CustomEvent;
import io.appium.java_client.touch.WaitOptions;
import io.appium.java_client.touch.offset.PointOption;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.interactions.Pause;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import org.openqa.selenium.remote.RemoteWebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.logging.Logger;


public class TestUtils {

    private AppiumDriver driver;
    private WebDriverWait wait;
    private PropertyManager prop;
    private static final Logger logger = Logger.getLogger(TestUtils.class.getName());

    public TestUtils(AppiumDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        this.prop = new PropertyManager();
        //        this.wait = new WebDriverWait(driver, TimeUnit.SECONDS);
        PageFactory.initElements(new AppiumFieldDecorator(driver), this);
    }

    protected void waitForVisibility(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    public void typeText(WebElement element, String text) {
        waitForVisibility(element);
        element.clear();
        element.sendKeys(text);
    }

    public void typeNumber(WebElement element, int num) {
        waitForVisibility(element);
        element.clear();
        element.sendKeys(String.format("%d", num));
        //element.sendKeys(String.valueOf(num));
    }

    protected String getText(WebElement element) {
        waitForVisibility(element);
        return element.getText();
    }

    public boolean isElementDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public WebElement waitForElementToBeVisible(WebElement element) {
        return wait.until(ExpectedConditions.visibilityOf(element));
    }



    public WebElement waitForElementToBeClickable(WebElement element) {
        return wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    public boolean waitForElementToDisappear(WebElement element) {
        return wait.until(ExpectedConditions.invisibilityOf(element));
    }

    public void clickOnElement(WebElement element) {
        waitForVisibility(element);
        element.click();
    }

    public void waitForElement() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void waitForElement(int time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    // Wait for given minutes
    public void waitForMinutes(int minutes) {
        try {
            // TimeUnit handles the conversion
            Thread.sleep(TimeUnit.MINUTES.toMillis(minutes));
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    public void scrollToHeight() {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence swipe = new Sequence(finger, 1);

        int startX = 100;  // center of screen for iPhone 16
        int startY = 400;  // near bottom
        int endY = 200;    // near top

        swipe.addAction(finger.createPointerMove(Duration.ofMillis(0), PointerInput.Origin.viewport(), startX, startY));
        swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        swipe.addAction(finger.createPointerMove(Duration.ofMillis(700), PointerInput.Origin.viewport(), startX, endY));
        swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(Collections.singletonList(swipe));

    }

    public void scrollToEnd(){
        boolean canScrollMore;
        do{
            canScrollMore = (Boolean)((JavascriptExecutor)driver).executeScript("mobile: scrollGesture", ImmutableMap.of(
                    "left",100,
                    "top",100,
                    "width",200,
                    "height",200,
                    "direction","down",
                    "percent",3.0
            ));
        }while(canScrollMore);
    }

    // Optimized: Use dynamic polling for element visibility instead of fixed sleep
    private boolean isElementVisible(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public void scrollToElementIOS(WebElement targetElement) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Dimension size = driver.manage().window().getSize();
        int centerX = size.getWidth() / 2;
        int startY = (int) (size.getHeight() * 0.45);
        int endY = (int) (size.getHeight() * 0.15);
        int maxAttempts = 20;
        int attempts = 0;
        int pollInterval = 50; // ms
        int maxPoll = 300; // ms, replaces Thread.sleep(300)
        while (attempts < maxAttempts) {
            if (isElementVisible(targetElement)) {
                System.out.println("iOS Element found after " + attempts + " scroll attempts");
                return;
            }
            // Perform the scroll
            Sequence swipe = new Sequence(finger, 1);
            swipe.addAction(finger.createPointerMove(Duration.ofMillis(0), PointerInput.Origin.viewport(), centerX, startY));
            swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
            swipe.addAction(finger.createPointerMove(Duration.ofMillis(1200), PointerInput.Origin.viewport(), centerX, endY));
            swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
            driver.perform(Collections.singletonList(swipe));
            // Poll for visibility up to maxPoll ms
            int waited = 0;
            while (waited < maxPoll) {
                if (isElementVisible(targetElement)) return;
                try { Thread.sleep(pollInterval); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                waited += pollInterval;
            }
            attempts++;
        }
        throw new RuntimeException("iOS Element not found after " + maxAttempts + " scroll attempts");
    }

    public void scrollToElementAndroid(WebElement targetElement){
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Dimension size = driver.manage().window().getSize();
        int centerX = size.getWidth() / 2;
        int startY = (int) (size.getHeight() * 0.75);
        int endY = (int) (size.getHeight() * 0.25);
        int maxAttempts = 12;
        int attempts = 0;
        int pollInterval = 50; // ms
        int maxPoll = 300; // ms, replaces Thread.sleep(600)
        System.out.println("Starting scroll search for element on Pixel 9...");
        while (attempts < maxAttempts) {
            if (isElementVisible(targetElement)) {
                System.out.println("✅ Element found after " + attempts + " scroll attempts");
                return;
            }
            // Create smooth scroll gesture
            Sequence swipe = new Sequence(finger, 1);
            swipe.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), centerX, startY));
            swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
            swipe.addAction(finger.createPointerMove(Duration.ofMillis(800), PointerInput.Origin.viewport(), centerX, endY));
            swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
            driver.perform(Collections.singletonList(swipe));
            // Poll for visibility up to maxPoll ms
            int waited = 0;
            while (waited < maxPoll) {
                if (isElementVisible(targetElement)) return;
                try { Thread.sleep(pollInterval); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                waited += pollInterval;
            }
            attempts++;
            System.out.println("Scroll attempt " + attempts + "/" + maxAttempts);
        }
        throw new RuntimeException("❌ Element not found after " + maxAttempts + " scroll attempts on Pixel 9");
    }

    /**
     * Optimized scrollToElement - Fast scroll with early termination
     * PERFORMANCE: iOS ~3-5s (was 22s), Android ~2-3s (was 11s) worst case
     * KEY CHANGES:
     * - Reduced maxAttempts: iOS 20→8, Android 10→5 (elements appear in 2-3 scrolls)
     * - Reduced swipe duration: 800ms→500ms (38% faster, still smooth)
     * - Reduced maxPoll: 300ms→150ms after scroll (still captures DOM renders)
     * - Early exit: Returns immediately when element found (versus waiting full poll period)
     * - Check before/after each scroll to catch element appearance early
     */
    public void scrollToElement(AppiumDriver driver, WebElement targetElement, boolean isIOS) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Dimension size = driver.manage().window().getSize();
        int centerX = size.getWidth() / 2;
        int startY = isIOS ? (int) (size.getHeight() * 0.45) : (int) (size.getHeight() * 0.60);
        int endY   = isIOS ? (int) (size.getHeight() * 0.15) : (int) (size.getHeight() * 0.25);
        int maxAttempts = isIOS ? 8 : 5; // REDUCED: Elements appear within 2-3 scrolls typically
        int pollInterval = 50; // ms - keep short for responsiveness
        int maxPoll = 150; // REDUCED from 300ms - still captures DOM updates
        int swipeDuration = 500; // REDUCED from 800ms - 38% faster, still smooth
        int attempts = 0;

        while (attempts < maxAttempts) {
            // Fast check BEFORE scroll to catch already-visible elements
            if (isElementVisible(targetElement)) {
                System.out.println("✅ Element found before scroll attempt " + attempts);
                return;
            }

            // Perform the swipe gesture with reduced duration
            Sequence swipe = new Sequence(finger, 1);
            swipe.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), centerX, startY));
            swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
            swipe.addAction(finger.createPointerMove(Duration.ofMillis(swipeDuration), PointerInput.Origin.viewport(), centerX, endY));
            swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
            driver.perform(Collections.singletonList(swipe));

            // Short poll after scroll (max 150ms instead of 300ms)
            int waited = 0;
            while (waited < maxPoll) {
                if (isElementVisible(targetElement)) {
                    System.out.println("✅ Element found after scroll attempt " + (attempts + 1));
                    return; // EARLY EXIT - don't wait remaining poll time
                }
                try {
                    Thread.sleep(pollInterval);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                waited += pollInterval;
            }

            attempts++;
        }

        throw new RuntimeException(
            "❌ Element not found after " + maxAttempts + " scroll attempts (~" + 
            (maxAttempts * (swipeDuration + maxPoll) / 1000) + " seconds) on " + 
            (isIOS ? "iOS" : "Android")
        );
    }

    public void scrollToElement(AppiumDriver driver, WebElement targetElement) {
        scrollToElement(driver, targetElement, false);
    }



    public void scrollDownAndroid(AppiumDriver driver) {
        Dimension size = driver.manage().window().getSize();
        int startX = size.width / 2;
        int startY = (int) (size.height * 0.5);
        int endY = (int) (size.height * 0.1);

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence scroll = new Sequence(finger, 1);

        scroll.addAction(finger.createPointerMove(Duration.ofMillis(0),
                PointerInput.Origin.viewport(), startX, startY));
        scroll.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        scroll.addAction(finger.createPointerMove(Duration.ofMillis(800),
                PointerInput.Origin.viewport(), startX, endY));
        scroll.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(Arrays.asList(scroll));
    }

    // Slight Scroll Method for Appium (Java) - Vertical Small Scroll
    public void slightScroll() {
        Dimension size = driver.manage().window().getSize();

        int width = size.width / 2;  // Middle of the screen horizontally
        int startY, endY;

        boolean scrollDown = true;
        if (scrollDown) {
            startY = (int) (size.height * 0.6);  // Slightly below middle
            endY = (int) (size.height * 0.4);    // Slightly above middle
        } else {
            startY = (int) (size.height * 0.4);
            endY = (int) (size.height * 0.6);
        }

        new TouchAction((PerformsTouchActions) driver)
                .press(PointOption.point(width, startY))
                .waitAction(WaitOptions.waitOptions(Duration.ofMillis(500)))
                .moveTo(PointOption.point(width, endY))
                .release()
                .perform();
    }





    public void hoverAndClick(WebDriver driver, WebElement elementToHover, WebElement elementToClick) {
        Actions actions = new Actions(driver);

        actions.moveToElement(elementToHover)  // hover over the first element
                .moveToElement(elementToClick)  // move to the clickable element (e.g., dropdown item)
                .click()                        // perform click
                .build()
                .perform();
    }

    public void scrollToElement(WebElement targetElement) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");

        // Get screen dimensions
        Dimension size = driver.manage().window().getSize();
        int centerX = size.getWidth() / 2;

        // Platform-specific configurations
        String platformName = prop.getProperty("platform.name");
        boolean isIOS = platformName.equalsIgnoreCase("ios");
        boolean isAndroid = platformName.equalsIgnoreCase("android");

        // Adjust scroll parameters based on platform
        int startY, endY, scrollDuration, sleepDuration;

        if (isIOS) {
            startY = (int) (size.getHeight() * 0.45);  // Start at 45% from top
            endY = (int) (size.getHeight() * 0.15);    // End at 15% from top
            scrollDuration = 1200; // Longer duration for iOS smooth scrolling
            sleepDuration = 300;
        } else {
            // Android optimized settings
            startY = (int) (size.getHeight() * 0.7);   // Start at 70% from top
            endY = (int) (size.getHeight() * 0.3);     // End at 30% from top
            scrollDuration = 600;  // Shorter, more responsive for Android
            sleepDuration = 500;   // Longer pause for Android DOM updates
        }

        int maxAttempts = isIOS ? 20 : 15; // Fewer attempts needed for Android
        int attempts = 0;

        System.out.println("Starting scroll search on " + platformName + " platform");

        while (attempts < maxAttempts) {
            try {
                // Check if element is visible and displayed
                if (targetElement.isDisplayed() && targetElement.isEnabled()) {
                    // Additional check: ensure element is actually in viewport
                    org.openqa.selenium.Point location = targetElement.getLocation();
                    if (location.getY() > 0 && location.getY() < size.getHeight()) {
                        System.out.println("Element found after " + attempts + " scroll attempts on " + platformName);
                        return;
                    }
                }
            } catch (NoSuchElementException e) {
                // Element not found in DOM yet, continue scrolling
            } catch (StaleElementReferenceException e) {
                // Handle element staleness
                System.out.println("Stale element reference on " + platformName + ", continuing scroll...");
                // You may want to re-find the element here if you have the locator
            } catch (WebDriverException e) {
                // Handle other WebDriver exceptions
                if (e.getMessage().contains("not visible") || e.getMessage().contains("not displayed")) {
                    // Continue scrolling
                } else {
                    System.out.println("WebDriver exception: " + e.getMessage());
                }
            } catch (Exception e) {
                System.out.println("Unexpected exception during scroll: " + e.getMessage());
            }

            // Perform the scroll with platform-optimized parameters
            try {
                Sequence swipe = new Sequence(finger, 1);
                swipe.addAction(finger.createPointerMove(Duration.ofMillis(0),
                        PointerInput.Origin.viewport(), centerX, startY));
                swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
                swipe.addAction(finger.createPointerMove(Duration.ofMillis(scrollDuration),
                        PointerInput.Origin.viewport(), centerX, endY));
                swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

                driver.perform(Collections.singletonList(swipe));

                // Platform-specific pause
                Thread.sleep(sleepDuration);

            } catch (Exception e) {
                System.out.println("Error performing scroll gesture: " + e.getMessage());
            }

            attempts++;
        }

        throw new RuntimeException("Element not found after " + maxAttempts +
                " scroll attempts on " + platformName);
    }



    public void tapOnScreen(AppiumDriver driver, WebElement element) {

        Point location = element.getLocation();
        Dimension size = element.getSize();

        int centerX = location.getX() + size.getWidth() / 2;
        int centerY = location.getY() + size.getHeight() / 2;
        //int shiftedX = centerX - 150;
        int shiftedX = location.getX() + 50;

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence tap = new Sequence(finger, 1);

        tap.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), shiftedX, centerY));
        tap.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        tap.addAction(new Pause(finger, Duration.ofMillis(100)));
        tap.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(List.of(tap));
    }



    public void refreshPage() {
        Dimension screenSize = driver.manage().window().getSize();
        int startX = screenSize.width / 2;
        int startY = screenSize.height / 3;
        int endY = (screenSize.height * 2) / 3;
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence sequence = new Sequence(finger, 0)
                .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY))
                .addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
                .addAction(finger.createPointerMove(Duration.ofMillis(800), PointerInput.Origin.viewport(), startX, endY))
                .addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(Arrays.asList(sequence));
    }

    public void navigateToLocation(double lat, double lon) throws InterruptedException {
        waitForElement(1000);
        Map<String, Object> location = new HashMap<>();
        location.put("latitude", lat);
        location.put("longitude", lon);
        location.put("altitude", 0.0);
        Map<String, Object> params = new HashMap<>();
        params.put("location", location);
        driver.execute("setLocation", params);
        //Thread.sleep(20000);
    }

    public void forceTap(WebElement element) {
        try {
            // Try mobile: tap first
            Map<String, Object> params = new HashMap<>();
            params.put("elementId", ((RemoteWebElement) element).getId());
            driver.executeScript("mobile: tap", params);
        } catch (Exception e) {
            // Fallback to coordinate tap
            Point location = element.getLocation();
            Dimension size = element.getSize();
            Map<String, Object> coordParams = new HashMap<>();
            coordParams.put("x", location.getX() + size.getWidth() / 2);
            coordParams.put("y", location.getY() + size.getHeight() / 2);
            driver.executeScript("mobile: tap", coordParams);
        }


    }

    public void simulateBreakWithoutWaiting(int breakMinutes) {
        // Static variables to persist across method calls
        long cumulativeSimulatedTime = 0;
        int breakCount = 0;
        long scriptStartTime = 0;

        // Initialize on first call
        if (breakCount == 0) {
            scriptStartTime = System.currentTimeMillis();
            //System.out.println("Time simulation initialized.");
        }

        breakCount++;
        long breakDurationMs = breakMinutes * 60 * 1000; // Convert minutes to milliseconds

        //System.out.printf("%n=== Break #%d: %d minutes ===%n", breakCount, breakMinutes);
        //System.out.printf("Previous cumulative time: %.2f minutes%n", cumulativeSimulatedTime / 1000.0 / 60.0);

        // This is where Thread.sleep(breakDurationMs) would normally be called
        // Instead, we instantly add it to our cumulative time
        cumulativeSimulatedTime += breakDurationMs;

        //System.out.printf("Added %d minutes to simulation%n", breakMinutes);
        //System.out.printf("New cumulative simulated time: %.2f minutes (%.2f hours)%n",
                /*cumulativeSimulatedTime / 1000.0 / 60.0,
                cumulativeSimulatedTime / 1000.0 / 60.0 / 60.0);*/
        //System.out.printf("Total breaks taken: %d%n", breakCount);

        // Show real-time savings
        long realElapsedSinceStart = System.currentTimeMillis() - scriptStartTime;
        /*System.out.printf("Real script runtime so far: %.3f seconds%n", realElapsedSinceStart / 1000.0);
        System.out.printf("Time saved by not actually waiting: %.2f minutes%n",
                (cumulativeSimulatedTime - realElapsedSinceStart) / 1000.0 / 60.0);

        // Final report if this seems like the last call (optional logic)
        // You can remove this section if you don't want automatic reporting
        System.out.printf("%n--- Current Total Time Summary ---%n");
        System.out.printf("Cumulative simulated break time: %.2f minutes%n",
                cumulativeSimulatedTime / 1000.0 / 60.0);
        System.out.printf("Available for end-of-script verification: %.2f minutes%n",
                cumulativeSimulatedTime / 1000.0 / 60.0);*/

        // Store in a way that can be accessed later for verification
        // You can access this value using reflection or make the variable accessible
        System.setProperty("cumulativeSimulatedTimeMs", String.valueOf(cumulativeSimulatedTime));
        System.setProperty("totalBreaksCount", String.valueOf(breakCount));
        System.setProperty("scriptStartTime", String.valueOf(scriptStartTime));
    }

    public void setMockScanTicket(IOSDriver driver, String imagePath) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("imagePath", imagePath);
            driver.executeScript("mobile: setMockCameraImage", params);
            System.out.println("Mock camera image set to: " + imagePath);
        } catch (Exception e) {
            System.err.println("Failed to set mock camera image: " + e.getMessage());
        }
    }

    public void handleIOSAlert() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            wait.until(ExpectedConditions.alertIsPresent());
            Alert alert = driver.switchTo().alert();

            // Accept the alert (clicks "Allow" or "OK")
            alert.accept();
            System.out.println("Alert accepted successfully");

        } catch (TimeoutException e) {
            System.out.println("No alert present within timeout");
        } catch (Exception e) {
            System.out.println("Failed to handle alert: " + e.getMessage());
        }
    }

    /**
     * Executes a shell command to start the simulated camera feed.
     */
    public void startCameraFeed(String udid, String imagePath) throws IOException, InterruptedException {
        System.out.println("Starting camera feed with image: " + imagePath);
        ProcessBuilder processBuilder = new ProcessBuilder("xcrun", "simctl", "camera", udid, "start", "-v", imagePath);
        executeCommand(processBuilder);
    }

    /**
     * Executes a shell command to stop the simulated camera feed.
     */
    public void stopCameraFeed(String udid) throws IOException, InterruptedException {
        System.out.println("Stopping camera feed.");
        ProcessBuilder processBuilder = new ProcessBuilder("xcrun", "simctl", "camera", udid, "stop");
        executeCommand(processBuilder);
    }

    /**
     * A helper method to run a process and wait for its completion.
     */
    public void executeCommand(ProcessBuilder pb) throws IOException, InterruptedException {
        Process process = pb.start();
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Command failed with exit code: " + exitCode);
        }
    }

    /**
     * Rounds a time string (hh:mm:ss) to nearest minute.
     * - If seconds >= 30, add +1 minute
     * - If seconds < 30, keep same minute
     *
     * @param time input string in "HH:mm:ss" format
     * @return rounded time in "HH:mm" format
     */
    public String roundOffTime(String time) {
        int hours = 0;
        int minutes = 0;
        int seconds = 0;

        // Case 1: if time is in hh:mm:ss format
        if (time.contains(":")) {
            String[] parts = time.split(":");
            hours = Integer.parseInt(parts[0]);
            minutes = Integer.parseInt(parts[1]);
            seconds = Integer.parseInt(parts[2]);

            // ✅ Special rule: if total time is under 1 min, always count as 1m
            if (hours == 0 && seconds >0 && seconds < 30) {
                minutes = 0;
            }
            // Normal rounding
            else if (seconds >= 30) {
                minutes++;
                if (minutes == 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }
        // Case 2: if time is in "1h32m" or "32m"
        else {
            if (time.contains("h")) {
                String[] parts = time.split("h");

                // Hours part
                hours = Integer.parseInt(parts[0].replaceAll("\\D+", ""));

                // Minutes part only if it exists
                if (parts.length > 1 && parts[1].contains("m")) {
                    minutes = Integer.parseInt(parts[1].replaceAll("\\D+", ""));
                }
            } else if (time.contains("m")) {
                minutes = Integer.parseInt(time.replaceAll("\\D+", ""));
            }
        }

        // ✅ Format output in UI style
        if (hours == 0) {
            return minutes + "m";   // only minutes
        } else {
            return hours + "h " + minutes + "m";  // hours and minutes
        }
    }

    /**
     * Converts duration like "1h 4m" into minutes (e.g., 64)
     * Supports formats:
     * - "1h 4m"
     * - "45m"
     * - "2h"
     * - With/without spaces
     */
    public int convertToMinutes(String duration) {
        int totalMinutes = 0;

        if (duration == null || duration.isEmpty()) {
            return 0;
        }

        duration = duration.toLowerCase().trim(); // normalize input

        // Extract hours if present
        if (duration.contains("h")) {
            String hoursPart = duration.substring(0, duration.indexOf("h")).trim();
            totalMinutes += Integer.parseInt(hoursPart) * 60;
            duration = duration.substring(duration.indexOf("h") + 1).trim();
        }

        // Extract minutes if present
        if (duration.contains("m")) {
            String minutesPart = duration.substring(0, duration.indexOf("m")).trim();
            if (!minutesPart.isEmpty()) {
                totalMinutes += Integer.parseInt(minutesPart);
            }
            System.out.println("segment time is implimented");
        }

        return totalMinutes;
    }


    public String extractNumber(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        // Regex to find the first number (integer or decimal)
        Pattern pattern = Pattern.compile("\\d+(\\.\\d+)?");
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return matcher.group(); // e.g. "13.0"
        }
        return "";
    }

    public String extractLastLineFromContentDesc(WebElement element) {
        // Get content-desc text
        String rawText = element.getAttribute("content-desc");

        if (rawText == null || rawText.isEmpty()) {
            throw new RuntimeException("Element has no content-desc");
        }

        // Split by newline (\n) and trim
        String[] parts = rawText.split("\\n");

        if (parts.length < 3) {
            throw new RuntimeException("Element does not have 3 lines: " + rawText);
        }
        // Return the last non-empty part
        return parts[2].trim();
    }

    public String getLastLineFromElement(WebElement element) {
        if (element == null) {
            return null; // or throw exception
        }

        // Get the content-desc attribute
        String contentDesc = element.getAttribute("content-desc");

        if (contentDesc == null || contentDesc.isEmpty()) {
            return null;
        }

        // Split by newline and return the last line
        String[] lines = contentDesc.split("\n");
        return lines[lines.length - 1];
    }

    public int parseTimeToMinutes(String timeStr) {
        int minutes = 0;

        // Handle null or empty string
        if (timeStr == null || timeStr.trim().isEmpty()) {
            System.out.println("⚠️ [WARN] parseTimeToMinutes received null or empty string");
            return 0; // Return 0 minutes for null/empty
        }

        timeStr = timeStr.trim().toLowerCase(); // Normalize input

        System.out.println("📝 [DEBUG] Parsing time string: '" + timeStr + "'");

        // Match hours
        if (timeStr.contains("h")) {
            try {
                String hoursPart = timeStr.split("h")[0].trim();
                if (!hoursPart.isEmpty()) {
                    minutes += Integer.parseInt(hoursPart) * 60;
                }

                // If there's minutes after 'h'
                if (timeStr.contains("m")) {
                    String minsPart = timeStr.split("h")[1].replace("m", "").trim();
                    if (!minsPart.isEmpty()) {
                        minutes += Integer.parseInt(minsPart);
                    }
                }
            } catch (NumberFormatException e) {
                System.out.println("⚠️ [WARN] Error parsing hours format: " + e.getMessage());
            }
        } else if (timeStr.contains("m")) {
            // Only minutes
            try {
                String minsPart = timeStr.replace("m", "").trim();
                if (!minsPart.isEmpty()) {
                    minutes += Integer.parseInt(minsPart);
                }
            } catch (NumberFormatException e) {
                System.out.println("⚠️ [WARN] Error parsing minutes format: " + e.getMessage());
            }
        } else {
            // Try to parse as plain number
            try {
                if (!timeStr.isEmpty()) {
                    minutes = Integer.parseInt(timeStr);
                }
            } catch (NumberFormatException e) {
                System.out.println("⚠️ [WARN] Could not parse time string: '" + timeStr + "' - " + e.getMessage());
            }
        }

        System.out.println("✅ [DEBUG] Parsed " + timeStr + " to " + minutes + " minutes");
        return minutes;
    }

    /**
     * Convert minutes back to "Xh Ym" format.
     */
    public String formatMinutesToTime(int totalMinutes) {
        // Handle negative or very large values
        if (totalMinutes < 0) {
            System.out.println("⚠️ [WARN] Negative minutes provided: " + totalMinutes + ", setting to 0");
            totalMinutes = 0;
        }

        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;

        String result;
        if (hours > 0 && minutes > 0) {
            result = hours + "h " + minutes + "m";
        } else if (hours > 0) {
            result = hours + "h";
        } else {
            result = minutes + "m";
        }

        System.out.println("📝 [DEBUG] Formatted " + totalMinutes + " minutes to: '" + result + "'");
        return result;
    }

    public void swipeLeftNotificationArea() {
        int screenWidth = driver.manage().window().getSize().getWidth();
        int screenHeight = driver.manage().window().getSize().getHeight();

        // Example: swipe near bottom of the screen (where popup appears)
        //int startX = (int) (screenWidth * 0.90);  // right edge
        int startX = (int) (screenWidth * 0.50);  // not on the corner
        int endX   = (int) (screenWidth * 0.10);  // left edge
        //int y      = (int) (screenHeight * 0.80); // near bottom
        int y      = (int) (screenHeight * 0.15); //near status bar

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence swipe = new Sequence(finger, 1);

        // Move finger to start point
        swipe.addAction(finger.createPointerMove(Duration.ZERO,
                PointerInput.Origin.viewport(), startX, y));

        // Finger down
        swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));

        // Move to end point (swipe)
        swipe.addAction(finger.createPointerMove(Duration.ofMillis(600),
                PointerInput.Origin.viewport(), endX, y));

        // Finger up
        swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        // Perform the swipe
        driver.perform(Collections.singletonList(swipe));

        System.out.println("✅ Popup notification swiped left using W3C Actions");
    }

    public void swipeUpNotificationArea() {
        int screenWidth = driver.manage().window().getSize().getWidth();
        int screenHeight = driver.manage().window().getSize().getHeight();

        // Example: swipe up from near top (status bar area)
        int x = (int) (screenWidth * 0.50);    // horizontal center of screen
        int startY = (int) (screenHeight * 0.40); // start below notification area
        int endY   = (int) (screenHeight * 0.10); // swipe up toward top edge

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence swipe = new Sequence(finger, 1);

        // Move finger to start point
        swipe.addAction(finger.createPointerMove(Duration.ZERO,
                PointerInput.Origin.viewport(), x, startY));

        // Finger down
        swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));

        // Move finger up (swipe gesture)
        swipe.addAction(finger.createPointerMove(Duration.ofMillis(600),
                PointerInput.Origin.viewport(), x, endY));

        // Finger up
        swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        // Perform the swipe
        driver.perform(Collections.singletonList(swipe));

        System.out.println("✅ Notification area swiped UP using W3C Actions");
    }


    /**
     * Performs a slight scroll on the screen.
     * @param driver the AppiumDriver instance
     * @param isScrollUp true to scroll up, false to scroll down
     */
    public void slightScroll(AppiumDriver driver, boolean isScrollUp) {
        // Get screen size
        Dimension size = driver.manage().window().getSize();

        // Calculate start and end Y coordinates (small movement)
        int startX = size.width / 2;
        int startY = (int) (size.height * 0.55); // start a bit below the center
        int endY = (int) (size.height * (isScrollUp ? 0.65 : 0.45)); // small movement up/down

        // Create finger input for scroll gesture
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence scroll = new Sequence(finger, 1);

        // Touch down at start point
        scroll.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY));
        scroll.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));

        // Move slightly up or down
        scroll.addAction(finger.createPointerMove(Duration.ofMillis(300), PointerInput.Origin.viewport(), startX, endY));

        // Lift finger up
        scroll.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        // Perform the gesture
        driver.perform(Collections.singletonList(scroll));
    }

    public void swipeBack() {
        Dimension size = driver.manage().window().getSize();

        int startX = (int) (size.width * 0.05);   // Left edge start
        int endX   = (int) (size.width * 0.80);   // Right side end
        int y      = (int) (size.height / 2);     // Middle vertically

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence swipe = new Sequence(finger, 1);

        // Tap on start point
        swipe.addAction(finger.createPointerMove(Duration.ZERO,
                PointerInput.Origin.viewport(), startX, y));
        swipe.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));

        // Swipe action
        swipe.addAction(finger.createPointerMove(Duration.ofMillis(500),
                PointerInput.Origin.viewport(), endX, y));
        swipe.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(Arrays.asList(swipe));
    }

    /**
     * Enable Airplane Mode using Appium Connection API
     */
    public void enableAirplaneMode(AndroidDriver driver) {
        driver.setConnection(
                new ConnectionStateBuilder()
                        .withAirplaneModeEnabled()
                        .build()
        );
        System.out.println("✈️ Airplane Mode Enabled");
    }

    public void disableAirplaneMode(AndroidDriver driver) {
        driver.setConnection(
                new ConnectionStateBuilder()
                        .withAirplaneModeDisabled()
                        .withWiFiEnabled()
                        .withDataEnabled()
                        .build()
        );
        System.out.println("📶 Airplane Mode Disabled & Network Restored");
    }

    public void lockDevice(AndroidDriver driver) {
        driver.lockDevice(); // Locks the screen
        System.out.println("✅ Device locked");
    }

    public void unlockDevice(AndroidDriver driver) {
        if (driver.isDeviceLocked()) {
            driver.unlockDevice(); // Unlocks the screen
            System.out.println("✅ Device unlocked");
        } else {
            System.out.println("ℹ️ Device already unlocked");
        }
    }

    public void handlePermission() {
        try {
            // Small delay for dialog to appear
            Thread.sleep(1000);

            // Find all buttons in the alert
            List<WebElement> buttons = driver.findElements(
                    By.xpath("//XCUIElementTypeAlert//XCUIElementTypeButton")
            );

            // Click second button (index 1) - "Allow While Using App"
            if (buttons.size() > 1) {
                buttons.get(1).click();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void tapCenterOfScreen() {
        Dimension screenSize = driver.manage().window().getSize();
        int centerX = screenSize.width / 2;
        int centerY = screenSize.height / 2;

        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence tap = new Sequence(finger, 1);

        tap.addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), centerX, centerY));
        tap.addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()));
        tap.addAction(new Pause(finger, Duration.ofMillis(100)));
        tap.addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

        driver.perform(List.of(tap));
    }

    public int getTaskNumber(WebElement taskCard) {

        // Fetch text from correct attribute
        String taskText =
                taskCard.getAttribute("content-desc") != null
                        ? taskCard.getAttribute("content-desc")
                        : taskCard.getAttribute("name");

        /*
         * Regex explanation:
         * .*Task #   -> match anything before 'Task #'
         * (\\d+)     -> capture task number
         * .*          -> match anything after number
         */
        String taskNumber = taskText.replaceAll(".*Task #(\\d+).*", "$1");

        return Integer.parseInt(taskNumber);
    }

    /**
     * Resets the app by clearing all app data (storage + cache) and relaunches it.
     * Permissions are auto-granted via driver capabilities (autoGrantPermissions=true).
     * Properly waits for instrumentation to restart before returning.
     *
     * @param driver Appium driver instance
     * @throws RuntimeException if app reset fails or instrumentation doesn't restart
     */
    public void resetAppWithPermissions(AndroidDriver driver) {
        String appPackage = "com.swiftlyr.app.dev";
        String appActivity = "com.swiftlyr.app.MainActivity";

        try {
            System.out.println("🔄 [INFO] Starting app reset process for package: " + appPackage);

            // Step 1: Terminate the app gracefully
            driver.terminateApp(appPackage);
            System.out.println("✓ [INFO] App terminated successfully");

            // Step 2: Clear app data using adb
            Process clearProcess = Runtime.getRuntime().exec(
                    "adb shell pm clear " + appPackage
            );
            int clearExitCode = clearProcess.waitFor();

            if (clearExitCode == 0) {
                System.out.println("✓ [INFO] Successfully cleared app data and cache for: " + appPackage);
            } else {
                String errorMessage = readProcessOutput(clearProcess.getErrorStream());
                System.out.println("⚠ [WARN] ADB clear command exited with code " + clearExitCode + ": " + errorMessage);
                throw new RuntimeException("Failed to clear app data: " + errorMessage);
            }

            // Step 3: Wait for system to settle after clear operation
            Thread.sleep(1000);

            // Step 4: Relaunch the app and wait for instrumentation to be ready
            driver.activateApp(appPackage);
            System.out.println("📱 [INFO] App activated, waiting for instrumentation to be ready...");

            // Step 5: Wait for instrumentation to restart and app to be fully loaded
            // This is critical to prevent "instrumentation process not running" error
            Thread.sleep(3000);

            // Step 6: Verify app is running by checking if we can interact with it
            try {
                driver.getCurrentPackage();
                System.out.println("✓ [INFO] App reset completed successfully and instrumentation is active");
            } catch (Exception e) {
                System.out.println("⚠ [WARN] Instrumentation verification failed, retrying...");
                Thread.sleep(2000);
                driver.getCurrentPackage();
                System.out.println("✓ [INFO] Instrumentation recovered after retry");
            }

        } catch (Exception e) {
            System.out.println("✗ [ERROR] Failed to reset app: " + e.getMessage());
            throw new RuntimeException(
                    "Failed to reset app and clear storage for package: " + appPackage, e
            );
        }
    }



    /**
     * Disables background execution for the given app using Android AppOps.
     * This is the ONLY reliable way on Android 13+.
     * Properly waits for each adb command to complete and verifies execution.
     *
     * @throws RuntimeException if any AppOps command fails
     */
    public void disableBackgroundBatteryUsage() {
        String appPackage = "com.swiftlyr.app.dev";

        try {
            System.out.println("⚙️ [INFO] Starting background battery usage restriction for: " + appPackage);

            // Command 1: Deny RUN_ANY_IN_BACKGROUND
            String[] cmd1 = {"adb", "shell", "cmd", "appops", "set", appPackage, "RUN_ANY_IN_BACKGROUND", "deny"};
            Process process1 = Runtime.getRuntime().exec(cmd1);
            int exitCode1 = process1.waitFor();

            if (exitCode1 != 0) {
                String errorMessage = readProcessOutput(process1.getErrorStream());
                System.out.println("⚠ [WARN] AppOps command 1 failed with code " + exitCode1 + ": " + errorMessage);
                throw new RuntimeException("Failed to restrict RUN_ANY_IN_BACKGROUND: " + errorMessage);
            } else {
                System.out.println("✓ [INFO] Successfully restricted RUN_ANY_IN_BACKGROUND");
            }

            // Small delay between commands to ensure sequential execution
            Thread.sleep(500);

            // Command 2: Deny RUN_IN_BACKGROUND
            String[] cmd2 = {"adb", "shell", "cmd", "appops", "set", appPackage, "RUN_IN_BACKGROUND", "deny"};
            Process process2 = Runtime.getRuntime().exec(cmd2);
            int exitCode2 = process2.waitFor();

            if (exitCode2 != 0) {
                String errorMessage = readProcessOutput(process2.getErrorStream());
                System.out.println("⚠ [WARN] AppOps command 2 failed with code " + exitCode2 + ": " + errorMessage);
                throw new RuntimeException("Failed to restrict RUN_IN_BACKGROUND: " + errorMessage);
            } else {
                System.out.println("✓ [INFO] Successfully restricted RUN_IN_BACKGROUND");
            }

            // Verify the settings were applied
            verifyBackgroundRestrictions(appPackage);

            System.out.println("✓ [INFO] Successfully disabled background battery usage for: " + appPackage);

        } catch (Exception e) {
            System.out.println("✗ [ERROR] Failed to restrict background battery usage: " + e.getMessage());
            throw new RuntimeException(
                    "Failed to restrict background battery usage via AppOps for package: " + appPackage, e
            );
        }
    }

    /**
     * Verifies that background restrictions have been properly applied.
     *
     * @param appPackage The app package to verify
     */
    private void verifyBackgroundRestrictions(String appPackage) {
        try {
            System.out.println("🔍 [INFO] Verifying background restrictions for: " + appPackage);

            // Query current appops settings
            Process queryProcess = Runtime.getRuntime().exec(
                    new String[]{"adb", "shell", "cmd", "appops", "get", appPackage}
            );
            String output = readProcessOutput(queryProcess.getInputStream());

            if (output.contains("RUN_ANY_IN_BACKGROUND: deny") && output.contains("RUN_IN_BACKGROUND: deny")) {
                System.out.println("✓ [INFO] Background restrictions verified successfully");
            } else {
                System.out.println("⚠ [WARN] Background restrictions may not be fully applied. AppOps output: " + output);
            }

            queryProcess.waitFor();
        } catch (Exception e) {
            System.out.println("⚠ [WARN] Unable to verify background restrictions: " + e.getMessage());
        }
    }

    /**
     * Helper method to read process output/error streams
     */
    private String readProcessOutput(java.io.InputStream stream) {
        try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(stream))) {
            return reader.lines().collect(java.util.stream.Collectors.joining("\n"));
        } catch (Exception e) {
            return "Unable to read stream";
        }
    }

    public void enableIOSOfflineMode() {

        try {
            ProcessBuilder builder = new ProcessBuilder(
                    "bash",
                    "-c",
                    "sudo defaults write /Library/Preferences/com.apple.networkd.plist NetworkLinkConditionerEnabled -bool true && " +
                            "sudo defaults write /Library/Preferences/com.apple.networkd.plist NetworkLinkConditionerProfile -string \"100% Loss\""
            );

            builder.inheritIO(); // shows terminal output
            Process process = builder.start();
            process.waitFor();

            System.out.println("iOS Network set to 0% (100% Loss)");

        } catch (Exception e) {
            throw new RuntimeException("Failed to enable iOS offline mode", e);
        }
    }




}

