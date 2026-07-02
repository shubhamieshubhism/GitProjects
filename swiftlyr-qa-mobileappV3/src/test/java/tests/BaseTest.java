package tests;

import Base.AppiumServer;
import Pages.BasePage;
import Pages.JobTicketPage;
import Pages.LoginPage;
import Utils.CredentialsPropertyManager;
import Utils.DriverManager;
import Utils.PropertyManager;
import Utils.TestUtils;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.annotations.*;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import org.testng.ITestResult;

import java.io.File;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;

public class BaseTest {

    protected static PropertyManager prop;
    protected static CredentialsPropertyManager credProp;
    protected static ExtentReports extent;
    protected ExtentTest test;
    protected AppiumDriver driver;
    protected LoginPage loginPage;
    protected BasePage basePage;
    protected JobTicketPage jobTicketPage;
    protected TestUtils utils;

    protected static String reportFolderPath;
    protected static String extentReportFolderPath;
    protected static String screenshotFolderPath;

    @AndroidFindBy(uiAutomator = "new UiSelector().className(\"android.widget.ImageView\").instance(0)")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeImage")
    private WebElement menuButton;

    @AndroidFindBy(accessibility = "Logout")
    @iOSXCUITFindBy(accessibility = "Logout")
    private WebElement logOutButton;

    @BeforeSuite
    public void setupSuite() {
        prop = new PropertyManager();
        credProp = new CredentialsPropertyManager();

        initializeReporting();
        AppiumServer.start();
    }

    @BeforeClass
    public void setupClass() {
        basePage = new BasePage();
    }


    @BeforeMethod
    public void setupTest(Method method) {
//        initializeReporting();
        AppiumServer.start();
        DriverManager.initializeDriver();
        driver = DriverManager.getDriver();
        test = extent.createTest(method.getName(), "Test method " + method.getName());
        loginPage = new LoginPage(driver, test, screenshotFolderPath);
        basePage = new BasePage(driver, test, screenshotFolderPath);
        jobTicketPage=new JobTicketPage(driver,test,screenshotFolderPath);
        utils=new TestUtils(driver);

        //utils.waitForElement(30000);
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            test.log(Status.FAIL, "Test Case Failed: " + result.getName());
            test.log(Status.FAIL, result.getThrowable());
            if (driver != null && basePage != null) {
                basePage.captureAndAttachScreenshot("Test_Failure");
            }
        } else if (result.getStatus() == ITestResult.SKIP) {
            test.log(Status.SKIP, "Test Case Skipped: " + result.getName());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            test.log(Status.PASS, "Test Case Passed: " + result.getName());
        }
        if (driver != null) {
            if (jobTicketPage != null && jobTicketPage.isHeaderLinkJobIdPresent()) {
                try {
                    System.out.println("🧾 headerLinkJobId detected — submitting timecard...");
                    jobTicketPage.submitTimecard();
                    System.out.println("✓ Timecard submitted in tearDown");
                } catch (Exception e) {
                    System.out.println("⚠️ Timecard submission in tearDown failed: " + e.getMessage());
                }
            }
            try {
                System.out.println("🔁 Attempting to log out...");
                menuButton.click();

                WebElement logout = driver.findElement(By.id("com.example:id/logout_button"));
                logout.click();

                System.out.println("✅ Successfully logged out.");
            } catch (Exception e) {
                System.out.println("⚠️ Logout failed or already logged out: " + e.getMessage());
            }

            driver.quit();
        }
    }

    @AfterSuite
    public void tearDownSuite() {
        if (extent != null) {
            extent.flush();
        }
        AppiumServer.stop();
    }

    private void initializeReporting() {
        Date now = new Date();
        SimpleDateFormat folderDateFormat = new SimpleDateFormat("yyyyMMdd-HHmmss");
        String folderTimestamp = folderDateFormat.format(now);

        reportFolderPath = "target/Report " + folderTimestamp;
        extentReportFolderPath = reportFolderPath + "/ExtentReport";
        screenshotFolderPath = reportFolderPath + "/screenshots";

        File reportDir = new File(reportFolderPath);
        File extentReportDir = new File(extentReportFolderPath);
        File screenshotDir = new File(screenshotFolderPath);

        if (!reportDir.exists()) reportDir.mkdirs();
        if (!extentReportDir.exists()) extentReportDir.mkdirs();
        if (!screenshotDir.exists()) screenshotDir.mkdirs();

        String reportFilePath = extentReportFolderPath + "/ExtentReport.html";
        ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportFilePath);

        sparkReporter.config().setDocumentTitle("Appium Automation Report");
        sparkReporter.config().setReportName("Mobile Test Automation Results");
        sparkReporter.config().setTheme(Theme.STANDARD);

        extent = new ExtentReports();
        extent.attachReporter(sparkReporter);

        extent.setSystemInfo("OS", System.getProperty("os.name"));
        extent.setSystemInfo("Java Version", System.getProperty("java.version"));
        extent.setSystemInfo("Appium Version", "2.0.0");
        extent.setSystemInfo("Report Generated", folderTimestamp);
    }

    protected void logStep(String stepName) {
        test.log(Status.INFO, "Step: " + stepName);
    }
}