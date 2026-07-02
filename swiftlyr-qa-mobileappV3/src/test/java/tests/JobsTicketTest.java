package tests;

import java.io.IOException;

import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import io.appium.java_client.android.AndroidDriver;

public class JobsTicketTest extends BaseTest {


    @Test()
    public void assignJobToDriver() throws InterruptedException {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress("jaya.kanthale@techverito.com");
        loginPage.enterPassword("Pass123!");
        loginPage.clickOnSignInWithEmailButton();
        loginPage.verifyJobsIsVisible();
        jobTicketPage.declineTheListOfAvailableJobs();
        jobTicketPage.createAuthorizationToken();
        jobTicketPage.createDispatch();
        jobTicketPage.acceptTheJob();
        jobTicketPage.verifyAcceptJobConfirmationPopup();
        jobTicketPage.closeTheConfirmationPopup();
        jobTicketPage.clickOnPreTripInspectionButton();
        jobTicketPage.enterMileage();
        jobTicketPage.clickOnSelectOnCheckBoxButton();
        jobTicketPage.clickOnCompletePreTripInspectionButton();
    }


    @Test
    public void assignJobToDriver_driverAcceptedJob() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress("jaya.kanthale@techverito.com");
        loginPage.enterPassword("Pass123!");
        loginPage.clickOnSignInWithEmailButton();
        loginPage.verifyJobsIsVisible();
        jobTicketPage.createAuthorizationToken();
        jobTicketPage.createDispatch();
        jobTicketPage.acceptTheJob();
    }

    @Test
    public void assignJobToDriver_driverDeclineJob() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress("jaya.kanthale@techverito.com");
        loginPage.enterPassword("Pass123!");
        loginPage.clickOnSignInWithEmailButton();
        loginPage.verifyJobsIsVisible();
        jobTicketPage.createAuthorizationToken();
        jobTicketPage.createDispatch();
        jobTicketPage.declineTheJob();
    }

    @Test
    public void assignJobToDriver_driverAcceptedJob_thenDecline() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress("jaya.kanthale@techverito.com");
        loginPage.enterPassword("Pass123!");
        loginPage.clickOnSignInWithEmailButton();
        loginPage.verifyJobsIsVisible();
        jobTicketPage.createAuthorizationToken();
        jobTicketPage.createDispatch();
        jobTicketPage.acceptTheJob();
        jobTicketPage.declineTheJob();
//        jobTicketPage.verifyConfirmationMessageForDecline();
        jobTicketPage.enterTheDeclineReason();
        jobTicketPage.verifyConfirmDeclineButtonEnabled();
        jobTicketPage.clickOnConfirmDeclineButton();
        jobTicketPage.verifyDeclineJobConfirmationPopup();
        jobTicketPage.verifyDeclineDispatchStatus();
    }

    @Test
    public void assignJobToDriver_driverAcceptedJob_completePreTripInspectionProcess_proceedTillTask5() {
        loginPage.loginSteps();
        loginPage.checkJobIsVisible();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startNewJob_Till_StartTimer();
        jobTicketPage.verifyCompletedTask4Message();
        jobTicketPage.verifyInformationOfTask5Screen();
        jobTicketPage.clickOnScanTicketButton();
    }

    @Test  //Break added at DownTime
    public void assignJobToDriver_driverAcceptedJob_completePreTripInspectionProcess_proceedTillTask5_EndWorkDay() {
        loginPage.loginSteps();
//        loginPage.checkJobIsVisible();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startNewJob_Till_StartTimer();
        jobTicketPage.addBreakAtDownTime();
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    @Test
    public void add_Break_At_WaitTime_SubmitTimeCard_EndWorkday() {
        loginPage.loginSteps();
        loginPage.checkJobIsVisible();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startNewJob_Till_StartTimer();
        jobTicketPage.addBreakATWaitTime();
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    @Test
    public void endToEndDriverFlow() {
        loginPage.loginSteps();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
//        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.testDriveIntoGeofence();
        jobTicketPage.verifyStartTimerTaskIsTrigger();
//        jobTicketPage.verifyWhenDriverLeaveThePickUpLocationGeofenceTravelToDestinationStart();
//        jobTicketPage.verifyWhenDriverEnterIntoTheDropOffLocationUnloadTaskStart();
    }

    @Test
    public void driverEndToEndHappyFlow() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        // Start time, loaded segment. t : loaded
        jobTicketPage.trips(3);
        jobTicketPage.endWorkdayMethods_SubmitTimecard();
    }

    @Test
    public void driverEndToEndFlowWithWait() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.travellingToStartDestination();
        utils.waitForElement(10000);
        jobTicketPage.travelFromStartToDump();
        jobTicketPage.addBreakAtDownTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        utils.waitForElement(60000);
        jobTicketPage.addBreakATWaitTime();
        utils.waitForElement(60000);
        jobTicketPage.clickOnResumeTime();
        jobTicketPage.travelToDumpSite();
        jobTicketPage.endWorkdayMethods_SubmitTimecard();


    }

    @Test
    public void driverEndToEndFlowWithAnomalyAndBreak() throws InterruptedException {
        loginPage.logInToApp();
        jobTicketPage.acceptNewDispatchJob();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterNearGeofenceAndVerifyTask2Trigger();
        jobTicketPage.trips(5);
        //jobTicketPage.endWorkdayMethods_SubmitTimecard();

    }

    @Test
    @Parameters({"username", "password"})
    public void refactoringAutomation(String username, String password) throws InterruptedException, IOException {
        loginPage.logInToApp(credProp.getProperty(username), credProp.getProperty(password));
        jobTicketPage.outSideGeofenceBPLRCFirstStep();
        jobTicketPage.acceptNewDispatchForBanerPashnLinkRoad();
        jobTicketPage.outSideGeofenceBPLRCFirstStep();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.enterBanerPashanLinkRoadCorner();
        //jobTicketPage.clickOnStartTimerButton();
        jobTicketPage.clickOnLoadDetailsButton();
        jobTicketPage.scanTicketAndroidScaleTicketOn();
        jobTicketPage.outSideGeofenceBPLRC();
        jobTicketPage.enterBanerPashanLinkRoadCornerPointB();
        jobTicketPage.takeDownTimeWait(1);
        //jobTicketPage.clickOnLoadDetailsButton();
        //jobTicketPage.scanTicketAndroidScaleTicketOn();
        jobTicketPage.outSideGeofenceBPLRC();
        jobTicketPage.enterBanerRoadPointB();
        jobTicketPage.takeWaitTimeWait(1);
        jobTicketPage.clickOnLoadDetailsButton();
        jobTicketPage.scanTicketAndroidScaleTicketOn();
        jobTicketPage.outSideGeofenceBPLRC();
        jobTicketPage.enterBanerRoadProject();
        //jobTicketPage.clickOnLoadDetailsButton();
        //jobTicketPage.scanTicketAndroidScaleTicketOn();
        jobTicketPage.getTaskNumberHistory();
        jobTicketPage.endWorkDayMethodForScanTicket();
    }

    @Test
    public void testScenarios() throws InterruptedException, IOException {
        loginPage.logInToApp();
        jobTicketPage.outSideGeofenceBPLRCFirstStep();
        jobTicketPage.acceptNewDispatchForBanerPashnLinkRoad();
        jobTicketPage.outSideGeofenceBPLRCFirstStep();
        jobTicketPage.startJobAndCompletePreTripInspection();
        jobTicketPage.oneJobIteration();
        //utils.enableAirplaneMode((AndroidDriver)driver);
        utils.waitForElement(5000);
        //jobTicketPage.oneJobIteration();
        //utils.disableAirplaneMode((AndroidDriver)driver);
        //utils.waitForElement(5000);
        jobTicketPage.getTaskNumberHistory();
        jobTicketPage.endWorkDayMethodForScanTicket();
    }

    @Test
    @Parameters({"username", "password"})
    public void offlineScenarios(String username, String password) throws InterruptedException, IOException {
        loginPage.logInToApp(credProp.getProperty(username), credProp.getProperty(password));
        jobTicketPage.outSideGeofenceBPLRCFirstStep();
        jobTicketPage.acceptNewDispatchForBanerPashnLinkRoad();
        jobTicketPage.outSideGeofenceBPLRCFirstStep();
        jobTicketPage.startJobAndCompletePreTripInspection();
        utils.waitForElement(5000);
        utils.enableAirplaneMode((AndroidDriver)driver);

        jobTicketPage.oneJobIteration();
        utils.disableAirplaneMode((AndroidDriver)driver);
        //jobTicketPage.waitForSyncingDataLoaderToDisappear();
        utils.waitForElement(5000);
        jobTicketPage.getTaskNumberHistory();
        jobTicketPage.endWorkDayMethodForScanTicket();
    }


    @Test
    public void offlineScenarioForIos(){
        loginPage.logInToApp();
        jobTicketPage.enableAirplaneModeIOS();
    }

    @Test
    public void testing(){
        loginPage.logInToApp();
        jobTicketPage.submitTimecard();

    }

}
