package Pages;

import Utils.TestUtils;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.MediaEntityBuilder;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.support.PageFactory;

import java.io.File;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.Date;

public class BasePage {

    protected AppiumDriver driver;
    protected TestUtils testUtils;
    protected ExtentTest test;
    private String screenshotFolderPath;

    public BasePage(AppiumDriver driver, ExtentTest test, String screenshotFolderPath) {
        this.driver = driver;
        this.test = test;
        this.screenshotFolderPath = screenshotFolderPath;

        if (driver != null) {
            PageFactory.initElements(new AppiumFieldDecorator(this.driver, Duration.ofSeconds(20)), this);
            this.testUtils = new TestUtils(driver);
        }
    }

    public BasePage() {
    }

    public void captureAndAttachScreenshot(String screenshotName) {
        try {
            if (driver == null) {
                System.out.println("Cannot capture screenshot: driver is null");
                if (test != null) {
                    test.warning("Cannot capture screenshot: driver is null");
                }
                return;
            }

            if (screenshotFolderPath == null || screenshotFolderPath.isEmpty()) {
                System.out.println("Screenshot folder path is not set");
                if (test != null) {
                    test.warning("Screenshot folder path is not set");
                }
                return;
            }

            File screenshotDir = new File(screenshotFolderPath);
            if (!screenshotDir.exists()) {
                screenshotDir.mkdirs();
            }

            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String fileName = screenshotName + "_" + timestamp + ".png";
            String filePath = screenshotFolderPath + "/" + fileName;

            // Capture screenshot with debug logging
            System.out.println("Capturing screenshot to: " + filePath);
            File screenshotFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            FileUtils.copyFile(screenshotFile, new File(filePath));
            System.out.println("Screenshot saved successfully");

            // Attach screenshot to extent report using relative path
            if (test != null) {
                test.info("Screenshot captured: " + screenshotName,
                        MediaEntityBuilder.createScreenCaptureFromPath("../screenshots/" + fileName).build());
            }
        } catch (Exception e) {
            System.out.println("Failed to capture screenshot: " + e.getMessage());
            e.printStackTrace();
            if (test != null) {
                test.warning("Failed to capture screenshot: " + e.getMessage());
            }
        }
    }

    public void performStep(String stepName, Runnable stepAction) {
        if (test != null) {
            test.info("Starting step: " + stepName);
        }

        try {
            stepAction.run();
            if (test != null) {
                test.pass("Step completed: " + stepName);
            }
        } catch (Exception e) {
            if (test != null) {
                test.fail("Step failed: " + stepName + " - " + e.getMessage());
            }
            captureAndAttachScreenshot("Failed_" + stepName.replaceAll("\\s+", "_"));
            throw e;
        }
    }
}