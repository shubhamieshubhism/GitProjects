package tests;

import io.appium.java_client.android.AndroidDriver;
import io.restassured.http.ContentType;
import org.testng.annotations.Test;

import java.io.IOException;

import static io.restassured.RestAssured.given;

public class DriverTest extends BaseTest{
    /*
    * Driver arrives on time
    * */
    @Test
    public void driverArrivesOnTime() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(1000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives Early
     * */
    @Test
    public void driverArrivesEarly() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        utils.waitForElement(1000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives late
     * */
    @Test
    public void driverArrivesAfterTime() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(120000);
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
    * Driver arrives at load on time
    * And take a downtime break
    * */
    @Test
    public void driverArrivesOnTimeOnLoadWithDownTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(1000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at load Early
     * And take a downtime break
     * */
    @Test
    public void driverArrivesEarlyOnLoadWithDownTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at load late
     * And take a downtime break
     * */
    @Test
    public void driverArrivesAfterOnLoadWithDownTime() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(120000);
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at unload on time
     * And take a downtime break
     * */
    @Test
    public void driverArrivesOnTimeOnUnloadWithDownTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(30000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at unload early
     * And take a downtime break
     * */
    @Test
    public void driverArrivesEarlyOnUnloadWithDownTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(30000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at unload late
     * And take a downtime break
     * */
    @Test
    public void driverArrivesAfterOnUnloadWithDownTime() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(120000);
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at load on time
     * And take a wait time break
     * */
    @Test
    public void driverArrivesOnTimeOnLoadWithWaitTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at load early
     * And take a wait time break
     * */
    @Test
    public void driverArrivesEarlyOnLoadWithWaitTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        utils.waitForElement(10000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at load late
     * And take a wait time break
     * */
    @Test
    public void driverArrivesAfterOnLoadWithWatTime() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(120000);
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at unload on time
     * And take a wait time break
     * */
    @Test
    public void driverArrivesOnTimeOnUnloadWithWaitTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(30000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at unload early
     * And take a wait time break
     * */
    @Test
    public void driverArrivesEarlyOnUnloadWithWaitTimeBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(30000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at unload late
     * And take a wait time break
     * */
    @Test
    public void driverArrivesAfterOnUnloadWithWaitTime() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(120000);
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
    * Driver arrives at Load on time and take a wait time break
    * then driver go to the dump site and unload
    * After that driver takes a downtime break
    * Finally driver ends the day*/
    @Test
    public void driverArrivesOnTimeBreaksAtLoadAndUnload() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(5000);
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(5000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(2000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(30000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(65000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(3000);
        //jobTicketPage.endWorkdayMethods_SubmitTimecard();
        jobTicketPage.endWorkDayMethod();
        jobTicketPage.submitTimecardMethod();
    }

    /*
     * Driver arrives at Load early and take a wait time break
     * then driver go to the dump site and unload
     * After that driver takes a downtime break
     * Finally driver ends the day*/
    @Test
    public void driverArrivesEarlyBreaksAtLoadAndUnload() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        utils.waitForElement(5000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(2000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(60000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(3000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    /*
     * Driver arrives at Load on time and take a wait time break
     * then driver go to the dump site and unload
     * After that driver takes a downtime break
     * Finally driver ends the day*/
    @Test
    public void driverArrivesLateBreaksAtLoadAndUnload() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(120000);
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(5000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(2000);
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(60000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(10000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(3000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }


    @Test
    public void driverFlowWithScanTicketAndroid() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        //jobTicketPage.scanTicketAndroid();
        utils.waitForElement(60000);
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(20000);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    @Test
    public void breakVerification() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobWithScaleTicketON();
        //jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(5000);
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(65000);

        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(65000);

        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(5000);
        jobTicketPage.endWorkDayMethod();
        jobTicketPage.submitTimecardMethod();
        //start time verification is not done yet need to focus on that later
    }

    /*
    * For this test we need the dispatch where scale ticket toggle is true
    * Automation scripts for driver flow for resolving anomlies for scan ticket : Android
    * https://swiftlyr.atlassian.net/browse/SCRUM-1803
    * */
    @Test
    public void scanTicketAnomalyTest() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobWithScaleTicketON();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(5000);
        jobTicketPage.addBreakAtDownTime();
        //utils.waitForElement(65000);
        jobTicketPage.DownTimeBreak();

        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(2000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(5000);
        jobTicketPage.endWorkDayMethodForScanTicket();
    }

    /*
    * Start timer button visibility
    * When the driver arrives before 30 min
    * Automation script for Time : 30 mins-driver reaches early
    * https://swiftlyr.atlassian.net/browse/SCRUM-1678
     */
    @Test
    public void driverArrivesBefore30MinBreaksAtLoadAndUnload() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriver();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(5000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(2000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.travelToDumpSite();
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(3000);
        //jobTicketPage.endWorkdayMethods_SubmitTimecard();
        /*jobTicketPage.endWorkDayMethod();
        jobTicketPage.submitTimecardMethod();*/
        jobTicketPage.endWorkDayMethodForScanTicket();
        jobTicketPage.verifyNoActiveJobIsDisplayed();
    }

    @Test
    public void driverEndToEndFlow() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOn();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        jobTicketPage.scanTicketAndroid();
        //1st trip
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        //utils.waitForMinutes(9);
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(2000);
        //2nd trip
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        //utils.waitForMinutes(9);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(2000);
        //downtime break
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //utils.waitForMinutes(9);
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //wait time break
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.endWorkDayMethodForScanTicket();
        jobTicketPage.verifyNoActiveJobIsDisplayed();

    }

    @Test
    public void driverEndToEndFlowWithAirplaneModeOn() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOn();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(4000);
        //1st trip
        utils.enableAirplaneMode((AndroidDriver) driver);
        utils.waitForElement(4000);
        //utils.lockDevice((AndroidDriver) driver);
        //((AndroidDriver) driver).openNotifications();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        utils.waitForMinutes(22);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //((AndroidDriver) driver).openNotifications();
        //utils.unlockDevice((AndroidDriver) driver);
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(2000);
        utils.waitForElement(4000);
        //2nd trip
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        //utils.waitForMinutes(9);
        jobTicketPage.travelToDumpSite();
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        utils.disableAirplaneMode((AndroidDriver) driver);
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(6000);
        //downtime break
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(35000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //utils.waitForMinutes(9);
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //wait time break
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.endWorkDayMethodForScanTicket();
        jobTicketPage.verifyNoActiveJobIsDisplayed();
    }

    @Test
    public void driverEndToEndFlowWithAirplaneModeOnTA() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOn();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(4000);
        //1st trip
        //utils.enableAirplaneMode((AndroidDriver) driver);
        utils.waitForElement(4000);
        //utils.lockDevice((AndroidDriver) driver);
        //((AndroidDriver) driver).openNotifications();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        //utils.waitForMinutes(22);
        jobTicketPage.travelToDumpSite();
        //now the driver have reached to the unloading site

        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //((AndroidDriver) driver).openNotifications();
        //utils.unlockDevice((AndroidDriver) driver);
        utils.waitForElement(2000);
        //jobTicketPage.travellingToStartDestination();

        jobTicketPage.scanTicketAndroid();
        //driver have reached to the loading site

        utils.waitForElement(2000);
        utils.waitForElement(4000);
        //2nd trip
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        //utils.waitForMinutes(9);
        jobTicketPage.travelToDumpSite();
        //driver have reached to the unloading site

        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();

        utils.waitForElement(2000);
        //utils.disableAirplaneMode((AndroidDriver) driver);
        //jobTicketPage.travellingToStartDestination();

        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(2000);
        jobTicketPage.scanTicketAndroid();

        //driver have reached to the loading site

        utils.waitForElement(6000);
        //downtime break
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(35000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //utils.waitForMinutes(9);
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //wait time break
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.endWorkDayMethodForScanTicket();
        jobTicketPage.verifyNoActiveJobIsDisplayed();
    }

    @Test
    public void timeAnomalyTest() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOnTA();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.travellingToStartDestinationTA();
        jobTicketPage.startTimeButton();
        //jobTicketPage.scanTicketAndroid();

        jobTicketPage.travelFromStartToDumpTA();
        utils.waitForElement(4000);

        utils.waitForMinutes(6);

        jobTicketPage.travelToDumpSiteTA();

        jobTicketPage.endWorkDayMethodForScanTicketTA();
        jobTicketPage.verifyNoActiveJobIsDisplayed();

    }

    @Test
    public void driverEndToEndFlowAlreadyInsideGeoFence() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOn();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        //jobTicketPage.travellingToStartDestination();
        jobTicketPage.startTimeButton();
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(4000);
        //1st trip
        //utils.enableAirplaneMode((AndroidDriver) driver);
        utils.waitForElement(4000);
        //utils.lockDevice((AndroidDriver) driver);
        //((AndroidDriver) driver).openNotifications();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        //utils.waitForMinutes(22);
        jobTicketPage.travelToDumpSite();
        //now the driver have reached to the unloading site

        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //((AndroidDriver) driver).openNotifications();
        //utils.unlockDevice((AndroidDriver) driver);
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        //driver have reached to the loading site

        utils.waitForElement(2000);
        utils.waitForElement(4000);
        //2nd trip
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        //utils.waitForMinutes(9);
        jobTicketPage.travelToDumpSite();
        //driver have reached to the unloading site

        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        //utils.disableAirplaneMode((AndroidDriver) driver);
        jobTicketPage.travellingToStartDestination();
        //driver have reached to the loading site

        utils.waitForElement(6000);
        //downtime break
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(35000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //utils.waitForMinutes(9);
        utils.waitForElement(2000);
        jobTicketPage.travelDropOffToPickUp();
        //wait time break
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.endWorkDayMethodForScanTicket();
        jobTicketPage.verifyNoActiveJobIsDisplayed();
    }

    @Test
    public void permissionPage(){
        loginPage.logInToApp();
    }

    @Test
    public void validateMaterialQuantity() throws InterruptedException, IOException {

        //login and start the job
        loginPage.logInToApp();
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOn();
        jobTicketPage.startJobAndCompletePreTripInspection();

        //Entering near and then into the geofence
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();

        //As driver is already inside the geofence and he arrives early

        jobTicketPage.startTimeButton();
        jobTicketPage.scanTicketAndroid();
        utils.waitForElement(4000);

        //Travelling form staring destination to the dumpsite
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //driver have reached to the unloading site

        //The driver is travelling back to the pickup location
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.scanTicketAndroid();
        //driver have reached to the loading site

        //Travelling form staring destination to the dumpsite
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //driver have reached to the unloading site

        //The driver is travelling back to the pickup location
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.scanTicketAndroid();
        //driver have reached to the loading site

        //downtime break
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(35000);
        jobTicketPage.DownTimeBreak();
        jobTicketPage.getDownTimeWait();
        jobTicketPage.clickOnResumeTime();

        //Travelling form staring destination to the dumpsite
        jobTicketPage.travelFromStartToDump();
        utils.waitForElement(2000);
        jobTicketPage.travelToDumpSite();
        //driver have reached to the unloading site

        //wait time break
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.WaitTimeBreak();
        jobTicketPage.getWaitTimeWait();
        jobTicketPage.clickOnResumeTime();

        //The driver is travelling back to the pickup location
        jobTicketPage.travelDropOffToPickUp();
        utils.waitForElement(2000);
        jobTicketPage.travellingToStartDestination();
        jobTicketPage.scanTicketAndroid();
        //driver have reached to the loading site

        //The driver is closing the day
        jobTicketPage.endWorkDayMethodForScanTicket();
        jobTicketPage.verifyNoActiveJobIsDisplayed();

    }







}

