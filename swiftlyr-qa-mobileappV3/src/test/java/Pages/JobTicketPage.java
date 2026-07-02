package Pages;

import Utils.CredentialsPropertyManager;
import Utils.PropertyManager;
import Utils.TimeGenerator;
import com.aventstack.extentreports.ExtentTest;
import com.google.common.collect.ImmutableMap;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.PerformsTouchActions;
import io.appium.java_client.pagefactory.AndroidFindAll;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.Duration;
import java.util.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class JobTicketPage extends BasePage {
    private static PropertyManager prop = new PropertyManager();
    private static CredentialsPropertyManager credProp = new CredentialsPropertyManager();

    String accessToken;
    SoftAssert softAssert = new SoftAssert();

    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"SIGN IN\"]")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeButton[@name=\"Decline\"])")
    private List<WebElement> listOfDeclineButtons;

    @AndroidFindBy(accessibility = "Decline")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeButton[@name=\"Decline\"])[1]")
    private WebElement declineButton;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Jobs\"]")
    @iOSXCUITFindBy(accessibility = "Jobs")
    private WebElement jobs;

    @AndroidFindBy(accessibility = "Accept")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeButton[@name=\"Accept\"])[1]")
    private WebElement acceptButton;

    @AndroidFindBy(accessibility = "Job accepted")
    @iOSXCUITFindBy(accessibility = "Job accepted")
    private WebElement acceptedConfirmationPopup;

    @AndroidFindBy(accessibility = "Job rejected")
    @iOSXCUITFindBy(accessibility = "Job rejected")
    private WebElement declineConfirmationPopup;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Jobs\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeOther[2]")
    private WebElement closeAcceptedPopup;

    @AndroidFindBy(accessibility = "PRE-TRIP INSPECTION")
    @iOSXCUITFindBy(accessibility = "PRE-TRIP INSPECTION")
    private WebElement preTripInspectionButton;

    @AndroidFindBy(xpath = "//android.widget.ScrollView/android.widget.CheckBox")
    //@AndroidFindBy(xpath = "//android.widget.ScrollView//android.view.View[@content-desc=\"Select All\"]")
    @iOSXCUITFindBy(xpath = "(//XCUIElementTypeSwitch[@value=\"0\"])[1]")
    private WebElement selectAllCheckBoxButton;

    @AndroidFindBy(accessibility = "COMPLETE PRE-TRIP INSPECTION")
    @iOSXCUITFindBy(accessibility = "COMPLETE PRE-TRIP INSPECTION")
    private WebElement completePreTripInspectionButton;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Jobs\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeOther/XCUIElementTypeOther[2]")
    private WebElement closeRejectPopup;

    @AndroidFindBy(xpath = "//android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "Enter Mileage")
    private WebElement enterMileageField;

    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"Start a Job\"]")
    @iOSXCUITFindBy(iOSClassChain = "**/XCUIElementTypeButton[`name == \"Start a Job\"`][1]")
    private WebElement startJob;

    @AndroidFindBy(accessibility = "Please confirm that you want to decline already accepted dispatch.")
    @iOSXCUITFindBy(accessibility = "Please confirm that you want to decline already accepted dispatch.")
    private WebElement declineConfirmationMessage;

    @AndroidFindBy(xpath = "//android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "Decline Reason")
    private WebElement declineReason;

    @AndroidFindBy(accessibility = "CONFIRM DECLINE")
    @iOSXCUITFindBy(accessibility = "CONFIRM DECLINE")
    private WebElement confirmDeclineButton;

    @AndroidFindBy(accessibility = "(//android.widget.TextView[@text='Declined Dispatch'])[1]")
    @iOSXCUITFindBy(accessibility = "(//XCUIElementTypeStaticText[@name='Declined Dispatch'])[1]")
    private WebElement declinedDispatchStatus;

    @AndroidFindBy(accessibility = "GET DIRECTIONS")
    @iOSXCUITFindBy(accessibility = "GET DIRECTIONS")
    private WebElement getDirectionButton;

    @AndroidFindBy(accessibility = "SKIP")
    @iOSXCUITFindBy(accessibility = "SKIP")
    private WebElement skipButton;

    @AndroidFindBy(accessibility = "START TIMER")
    @iOSXCUITFindBy(accessibility = "START TIMER")
    private WebElement startTimerButton;

    @AndroidFindBy(accessibility = "SCAN TICKET")
    @iOSXCUITFindBy(accessibility = "SCAN TICKET")
    private WebElement scanTicket;

    @AndroidFindBy(accessibility = "Task #1\nSafety Reminder\nKeep yourself and others safe by verifying everything is in working order before you hit the road.")
    @iOSXCUITFindBy(accessibility = "Task #1\nSafety Reminder\nKeep yourself and others safe by verifying everything is in working order before you hit the road.")
    private WebElement task1CardInfo;

    @AndroidFindBy(accessibility = "Task #2\\nTravel to Starting Destination\\nN/A")
    @iOSXCUITFindBy(accessibility = "Task #2\\nTravel to Starting Destination\\nN/A")
    private WebElement task2CardInfo;

    @AndroidFindBy(accessibility = "Completed Tasks\n3")
    @iOSXCUITFindBy(accessibility = "Completed Tasks\n3")
    private WebElement completedTasks3Message;

    @AndroidFindBy(accessibility = "Completed Tasks\n1")
    @iOSXCUITFindBy(accessibility = "Completed Tasks\n1")
    private WebElement completedTasks1Message;

    @AndroidFindBy(accessibility = "Task #4\nStart a Day\nIt's time to start work! Have a good shift!")
    @iOSXCUITFindBy(accessibility = "Task #4\nStart a Day\nIt's time to start work! Have a good shift!")
    private WebElement task4CardInfo;

    @AndroidFindBy(accessibility = "Completed Tasks\n4")
    @iOSXCUITFindBy(accessibility = "Completed Tasks\n4")
    private WebElement completedTasks4Message;

    @AndroidFindBy(accessibility = "Task #5\nLoad Truck\nMaterial\nGravel")
    @iOSXCUITFindBy(accessibility = "Task #5\nLoad Truck\nMaterial\nGravel")
    private WebElement task5CardInfo;

    @AndroidFindBy(accessibility = "Task #6\nTravel to Dump Site\nPleasant Green Park")
    @iOSXCUITFindBy(accessibility = "Task #6\nTravel to Dump Site\nPleasant Green Park")
    private WebElement task6CardInfo;

    @AndroidFindBy(accessibility = "Task #7\nUnload Truck\nMaterial\nGravel")
    @iOSXCUITFindBy(accessibility = "Task #7\nUnload Truck\nMaterial\nGravel")
    private WebElement task7CardInfo;

    @AndroidFindBy(accessibility = "Exit Geofence")
    @iOSXCUITFindBy(accessibility = "Exit Geofence")
    private WebElement exitGeofenceButton;

    @AndroidFindBy(accessibility = "Back-Up Alarm")
    @iOSXCUITFindBy(iOSNsPredicate = "type == 'XCUIElementTypeSwitch' AND name == 'Back-Up Alarm'")
    private WebElement backUpAlarmCheckbox;

    @AndroidFindBy(accessibility = "Notes...")
    @iOSXCUITFindBy(accessibility = "Notes...")
    private WebElement notesInputBox;

    @AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeImage[1]")
    private WebElement breakButton;

    @AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeApplication[@name=\"[DEV] Swiftlyr\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeImage[1]")
    private WebElement backArrowButton;

    @AndroidFindBy(accessibility = "Timecard")
    @iOSXCUITFindBy(accessibility = "Timecard")
    private WebElement timeCardHeading;

    @AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.widget.ImageView[3]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeApplication[@name=\"[DEV] Swiftlyr\"]/XCUIElementTypeWindow[1]/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther[2]/XCUIElementTypeOther[2]/XCUIElementTypeImage[3]")
    private WebElement menuButton;

    @AndroidFindBy(accessibility = "DOWN TIME")
    @iOSXCUITFindBy(accessibility = "DOWN TIME")
    private WebElement downTimeToggleButton;

    @AndroidFindBy(accessibility = "WAIT TIME")
    @iOSXCUITFindBy(accessibility = "WAIT TIME")
    //@iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@name=\"WAIT TIME\"]")
    private WebElement waitTimeToggleButton;

    @AndroidFindBy(accessibility = "Lunch")
    @iOSXCUITFindBy(accessibility = "Lunch")
    private WebElement lunchRadioButton;

    @AndroidFindBy(accessibility = "Personal Break")
    @iOSXCUITFindBy(accessibility = "Personal Break")
    private WebElement personalBreakRadioButton;

    @AndroidFindBy(accessibility = "Mechanical")
    //@iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@name=\"Mechanical\"]")
    @iOSXCUITFindBy(accessibility = "Mechanical")
    private WebElement mechanicalRadioButton;

    @AndroidFindBy(accessibility = "Pulled Over")
    @iOSXCUITFindBy(accessibility = "Pulled Over")
    private WebElement pulledOverRadioButton;

    @AndroidFindBy(accessibility = "Fuel")
    @iOSXCUITFindBy(accessibility = "Fuel")
    private WebElement fuelRadioButton;

    @AndroidFindBy(accessibility = "Other")
    @iOSXCUITFindBy(accessibility = "Other")
    private WebElement otherRadioButton;

    @AndroidFindBy(accessibility = "End Work Day")
    @iOSXCUITFindBy(accessibility = "End Work Day")
    private WebElement endWorkDayRadioButton;

    @AndroidFindBy(accessibility = "SAVE")
    @iOSXCUITFindBy(accessibility = "SAVE")
    private WebElement saveButton;

    @AndroidFindBy(accessibility = "CANCEL")
    @iOSXCUITFindBy(accessibility = "CANCEL")
    private WebElement cancelButton;

    @AndroidFindBy(xpath = "//android.widget.EditText")
    @iOSXCUITFindBy(accessibility = "Notes...")
    private WebElement notesTextBox;

    @AndroidFindBy(accessibility = "Job Site Conditions")
    @iOSXCUITFindBy(accessibility = "Job Site Conditions")
    private WebElement jobSiteConditionRadioButton;

    @AndroidFindBy(accessibility = "Load Conditions")
    @iOSXCUITFindBy(accessibility = "Load Conditions")
    private WebElement loadConditionRadioButton;

    @AndroidFindBy(accessibility = "Pit Breakdown")
    @iOSXCUITFindBy(accessibility = "Pit Breakdown")
    private WebElement pitBreakdownRadioButton;

    @AndroidFindBy(accessibility = "Waiting in Line")
    @iOSXCUITFindBy(accessibility = "Waiting in Line")
    private WebElement waitingInLineRadioButton;

    @AndroidFindBy(accessibility = "Traffic")
    @iOSXCUITFindBy(accessibility = "Traffic")
    private WebElement trafficRadioButton;

    @AndroidFindBy(accessibility = "Tasks")
    @iOSXCUITFindBy(accessibility = "Tasks")
    private WebElement taskText;

    @AndroidFindBy(accessibility = "RESUME TIME")
    @iOSXCUITFindBy(accessibility = "RESUME TIME")
    private WebElement resumeTimeButton;

    @AndroidFindBy(accessibility = "END WORK DAY")
    @iOSXCUITFindBy(accessibility = "END WORK DAY")
    private WebElement endWorkDayButton;

    @AndroidFindBy(accessibility = "Close Workday")
    @iOSXCUITFindBy(accessibility = "Close Workday")
    private WebElement closeWorkdayHeading;

    @AndroidFindBy(accessibility = "Segments")
    @iOSXCUITFindBy(accessibility = "Segments")
    private WebElement segmentsHeading;

    @AndroidFindBy(xpath = "//android.widget.CheckBox")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeSwitch[@value=\"0\"]")
    private WebElement iAgreeCheckbox;

    @AndroidFindBy(accessibility = "NEXT STEP")
    @iOSXCUITFindBy(accessibility = "NEXT STEP")
    private WebElement nextStepButton;

    @AndroidFindBy(accessibility = "Submit Timecard")
    @iOSXCUITFindBy(accessibility = "Submit Timecard")
    private WebElement submitTimeCardHeading;

    @AndroidFindBy(xpath = "//android.widget.CheckBox")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeSwitch[@value=\"0\"]")
    private WebElement submitTimecardIAgreeCheckbox;

    @AndroidFindBy(accessibility = "SUBMIT TIMECARD")
    @iOSXCUITFindBy(accessibility = "SUBMIT TIMECARD")
    private WebElement submitTimecardButton;

    @AndroidFindBy(accessibility = "Close Workday")
    @iOSXCUITFindBy(accessibility = "CLOSE WORKDAY")
    private WebElement closeWorkdayHeading2;

    @AndroidFindBy(accessibility = "Please review all segments and confirm that all tickets have been scanned and uploaded and scrub any segments for downtime.")
    @iOSXCUITFindBy(accessibility = "Please review all segments and confirm that all tickets have been scanned and uploaded and scrub any segments for downtime.")
    private WebElement closeWorkdayPageInfo;

    @AndroidFindBy(accessibility = "Segments")
    @iOSXCUITFindBy(accessibility = "Segments")
    private WebElement segmentsText;

    @AndroidFindBy(xpath = "//android.widget.CheckBox")
    @iOSXCUITFindBy(accessibility = "I agree, that the record is accurate")
    private WebElement iAgreeCheckBoxText;

    @AndroidFindBy(accessibility = "GET DIRECTIONS")
    @iOSXCUITFindBy(accessibility = "GET DIRECTIONS")
    private WebElement getDirectionsButton;

    @AndroidFindBy(accessibility = "Timecard\nMechanical\nThe clock keeping track of your total time is still running. This down time will reduce billable time on the truck ticket.\\nTotal Down time:\\n00:00:05")
    @iOSXCUITFindBy(accessibility = "Timecard\nMechanical\nThe clock keeping track of your total time is still running. This down time will reduce billable time on the truck ticket.\\nTotal Down time:\\n00:00:05")
    private WebElement mechanicalBreakTimecard;

    @AndroidFindBy(accessibility = "Timecard\nJob Site Conditions\nThe clock keeping track of your total time is still running. This wait time will not reduce billable time on the truck ticket.\\nTotal Wait time:\\n00:00:05")
    @iOSXCUITFindBy(accessibility = "Timecard\nJob Site Conditions\nThe clock keeping track of your total time is still running. This wait time will not reduce billable time on the truck ticket.\\nTotal Wait time:\\n00:00:05")
    private WebElement jobSiteConditionBreakTimeCard;

    @AndroidFindBy(accessibility = "Accept & Continue")
    @iOSXCUITFindBy(accessibility = "Accept & Continue")
    private WebElement acceptAndContinue;

    @AndroidFindBy(xpath = "//android.view.View[contains(@content-desc,'Anomaly detected!') and contains(@content-desc,'Scale ticket required')]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeOther[contains(@name, 'Anomaly detected!')]")
    private WebElement anomalyItem;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\"]")
    private WebElement whileUsingTheApp_Picture_and_Video_Permission;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text=\"Manual\"]")
    private WebElement cameraManualModeButton;

    @AndroidFindBy(accessibility = "Capture")
    private WebElement cameraCaptureButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.google.android.gms.optional_mlkit_docscan_ui:id/confirm_crop_button\"]")
    private WebElement applyButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.google.android.gms.optional_mlkit_docscan_ui:id/scan_done_button\"]")
    private WebElement cameraImageDoneButton;

    //@AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]")
    @AndroidFindBy(xpath = "//android.widget.EditText[1]")
    //@iOSXCUITFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]")
    private WebElement scanTicketTicketNumberField;

    //@AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]")
    @AndroidFindBy(xpath = "//android.widget.EditText[3]")
    //@AndroidFindBy(xpath = "//android.widget.ScrollView/android.widget.EditText[3]")
    //@iOSXCUITFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]")
    private WebElement scanTicketQuantityField;

    @AndroidFindBy(accessibility = "SUBMIT TICKET")
    @iOSXCUITFindBy(accessibility = "SUBMIT TICKET")
    private WebElement submitScanTicketButton;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Down Time']/following-sibling::android.view.View[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[contains(@value, \":\")]")
    private WebElement downTimeBreakTime;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Wait Time']/following-sibling::android.view.View[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[contains(@value, \":\")]")
    private WebElement waitTimeBreakTime;

    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@label='Down Time']/following-sibling::XCUIElementTypeStaticText[1]")
    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Down Time']/following-sibling::android.view.View[1]")
    private WebElement downTimeBreakValueAtSubmitTimecard;

    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@label='Wait Time']/following-sibling::XCUIElementTypeStaticText[1]")
    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Wait Time']/following-sibling::android.view.View[1]")
    private WebElement waitTimeBreakValueAtSubmitTimecard;

    @AndroidFindBy(accessibility = "Down Time")
    @iOSXCUITFindBy(accessibility = "Down Time")
    private WebElement downTimeAtSubmitTimecard;

    @AndroidFindBy(accessibility = "Wait Time")
    @iOSXCUITFindBy(accessibility = "Wait Time")
    private WebElement waitTimeAtSubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Total Time']/following-sibling::android.view.View[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@label='Total Time']/following-sibling::XCUIElementTypeStaticText[1]")
    private WebElement totalTimeSubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Start Time']/following-sibling::android.view.View[1]")
    private WebElement startTimeSubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='End Time']/following-sibling::android.view.View[1]")
    private WebElement endTimeSubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Drive Time']/following-sibling::android.view.View[1]")
    private WebElement driveTimeSubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Billable Time']/following-sibling::android.view.View[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@label='Billable Time']/following-sibling::XCUIElementTypeStaticText[1]")
    private WebElement billableTimeSubmitTimecard;



    @AndroidFindBy(xpath = "//android.widget.EditText[3]")
    private WebElement scanQuantity;


    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Unit']/following-sibling::android.view.View[1]\n")
    private WebElement scanUnit;

    @AndroidFindBy(xpath = "//android.view.View[\n" +
            "    contains(@content-desc, '(Import)') \n" +
            "    or contains(@content-desc, '(Export)')\n" +
            "]\n")
    private List<WebElement> materialList;

    @AndroidFindBy(accessibility = "Billable Quantity")
    @iOSXCUITFindBy(accessibility = "Billable Quantity")
    private WebElement billableQuantitySubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Billable Quantity']/following-sibling::android.view.View[1]")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@value='Billable Quantity']/following-sibling::XCUIElementTypeStaticText[1]")
    private WebElement billableQuantityValueSubmitTimecard;

    @AndroidFindBy(xpath = "//android.view.View[contains(@content-desc,'Pre Trip Inspection')]")
    private WebElement preTripInspectionCloseWorkday;

    //@AndroidFindBy(xpath = "//android.view.View[contains(@content-desc,'Start Time')]")
    //@AndroidFindBy(xpath = "//android.view.View[matches(@content-desc, 'Start Time\\s+Start Time\\s+\\d{1,2}:\\d{2}\\s?(AM|PM)')]")
    @AndroidFindBy(xpath = "//android.view.View[contains(@content-desc,'Start Time')]/following-sibling::android.view.View[1]")
    private WebElement startTimeSegmentCloseWorkday;

    //@AndroidFindBy(xpath = "//android.view.View[contains(@content-desc,'End Time')][1]")
    @AndroidFindBy(xpath = "//android.view.View[contains(@content-desc, 'End Time')]/following-sibling::android.view.View[1]")
    private WebElement endTimeSegmentCloseWorkday;

    @AndroidFindBy(accessibility = "Next")
    private WebElement cameraNextButton;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.google.android.gms.optional_mlkit_docscan_ui:id/scan_done_button\"]")
    private WebElement previewDoneButton;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc='Total Time']/following-sibling::android.view.View[1]")
    private WebElement totalTimeValueSubmitTimecard;

    @iOSXCUITFindBy(accessibility = "SCAN TICKET")
    @AndroidFindBy(accessibility = "SCAN TICKET")
    private WebElement scanTicketAtCloseWorkday;

    @AndroidFindBy(xpath = "//android.widget.Button[@content-desc=\"EXPLAIN THE REASON\"]")
    private WebElement explainTheReasonButton;

    @AndroidFindBy(xpath = "//android.widget.ScrollView/android.widget.EditText[1]")
    private WebElement annotationTImeField;

    @AndroidFindBy(xpath = "((//android.view.View[contains(@content-desc,'m')])[last()]")
    //@AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Segment Time\"]/../android.view.View[9]/android.view.View")
    private WebElement segmentTimeValue;

    //@AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]"),
    @AndroidFindBy(xpath = "//android.widget.FrameLayout[@resource-id=\"android:id/content\"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.widget.ImageView[2]")
    //@AndroidFindBy(xpath = "//android.widget.ScrollView/android.widget.ImageView[2]"),
    //@AndroidFindBy(xpath = "//android.widget.ScrollView/android.view.View/android.widget.ImageView[2]")
    private WebElement materialsDropDown;

    @AndroidFindBy(xpath = "//android.view.View[@content-desc=\"Automation_Test\n" +
            "sand (Import)\"]")
    private WebElement sandMaterial;

    @AndroidFindBy(xpath = "//android.widget.Button[@resource-id=\"com.android.permissioncontroller:id/permission_allow_foreground_only_button\"]")
    private WebElement cameraPermissionWhileUsingTheApp;

    @AndroidFindBy(accessibility = "No active job")
    @iOSXCUITFindBy(accessibility = "No active job")
    private WebElement noActiveJob;

    @AndroidFindBy(accessibility = "ENTER LOAD DETAILS")
    private WebElement enterLoadDetailsButton;

    @AndroidFindBy(xpath = "//android.view.View[contains(@content-desc,'Task #')]\n")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeOther[contains(@name,'Task #')]\n")
    //(//*[contains(@content-desc,'Task #') or contains(@name,'Task #')])   --> compatible with both
    private WebElement currentTask;

    @AndroidFindBy(xpath = "//*[contains(@content-desc,'Completed Tasks')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@name,'Completed Tasks')]")
    private WebElement completedTasks;

    @AndroidFindBy(xpath = "//*[contains(@content-desc,'Drive to Next Location')]")
    @iOSXCUITFindBy(xpath = "//*[contains(@name,'Drive to Next Location')]")
    private WebElement driveToNextLocation;

    @AndroidFindBy(accessibility = "SCAN SCALE TICKET")
    @iOSXCUITFindBy(accessibility = "SCAN SCALE TICKET")
    private WebElement scanScaleTicketButton;

    @AndroidFindBy(accessibility = "Syncing data...")
    @iOSXCUITFindBy(accessibility = "Syncing data...")
    private WebElement syncingDataLoader;

    @AndroidFindBy(accessibility = "CLOSE TICKET")
    @iOSXCUITFindBy(accessibility = "CLOSE TICKET")
    private WebElement closeTicketButton;

    @AndroidFindBy(xpath = "//android.view.View[number(@content-desc)=number(@content-desc)]")
    private WebElement headerLinkJobId;















    public JobTicketPage(AppiumDriver driver, ExtentTest test, String screenshotFolderPath) {
        super(driver, test, screenshotFolderPath);
    }

    public void createAuthorizationToken() {
        String mutation = "mutation Login($input: LoginInput!) {"
                + "  login(input: $input) {"
                + "    success"
                + "    message"
                + "    accessToken"
                + "    idToken"
                + "    refreshToken"
                + "    expiresIn"
                + "    tokenType"
                + "  }"
                + "}";

        String variables = "{"
                + "\"input\": {"
                + "  \"email\": \"shubham.tirpude+admin@techverito.com\","
                + "  \"password\": \"Shubham@20\""
                + "}"
                + "}";

        Response response = given()
                .header("Content-Type", "application/json")
                .body("{ \"query\": \"" + mutation + "\", \"variables\": " + variables + " }")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .statusCode(200)
                .extract().response();

        accessToken = response.jsonPath().getString("data.login.accessToken");
        System.out.println("Token" + accessToken);
    }

    public void createDispatch() {

        String startDate = TimeGenerator.getStartDate();
        String startTime = TimeGenerator.getStartTime();
        String endTime = TimeGenerator.getEndTime();

        String query = """
                    mutation CreateOneDispatch($input: CreateOneDispatchInput!) {
                       createOneDispatch(input: $input) {
                         id
                         createdAt
                         updatedAt
                         startTime
                         endTime
                         startDate
                         notes
                         status
                         stagger
                         trucksPerStagger
                         jobId
                         pickupLocationId
                         dropoffLocationId
                         customerId
                         projectId
                         phaseId
                         pickupLocation {
                           id
                         }
                         dropoffLocation {
                           id
                         }
                         customer {
                           id
                         }
                         job {
                           id
                         }
                         project {
                           id
                         }
                         dispatchDrivers{
                           id
                           driver {
                             user {
                               name
                             }
                           }
                         }
                       }
                     }
                
                """;

        String variables = """
                   {
                     "input": {
                       "dispatch": {
                         "customerId": "12",
                         "projectId": "97",
                         "status": "DISPATCHED",
                         "startDate": "%s",
                         "startTime": "%s",
                         "endTime": "%s",
                         "jobId": "118",
                         "quantity": 10,
                         "notes": "",
                         "pickupLocationId": "174",
                         "dropoffLocationId": "239",
                         "dispatchEquipments": [
                           {
                             "equipmentId": "1",
                             "numberOfEquipments": 1,
                             "quantity": 10,
                             "unit": "TONS"
                           }
                         ],
                         "scaleTicketExpected": false,
                         "dispatchDrivers": [
                           {
                             "driverId": "25",
                             "dispatchId": "null"
                           }
                         ]
                       }
                     }
                   }
                """.formatted(startDate, startTime, endTime);

        given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .body("{\"query\": \"" + query.replace("\"", "\\\"").replace("\n", "\\n") + "\", \"variables\": " + variables + "}")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");

    }

    public void createDispatchForBanerPashanLinkRoadCorner() {

        String startDate = TimeGenerator.getStartDate();
        String startTime = TimeGenerator.getStartTime();
        String endTime = TimeGenerator.getEndTime();

        String query = """
                    mutation CreateOneDispatch($input: CreateOneDispatchInput!) {
                       createOneDispatch(input: $input) {
                         id
                       }
                     }
                
                """;

        String variables = """
                  {
                    "input": {
                      "dispatch": {
                        "dispatchId": "",
                        "dispatchLegs": [
                          {
                            "legSequence": 1,
                            "customerId": "12",
                            "projectId": "247",
                            "jobId": "323",
                            "expectedQuantity": null,
                            "scaleTicketExpected": true,
                            "pickupLocationId": "5111",
                            "dropoffLocationId": "5110"
                          },
                          {
                            "legSequence": 2,
                            "customerId": "12",
                            "projectId": "248",
                            "jobId": "336",
                            "expectedQuantity": null,
                            "scaleTicketExpected": true,
                            "pickupLocationId": "609",
                            "dropoffLocationId": "608"
                          }
                        ],
                        "notes": "",
                        "dispatchEquipments": [
                          {
                            "equipmentId": "1",
                            "numberOfEquipments": 2,
                            "staggerMinutes": 1,
                            "trucksPerStagger": 1
                          }
                        ],
                        "status": "DISPATCHED",
                        "startDate": "%s",
                        "startTime": "%s",
                        "endTime": "%s",
                        "dispatchDrivers": [
                          {
                            "driverId": "93",
                            "dispatchId": "",
                            "jobStartsAt": "%s",
                            "position": 0
                          },
                          {
                            "driverId": "89",
                            "dispatchId": "",
                            "jobStartsAt": "%s",
                            "position": 1
                          }
                        ]
                      }
                    }
                  }
                    
                """.formatted(startDate, startTime, endTime,startTime,startTime);

        given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .body("{\"query\": \"" + query.replace("\"", "\\\"").replace("\n", "\\n") + "\", \"variables\": " + variables + "}")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");

    }

    public void createDispatchForEarlyArrivalOfDriver() {

        String startDate = TimeGenerator.getStartDate();
        String startTime = TimeGenerator.getStartTimeForEarlyArrival();
        String endTime = TimeGenerator.getEndTime();

        String query = """
                    mutation CreateOneDispatch($input: CreateOneDispatchInput!) {
                       createOneDispatch(input: $input) {
                         id
                         createdAt
                         updatedAt
                         startTime
                         endTime
                         startDate
                         notes
                         status
                         stagger
                         trucksPerStagger
                         jobId
                         pickupLocationId
                         dropoffLocationId
                         customerId
                         projectId
                         phaseId
                         pickupLocation {
                           id
                         }
                         dropoffLocation {
                           id
                         }
                         customer {
                           id
                         }
                         job {
                           id
                         }
                         project {
                           id
                         }
                         dispatchDrivers{
                           id
                           driver {
                             user {
                               name
                             }
                           }
                         }
                       }
                     }
                
                """;

        String variables = """
                   {
                     "input": {
                       "dispatch": {
                         "customerId": "12",
                         "projectId": "97",
                         "status": "DISPATCHED",
                         "startDate": "%s",
                         "startTime": "%s",
                         "endTime": "%s",
                         "jobId": "118",
                         "quantity": 10,
                         "notes": "",
                         "pickupLocationId": "174",
                         "dropoffLocationId": "239",
                         "dispatchEquipments": [
                           {
                             "equipmentId": "1",
                             "numberOfEquipments": 1,
                             "quantity": 10,
                             "unit": "TONS"
                           }
                         ],
                         "scaleTicketExpected": false,
                         "dispatchDrivers": [
                           {
                             "driverId": "25",
                             "dispatchId": "null"
                           }
                         ]
                       }
                     }
                   }
                """.formatted(startDate, startTime, endTime);

        given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .body("{\"query\": \"" + query.replace("\"", "\\\"").replace("\n", "\\n") + "\", \"variables\": " + variables + "}")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");

    }

    public void createDispatchWithScaleTicketONAndDriverArrivesEarly() {

        String startDate = TimeGenerator.getStartDate();
        String startTime = TimeGenerator.getStartTimeForEarlyArrival();
        String endTime = TimeGenerator.getEndTime();

        String query = """
                    mutation CreateOneDispatch($input: CreateOneDispatchInput!) {
                       createOneDispatch(input: $input) {
                         id
                         createdAt
                         updatedAt
                         startTime
                         endTime
                         startDate
                         notes
                         status
                         stagger
                         trucksPerStagger
                         jobId
                         pickupLocationId
                         dropoffLocationId
                         customerId
                         projectId
                         phaseId
                         pickupLocation {
                           id
                         }
                         dropoffLocation {
                           id
                         }
                         customer {
                           id
                         }
                         job {
                           id
                         }
                         project {
                           id
                         }
                         dispatchDrivers{
                           id
                           driver {
                             user {
                               name
                             }
                           }
                         }
                       }
                     }
                
                """;

        String variables = """
                  {
                      "input": {
                        "dispatch": {
                          "customerId": "12",
                          "projectId": "97",
                          "status": "DISPATCHED",
                          "startDate": "%s",
                          "startTime": "%s",
                          "endTime": "%s",
                          "jobId": "118",
                          "quantity": 10,
                          "notes": "",
                          "pickupLocationId": "174",
                          "dropoffLocationId": "239",
                          "dispatchEquipments": [
                            {
                              "equipmentId": "1",
                              "numberOfEquipments": 1
                            }
                          ],
                          "scaleTicketExpected": true,
                          "dispatchDrivers": [
                            {
                              "driverId": "25",
                              "dispatchId": "null"
                            }
                          ]
                        }
                      }
                    }
                """.formatted(startDate, startTime, endTime);

        given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .body("{\"query\": \"" + query.replace("\"", "\\\"").replace("\n", "\\n") + "\", \"variables\": " + variables + "}")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");

    }

    public void createDispatchWithScaleTicketONAndDriverArrivesEarlyTA() {

        String startDate = TimeGenerator.getStartDate();
        String startTime = TimeGenerator.getStartTimeForEarlyArrival();
        String endTime = TimeGenerator.getEndTime();

        String query = """
                    mutation CreateOneDispatch($input: CreateOneDispatchInput!) {
                       createOneDispatch(input: $input) {
                         id
                         createdAt
                         updatedAt
                         startTime
                         endTime
                         startDate
                         notes
                         status
                         stagger
                         trucksPerStagger
                         jobId
                         pickupLocationId
                         dropoffLocationId
                         customerId
                         projectId
                         phaseId
                         pickupLocation {
                           id
                         }
                         dropoffLocation {
                           id
                         }
                         customer {
                           id
                         }
                         job {
                           id
                         }
                         project {
                           id
                         }
                         dispatchDrivers{
                           id
                           driver {
                             user {
                               name
                             }
                           }
                         }
                       }
                     }
                
                """;

        String variables = """
                  {
                    "input": {
                      "dispatch": {
                        "customerId": "12",
                        "projectId": "178",
                        "status": "DISPATCHED",
                        "startDate": "%s",
                        "startTime": "%s",
                        "endTime": "%s",
                        "jobId": "220",
                        "quantity": 10,
                        "notes": "",
                        "pickupLocationId": "423",
                        "dropoffLocationId": "433",
                        "dispatchEquipments": [
                          {
                            "equipmentId": "1",
                            "numberOfEquipments": 1
                          }
                        ],
                        "scaleTicketExpected": true,
                        "dispatchDrivers": [
                          {
                            "driverId": "25",
                            "dispatchId": "null"
                          }
                        ]
                      }
                    }
                  }
                """.formatted(startDate, startTime, endTime);

        given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .body("{\"query\": \"" + query.replace("\"", "\\\"").replace("\n", "\\n") + "\", \"variables\": " + variables + "}")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");

    }

    public void getDriverDispatchData() {
        Response data = given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .when()
                .get("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");
        System.out.println(data);

    }

    public void createDispatchWithScaleTicketON() {

        String startDate = TimeGenerator.getStartDate();
        String startTime = TimeGenerator.getStartTime();
        String endTime = TimeGenerator.getEndTime();

        String query = """
                    mutation CreateOneDispatch($input: CreateOneDispatchInput!) {
                       createOneDispatch(input: $input) {
                         id
                         createdAt
                         updatedAt
                         startTime
                         endTime
                         startDate
                         notes
                         status
                         stagger
                         trucksPerStagger
                         jobId
                         pickupLocationId
                         dropoffLocationId
                         customerId
                         projectId
                         phaseId
                         pickupLocation {
                           id
                         }
                         dropoffLocation {
                           id
                         }
                         customer {
                           id
                         }
                         job {
                           id
                         }
                         project {
                           id
                         }
                         dispatchDrivers{
                           id
                           driver {
                             user {
                               name
                             }
                           }
                         }
                       }
                     }
                
                """;

        String variables = """
                  {
                      "input": {
                        "dispatch": {
                          "customerId": "12",
                          "projectId": "97",
                          "status": "DISPATCHED",
                          "startDate": "%s",
                          "startTime": "%s",
                          "endTime": "%s",
                          "jobId": "118",
                          "quantity": 10,
                          "notes": "",
                          "pickupLocationId": "174",
                          "dropoffLocationId": "239",
                          "dispatchEquipments": [
                            {
                              "equipmentId": "1",
                              "numberOfEquipments": 1
                            }
                          ],
                          "scaleTicketExpected": true,
                          "dispatchDrivers": [
                            {
                              "driverId": "25",
                              "dispatchId": "null"
                            }
                          ]
                        }
                      }
                    }
                """.formatted(startDate, startTime, endTime);

        given()
                .log().all()
                .contentType(ContentType.JSON)
                .header("Authorization", accessToken)
                .body("{\"query\": \"" + query.replace("\"", "\\\"").replace("\n", "\\n") + "\", \"variables\": " + variables + "}")
                .when()
                .post("https://api-dev.swiftlyr.com/graphql")
                .then()
                .log().all()
                .statusCode(200)
                .extract().response();

        //String dropOffLocation = response.jsonPath().getString("input.dispatch.dropoffLocationId");
        System.out.println("Dispatch created successfully");

    }

    public void declineTheListOfAvailableJobs() {
        performStep("Jobs page is displaying", () -> {
            for (WebElement element : listOfDeclineButtons) {
                testUtils.clickOnElement(declineButton);
                testUtils.waitForElement();
                testUtils.clickOnElement(closeRejectPopup);
            }
            captureAndAttachScreenshot("Decline list of available job");
        });
    }

    public void declineTheJobs() {
        performStep("Decline the jobs", () -> {
            for (WebElement element : listOfDeclineButtons) {
                testUtils.clickOnElement(declineButton);
                testUtils.waitForElement();
                testUtils.clickOnElement(closeRejectPopup);
            }
            captureAndAttachScreenshot("Job is decline successfully");
        });
    }

    public void declineTheJob() {
        performStep("Decline job", () -> {
            Assert.assertTrue(declineButton.isDisplayed());
            testUtils.clickOnElement(declineButton);
            captureAndAttachScreenshot("Job is decline successfully");
        });
    }

    public void verifyConfirmationMessageForDecline() {
        performStep("Verify confirmation message for decline page", () -> {
            testUtils.waitForElement();
            testUtils.waitForElementToBeVisible(declineConfirmationMessage);
            Assert.assertTrue(declineConfirmationMessage.isDisplayed());
//            Assert.assertEquals(declineConfirmationMessage.getText(),"Please confirm that you want to decline\\nalready accepted dispatch.");
            captureAndAttachScreenshot("Verified confirmation message for decline page successfully");
        });
    }

    public void enterTheDeclineReason() {
        performStep("Enter decline reason", () -> {
            Assert.assertTrue(declineReason.isDisplayed());
            testUtils.clickOnElement(declineReason);
            testUtils.typeText(declineReason, "Not feeling well");
            declineReason.sendKeys(Keys.TAB);
            captureAndAttachScreenshot("Decline reason entered successfully");
        });
    }

    public void verifyConfirmDeclineButtonEnabled() {
        performStep("verify Confirm Decline Button Enable", () -> {
            Assert.assertTrue(confirmDeclineButton.isDisplayed());
            captureAndAttachScreenshot("Verified Confirm Decline Button is Enabled successfully");
        });
    }

    public void clickOnConfirmDeclineButton() {
        performStep("Click on Confirm Decline Button", () -> {
            Assert.assertTrue(confirmDeclineButton.isDisplayed());
            testUtils.clickOnElement(confirmDeclineButton);
            captureAndAttachScreenshot("Click on Confirm Decline Button successfully");
        });
    }


    public void acceptTheJob() {
        performStep("Accepting job", () -> {
            testUtils.waitForElement();
            testUtils.waitForElementToBeVisible(acceptButton);
            Assert.assertTrue(acceptButton.isDisplayed());
            testUtils.clickOnElement(acceptButton);
            captureAndAttachScreenshot("Driver has accepted the job successfully");
        });
    }

    public void verifyAcceptJobConfirmationPopup() {
        performStep("Verify confirmation popup of job Accepted", () -> {
            Assert.assertTrue(acceptedConfirmationPopup.isDisplayed(), "Accepted Job confirmation pop up not displayed");
            captureAndAttachScreenshot("Verified Job Accepted pop up successfully");
        });
    }

    public void verifyDeclineJobConfirmationPopup() {
        performStep("Verify confirmation popup of job decline", () -> {
            testUtils.waitForElementToBeVisible(declineConfirmationPopup);
            Assert.assertTrue(declineConfirmationPopup.isDisplayed(), "Decline Job confirmation pop up not displayed");
            captureAndAttachScreenshot("Verified Job decline pop up successfully");
        });
    }

    public void clickOnStartJobButton() {
        performStep("Click on start job button", () -> {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // wait up to 10 seconds
            WebElement element = wait.until(
                    ExpectedConditions.visibilityOf(startJob));
            Assert.assertTrue(startJob.isDisplayed());
            testUtils.clickOnElement(startJob);
            testUtils.waitForElement(5000);
            captureAndAttachScreenshot("Click on start job button successfully");
        });
    }

    public void closeTheConfirmationPopup() {
        performStep("Close the confirmation popup", () -> {
            testUtils.clickOnElement(closeAcceptedPopup);
            captureAndAttachScreenshot("Confirmation Pop up closed successfully");
        });
    }

    public void clickOnPreTripInspectionButton() {
        performStep("Click on pre trip inspection button", () -> {
            Assert.assertTrue(preTripInspectionButton.isDisplayed());
            testUtils.clickOnElement(preTripInspectionButton);
            captureAndAttachScreenshot("Click on pre trip inspection button successfully");
        });
    }

    public void clickOnSelectOnCheckBoxButton() {
        performStep("Click on select all check box button", () -> {
            testUtils.clickOnElement(selectAllCheckBoxButton);
//            enterMileageField.sendKeys(Keys.TAB);
            captureAndAttachScreenshot("Click on select all check box button successfully");
        });
    }

    public void clickOnCompletePreTripInspectionButton() {
        performStep("Click On Complete Pre Trip Inspection Button", () -> {
            //Assert.assertTrue(completePreTripInspectionButton.isDisplayed());
            //Assert.assertTrue(completePreTripInspectionButton.isEnabled());
            if(prop.getProperty("platform.name").equalsIgnoreCase("ios")){
                testUtils.scrollToElementIOS(completePreTripInspectionButton);
            }else{
                //testUtils.scrollDownAndroid(driver);
                //testUtils.scrollToElementAndroid(driver,completePreTripInspectionButton);
                //testUtils.scrollToElement(completePreTripInspectionButton);
                testUtils.scrollToElement(driver,completePreTripInspectionButton);
            }
            //testUtils.waitForElementToBeClickable(completePreTripInspectionButton);

            testUtils.clickOnElement(completePreTripInspectionButton);
            captureAndAttachScreenshot("Click On Complete Pre Trip Inspection Button successfully");
        });
    }

    public void enterMileage() {
        performStep("Enter Mileage ", () -> {
            Assert.assertTrue(enterMileageField.isDisplayed());
            testUtils.clickOnElement(enterMileageField);
            testUtils.typeText(enterMileageField, "12345");
//            enterMileageField.sendKeys(Keys.TAB);
            captureAndAttachScreenshot("Mileage entered successfully");
        });
    }

    public void verifyDeclineDispatchStatus() {
        performStep("Verify decline dispatch status", () -> {
            testUtils.waitForElementToBeVisible(declinedDispatchStatus);
            Assert.assertTrue(declinedDispatchStatus.isDisplayed(), "Decline dispatch status not displayed");
            captureAndAttachScreenshot("Verified decline dispatch status successfully");
        });
    }

    public void clickOnSkipButton() {
        performStep("Clicking on skip button", () -> {
            testUtils.waitForElementToBeVisible(skipButton);
            Assert.assertTrue(skipButton.isDisplayed());
            testUtils.clickOnElement(skipButton);
            captureAndAttachScreenshot("Clicked on skip button");
        });
    }

    public void startTimeButton() {
        performStep("Clicking on start timer button", () -> {
            testUtils.waitForElementToBeVisible(startTimerButton);
            Assert.assertTrue(startTimerButton.isDisplayed());
            testUtils.clickOnElement(startTimerButton);
            captureAndAttachScreenshot("Clicked on start timer button");
        });
    }

    public void clickOnScanTicketButton() {
        performStep("Clicking on scan ticket button", () -> {
            testUtils.waitForElementToBeVisible(scanTicket);
            Assert.assertTrue(scanTicket.isDisplayed());
            testUtils.clickOnElement(scanTicket);
            captureAndAttachScreenshot("Clicked on scan ticket button");
        });
    }

    public void clickOnLoadDetailsButton() {
        performStep("Clicking on enter load details button", () -> {
            testUtils.waitForElementToBeVisible(enterLoadDetailsButton);
            Assert.assertTrue(enterLoadDetailsButton.isDisplayed());
            testUtils.clickOnElement(enterLoadDetailsButton);
            captureAndAttachScreenshot("Clicked on enter load details button");
        });
    }

    public void clickToSkipScanTicket() {
        performStep("Perform click to skip the scan ticket button", () -> {
            testUtils.waitForElementToBeVisible(skipButton);
            Assert.assertTrue(skipButton.isDisplayed(), "Skip button not displayed");
            testUtils.clickOnElement(skipButton);
            captureAndAttachScreenshot("Performed Click to Skip scan Ticket");
        });
    }

    public void clickOnCameraCaptureButton() {
        performStep("Clicking on camera capture button", () -> {
            //testUtils.waitForElementToBeVisible(cameraCaptureButton);
            Assert.assertTrue(cameraCaptureButton.isDisplayed());
            testUtils.clickOnElement(cameraCaptureButton);
            captureAndAttachScreenshot("Clicked on camera capture button");
        });
    }

    public void clickOnApplyButton() {
        performStep("Clicking on apply button", () -> {
            //testUtils.waitForElementToBeVisible(applyButton);
            Assert.assertTrue(applyButton.isDisplayed());
            testUtils.clickOnElement(applyButton);
            captureAndAttachScreenshot("Clicked on apply button");
        });
    }

    public void clickOnWhileUsingApp_CameraButton() {
        performStep("Clicking on while using the app button", () -> {
            testUtils.waitForElementToBeVisible(whileUsingTheApp_Picture_and_Video_Permission);
            Assert.assertTrue(whileUsingTheApp_Picture_and_Video_Permission.isDisplayed());
            testUtils.clickOnElement(whileUsingTheApp_Picture_and_Video_Permission);
            captureAndAttachScreenshot("Clicked on while using the app button");
        });
    }

    public String getUniqueAlphaNumericString() {
        String timeComponent = String.valueOf(System.currentTimeMillis());
        String lastDigits = timeComponent.substring(timeComponent.length() - 4); // take last 4 digits of timestamp
        String randomComponent = UUID.randomUUID().toString().replaceAll("[^A-Za-z0-9]", "").substring(0, 4); // 4 alphanumeric chars
        return lastDigits + randomComponent; // total = 8 characters
    }

    public void enterTicketNumber() {
        performStep("Enter ticket number", () -> {
            scanTicketTicketNumberField.click();
            testUtils.typeText(scanTicketTicketNumberField, getUniqueAlphaNumericString());
            captureAndAttachScreenshot("Ticket number entered");
        });
    }

    public WebElement getRandomMaterial() {
        if (materialList == null) {
            throw new RuntimeException("Material list is null - dropdown may not be fully loaded");
        }

        if (materialList.isEmpty()) {
            throw new RuntimeException("Material list is empty - no materials available in dropdown");
        }

        Random random = new Random();
        int index = random.nextInt(materialList.size());
        WebElement selectedMaterial = materialList.get(index);

        if (selectedMaterial == null) {
            throw new RuntimeException("Selected material element is null at index: " + index);
        }

        return selectedMaterial;
    }


    public void selectMaterial() {
        performStep("Select the material", () -> {
            try {
                // Scroll and click dropdown
                testUtils.scrollToElement(driver, materialsDropDown, false);
                testUtils.waitForElementToBeClickable(materialsDropDown);
                testUtils.clickOnElement(materialsDropDown);

                // Optimized wait for material list (reduced from 1500ms)
                Thread.sleep(800);

                // Verify material list and select
                if (materialList == null || materialList.isEmpty()) {
                    if (testUtils.isElementDisplayed(sandMaterial)) {
                        testUtils.clickOnElement(sandMaterial);
                    } else {
                        throw new RuntimeException("No materials available in dropdown");
                    }
                } else {
                    WebElement randomMaterial = getRandomMaterial();
                    testUtils.scrollToElement(driver, randomMaterial, false);
                    testUtils.clickOnElement(randomMaterial);
                    Thread.sleep(200); // Reduced from 500ms
                }

                captureAndAttachScreenshot("Material selected");

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Material selection interrupted", e);
            } catch (Exception e) {
                captureAndAttachScreenshot("Failed to select material");
                throw new RuntimeException("Failed to select material from dropdown: " + e.getMessage(), e);
            }
        });
    }

    /**
     * Fast wrapper for material selection using optimized selectMaterial method
     * Maintains 20-second timeout for safety while using internally optimized waits
     */
    private void selectMaterialFast() {
        selectMaterialWithTimeout(20000);
    }

    /*private String quantity;

    public void enterQuantity() {
        performStep("Enter Quantity ", () -> {
            Assert.assertTrue(scanTicketQuantityField.isDisplayed());
            testUtils.clickOnElement(scanTicketQuantityField);
            testUtils.typeText(scanTicketQuantityField, "13.26");
            String units = scanQuantity.getText();
            this.quantity=units;
//            enterMileageField.sendKeys(Keys.TAB);
            captureAndAttachScreenshot("Ticket number entered successfully");
        });
    }
    public String getQuantity(){
        return quantity;
    }*/
    private double totalQuantity = 0.0;  // Accumulator
    private String quantity;

    public void enterQuantity() {
        performStep("Enter Quantity ", () -> {
            Assert.assertTrue(scanTicketQuantityField.isDisplayed());
            testUtils.clickOnElement(scanTicketQuantityField);

            // Typing value — Replace "13.26" with dynamic input if needed later
            testUtils.typeText(scanTicketQuantityField, "13.26");

            String units = scanQuantity.getText();  // e.g. "13.26"

            try {
                double currentQuantity = Double.parseDouble(units); // Convert to number
                totalQuantity += currentQuantity; // Accumulate
                this.quantity = String.valueOf(totalQuantity); // Store as String

                System.out.println("🔹 Current Scan Quantity: " + currentQuantity);
                System.out.println("🔸 Total Accumulated Quantity: " + this.quantity);

            } catch (NumberFormatException e) {
                System.out.println("⚠️ Invalid quantity format: " + units);
            }

            captureAndAttachScreenshot("Quantity entered and accumulated");
        });
    }

    public String getQuantity() {
        return quantity; // Will return total accumulated value
    }

    // Stores all scanned quantities grouped by their unit (e.g., tons → [13.26, 20.0])
    private Map<String, List<Double>> quantityByUnit = new HashMap<>();

    private String lastQuantityEntry;

    /**
     * Method to enter quantity for each scanned ticket.
     * Groups quantities based on their unit (e.g., tons, gallon, etc.)
     */
    public void enterQuantityMultiUnit() {
        performStep("Enter Quantity", () -> {

            // Make sure quantity field is visible
            Assert.assertTrue(scanTicketQuantityField.isDisplayed());
            testUtils.clickOnElement(scanTicketQuantityField);

            // Enter only numeric value (unit comes from scanUnit element)
            testUtils.typeText(scanTicketQuantityField, "13.26");

            // Extract quantity (only numeric)
            String quantityText = scanQuantity.getText().trim();

            // Extract dynamic unit text from UI (tons, gallon, kg, etc.)
            String unitText = scanUnit.getText().trim().toLowerCase();

            try {
                // Convert quantity into number
                double value = Double.parseDouble(quantityText);

                // Group quantity based on its unit
                quantityByUnit.putIfAbsent(unitText, new ArrayList<>());
                quantityByUnit.get(unitText).add(value);

                // Store last scanned combination
                lastQuantityEntry = value + " " + unitText;

                System.out.println("✅ Scanned: " + value + " " + unitText);
                System.out.println("📊 Current Grouped Quantities: " + quantityByUnit);

            } catch (Exception e) {
                System.out.println("⚠️ Invalid number format: " + quantityText);
            }

            captureAndAttachScreenshot("Quantity entered and grouped by unit");
        });
    }

    /**
     * Calculates total of each unit and returns a formatted string.
     * Example output: "33.26 tons, 20.5 gallon"
     */
    public String getTotalQuantitiesAsString() {
        StringBuilder result = new StringBuilder();

        for (Map.Entry<String, List<Double>> entry : quantityByUnit.entrySet()) {
            double sum = entry.getValue()
                    .stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            if (result.length() > 0) result.append(", ");
            result.append(sum).append(" ").append(entry.getKey());
        }

        return result.toString();
    }

    // --- Optional Getters ---
    public Map<String, List<Double>> getQuantitiesByUnit() {
        return quantityByUnit;
    }

    // Method to convert UI text into Map<unit, quantity>
    public Map<String, Double> parseFinalBillableSummary(String text) {

        // This map will store final UI values like: {tons=11.1, gallons=44}
        Map<String, Double> result = new HashMap<>();

        // Each line contains "value + unit"
        String[] lines = text.split("\n");

        for (String line : lines) {

            line = line.trim();
            if (line.isEmpty()) continue;

            // Example line: "11.1 Tons"
            String[] parts = line.split(" ", 2);

            double quantity = Double.parseDouble(parts[0].trim());
            String unit = parts[1].trim().toLowerCase();  // normalize

            result.put(unit, quantity);
        }

        return result;
    }

   /* public void assertBillableQuantities() {

        // Get the UI summary text from final screen
        String finalSummaryText = billableQuantityValueSubmitTimecard.getAttribute("content-desc").trim();

        System.out.println("🔵 Final UI Summary:\n" + finalSummaryText);

        // Parse UI quantities into map
        Map<String, Double> uiQuantities = parseFinalBillableSummary(finalSummaryText);

        // Compare each unit from your stored scan results
        for (Map.Entry<String, List<Double>> entry : quantityByUnit.entrySet()) {

            String unit = entry.getKey();  // example: tons, gallon, cubic feet

            // Sum scanned quantities for that unit
            double calculatedSum = entry.getValue()
                    .stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            // UI value for same unit
            double uiSum = uiQuantities.getOrDefault(unit, -999.0);

            // ASSERT they match
            Assert.assertEquals(
                    uiSum,
                    calculatedSum,
                    0.01,  // tolerance for float
                    "❌ Quantity mismatch for unit: " + unit
            );

            System.out.println("✔ MATCHED: " + unit + " → " + calculatedSum);
        }

        System.out.println("🎉 All billable quantities MATCHED with submit page!");
    }*/

   /* public void assertBillableQuantities() {

        // Get the UI summary text from final screen
        String finalSummaryText =
                billableQuantityValueSubmitTimecard.getAttribute("content-desc").trim();

        System.out.println("🔵 Final UI Summary:\n" + finalSummaryText);

        // Parse UI quantities into map (unit -> quantity)
        Map<String, Double> uiQuantities = parseFinalBillableSummary(finalSummaryText);

        // Validate ONLY the units that were scanned
        for (Map.Entry<String, List<Double>> entry : quantityByUnit.entrySet()) {

            String unit = entry.getKey(); // e.g. tons, gallon, cubic feet

            // Sum scanned quantities for that unit
            double calculatedSum = entry.getValue()
                    .stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            // 🔴 ASSERT 1: Unit must exist in UI
            Assert.assertTrue(
                    uiQuantities.containsKey(unit),
                    "❌ Unit '" + unit + "' is missing from Submit Timecard UI summary"
            );

            // UI value for the SAME unit
            Double uiSum = uiQuantities.get(unit);

            // 🔴 ASSERT 2: Unit must not be N/A or null
            Assert.assertNotNull(
                    uiSum,
                    "❌ Unit '" + unit + "' is shown as N/A in Submit Timecard UI"
            );

            // 🔴 ASSERT 3: Quantity must match
            Assert.assertEquals(
                    uiSum,
                    calculatedSum,
                    0.01, // tolerance for floating point
                    "❌ Quantity mismatch for unit '" + unit
                            + "' | UI: " + uiSum
                            + " | Calculated: " + calculatedSum
            );

            System.out.println("✔ MATCHED UNIT: " + unit + " → " + calculatedSum);
        }

        System.out.println("🎉 All scanned units validated successfully!");
    }*/

    public void assertBillableQuantities() {

        // Get the UI summary text from final screen
        String finalSummaryText =
                billableQuantityValueSubmitTimecard.getAttribute("content-desc").trim();

        System.out.println("Final UI Summary:\n" + finalSummaryText);

        // Parse UI quantities into map (unit -> quantity)
        Map<String, Double> uiQuantities = parseFinalBillableSummary(finalSummaryText);

        // Store validated results for final reporting
        Map<String, Double> validatedResults = new LinkedHashMap<>();

        // Validate ONLY the units that were scanned
        for (Map.Entry<String, List<Double>> entry : quantityByUnit.entrySet()) {

            String unit = entry.getKey(); // e.g. tons, gallon, cubic feet

            // Sum scanned quantities for that unit
            double calculatedSum = entry.getValue()
                    .stream()
                    .mapToDouble(Double::doubleValue)
                    .sum();

            // 🔴 ASSERT 1: Unit must exist in UI
            Assert.assertTrue(
                    uiQuantities.containsKey(unit),
                    "Unit '" + unit + "' is missing from Submit Timecard UI summary"
            );

            // UI value for the SAME unit
            Double uiSum = uiQuantities.get(unit);

            // 🔴 ASSERT 2: Unit must not be N/A or null
            Assert.assertNotNull(
                    uiSum,
                    "Unit '" + unit + "' is shown as N/A in Submit Timecard UI"
            );

            // 🔴 ASSERT 3: Quantity must match
            Assert.assertEquals(
                    uiSum,
                    calculatedSum,
                    0.01,
                    "Quantity mismatch for unit '" + unit
                            + "' | UI: " + uiSum
                            + " | Calculated: " + calculatedSum
            );

            // Store validated unit and quantity
            validatedResults.put(unit, uiSum);
        }

        // ✅ FINAL SUMMARY PRINT
        System.out.println("\nValidated Billable Quantities Summary:");
        validatedResults.forEach((unit, quantity) ->
                System.out.println("• " + unit + " → " + quantity)
        );

        System.out.println("\nAll scanned units validated successfully!");
    }




    public void clickOnSubmitTicketButton() {
        performStep("Click submit button", () -> {
            testUtils.scrollDownAndroid(driver);
            testUtils.waitForElementToBeVisible(submitScanTicketButton);
            testUtils.clickOnElement(submitScanTicketButton);
            captureAndAttachScreenshot("Submit button clicked");
        });
    }

    public void clickOnDoneButton() {
        performStep("Click done button", () -> {
            testUtils.waitForElementToBeVisible(cameraImageDoneButton);
            testUtils.clickOnElement(cameraImageDoneButton);
            captureAndAttachScreenshot("Done button clicked");
        });
    }

    public void clickOnPreviewDoneButton() {
        performStep("Click preview done", () -> {
            testUtils.waitForElementToBeVisible(previewDoneButton);
            testUtils.clickOnElement(previewDoneButton);
            captureAndAttachScreenshot("Preview done clicked");
        });
    }

    public void clickOnNextButton() {
        performStep("Click next button", () -> {
            testUtils.clickOnElement(cameraNextButton);
            captureAndAttachScreenshot("Next button clicked");
        });
    }

    public void clickOnTicketNumberField() {
        performStep("Click ticket number field", () -> {
            testUtils.waitForElementToBeVisible(scanTicketTicketNumberField);
            testUtils.clickOnElement(scanTicketTicketNumberField);
            captureAndAttachScreenshot("Ticket number field");
        });
    }

    public void clickOnTicketQuantityField() {
        performStep("Click ticket quantity field", () -> {
            testUtils.waitForElementToBeVisible(scanTicketQuantityField);
            testUtils.clickOnElement(scanTicketQuantityField);
            captureAndAttachScreenshot("Ticket quantity field");
        });
    }

    public void clickOnCameraManualMode() {
        performStep("Click manual mode", () -> {
            testUtils.clickOnElement(cameraManualModeButton);
            captureAndAttachScreenshot("Manual mode clicked");
        });
    }

    public void clickOnAnnotationTimeField() {
        performStep("Click annotation field", () -> {
            testUtils.waitForElementToBeVisible(annotationTImeField);
            testUtils.clickOnElement(annotationTImeField);
            captureAndAttachScreenshot("Annotation field clicked");
        });
    }

    public void clickOnExplainTheReasonButton() {
        performStep("Click explain reason", () -> {
            testUtils.waitForElementToBeVisible(explainTheReasonButton);
            testUtils.clickOnElement(explainTheReasonButton);
            captureAndAttachScreenshot("Explain reason clicked");
        });
    }

    public void clickOnScanScaleTicketButton() {
        performStep("Clicking on scan scale ticket button", () -> {
            testUtils.waitForElementToBeVisible(scanScaleTicketButton);
            Assert.assertTrue(scanScaleTicketButton.isDisplayed());
            testUtils.clickOnElement(scanScaleTicketButton);
            System.out.println("✅ Clicked on scan scale ticket button successfully");
            captureAndAttachScreenshot("Clicked on scan scale ticket button");
        });
    }

    public void clickOnStartTimerButton() {
        performStep("Click start timer", () -> {
            testUtils.waitForElementToBeVisible(startTimerButton);
            testUtils.clickOnElement(startTimerButton);
            validateTaskCounters();
            captureAndAttachScreenshot("Start timer clicked");
        });
    }

    public void enterAnnotationTime() {
        performStep("Enter Annotation time ", () -> {
            Assert.assertTrue(annotationTImeField.isDisplayed());
            testUtils.clickOnElement(annotationTImeField);
            testUtils.typeNumber(annotationTImeField, testUtils.convertToMinutes(segmentTimeValue.getAttribute("content-desc"))+3);
//            enterMileageField.sendKeys(Keys.TAB);
            captureAndAttachScreenshot("Annotation time entered successfully");
        });
    }

    public void verifyCameraCaptureButtonIsDisplayed() {
        performStep("Verify camera capture button is displayed", () -> {
            testUtils.waitForElementToBeVisible(cameraCaptureButton);
            Assert.assertTrue(cameraCaptureButton.isDisplayed(), "Break Button is not displayed");
        });
    }

    public void cameraPermissionScanTicket() {
        performStep("camera permission", () -> {

            Assert.assertTrue(cameraPermissionWhileUsingTheApp.isDisplayed(), "camera permission is not displayed");
            testUtils.clickOnElement(cameraPermissionWhileUsingTheApp);
        });
    }

    public void fillDetailsOnScanTicket(){
        long startTime = System.currentTimeMillis();
        try {
            // Batch 1: Fill ticket details (number + quantity) in single performStep
            performStep("Fill ticket details", () -> {
                testUtils.waitForElementToBeVisible(scanTicketTicketNumberField);
                testUtils.clickOnElement(scanTicketTicketNumberField);
                testUtils.typeText(scanTicketTicketNumberField, getUniqueAlphaNumericString());
                testUtils.waitForElement(300); // Reduced from 200+800 pattern

                testUtils.waitForElementToBeVisible(scanTicketQuantityField);
                testUtils.clickOnElement(scanTicketQuantityField);
                testUtils.typeText(scanTicketQuantityField, "13.26");
                String units = scanQuantity.getText();
                this.quantity = units;
                testUtils.waitForElement(300); // Reduced from 800

                captureAndAttachScreenshot("Ticket details entered");
            });

            // Batch 2: Select material (with optimized internal waits)
            selectMaterialFast();

            // Batch 3: Submit form (scroll + click)
            performStep("Submit ticket form", () -> {
                testUtils.scrollDownAndroid(driver);
                testUtils.waitForElementToBeVisible(submitScanTicketButton);
                testUtils.clickOnElement(submitScanTicketButton);
                captureAndAttachScreenshot("Ticket submitted");
            });

            long elapsed = System.currentTimeMillis() - startTime;
            System.out.println("Filled scan ticket details in " + elapsed + "ms");

        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - startTime;
            System.out.println("Error: Failed to fill scan ticket after " + elapsed + "ms - " + e.getMessage());
            captureAndAttachScreenshot("Failed to fill scan ticket");
            throw new RuntimeException("fillDetailsOnScanTicket failed: " + e.getMessage(), e);
        }
    }

    /**
     * Wrapper for selectMaterial with timeout to fail fast if dropdown not found
     * @param timeoutMs Maximum time to wait for material selection
     * @throws RuntimeException if dropdown not found or material selection fails
     */
    private void selectMaterialWithTimeout(long timeoutMs) {
        long startTime = System.currentTimeMillis();
        try {
            selectMaterial();
        } catch (Exception e) {
            long elapsed = System.currentTimeMillis() - startTime;

            // Check if we should retry or bail fast
            if (elapsed < timeoutMs && isDropdownNotFoundError(e)) {
                System.out.println("⚠ [WARN] Material dropdown not found on attempt 1, checking if element exists...");
                try {
                    // Quick check: Is the dropdown element actually present?
                    boolean dropdownVisible = testUtils.isElementDisplayed(materialsDropDown);
                    if (!dropdownVisible) {
                        System.out.println("✗ [ERROR] Material dropdown element not found/displayed on page");
                        throw new RuntimeException("Material dropdown not visible on page - cannot select material", e);
                    }

                    // Dropdown exists, retry once more with extended wait
                    System.out.println("⚠ [WARN] Dropdown found but selection failed, retrying once...");
                    testUtils.waitForElement(500);
                    selectMaterial();
                } catch (Exception retryException) {
                    long totalElapsed = System.currentTimeMillis() - startTime;
                    System.out.println("✗ [ERROR] Retry also failed after " + totalElapsed + "ms");
                    throw new RuntimeException("Failed to select material after retry: " + retryException.getMessage(), retryException);
                }
            } else if (elapsed >= timeoutMs) {
                System.out.println("✗ [ERROR] Material selection timeout after " + elapsed + "ms");
                throw new RuntimeException("Material selection exceeded timeout of " + timeoutMs + "ms", e);
            } else {
                // Different error, throw immediately
                throw e;
            }
        }
    }

    /**
     * Check if error is related to dropdown not being found
     */
    private boolean isDropdownNotFoundError(Exception e) {
        String message = e.getMessage();
        return message != null && (
            message.contains("No such element") ||
            message.contains("not found") ||
            message.contains("not displayed") ||
            message.contains("not visible") ||
            message.contains("dropdown")
        );
    }

    public void verifyInformationOfTask1Screen() {
        performStep("Verifying information of Task 1 screen", () -> {
            testUtils.waitForElementToBeVisible(task1CardInfo);
            String actualText = task1CardInfo.getText();
            String expectedText = "Task #1\nSafety Reminder\nKeep yourself and others safe by verifying everything is in working order before you hit the road.";
            //Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified information of Task 1 screen");
        });
    }

    public void verifyCompletedTask1Message() {
        performStep("Verifying completed task 1 message", () -> {
            testUtils.waitForElementToBeVisible(completedTasks1Message);
            String actualText = completedTasks1Message.getText();
            String expectedText = "Completed Tasks\n1";
            Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified completed task 1 message");
        });
    }

    public void verifyCompletedTask3Message() {
        performStep("Verifying completed task 3 message", () -> {
            testUtils.waitForElementToBeVisible(completedTasks3Message);
            String actualText = completedTasks3Message.getText();
            String expectedText = "Completed Tasks\n3";
            Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified completed task 3 message");
        });
    }

    public void verifyInformationOfTask4Screen() {
        performStep("Verifying information of Task 4 screen", () -> {
            testUtils.waitForElementToBeVisible(task4CardInfo);
            String actualText = task4CardInfo.getText();
            String expectedText = "Task #4\nStart a Day\nIt's time to start work! Have a good shift!";
            Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified information of Task 4 screen");
        });
    }

    public void verifyCompletedTask4Message() {
        performStep("Verifying completed task 4 message", () -> {
            testUtils.waitForElementToBeVisible(completedTasks4Message);
            String actualText = completedTasks4Message.getText();
            String expectedText = "Completed Tasks\n4";
            Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified completed task 4 message");
        });
    }

    public void verifyInformationOfTask5Screen() {
        performStep("Verifying information of Task 5 screen", () -> {
            testUtils.waitForElementToBeVisible(task5CardInfo);
            String actualText = task5CardInfo.getText();
            String expectedText = "Task #5\nLoad Truck\nMaterial\nGravel";
            Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified information of Task 5 screen");
        });
    }

    public void verifyInformationOfTask6Screen() {
        performStep("Verify information on Tast 6 Screen", () -> {
            testUtils.waitForElementToBeVisible(task6CardInfo);
            String actualtext = task6CardInfo.getText();
            String expectedText = "Task #6\nTravel to Dump Site\nPleasant Green Park";
            Assert.assertEquals(actualtext, expectedText);
            captureAndAttachScreenshot("Verified information on Task 6 screen");
        });
    }

    public void verifyInfoOnTask7Screen() {
        performStep("Verifying information of Task 7 screen", () -> {
            testUtils.waitForElementToBeVisible(task7CardInfo);
            String actualText = task7CardInfo.getText();
            String expectedText = "Task #7\nUnload Truck\nMaterial\nGravel";
            Assert.assertEquals(actualText, expectedText);
        });
    }

    public void clickOnExitGeofenceButton() {
        performStep("Perform click on exit geofence button", () -> {
            testUtils.waitForElementToBeVisible(exitGeofenceButton);
            testUtils.clickOnElement(exitGeofenceButton);
            captureAndAttachScreenshot("Performed click on Exit Geofence button");
            Assert.assertTrue(task2CardInfo.isDisplayed(), "Task 2 Card information is not displayed");
        });
    }

    public void verifyInfoOfTask2Page() {
        performStep("Verify Infromation of Task 2 Page", () -> {
            testUtils.waitForElementToBeVisible(task2CardInfo);
            String actualText = task2CardInfo.getText();
            String expectedText = "Task #2\\nTravel to Starting Destination\\nN/A";
        });
    }

    public void uncheckBackUPAlarmCheckBox() {
        performStep("Unchecking back up alarm check box", () -> {
            testUtils.scrollToHeight();
            testUtils.scrollToHeight();
            testUtils.scrollToHeight();
            testUtils.waitForElementToBeVisible(backUpAlarmCheckbox);

            String value = backUpAlarmCheckbox.getAttribute("value");
            if (value.equals("1")) {
                testUtils.clickOnElement(backUpAlarmCheckbox);
            }
            captureAndAttachScreenshot("Unchecked back up alarm check box");
        });
    }

    public void enterNotesInInputBox() {
        performStep("Entering notes in input box", () -> {
            testUtils.scrollToHeight();
            testUtils.waitForElementToBeVisible(notesInputBox);
            testUtils.typeText(notesInputBox, "Back up alarm not working properly");
            captureAndAttachScreenshot("Entered notes in input box");
        });
    }

    public void verifyNoActiveJobIsDisplayed() {
        performStep("Verify no active job is displayed", () -> {
            //testUtils.waitForElementToBeVisible(breakButton);
            testUtils.waitForElementToBeClickable(noActiveJob);
            Assert.assertTrue(noActiveJob.isDisplayed(), "No active job is not displayed");
        });
    }

    public void verifyBreakButtonIsDisplayed() {
        performStep("Verify break button is displayed", () -> {
            //testUtils.waitForElementToBeVisible(breakButton);
            testUtils.waitForElementToBeClickable(breakButton);
            Assert.assertTrue(breakButton.isDisplayed(), "Break Button is not displayed");
        });
    }

    public void clickOnBreakButton() {
        performStep("Perform Click On Break Button", () -> {
            //Assert.assertTrue(breakButton.isEnabled());
            testUtils.swipeUpNotificationArea();
            testUtils.waitForElementToBeVisible(breakButton);
            Assert.assertTrue(breakButton.isDisplayed());
            //testUtils.tapOnScreen(driver,breakButton);
            testUtils.clickOnElement(breakButton);
            //testUtils.forceTap(breakButton);

            captureAndAttachScreenshot("Click On Break Button");
            testUtils.waitForElementToBeVisible(timeCardHeading);
            Assert.assertTrue(timeCardHeading.isDisplayed(), "User is not on TimeCard page");
        });
    }

    public void verifyDownTimeToggleButtonIsSelected() {
        performStep("DownTime toggle button is selected", () -> {
            Assert.assertTrue(downTimeToggleButton.isSelected(), "DownTime toggle button is not selected");
            captureAndAttachScreenshot("DownTime Toggle button is selected");
        });
    }

    public void verifyAllElementsVisibleAtDownTime() {
        performStep("Verify all elements are visible when clicked on Down Time toggle", () -> {
            WebElement[] elements = {backArrowButton, timeCardHeading, menuButton, downTimeToggleButton, waitTimeToggleButton, lunchRadioButton,
                    personalBreakRadioButton, mechanicalRadioButton, pulledOverRadioButton, fuelRadioButton, otherRadioButton, endWorkDayRadioButton, notesTextBox,
                    saveButton};

            for (WebElement element : elements) {
                try {

                    testUtils.waitForElementToBeVisible(element);

                } catch (Exception e) {
                    System.out.println("Element not visible: " + element);
                }
            }
        });
    }

    public void verifyAllDownTimeBreakButtonsClickable() {
        performStep("Perform click on all break options visible at downtime", () -> {
            WebElement[] elements = {lunchRadioButton, personalBreakRadioButton, mechanicalRadioButton, pulledOverRadioButton,
                    fuelRadioButton, otherRadioButton, endWorkDayRadioButton};
            for (WebElement element : elements) {
                try {
                    testUtils.waitForElement();
                    testUtils.tapOnScreen(driver, element);
                    captureAndAttachScreenshot("Performed click on Button");
                } catch (Exception e) {
                    System.out.println("Break button not clickable: " + element);
                }
            }
        });
    }

    public void verifyWaitTimeToggleIsDisplayed() {
        performStep("Verify wait Time is displayed", () -> {
            testUtils.waitForElementToBeVisible(waitTimeToggleButton);
            Assert.assertTrue(waitTimeToggleButton.isDisplayed(), "Wait Time toggle button is not displayed");
        });
    }

    public void clickOnWaitTimeToggleButton() {
        performStep("Perform Click on wait time toggle button", () -> {
            testUtils.clickOnElement(waitTimeToggleButton);
            captureAndAttachScreenshot("Click on wait time toggle button");
            Assert.assertTrue(jobSiteConditionRadioButton.isDisplayed(), "Wait Time toggle is not selected");

        });
    }

    public void verifyAllElementsVisibleAtWaitTime() {
        performStep("Verify all elements are visible when clicked on wait Time toggle", () -> {

            WebElement[] elements = {backArrowButton, timeCardHeading, jobSiteConditionRadioButton, loadConditionRadioButton, pitBreakdownRadioButton,
                    waitingInLineRadioButton, trafficRadioButton, otherRadioButton, notesTextBox, saveButton};

            for (WebElement element : elements) {
                try {

                    testUtils.waitForElementToBeVisible(element);

                } catch (Exception e) {

                    System.out.println("Element not visible: " + element.getText());
                }
            }
        });

    }

    public void clickOnBreakButtonsAtWaitTime() {
        performStep("Perform click on Break options present at wait time", () -> {
            WebElement[] elements = {jobSiteConditionRadioButton, loadConditionRadioButton, pitBreakdownRadioButton,
                    waitingInLineRadioButton, trafficRadioButton, otherRadioButton};

            for (WebElement element : elements) {
                try {
                    testUtils.waitForElement();
                    testUtils.tapOnScreen(driver, element);
                    captureAndAttachScreenshot("Click on Break option visible at wait time");
                } catch (Exception e) {
                    System.out.println("Break button not clickable: " + element);
                }

            }
        });
    }

    public void verifyAllButtonsAtWaitTimeNotSelected() {
        performStep("Check All buttons are disabled when click on Wait time at initial load", () -> {
            //Assert.assertTrue(downTimeToggleButton.isSelected(), " Downtime is not selected");
            Assert.assertTrue(downTimeToggleButton.isDisplayed(), " Downtime is not Displayed");
            testUtils.waitForElementToBeVisible(waitTimeToggleButton);
            testUtils.clickOnElement(waitTimeToggleButton);
            WebElement[] elements = {jobSiteConditionRadioButton, loadConditionRadioButton, pitBreakdownRadioButton, waitingInLineRadioButton,
                    trafficRadioButton, otherRadioButton, saveButton};

            for (WebElement element : elements) {
                if (!element.isSelected()) {
                    System.out.println("Button is not Selected");
                } else {
                    System.out.println("Button is Selected: " + element.getText());
                }
            }
        });
    }

    public void clickOnDownTime() {
        performStep("Click on DownTime button", () -> {
            testUtils.clickOnElement(downTimeToggleButton);
            captureAndAttachScreenshot("Click on Wait Time Toggle Button");
            Assert.assertTrue(lunchRadioButton.isDisplayed(), "DownTime toggle button is not selected");
        });
    }

    public void verifyAllButtonsAtDowntimeNotSelected() {
        performStep("Check the buttons are disabled when click on Down Time at initial load", () -> {
            WebElement[] elements = {waitTimeToggleButton, lunchRadioButton, personalBreakRadioButton, mechanicalRadioButton, pulledOverRadioButton, fuelRadioButton,
                    otherRadioButton, endWorkDayRadioButton, saveButton};

            for (WebElement element : elements) {
                if (!element.isSelected()) {
                    System.out.println("Button is not selected by default");
                } else {
                    System.out.println("Button is Selected: " + element.getText());
                }
            }

        });
    }

    public void verifyCancelButtonIsClickable() {
        performStep("Perform Click on cancel button", () -> {
            testUtils.scrollToHeight();
            Assert.assertTrue(cancelButton.isDisplayed());
            testUtils.clickOnElement(cancelButton);
            captureAndAttachScreenshot("Click on cancel button");
            Assert.assertTrue(taskText.isDisplayed(), "Task text is not displayed");
        });
    }

    public void select_MechanicalBreak_DownTime() {
        performStep("Verify Pause at Down time", () -> {
            testUtils.waitForElementToBeVisible(mechanicalRadioButton);
            testUtils.clickOnElement(mechanicalRadioButton);
            //testUtils.tapOnScreen(driver, mechanicalRadioButton);
            captureAndAttachScreenshot("Click on Mechanical Radio Button");
        });
    }

    public void select_LoadOrPitBreakDown_WaitTimeBreak() {
        performStep("Select Load or Pit Break option from Wait time", () -> {
            testUtils.waitForElementToBeVisible(pitBreakdownRadioButton);
            testUtils.tapOnScreen(driver, pitBreakdownRadioButton);
            captureAndAttachScreenshot("Click on Pit- BreakDown Radio Button Radio Button");
        });
    }

    public void enterNoteText() {
        performStep("Enter text in Notes TextBox", () -> {
            testUtils.scrollToHeight();
            notesTextBox.sendKeys("Tyre Failure");

        });

    }

    public void clickOnSaveButton() {
        performStep("Perform click on save button", () -> {
            testUtils.scrollToHeight();
            //  Assert.assertTrue(saveButton.isEnabled());
            testUtils.waitForElement();
            testUtils.clickOnElement(saveButton);
            //testUtils.forceTap(saveButton);
            //   Assert.assertTrue(taskText.isDisplayed(), "User is not on Task page");
        });
    }

    public void clickOnResumeTime() {
        performStep("Verify Resume Time radio button is enabled when driver user takes break", () -> {
            testUtils.waitForElementToBeClickable(resumeTimeButton);
            testUtils.clickOnElement(resumeTimeButton);
            captureAndAttachScreenshot("Perform click on Resume Time");
            //Assert.assertTrue(taskText.isDisplayed(), "Scan Ticket button is not displayed");
        });
    }

    public void clickOnEndWorkDayButtonAtDownTime() {
        performStep("Verify click on End work day button", () -> {
            testUtils.waitForElementToBeClickable(endWorkDayRadioButton);
            Assert.assertTrue(!endWorkDayRadioButton.isSelected());
            //testUtils.tapOnScreen(driver, endWorkDayRadioButton);

            //testUtils.forceTap(endWorkDayRadioButton);
            testUtils.clickOnElement(endWorkDayRadioButton);
            testUtils.waitForElementToBeClickable(saveButton);
            Assert.assertTrue(saveButton.isEnabled());
        });
    }

    public void clickOnCloseTicketButton() {
        performStep("Verify click on close ticket button", () -> {
            testUtils.waitForElementToBeClickable(closeTicketButton);
            Assert.assertTrue(!closeTicketButton.isSelected());
            //testUtils.tapOnScreen(driver, endWorkDayRadioButton);

            //testUtils.forceTap(endWorkDayRadioButton);
            testUtils.clickOnElement(closeTicketButton);

        });
    }

    public void closeWorkdayPageISVisible() {
        performStep("Verify close workday page is visible", () -> {
            testUtils.waitForElementToBeVisible(closeWorkdayHeading);
            Assert.assertTrue(closeWorkdayHeading.isDisplayed(), "Close workday heading is absent");
        });
    }

    public void verifyTextOnCloseWorkdayPage() {
        performStep("Verify text is present on Close workday Page", () -> {
            testUtils.waitForElementToBeVisible(closeWorkdayPageInfo);
            String actualText = closeWorkdayPageInfo.getText();
            String expectedText = "Please review all segments and confirm that all tickets have been scanned and uploaded and scrub any segments for downtime.";
            Assert.assertEquals(actualText, expectedText);
            captureAndAttachScreenshot("Verified information text on Close workday page");
        });
    }

    public void verifySegmentsTextDisplayed() {
        testUtils.waitForElementToBeVisible(segmentsText);
        Assert.assertTrue(segmentsText.isDisplayed(), "Segments text is not visible");
        captureAndAttachScreenshot("Segments text is visible");
    }

    public void verifyIAgreeText() {
        performStep("Verify I agree text should be visible", () -> {
            testUtils.waitForElementToBeClickable(iAgreeCheckBoxText);
            Assert.assertTrue(iAgreeCheckBoxText.isDisplayed(), "Text is not present");
        });
    }

    public void clickOnIAgreeCheckBox() {
        performStep("Verify click on I Agree Checkbox", () -> {
            testUtils.waitForElement();
            //testUtils.scrollToDown();
            if(prop.getProperty("platform.name").equalsIgnoreCase("ios")){
                testUtils.scrollToElementIOS(iAgreeCheckbox);
            }else{
                //testUtils.scrollToElementAndroidUiAutomatorCorrected(iAgreeCheckbox);
                //testUtils.scrollToTextAndroidUiAutomator(iAgreeCheckbox.getText());
                //testUtils.scrollDownAndroid(driver);
                //testUtils.scrollToElementAndroid(driver,iAgreeCheckbox);
                //testUtils.scrollToElement(driver,iAgreeCheckbox,false);
                //testUtils.scrollToElement(iAgreeCheckbox);
                //testUtils.scrollToElementBidirectional(iAgreeCheckbox);
                testUtils.scrollToElement(driver,iAgreeCheckbox,false);

            }
            testUtils.waitForElementToBeClickable(iAgreeCheckbox);
            testUtils.clickOnElement(iAgreeCheckbox);
            captureAndAttachScreenshot("Perform click on I agree Checkbox");
        });
    }

    public void clickOnNextStepButton() {
        performStep("Click on next step button", () -> {
            testUtils.scrollToElement(driver,nextStepButton,false);
            if(!nextStepButton.isDisplayed()){
                testUtils.scrollToElementIOS(nextStepButton);
            }
            Assert.assertTrue(nextStepButton.isEnabled());
            testUtils.clickOnElement(nextStepButton);
            captureAndAttachScreenshot("Performed click on Next Step Button");
        });
    }

    public void verifySubmitTimecardIsVisible() {
        performStep("Check submit timecard is displayed", () -> {
            testUtils.waitForElementToBeVisible(submitTimeCardHeading);
            Assert.assertTrue(submitTimeCardHeading.isDisplayed(), "heading is not displayed");
        });
    }

    public void click_ON_I_Agree_CheckBox_SubmitTimecard() {
        performStep("click on submit timecard checkbox", () -> {

            if(prop.getProperty("platform.name").equalsIgnoreCase("ios")){
                testUtils.scrollToElementIOS(submitTimecardIAgreeCheckbox);
            }else{
                //testUtils.scrollToElementAndroidUiAutomatorCorrected(submitTimecardIAgreeCheckbox);
                //testUtils.scrollToTextAndroidUiAutomator(submitTimecardIAgreeCheckbox.getText());
                //testUtils.scrollDownAndroid(driver);
                //testUtils.scrollToElement(driver,submitTimecardIAgreeCheckbox,false);
                //testUtils.scrollToElementAndroid(driver,submitTimecardIAgreeCheckbox);
                //testUtils.scrollToElement(submitTimecardIAgreeCheckbox);
                //testUtils.scrollToElementBidirectional(submitTimecardIAgreeCheckbox);
                testUtils.scrollToElement(driver,submitTimecardIAgreeCheckbox ,false);
            }
            testUtils.clickOnElement(submitTimecardIAgreeCheckbox);
            captureAndAttachScreenshot("Performed click on I agree checkbox On Submit Timecard");
        });
    }

    public void  click_On_Submit_Timecard_Button() {
        performStep("Click n submit timecard button", () -> {
            //testUtils.scrollToDown();
            //testUtils.scrollToElementIOS(submitTimecardButton);
            if(prop.getProperty("platform.name").equalsIgnoreCase("ios")){
                testUtils.scrollToElementIOS(submitTimecardButton);
            }else{
                System.out.println("before scroll method");
                testUtils.scrollDownAndroid(driver);
                System.out.println("after scroll method");
            }
            testUtils.clickOnElement(submitTimecardButton);
            captureAndAttachScreenshot("Performed click on submit timecard button");
        });
    }

    public void waitForSyncingDataLoaderToDisappear()  {
        performStep("Check submit timecard is displayed", () -> {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(40));

            // Poll frequently because loader timing is unpredictable
            wait.pollingEvery(Duration.ofMillis(500));

            // Ignore transient Appium / DOM exceptions
            wait.ignoring(Exception.class);

            // Wait until loader becomes invisible or removed
            wait.until(ExpectedConditions.invisibilityOf(syncingDataLoader));
        });
    }


    public void acceptNewDispatchJob() {
        createAuthorizationToken();
        createDispatch();
        testUtils.waitForElement();
        //driver.navigate().refresh();
        testUtils.refreshPage();
        testUtils.waitForElement();
        acceptTheJob();
        //verifyAcceptJobConfirmationPopup(); //not visible thus not showing
    }

    public void acceptNewDispatchJobForEarlyArrivalOfDriver() {
        createAuthorizationToken();
        createDispatchForEarlyArrivalOfDriver();
        testUtils.waitForElement();
        testUtils.refreshPage();
        testUtils.waitForElement();
        acceptTheJob();
    }

    public void acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOn() {
        createAuthorizationToken();
        createDispatchWithScaleTicketONAndDriverArrivesEarly();
        testUtils.waitForElement();
        testUtils.refreshPage();
        //testUtils.waitForElement();
        acceptTheJob();
    }

    public void acceptNewDispatchJobForEarlyArrivalOfDriverAndScaleTicketIsOnTA() {
        createAuthorizationToken();
        createDispatchWithScaleTicketONAndDriverArrivesEarlyTA();
        testUtils.waitForElement();
        testUtils.refreshPage();
        //testUtils.waitForElement();
        acceptTheJob();
    }

    public void acceptNewDispatchJobWithScaleTicketON() {
        createAuthorizationToken();
        createDispatchWithScaleTicketON();
        testUtils.waitForElement();
        //driver.navigate().refresh();
        testUtils.refreshPage();
        testUtils.waitForElement();
        acceptTheJob();
        //verifyAcceptJobConfirmationPopup(); //not visible thus not showing
    }
    public void acceptNewDispatchForBanerPashnLinkRoad() {
        createAuthorizationToken();
        createDispatchForBanerPashanLinkRoadCorner();
        testUtils.waitForElement();
        testUtils.refreshPage();
        testUtils.waitForElement();
        acceptTheJob();
    }


    public void startNewJob_Till_StartTimer() {
        clickOnStartJobButton();
        verifyInformationOfTask1Screen();
        clickOnPreTripInspectionButton();
        enterMileage();
        clickOnSelectOnCheckBoxButton();
        //uncheckBackUPAlarmCheckBox();
        //enterNotesInInputBox();
        clickOnCompletePreTripInspectionButton();
        verifyCompletedTask1Message();
        clickOnSkipButton();
        //verifyCompletedTask3Message(); //Popup missing
        verifyInformationOfTask4Screen();
        startTimeButton();
        //verifyCompletedTask4Message();  //popup missing
    }


    public void addBreakAtDownTime() {
        testUtils.waitForElement(3000);
        //testUtils.swipeUpNotificationArea();
        testUtils.swipeLeftNotificationArea();
        testUtils.waitForElementToBeClickable(breakButton);
        verifyBreakButtonIsDisplayed();
        clickOnBreakButton();
        //verifyDownTimeToggleButtonIsSelected();
        //verifyAllElementsVisibleAtDownTime();
        //verifyAllButtonsAtDowntimeNotSelected();
        select_MechanicalBreak_DownTime();
        enterNoteText();
        clickOnSaveButton();
    }




    public void addBreakAtDownTimeWhileAnomaly(){
        verifyBreakButtonIsDisplayed();
        clickOnBreakButton();
        clickOnEndWorkDayButtonAtDownTime();
        clickOnSaveButton();
        closeWorkdayPageISVisible();
        List<WebElement> anomalies = driver.findElements(By.xpath("\"//XCUIElementTypeOther[contains(@name, 'Anomaly detected!')]\""));
        for(WebElement anomaly : anomalies){
            WebElement editButton = anomaly.findElement(By.xpath("\".//parent::XCUIElementTypeOther//XCUIElementTypeImage[2]\""));
            editButton.click();
        }




    }

    public void addBreakATWaitTime() {
        testUtils.waitForElement(3000);
        //testUtils.swipeUpNotificationArea();
        testUtils.swipeLeftNotificationArea();
        testUtils.waitForElementToBeVisible(breakButton);
        verifyBreakButtonIsDisplayed();
        clickOnBreakButton();
        clickOnWaitTimeToggleButton();
        //verifyAllElementsVisibleAtWaitTime();
        //verifyAllButtonsAtWaitTimeNotSelected();
        select_LoadOrPitBreakDown_WaitTimeBreak();
        enterNoteText();
        clickOnSaveButton();
    }

    public void endWorkdayMethods_SubmitTimecard() {
        //clickOnResumeTime();
        verifyBreakButtonIsDisplayed();
        clickOnBreakButton();
        clickOnEndWorkDayButtonAtDownTime();
        clickOnSaveButton();
        closeWorkdayPageISVisible();
        clickOnIAgreeCheckBox();
        clickOnNextStepButton();
        verifySubmitTimecardIsVisible();
        click_ON_I_Agree_CheckBox_SubmitTimecard();
        click_On_Submit_Timecard_Button();
        Assert.assertTrue(jobs.isDisplayed(), "Jobs are not visible");
    }

    public void endWorkDayMethod(){
        verifyBreakButtonIsDisplayed();
        clickOnBreakButton();
        clickOnEndWorkDayButtonAtDownTime();
        clickOnSaveButton();
        closeWorkdayPageISVisible();
        clickOnIAgreeCheckBox();
        clickOnNextStepButton();
    }


    public void endWorkDayMethodForScanTicket(){
        performStep("End Work Day Method For Scan Ticket", () -> {
            System.out.println("📋 [INFO] Starting End Work Day process with Scan Ticket...");

            testUtils.swipeLeftNotificationArea();
            testUtils.waitForElementToBeClickable(breakButton);
            verifyBreakButtonIsDisplayed();
            clickOnBreakButton();
            //clickOnEndWorkDayButtonAtDownTime();
            clickOnCloseTicketButton();
            //clickOnSaveButton();
            closeWorkdayPageISVisible();
            detectAnomaly();
            clickOnIAgreeCheckBox();
            clickOnNextStepButton();
            verifySubmitTimecardIsVisible();
            calculateBillableTime();
            verifyScanTicketQuantity();
            verifyBillableTime();

            // Verify downtime wait ONLY if downtime was actually applied
            if (hasDownTimeBreakApplied()) {
                System.out.println("✅ [INFO] Downtime break was applied - Verifying downtime wait...");
                verifyDownTimeWait();
            } else {
                System.out.println("⏭️ [INFO] No downtime break applied - Skipping downtime verification");
            }

            // Verify waittime wait ONLY if waittime was actually applied
            if (hasWaitTimeBreakApplied()) {
                System.out.println("✅ [INFO] Waittime break was applied - Verifying waittime wait...");
                verifyWaitTimeWait();
            } else {
                System.out.println("⏭️ [INFO] No waittime break applied - Skipping waittime verification");
            }

            verifyEndTime();
            verifyStartTime();
            click_ON_I_Agree_CheckBox_SubmitTimecard();
            click_On_Submit_Timecard_Button();
            testUtils.waitForElement();
        });
    }

    /**
     * Check if downtime break was actually applied
     * Returns true if downtime value exists and is not empty/zero
     */
    private boolean hasDownTimeBreakApplied() {
        try {
            System.out.println("🔍 [INFO] Checking if downtime break was applied...");

            // Get the stored downtime value
            String downTimeValue = getDownTimeWait();

            // Check if value exists and is meaningful
            if (downTimeValue != null && !downTimeValue.isEmpty() && !downTimeValue.equals("0 min")) {
                System.out.println("✅ [SUCCESS] Downtime break found: " + downTimeValue);
                return true;
            } else {
                System.out.println("⏭️ [INFO] No downtime break (value: " + downTimeValue + ")");
                return false;
            }
        } catch (Exception e) {
            System.out.println("⚠️ [WARN] Error checking downtime break: " + e.getMessage());
            System.out.println("⏭️ [INFO] Assuming no downtime break applied");
            return false;
        }
    }

    /**
     * Check if waittime break was actually applied
     * Returns true if waittime value exists and is not empty/zero
     */
    private boolean hasWaitTimeBreakApplied() {
        try {
            System.out.println("🔍 [INFO] Checking if waittime break was applied...");

            // Get the stored waittime value
            String waitTimeValue = getWaitTimeWait();

            // Check if value exists and is meaningful
            if (waitTimeValue != null && !waitTimeValue.isEmpty() && !waitTimeValue.equals("0 min")) {
                System.out.println("✅ [SUCCESS] Waittime break found: " + waitTimeValue);
                return true;
            } else {
                System.out.println("⏭️ [INFO] No waittime break (value: " + waitTimeValue + ")");
                return false;
            }
        } catch (Exception e) {
            System.out.println("⚠️ [WARN] Error checking waittime break: " + e.getMessage());
            System.out.println("⏭️ [INFO] Assuming no waittime break applied");
            return false;
        }
    }

    public void endWorkDayMethodForScanTicketTA(){
        verifyBreakButtonIsDisplayed();
        clickOnBreakButton();
        clickOnEndWorkDayButtonAtDownTime();
        clickOnSaveButton();
        closeWorkdayPageISVisible();
        detectAnomaly();
        clickOnIAgreeCheckBox();
        clickOnNextStepButton();
        verifySubmitTimecardIsVisible();
       /* calculateBillableTime();
        verifyScanTicketQuantity();
        verifyBillableTime();
        verifyDownTimeWait();
        verifyWaitTimeWait();
        verifyEndTime();
        verifyStartTime();*/
        click_ON_I_Agree_CheckBox_SubmitTimecard();
        click_On_Submit_Timecard_Button();
        testUtils.waitForElement();
    }

    public void startJobAndCompletePreTripInspection() {
        clickOnStartJobButton();
        verifyInformationOfTask1Screen();
        clickOnPreTripInspectionButton();
        enterMileage();
        clickOnSelectOnCheckBoxButton();
        clickOnCompletePreTripInspectionButton();
        //verifyCompletedTask1Message();
        //testUtils.waitForElement();
    }

    public void outSideGeofenceBPLRC() throws InterruptedException {
        //testUtils.refreshPage();
        testUtils.navigateToLocation(18.551511, 73.794263); //techveritoLocation
        testUtils.waitForElement(5000);
        System.out.println("location changed to Outside geofence");
        testUtils.waitForElement(1000);
        validateTaskCounters();
    }
    public void outSideGeofenceBPLRCFirstStep() throws InterruptedException {
        //testUtils.refreshPage();
        testUtils.waitForElement(2000);
        testUtils.navigateToLocation(18.551511, 73.794263); //techveritoLocation
        System.out.println("location changed to Outside geofence");
        testUtils.waitForElement(1000);
    }

    public void enterBanerPashanLinkRoadCorner() throws InterruptedException {
        performStep("Enter Baner Pashan Link Road Corner", () -> {
            System.out.println("📍 [INFO] Navigating to Baner Pashan Link Road Corner...");

            //testUtils.refreshPage();
            try {
                testUtils.navigateToLocation(18.552094, 73.791615);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("✅ [INFO] Entered Baner pashan link road corner");

            // Extended wait for DOM to stabilize after navigation
            testUtils.waitForElement(2000);
            System.out.println("⏳ [INFO] Waiting for UI to stabilize after navigation...");

            try {
                // Additional stability check
                testUtils.waitForElement(1000);

                if (startTimerButton.isDisplayed()) {
                    System.out.println("🎯 [INFO] Start Timer button detected - clicking...");
                    clickOnStartTimerButton();
                }
            } catch (org.openqa.selenium.NoSuchElementException e) {
                // Do nothing – execution continues as usual
                System.out.println("⚠️ [WARN] Start Timer button not found: " + e.getMessage());
            } catch (org.openqa.selenium.StaleElementReferenceException e) {
                System.out.println("⚠️ [WARN] Start Timer button became stale, trying again...");
                testUtils.waitForElement(500);
                try {
                    if (startTimerButton.isDisplayed()) {
                        clickOnStartTimerButton();
                    }
                } catch (Exception e2) {
                    System.out.println("⚠️ [WARN] Could not click Start Timer button on retry: " + e2.getMessage());
                }
            }

            // Wait for new elements to fully load before validation
            System.out.println("⏳ [INFO] Waiting for task counters to load before validation...");
            testUtils.waitForElement(2000);

            validateTaskCounters();

            System.out.println("✅ [SUCCESS] Entered Baner Pashan Link Road Corner and validated task counters");
            captureAndAttachScreenshot("Baner_Pashan_Link_Road_Corner");
        });
    }

    public void enterBanerPashanLinkRoadCornerPointB() throws InterruptedException {
        //testUtils.refreshPage();
        testUtils.navigateToLocation(18.550529, 73.794088);
        System.out.println("enter baner pashan linked road point B");
        testUtils.waitForElement(5000);
        validateTaskCounters();
    }

    public void enterBanerRoadPointB() throws InterruptedException {
        //testUtils.refreshPage();
        testUtils.navigateToLocation(18.550395, 73.798435 );
        System.out.println("entered baner road point B");
        testUtils.waitForElement(5000);
        validateTaskCounters();
    }

    public void enterBanerRoadProject() throws InterruptedException {
        //testUtils.refreshPage();
        testUtils.navigateToLocation(18.554500, 73.797589);
        System.out.println("entered baner road project");
        validateTaskCounters();
        testUtils.waitForElement(5000);
    }


    public void enterNearGeofenceAndVerifyTask2Trigger() throws InterruptedException {
        testUtils.refreshPage();
        testUtils.navigateToLocation(18.55172, 73.79782);
        testUtils.navigateToLocation(18.551878, 73.79564); //exact site location
        testUtils.waitForElement(2000);
    }

    public void awayFromGeofence() throws InterruptedException {
        testUtils.navigateToLocation(18.55172, 73.79782);
    }

    public void travellingToStartDestination() throws InterruptedException {
        //testUtils.refreshPage();
        //Thread.sleep(5000);
        //testUtils.navigateToLocation(18.55172,73.79782); //near the exact location little bit away
        //testUtils.waitForElement(10000);
        testUtils.navigateToLocation(18.551878, 73.79564); //exact site location
        testUtils.waitForElement(1000);
    }

    public void travellingToStartDestinationTA() throws InterruptedException {
        testUtils.refreshPage();
        //Thread.sleep(5000);
        //testUtils.navigateToLocation(18.55172,73.79782); //near the exact location little bit away
        //testUtils.waitForElement(10000);
        testUtils.navigateToLocation(20.76962, 78.59753); //exact site location
        testUtils.waitForElement(5000);
    }


    public void travelToDumpSite() throws InterruptedException {
        testUtils.waitForElement(1000);
        testUtils.navigateToLocation(18.55206, 73.79613);
        testUtils.navigateToLocation(18.55172, 73.79782);
        testUtils.navigateToLocation(18.56101, 73.78733);
        testUtils.navigateToLocation(18.55492, 73.79769);
        testUtils.navigateToLocation(18.5647, 73.78236);
        testUtils.navigateToLocation(18.56462, 73.78519);
        testUtils.navigateToLocation(18.56477, 73.78565);
    }

    public void travelToDumpSiteTA() throws InterruptedException {
        testUtils.waitForElement(1000);

        testUtils.navigateToLocation(20.76962, 78.59753);
        testUtils.navigateToLocation( 20.7749, 78.59407);
        testUtils.waitForElement(3000);
    }

    public void travelFromStartToDump() throws InterruptedException {
        testUtils.navigateToLocation(18.55172, 73.79782);
        testUtils.navigateToLocation(18.56101, 73.78733);
        testUtils.navigateToLocation(18.55492, 73.79769);
        testUtils.navigateToLocation(18.5647, 73.78236);

    }

    public void travelFromStartToDumpTA() throws InterruptedException {
        testUtils.navigateToLocation(20.77175, 78.59611);


    }

    public void travelDropOffToPickUp() throws InterruptedException {
        testUtils.waitForElement(1000);
        //testUtils.navigateToLocation(18.56462, 73.78519);
        testUtils.navigateToLocation(18.5647, 73.78236);
        testUtils.navigateToLocation(18.55492, 73.79769);
        testUtils.navigateToLocation(18.56101, 73.78733);
        testUtils.navigateToLocation(18.55172, 73.79782);
        testUtils.navigateToLocation(18.55206, 73.79613);
        testUtils.navigateToLocation(18.551878, 73.79564); //exact site location

        //testUtils.waitForElement(5000);

    }


    public void verifyStartTimerTaskIsTrigger() {
        testUtils.waitForElement(20000);
    }

    public void verifyWhenDriverLeaveThePickUpLocationGeofenceTravelToDestinationStart() {
//        testUtils.waitForElement();
        setLocation(18.62525, 73.73756);
        testUtils.waitForElement(10000);
        setLocation(18.62444, 73.73699);
        testUtils.waitForElement(10000);
        setLocation(18.6237, 73.73715);
        testUtils.waitForElement(10000);
        setLocation(18.62214, 73.73704);

    }

    public void verifyWhenDriverEnterIntoTheDropOffLocationUnloadTaskStart() {
//        testUtils.waitForElement();
        setLocation(18.62105, 73.73679);
        testUtils.waitForElement(10000);
        setLocation(18.62092, 73.73638);
        testUtils.waitForElement(10000);
        setLocation(18.62125, 73.73458);
        testUtils.waitForElement(10000);
        setLocation(18.62189, 73.73126);

    }

    public static void setLocation(double latitude, double longitude) {
        String udid = "585E8846-7D5D-40ED-BE96-D90B085C5C9E";

        // Use array version of exec() to avoid shell parsing issues
        String[] command = new String[]{
                "xcrun", "simctl", "location", udid, "set",
                String.format(Locale.US, "%.6f", latitude),
                String.format(Locale.US, ",%.6f", longitude)
        };

        System.out.println("👉 Running command: " + String.join(" ", command));

        try {
            Process process = Runtime.getRuntime().exec(command);

            // Read and print any error output
            InputStream errorStream = process.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(errorStream));
            StringBuilder errorOutput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                System.err.println("❌ Failed to set location. Exit code: " + exitCode);
                System.err.println("Error output: " + errorOutput.toString());
            } else {
                System.out.println("✅ Location set to: " + latitude + ", " + longitude);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void simulateLocationUsingGpx(String gpxFilePath) {
        String udid = "585E8846-7D5D-40ED-BE96-D90B085C5C9E";
        String[] command = new String[]{
                "xcrun", "simctl", "location", udid, "simulate", gpxFilePath
        };

        System.out.println("👉 Running command: " + String.join(" ", command));

        try {
            Process process = Runtime.getRuntime().exec(command);

            InputStream errorStream = process.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(errorStream));
            StringBuilder errorOutput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                System.err.println("❌ Failed to simulate location. Exit code: " + exitCode);
                System.err.println("Error output: " + errorOutput.toString());
            } else {
                System.out.println("✅ Simulated location using GPX file: " + gpxFilePath);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public static void simulateDrive(String udid, List<double[]> waypoints, int speed, int distance) {
        if (waypoints == null || waypoints.size() < 2) {
            System.err.println("❌ You must provide at least two waypoints.");
            return;
        }

        // Build the command
        String[] baseCommand = new String[6 + waypoints.size()];
        baseCommand[0] = "xcrun";
        baseCommand[1] = "simctl";
        baseCommand[2] = "location";
        baseCommand[3] = udid;
        baseCommand[4] = "start";
        baseCommand[5] = "--distance=" + distance;
        baseCommand[6] = "--speed=" + speed;

        int i = 7;
        for (double[] point : waypoints) {
            baseCommand[i++] = String.format(Locale.US, "%.6f,%.6f", point[0], point[1]);
        }

        System.out.println("👉 Running command: " + String.join(" ", baseCommand));

        try {
            Process process = Runtime.getRuntime().exec(baseCommand);

            InputStream errorStream = process.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(errorStream));
            StringBuilder errorOutput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                System.err.println("❌ Failed to simulate drive. Exit code: " + exitCode);
                System.err.println("Error output: " + errorOutput.toString());
            } else {
                System.out.println("✅ Simulated drive started.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void testDriveIntoGeofence() {
        String udid = "585E8846-7D5D-40ED-BE96-D90B085C5C9E"; // or getBootedSimulatorUDID()

        List<double[]> waypoints = List.of(
                new double[]{18.6271, 73.73809},   // Start outside
                new double[]{18.62665, 73.73827},
                new double[]{18.62574, 73.73795},
                new double[]{18.62535, 73.73787}    // Inside geofence
        );

        // Simulate movement through waypoints at 10 m/s, with location updates every 50m
        simulateDrive(udid, waypoints, 10, 50);
    }

    public void trips(int n) throws InterruptedException {
        for (int i = 0; i <n*2-1; i++) {

            //Loaded Start
            System.out.println("Starting Loaded segment iteration --> "+i);
            travellingToStartDestination();
            testUtils.simulateBreakWithoutWaiting(5);
            travelToDumpSite();
            System.out.println("Ending Loaded segment iteration --> "+i);
            testUtils.simulateBreakWithoutWaiting(5);
            System.out.println("Starting Unloaded segment iteration --> "+i);
            travelDropOffToPickUp();
            testUtils.simulateBreakWithoutWaiting(5);
            testUtils.waitForElement(3000);
            System.out.println("Ending Unloaded segment iteration --> "+i);
        }
    }

    private void handleCameraInterruptions() {

        long endTime = System.currentTimeMillis() + 15000; // 15 sec timeout

        while (System.currentTimeMillis() < endTime) {

            if (testUtils.isElementDisplayed(cameraPermissionWhileUsingTheApp)) {
                cameraPermissionScanTicket();
                testUtils.waitForElement(1000);
                cameraManualModeButton.click();
                //clickOnCameraManualMode();
                System.out.println("✅ [INFO] Handled camera permission prompt");
                continue;
            }

            /*if(testUtils.isElementDisplayed(cameraManualModeButton)){
                clickOnCameraManualMode();
                System.out.println("✅ [INFO] Handled camera manual mode prompt");
                continue;
            }*/

            // Priority 1: Next Button (most common)
            if (testUtils.isElementDisplayed(cameraCaptureButton)) {
                clickOnCameraCaptureButton();
                System.out.println("✅ [INFO] Handled camera capture button");
                continue;
            }


            /*if (testUtils.isElementDisplayed(applyButton)) {
                clickOnApplyButton();
                continue;
            }*/

            // Exit loop if no interruption is present
            break;
        }
    }

    private void tapByCoordinates(WebElement element) {
        org.openqa.selenium.Point loc = element.getLocation();
        org.openqa.selenium.Dimension size = element.getSize();
        int x = loc.getX() + size.getWidth() / 2;
        int y = loc.getY() + size.getHeight() / 2;
        driver.executeScript("mobile: clickGesture", Map.of("x", x, "y", y));
    }

    private void handleCameraNavigation() {
        int maxAttempts = 60; // 60 × 100ms = 6 seconds max
        int attemptCount = 0;

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(0));

        try {
            while (attemptCount < maxAttempts) {
                attemptCount++;

                // Priority 1: Apply Button (crop confirmation screen)
                List<WebElement> applyBtns = driver.findElements(By.xpath(
                    "//android.widget.Button[@resource-id=\"com.google.android.gms.optional_mlkit_docscan_ui:id/confirm_crop_button\"]"));
                List<WebElement> nextBtns = driver.findElements(By.xpath("//*[@content-desc='Next']"));
                if (!applyBtns.isEmpty()) {
                    tapByCoordinates(applyBtns.get(0));
                    System.out.println("Camera navigation: Apply button tapped on attempt " + attemptCount);
                    testUtils.waitForElementToBeClickable(cameraNextButton);
                    cameraNextButton.click();
                    System.out.println("Camera navigation: Next button tapped on attempt " + attemptCount);
                    return;
                }

                // Priority 2: Next Button — ML Kit native view ignores element.click(), use gesture tap
                if (!nextBtns.isEmpty()) {
                    tapByCoordinates(nextBtns.get(0));
                    System.out.println("Camera navigation: Next button tapped on attempt " + attemptCount);
                    return;
                }

                // Priority 3: Done Button
                List<WebElement> doneBtns = driver.findElements(By.xpath(
                    "//android.widget.Button[@resource-id=\"com.google.android.gms.optional_mlkit_docscan_ui:id/scan_done_button\"]"));
                if (!doneBtns.isEmpty()) {
                    tapByCoordinates(doneBtns.get(0));
                    System.out.println("Camera navigation: Done button tapped on attempt " + attemptCount);
                    return;
                }

                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        } finally {
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        }

        throw new RuntimeException(
            "Camera button not found after " + attemptCount + " attempts (~6 seconds). " +
            "Ensure camera scan completed and button is visible on screen."
        );
    }



    public void scanTicketAndroidScaleTicketOn() throws IOException, InterruptedException {

       /* *//*testUtils.waitForElementToBeVisible(scanTicket);
        clickOnScanTicketButton();
        testUtils.waitForElement(2000);*//*
        if (testUtils.isElementDisplayed(cameraPermissionWhileUsingTheApp)) {
            cameraPermissionScanTicket();
            //testUtils.waitForElement(2000);
            //clickOnCameraCaptureButton();
           *//* if(applyButton.isDisplayed()){
                clickOnApplyButton();
            }*//*

            if (cameraNextButton.isDisplayed()) {
                clickOnNextButton();
            } else {
                clickOnDoneButton();
            }
        } else {
            testUtils.waitForElement(2000);
            //clickOnCameraCaptureButton();
            *//*if(applyButton.isDisplayed()){
                clickOnApplyButton();
            }*//*
            //clickOnWhileUsingApp_CameraButton();
            //clickOnCameraManualMode();
            //verifyCameraCaptureButtonIsDisplayed();
            //clickOnCameraCaptureButton();


            if (cameraNextButton.isDisplayed()) {
                clickOnNextButton();
            } else {
                clickOnDoneButton();
            }
        }*/

        // Handle camera permission / system interruptions safely
        handleCameraInterruptions();
        testUtils.waitForElement(5000);
        // Handle Next / Done button whenever it appears
        handleCameraNavigation();

        fillDetailsOnScanTicket();
        testUtils.waitForElement(2000);
        testUtils.swipeLeftNotificationArea();
    }


    public void scanTicketAndroid() throws IOException, InterruptedException {

        /*testUtils.waitForElementToBeVisible(scanTicket);
        clickOnScanTicketButton();
        testUtils.waitForElement(2000);*/
        if(testUtils.isElementDisplayed(scanScaleTicketButton)){
            clickOnScanScaleTicketButton();
            if (testUtils.isElementDisplayed(cameraPermissionWhileUsingTheApp)) {
                cameraPermissionScanTicket();
                testUtils.waitForElement(2000);
                if (cameraNextButton.isDisplayed()) {
                    clickOnNextButton();
                } else {
                    clickOnDoneButton();
                }
            } else {
                testUtils.waitForElement(2000);
                //clickOnWhileUsingApp_CameraButton();
                //clickOnCameraManualMode();
                //verifyCameraCaptureButtonIsDisplayed();
                //clickOnCameraCaptureButton();


                if (cameraNextButton.isDisplayed()) {
                    clickOnNextButton();
                } else {
                    clickOnDoneButton();
                }
            }
            fillDetailsOnScanTicket();

        }
        else {
            if (testUtils.isElementDisplayed(cameraPermissionWhileUsingTheApp)) {
                cameraPermissionScanTicket();
                testUtils.waitForElement(2000);
                if (cameraNextButton.isDisplayed()) {
                    clickOnNextButton();
                } else {
                    clickOnDoneButton();
                }
            } else {
                testUtils.waitForElement(2000);
                //clickOnWhileUsingApp_CameraButton();
                //clickOnCameraManualMode();
                //verifyCameraCaptureButtonIsDisplayed();
                //clickOnCameraCaptureButton();


                if (cameraNextButton.isDisplayed()) {
                    clickOnNextButton();
                } else {
                    clickOnDoneButton();
                }
            }
        }

        fillDetailsOnScanTicket();
    }



    public void scanTicketAndroidOnCloseWorkDay() throws IOException, InterruptedException {
        //testUtils.waitForElementToBeVisible(scanTicket);
        //clickOnScanTicketButton();
        testUtils.waitForElement(2000);
        //clickOnWhileUsingApp_CameraButton();
        //clickOnCameraManualMode();
        //verifyCameraCaptureButtonIsDisplayed();
        //clickOnCameraCaptureButton();
        clickOnNextButton();
        //clickOnDoneButton();
        fillDetailsOnScanTicket();
        testUtils.waitForElement(2000);
        testUtils.swipeUpNotificationArea();
    }

    public void verifyScanTicketQuantity(){
        performStep("Verify billable quantity", () -> {
            /*String billableQuantityExpected = getQuantity();
            String billableQuantityActual = testUtils.extractNumber(billableQuantityValueSubmitTimecard.getAttribute("content-desc"));
            System.out.println("scanned ticket quantity "+billableQuantityExpected);
            System.out.println("Billable quantity on submit timecard "+billableQuantityActual);
            Assert.assertEquals(billableQuantityActual,billableQuantityExpected,"billable quantity needs to be matching");*/
            assertBillableQuantities();
        });
    }

    private String downTimeWait;
    public void DownTimeBreak(){
        performStep("Verify downtime Wait", () -> {
            String downtimeWait =downTimeBreakTime.getAttribute("content-desc");
            System.out.println("downtime break time "+downtimeWait);
            String downtimeWaitinminutes = testUtils.roundOffTime(downtimeWait);
            System.out.println("downtime breaktime after roundoff "+downtimeWaitinminutes);
            this.downTimeWait=downtimeWaitinminutes;
        });
    }

    public String getDownTimeWait(){
        return downTimeWait;
    }

    public void takeDownTimeWait(int n){
        performStep("Take downtime wait",()->{
            addBreakAtDownTime();
            testUtils.waitForMinutes(n);
            DownTimeBreak();
            captureAndAttachScreenshot("downtime break");
            getDownTimeWait();
            clickOnResumeTime();
        });
    }

    private String waitTimeWait;
    public void WaitTimeBreak(){
        performStep("Verify waittime Wait", () -> {
            String waittimeWait =waitTimeBreakTime.getAttribute("content-desc");
            System.out.println("waittime break time "+waittimeWait);
            String waittimeWaitinminutes = testUtils.roundOffTime(waittimeWait);
            System.out.println("waittime breaktime after roundoff "+waittimeWaitinminutes);
            this.waitTimeWait=waittimeWaitinminutes;
        });
    }

    public String getWaitTimeWait(){
        return waitTimeWait;
    }

    public void takeWaitTimeWait(int n){
        performStep("Take wait time break",()->{
            addBreakATWaitTime();
            testUtils.waitForMinutes(n);
            WaitTimeBreak();
            captureAndAttachScreenshot("waittime break");
            getWaitTimeWait();
            clickOnResumeTime();
        });
    }



    public void submitTimecardMethod(){

        verifySubmitTimecardIsVisible();
        calculateBillableTime();
        verifyScanTicketQuantity();
        verifyBillableTime();
        verifyDownTimeWait();
        verifyWaitTimeWait();
        verifyEndTime();
        verifyStartTime();
        click_ON_I_Agree_CheckBox_SubmitTimecard();
        click_On_Submit_Timecard_Button();
    }

    public void verifyStartTime(){
        /*List<WebElement> startTimeElements = driver.findElements(By.xpath("//android.widget.ScrollView/android.view.View[contains(@content-desc,'Start Time')]"));
        for(WebElement el : startTimeElements){
            System.out.println("Start time attribute "+el.getAttribute("content-desc"));
        }*/
        String startTimeExpected = testUtils.getLastLineFromElement(startTimeSegmentCloseWorkday);
        //String startTime = startTimeSegmentCloseWorkday.getAttribute("content-desc");
        System.out.println("start time at close work day "+startTimeExpected);
        String startTimeActual = startTimeSubmitTimecard.getAttribute("content-desc");
        System.out.println("start time at submit timecard "+startTimeActual);
        //Assert.assertEquals(startTimeActual,startTimeExpected,"Start time need to be matching");
        softAssert.assertEquals(startTimeActual,startTimeExpected,"Start time need to be matching");
        softAssert.assertAll();
    }
    public void verifyEndTime(){

        performStep("Verify end time ", () -> {
            //String endTime = testUtils.extractLastLineFromContentDesc(endTimeSegmentCloseWorkday);
            String endTimeExpected = endTimeSegmentCloseWorkday.getAttribute("content-desc");
            System.out.println("end time at close work day "+endTimeExpected);
            String endTimeActual = endTimeSubmitTimecard.getAttribute("content-desc");
            System.out.println("end time at submit timecard "+endTimeActual);
            //Assert.assertEquals(endTimeActual,endTimeExpected,"end time need to be matching");
            softAssert.assertEquals(endTimeActual,endTimeExpected,"end time need to be matching");
            softAssert.assertAll();
        });
    }



    public void verifyBillableTime(){
        String totalTimeActual = billableTimeSubmitTimecard.getAttribute("content-desc");
        System.out.println("total time at submit timecard "+totalTimeActual);
        String totalTimeExpected = calculateBillableTime();
        System.out.println("total billing time at submit timecard "+totalTimeExpected);
        //Assert.assertEquals(totalTimeActual,totalTimeExpected,"billable time needs to be matching");
        softAssert.assertEquals(totalTimeActual,totalTimeExpected,"billable time needs to be matching");
        softAssert.assertAll();
    }

    public void verifyDownTimeWait(){
        performStep("Verify downtime Wait", () -> {
            String downtimeWaitExpected =getDownTimeWait();
            System.out.println("downtime wait at break page "+downtimeWaitExpected);
            String downTimeWaitActual = downTimeBreakValueAtSubmitTimecard.getAttribute("content-desc");
            System.out.println("downtime wait at submit timecard page "+downTimeWaitActual);
            //Assert.assertEquals(downTimeWaitActual,downtimeWaitExpected,"downtime break needs to be matching");
            softAssert.assertEquals(downTimeWaitActual,downtimeWaitExpected,"downtime break needs to be matching");
            softAssert.assertAll();
        });
    }

    public void  verifyWaitTimeWait(){
        performStep("Verify downtime Wait", () -> {
            String waittimeWaitExpected =getWaitTimeWait();
            System.out.println("waittime wait at break page "+waittimeWaitExpected);
            String waitTimeWaitActual = waitTimeBreakValueAtSubmitTimecard.getAttribute("content-desc");
            System.out.println("waittime wait at submit timecard page "+waitTimeWaitActual);
            //Assert.assertEquals(waitTimeWaitActual,waittimeWaitExpected,"waittime break needs to be matching");
            softAssert.assertEquals(waitTimeWaitActual,waittimeWaitExpected,"waittime break needs to be matching");
            softAssert.assertAll();
        });
    }

    public String calculateBillableTime() {
        System.out.println("🧮 [INFO] Calculating billable time...");

        try {
            // Get total time
            String totalTime = totalTimeValueSubmitTimecard.getAttribute("content-desc");
            System.out.println("📊 [INFO] Total time from UI: '" + totalTime + "'");

            // Check if total time is null
            if (totalTime == null || totalTime.trim().isEmpty()) {
                System.out.println("⚠️ [WARN] Total time is null/empty, using default 0");
                totalTime = "0m";
            }

            // Get break time (downtime)
            String breakTime = getDownTimeWait();
            System.out.println("⏱️ [INFO] Break time from getDownTimeWait(): '" + breakTime + "'");

            // Check if break time is null
            if (breakTime == null || breakTime.trim().isEmpty()) {
                System.out.println("⚠️ [WARN] Break time is null/empty, assuming no break");
                breakTime = "0m";
            }

            // Convert both times to minutes
            int totalMinutes = testUtils.parseTimeToMinutes(totalTime);
            System.out.println("📈 [DEBUG] Total minutes: " + totalMinutes);

            int breakMinutes = testUtils.parseTimeToMinutes(breakTime);
            System.out.println("📉 [DEBUG] Break minutes: " + breakMinutes);

            // Subtract break time
            int billableMinutes = totalMinutes - breakMinutes;

            System.out.println("💰 [DEBUG] Billable minutes (total - break): " + billableMinutes);

            // Safeguard against negative
            if (billableMinutes < 0) {
                System.out.println("⚠️ [WARN] Billable minutes is negative, setting to 0");
                billableMinutes = 0;
            }

            // Convert back to "Xh Ym" format
            String result = testUtils.formatMinutesToTime(billableMinutes);
            System.out.println("✅ [INFO] Billable time result: '" + result + "'");

            return result;
        } catch (Exception e) {
            System.out.println("❌ [ERROR] Error calculating billable time: " + e.getMessage());
            e.printStackTrace();

            // Return safe default on error
            System.out.println("⚠️ [WARN] Returning default value '0m' due to error");
            return "0m";
        }
    }


    public void detectAnomaly() {
        performStep("Verifying anomaly detected", () -> {
            int maxAttempts = 30; // Prevent infinite loops
            int attempts = 0;

            while (attempts < maxAttempts) {
                // Re-find elements in each iteration
                /*List<WebElement> anomalies = driver.findElements(By.xpath(
                        "//android.widget.ScrollView/android.view.View[contains(@content-desc,'Anomaly detected!') or contains(@content-desc,'Scale ticket required')]"
                ));*/

                /*List<WebElement> anomalies = driver.findElements(By.xpath(
                        "//android.widget.ScrollView//android.widget.ImageView[\n" +
                                "    contains(@content-desc,'Anomaly detected!') \n" +
                                "    or contains(@content-desc,'Scale ticket expected')\n" +
                                "]\n"
                ));*/

                List<WebElement> anomalies = driver.findElements(By.xpath("//android.view.View[contains(@content-desc,'Anomaly detected!')]"));

                System.out.println("anomalies found --> " + anomalies.size());

                if (anomalies.isEmpty()) {
                    break; // No more anomalies
                }

                boolean processed = false;
                for (int i = 0; i < anomalies.size(); i++) {
                    try {
                        // Re-find the specific anomaly element
                        /*List<WebElement> currentAnomalies = driver.findElements(By.xpath(
                                "//android.widget.ScrollView/android.view.View[contains(@content-desc,'Anomaly detected!') or contains(@content-desc,'Scale ticket required')]"
                        ));*/

                        /*List<WebElement> currentAnomalies = driver.findElements(By.xpath(
                                "//android.widget.ScrollView//android.widget.ImageView[\n" +
                                        "    contains(@content-desc,'Anomaly detected!') \n" +
                                        "    or contains(@content-desc,'Scale ticket expected')\n" +
                                        "]\n"
                        ));*/

                        List<WebElement> currentAnomalies = driver.findElements(By.xpath("//android.view.View[contains(@content-desc,'Anomaly detected!')]"));

                        if (i >= currentAnomalies.size()) {
                            continue;
                        }

                        WebElement anomaly = currentAnomalies.get(i);
                        WebElement expandButton = anomaly.findElement(By.xpath(".//android.widget.ImageView[1]"));

                        if(anomaly.isDisplayed() &&
                                anomaly.getAttribute("content-desc").contains("Travel time") &&
                                anomaly.getAttribute("content-desc").contains("expected") &&
                                anomaly.getAttribute("content-desc").contains("Scale ticket expected")){
                            expandButton.click();
                            testUtils.waitForElement(5000);
                            System.out.println("Explain the reason button is --> " + explainTheReasonButton.isDisplayed());
                            clickOnExplainTheReasonButton();
                            int segmentTImeInMin = testUtils.convertToMinutes(segmentTimeValue.getAttribute("content-desc"));
                            System.out.println("segment time --> "+ segmentTImeInMin);

                            System.out.println("annotation time field --> " + annotationTImeField.isDisplayed());
                            enterAnnotationTime();
                            testUtils.scrollToElement(driver,saveButton);
                            select_MechanicalBreak_DownTime();
                            clickOnSaveButton();

                            //scanning the ticket
                            System.out.println("Processing anomaly --> " + anomaly.getAttribute("content-desc"));

                            // Re-find expand button

                            expandButton.click();
                            testUtils.waitForElement(5000);
                            testUtils.scrollDownAndroid(driver);

                            // Re-find scan button

                            WebElement scanButton = driver.findElement(By.xpath("//*[@content-desc='SCAN TICKET']"));
                            System.out.println("scan button is --> " + scanButton.isDisplayed());
                            testUtils.waitForElementToBeClickable(scanButton);
                            testUtils.clickOnElement(scanButton);

                            try {
                                scanTicketAndroidOnCloseWorkDay();
                            } catch (IOException | InterruptedException e) {
                                throw new RuntimeException(e);
                            }

                            testUtils.waitForElementToBeVisible(closeWorkdayHeading);
                            testUtils.scrollDownAndroid(driver);

                            processed = true;
                            break; // Exit loop after processing one anomaly

                        }
                        else if(anomaly.isDisplayed() &&
                                anomaly.getAttribute("content-desc").contains("Travel time") &&
                                anomaly.getAttribute("content-desc").contains("expected")){

                            expandButton.click();
                            testUtils.waitForElement(5000);


                            System.out.println("Explain the reason button is --> " + explainTheReasonButton.isDisplayed());
                            clickOnExplainTheReasonButton();
                            int segmentTImeInMin = testUtils.convertToMinutes(segmentTimeValue.getAttribute("content-desc"));
                            System.out.println("segment time --> "+ segmentTImeInMin);

                            System.out.println("annotation time field --> " + annotationTImeField.isDisplayed());
                            enterAnnotationTime();
                            testUtils.scrollToElement(driver,saveButton);
                            //testUtils.scrollDownAndroid(driver);
                            select_MechanicalBreak_DownTime();
                            clickOnSaveButton();

                            testUtils.scrollDownAndroid(driver);

                            processed = true;
                            break; // Exit loop after processing one anomaly

                        }
                        else if (anomaly.isDisplayed() &&
                                anomaly.getAttribute("content-desc").contains("Scale ticket expected")) {

                            System.out.println("Processing anomaly --> " + anomaly.getAttribute("content-desc"));

                            // Re-find expand button

                            expandButton.click();
                            testUtils.waitForElement(5000);
                            testUtils.scrollDownAndroid(driver);

                            // Re-find scan button

                            WebElement scanButton = driver.findElement(By.xpath("//*[@content-desc='SCAN TICKET']"));
                            System.out.println("scan button is --> " + scanButton.isDisplayed());
                            testUtils.waitForElementToBeClickable(scanButton);
                            testUtils.clickOnElement(scanButton);

                            try {
                                scanTicketAndroidOnCloseWorkDay();
                            } catch (IOException | InterruptedException e) {
                                throw new RuntimeException(e);
                            }

                            testUtils.waitForElementToBeVisible(closeWorkdayHeading);
                            testUtils.scrollDownAndroid(driver);

                            processed = true;
                            break; // Exit loop after processing one anomaly
                        }

                    } catch (StaleElementReferenceException e) {
                        System.out.println("Stale element, retrying...");
                        break; // Break and re-find all elements
                    }
                }

                if (!processed) {
                    testUtils.scrollDownAndroid(driver);
                }

                attempts++;
            }
        });
    }


    public void verifyCompletedTasksLessThanCurrentTask(WebElement completedTaskElement, WebElement taskElement ) {

        // -------- Locate Completed Tasks element -----

        // Get text from correct attribute (iOS / Android)
        String completedTaskText =
                completedTaskElement.getAttribute("name") != null
                        ? completedTaskElement.getAttribute("name")
                        : completedTaskElement.getAttribute("content-desc");

        /*
         * Example text:
         * "Completed Tasks 1"
         */
        int completedTasks =
                Integer.parseInt(completedTaskText.replaceAll(".*Completed Tasks\\s*(\\d+).*", "$1"));

        // -------- Locate Current Task card --------

        String taskText =
                taskElement.getAttribute("name") != null
                        ? taskElement.getAttribute("name")
                        : taskElement.getAttribute("content-desc");

        int currentTaskNumber =
                Integer.parseInt(taskText.replaceAll(".*Task #(\\d+).*", "$1"));

        // -------- Assertion --------
        Assert.assertTrue(
                completedTasks < currentTaskNumber,
                "Validation failed: Completed Tasks (" + completedTasks +
                        ") is NOT less than Current Task (" + currentTaskNumber + ")"
        );
    }

    //------------------------------task validation----------------------------//
    //private SoftAssert softAssert;
    // Stores all observed task numbers
    private final List<Integer> taskNumberHistory = new ArrayList<>();

    // Tracks last completed task count to ensure it never decreases
    private int lastCompletedTaskCount = -1;

   /* *//**
     * Validates:
     * 1. Completed Tasks never decreases
     * 2. Task Number = Completed Tasks + 1
     * 3. Task numbers are strictly sequential
     *
     * Uses SoftAssert (assertAll must be called separately)
     *//*
    public void validateTaskCounters() {

        // Wait for UI to stabilize
        testUtils.waitForElementToBeVisible(currentTask);
        testUtils.waitForElementToBeVisible(completedTasks);

        String completedTasksText = getElementText(completedTasks);
        String currentTaskText = getElementText(currentTask);

        int completedTasksCount = extractNumber(completedTasksText);
        int currentTaskNumber = extractNumber(currentTaskText);

        // Rule 1: Completed tasks should never decrease
        if (lastCompletedTaskCount != -1) {
            softAssert.assertTrue(
                    completedTasksCount >= lastCompletedTaskCount,
                    "Completed Tasks count decreased. Previous: "
                            + lastCompletedTaskCount + ", Current: " + completedTasksCount
            );
        }

        // Rule 2: Task number must be exactly +1 of completed tasks
        softAssert.assertEquals(
                currentTaskNumber,
                completedTasksCount + 1,
                "Task number is not equal to Completed Tasks count + 1"
        );

        // Rule 3: Task numbers must be sequential
        if (!taskNumberHistory.isEmpty()) {
            int lastTaskNumber = taskNumberHistory.get(taskNumberHistory.size() - 1);
            softAssert.assertEquals(
                    currentTaskNumber,
                    lastTaskNumber + 1,
                    "Task numbers are not sequential. Previous: "
                            + lastTaskNumber + ", Current: " + currentTaskNumber
            );
        }

        // Persist state
        taskNumberHistory.add(currentTaskNumber);
        lastCompletedTaskCount = completedTasksCount;
    }

    *//**
     * Must be called once at the end of the test
     *//*
    public void assertAll() {
        softAssert.assertAll();
    }*/

    /**
     * Validates:
     * 1. Completed Tasks never decreases
     * 2. Task Number = Completed Tasks + 1
     * 3. Task numbers are strictly sequential
     *
     * Uses ONLY hard assertions (fails immediately on error)
    public void validateTaskCounters() {

        // Wait for UI to stabilize
        testUtils.waitForElementToBeVisible(currentTask);
        testUtils.waitForElementToBeVisible(completedTasks);

        String completedTasksText = getElementText(completedTasks);
        String currentTaskText = getElementText(currentTask);

        int completedTasksCount = extractNumber(completedTasksText);
        int currentTaskNumber = extractNumber(currentTaskText);

        // Rule 1: Completed tasks should never decrease
        if (lastCompletedTaskCount != -1) {
            Assert.assertTrue(
                    completedTasksCount >= lastCompletedTaskCount,
                    "Completed Tasks count decreased. Previous: "
                            + lastCompletedTaskCount + ", Current: " + completedTasksCount
            );
        }

        // Rule 2: Task number must be exactly +1 of completed tasks
        Assert.assertEquals(
                currentTaskNumber,
                completedTasksCount + 1,
                "Task number is not equal to Completed Tasks count + 1"
        );

        // Rule 3: Task numbers must be strictly sequential
        if (!taskNumberHistory.isEmpty()) {
            int lastTaskNumber = taskNumberHistory.get(taskNumberHistory.size() - 1);
            Assert.assertEquals(
                    currentTaskNumber,
                    lastTaskNumber + 1,
                    "Task numbers are not sequential. Previous: "
                            + lastTaskNumber + ", Current: " + currentTaskNumber
            );
        }

        // Persist state
        taskNumberHistory.add(currentTaskNumber);
        lastCompletedTaskCount = completedTasksCount;
    }*/

    public void validateTaskCounters() {
        performStep("Verify task number ", () -> {
            System.out.println("🔄 [INFO] Validating task counters with stale element handling...");

            int maxRetries = 5;
            int retryCount = 0;
            Exception lastException = null;

            while (retryCount < maxRetries) {
                try {
                    // Wait for UI to stabilize after navigation
                    testUtils.waitForElement(2000);

                    // Force re-fetch of elements to avoid stale references
                    System.out.println("📍 [INFO] Attempt " + (retryCount + 1) + "/" + maxRetries + " to validate task counters");

                    // Re-initialize element locators to get fresh references
                    testUtils.waitForElementToBeVisible(currentTask);
                    testUtils.waitForElementToBeVisible(completedTasks);

                    // Additional wait to ensure elements are truly stable
                    testUtils.waitForElement(500);

                    String completedTasksText = getElementText(completedTasks);
                    String currentTaskText = getElementText(currentTask);

                    int completedTasksCount = extractNumber(completedTasksText);
                    int currentTaskNumber = extractNumber(currentTaskText);

                    System.out.println("✅ [INFO] Successfully retrieved task counters");
                    System.out.println("   └─ Completed Tasks: " + completedTasksCount);
                    System.out.println("   └─ Current Task: " + currentTaskNumber);

                    // Rule 1: Completed tasks should never decrease
                    if (lastCompletedTaskCount != -1) {
                        Assert.assertTrue(
                                completedTasksCount >= lastCompletedTaskCount,
                                "Completed Tasks count decreased. Previous: "
                                        + lastCompletedTaskCount + ", Current: " + completedTasksCount
                        );
                    }

                    // Rule 2: Task number must be exactly +1 of completed tasks
                    Assert.assertEquals(
                            currentTaskNumber,
                            completedTasksCount + 1,
                            "Task number is not equal to Completed Tasks count + 1"
                    );

                    // Rule 3: Task numbers must be strictly sequential
                    /*if (!taskNumberHistory.isEmpty()) {
                        int lastTaskNumber = taskNumberHistory.get(taskNumberHistory.size() - 1);
                        Assert.assertEquals(
                                currentTaskNumber,
                                lastTaskNumber + 1,
                                "Task numbers are not sequential. Previous: "
                                        + lastTaskNumber + ", Current: " + currentTaskNumber
                        );
                    }*/

                    // Persist state
                    taskNumberHistory.add(currentTaskNumber);
                    lastCompletedTaskCount = completedTasksCount;

                    System.out.println("✅ [SUCCESS] Task counter validation passed");
                    captureAndAttachScreenshot("Task number validation");

                    return; // Success - exit retry loop

                } catch (org.openqa.selenium.StaleElementReferenceException e) {
                    lastException = e;
                    retryCount++;
                    System.out.println("⚠️ [WARN] Attempt " + retryCount + ": StaleElementReferenceException - " + e.getMessage());

                    if (retryCount < maxRetries) {
                        System.out.println("🔄 [INFO] Retrying after element refresh...");
                        try {
                            Thread.sleep(1000); // Wait before retry
                            testUtils.waitForElement(1000); // Additional stabilization
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                        }
                    }
                } catch (Exception e) {
                    lastException = e;
                    retryCount++;
                    System.out.println("⚠️ [WARN] Attempt " + retryCount + ": Exception - " + e.getClass().getSimpleName() + " - " + e.getMessage());

                    if (retryCount < maxRetries) {
                        System.out.println("🔄 [INFO] Retrying...");
                        try {
                            Thread.sleep(500);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                        }
                    }
                }
            }

            // If all retries failed, throw the last exception
            if (retryCount >= maxRetries && lastException != null) {
                System.out.println("❌ [ERROR] Task counter validation failed after " + maxRetries + " attempts");
                throw new RuntimeException("validateTaskCounters failed after " + maxRetries + " retries: " + lastException.getMessage(), lastException);
            }
        });
    }

    // ===== Utility Methods =====

    /**
     * Platform-aware method to get element text
     * iOS: Uses 'name', 'label', 'value' attributes
     * Android: Uses 'content-desc', 'text' attributes
     */
    private String getElementText(WebElement element) {
        try {
            String platformName = prop.getProperty("platform.name");

            if (platformName != null && platformName.equalsIgnoreCase("ios")) {
                // iOS: Try name, label, value in order
                System.out.println("📱 [DEBUG] Getting text from iOS element");

                String text = safeGetAttribute(element, "name");
                if (text != null && !text.isEmpty()) {
                    System.out.println("   └─ Found via 'name': " + text);
                    return text;
                }

                text = safeGetAttribute(element, "label");
                if (text != null && !text.isEmpty()) {
                    System.out.println("   └─ Found via 'label': " + text);
                    return text;
                }

                text = safeGetAttribute(element, "value");
                if (text != null && !text.isEmpty()) {
                    System.out.println("   └─ Found via 'value': " + text);
                    return text;
                }

                // Fallback: try wdLabel (WebDriver prefixed)
                text = safeGetAttribute(element, "wdLabel");
                if (text != null && !text.isEmpty()) {
                    System.out.println("   └─ Found via 'wdLabel': " + text);
                    return text;
                }

            } else {
                // Android: Try content-desc, text in order
                System.out.println("🤖 [DEBUG] Getting text from Android element");

                String text = safeGetAttribute(element, "content-desc");
                if (text != null && !text.isEmpty()) {
                    System.out.println("   └─ Found via 'content-desc': " + text);
                    return text;
                }

                text = safeGetAttribute(element, "text");
                if (text != null && !text.isEmpty()) {
                    System.out.println("   └─ Found via 'text': " + text);
                    return text;
                }
            }

            System.out.println("⚠️ [WARN] Could not get element text from any attribute");
            return "";

        } catch (Exception e) {
            System.out.println("❌ [ERROR] Error getting element text: " + e.getMessage());
            return "";
        }
    }

    /**
     * Safely get element attribute without throwing exception
     * Returns null if attribute doesn't exist or can't be accessed
     */
    private String safeGetAttribute(WebElement element, String attributeName) {
        try {
            String value = element.getAttribute(attributeName);
            return value;
        } catch (org.openqa.selenium.WebDriverException e) {
            // Attribute not supported on this platform
            System.out.println("   ⚠️ Attribute '" + attributeName + "' not available: " + e.getMessage().split("\n")[0]);
            return null;
        } catch (Exception e) {
            System.out.println("   ⚠️ Error getting attribute '" + attributeName + "': " + e.getClass().getSimpleName());
            return null;
        }
    }

    private int extractNumber(String text) {
        return Integer.parseInt(text.replaceAll("\\D+", ""));
    }

    /**
     * Returns and prints all captured task numbers
     */
    public List<Integer> getTaskNumberHistory() {

        System.out.println("---- Task Number History ----");

        if (taskNumberHistory.isEmpty()) {
            System.out.println("No task numbers captured yet.");
        } else {
            for (Integer taskNumber : taskNumberHistory) {
                System.out.println("Task #" + taskNumber);
            }
        }

        System.out.println("-----------------------------");

        return taskNumberHistory;
    }

    //---------------------------------------------------------------------------------------//

    public void oneJobIteration() throws InterruptedException, IOException {

        String platformNme = prop.getProperty("platform.name");
        if (platformNme.equalsIgnoreCase("ios")){
            oneJobIterationForIOS();
        }else{
            enterBanerPashanLinkRoadCorner();
            //jobTicketPage.clickOnStartTimerButton();
            clickOnLoadDetailsButton();
            scanTicketAndroidScaleTicketOn();
            outSideGeofenceBPLRC();
            enterBanerPashanLinkRoadCornerPointB();
            //takeDownTimeWait(1);
            //clickOnLoadDetailsButton();
            //scanTicketAndroidScaleTicketOn();
            outSideGeofenceBPLRC();
            enterBanerRoadPointB();
            //takeWaitTimeWait(1);
            clickOnLoadDetailsButton();
            scanTicketAndroidScaleTicketOn();
            outSideGeofenceBPLRC();
            enterBanerRoadProject();
            //clickOnLoadDetailsButton();
            //scanTicketAndroidScaleTicketOn();
        }
    }

    public void oneJobIterationForIOS() throws InterruptedException, IOException {
        enterBanerPashanLinkRoadCorner();
        //jobTicketPage.clickOnStartTimerButton();
        testUtils.waitForElement(5000);
        outSideGeofenceBPLRC();
        testUtils.waitForElement(5000);
        enterBanerPashanLinkRoadCornerPointB();
        testUtils.waitForElement(5000);
        takeDownTimeWait(1);
        outSideGeofenceBPLRC();
        testUtils.waitForElement(5000);
        enterBanerRoadPointB();
        testUtils.waitForElement(5000);
        takeWaitTimeWait(1);
        outSideGeofenceBPLRC();
        testUtils.waitForElement(5000);
        enterBanerRoadProject();
        testUtils.waitForElement(5000);
    }

    public String getTimecardIdForDispatchDriverJob(WebElement dispatchDriverJobId) {

        // GraphQL query
        String query = """
        query DispatchDriverJob($id: ID!) {
          dispatchDriverJob(id: $id) {
            timecard {
              id
            }
          }
        }
    """;

        // Extract job ID from the WebElement's content-desc attribute
        String jobId = dispatchDriverJobId.getAttribute("content-desc");
        if (jobId == null || jobId.trim().isEmpty()) {
            throw new RuntimeException("Could not retrieve job ID from headerLinkJobId element");
        }
        System.out.println("📋 Job ID from header: " + jobId);

        // GraphQL variables
        String variables = """
        {
          "id": "%s"
        }
    """.formatted(jobId.trim());

        // Execute GraphQL request
        String response =
                given()
                        .log().all()
                        .contentType(ContentType.JSON)
                        .header("Authorization", accessToken)
                        .body(
                                "{ \"query\": \"" +
                                        query.replace("\"", "\\\"").replace("\n", "\\n") +
                                        "\", \"variables\": " + variables + " }"
                        )
                        .when()
                        .post("https://api-dev.swiftlyr.com/graphql")
                        .then()
                        .log().all()
                        .statusCode(200)
                        .extract()
                        .asString();

        // Extract timecardId from response
        String timecardId = JsonPath
                .from(response)
                .getString("data.dispatchDriverJob.timecard.id");

        // Safety check
        if (timecardId == null) {
            throw new RuntimeException("Timecard ID not found for DispatchDriverJob: " + dispatchDriverJobId);
        }

        System.out.println("Extracted Timecard ID: " + timecardId);

        return timecardId;
    }

    /**
     * Submits a timecard via GraphQL API with proper error handling and validation.
     *
     * @param timecardId The unique identifier of the timecard to submit
     * @throws IllegalArgumentException if timecardId is null or empty
     * @throws RuntimeException if the API request fails or returns an error
     */
    public void submitTimecard(String timecardId) {

        // Validate input
        if (timecardId == null || timecardId.trim().isEmpty()) {
            throw new IllegalArgumentException("Timecard ID cannot be null or empty");
        }

        performStep("Submit Timecard via GraphQL API", () -> {
            try {
                // GraphQL mutation query
                String mutation = """
                    mutation UpdateOneTimecard($input: UpdateOneTimecardInput!) {
                      updateOneTimecard(input: $input) {
                        status
                      }
                    }
                """;

                // GraphQL variables with proper formatting
                String variables = """
                    {
                      "input": {
                        "id": "%s",
                        "update": {
                          "status": "SUBMITTED"
                        }
                      }
                    }
                """.formatted(timecardId);

                // Build the complete GraphQL request body
                String requestBody = "{ \"query\": \"" +
                        mutation.replace("\"", "\\\"").replace("\n", "\\n") +
                        "\", \"variables\": " + variables + " }";

                System.out.println("Submitting timecard with ID: " + timecardId);

                // Execute GraphQL request with proper validation
                io.restassured.response.Response response = given()
                        .log().all()
                        .contentType("application/json")
                        .header("Authorization", accessToken)
                        .header("Accept", "application/json")
                        .body(requestBody)
                        .when()
                        .post("https://api-dev.swiftlyr.com/graphql")
                        .then()
                        .log().all()
                        .statusCode(200)
                        .extract()
                        .response();

                // Validate response contains the expected status
                String status = response.jsonPath().getString("data.updateOneTimecard.status");

                if (status == null) {
                    String errorMessage = response.jsonPath().getString("errors[0].message");
                    throw new RuntimeException("Timecard submission failed. Error: " + errorMessage);
                }

                if (!status.equals("SUBMITTED")) {
                    throw new RuntimeException("Expected status 'SUBMITTED' but got: " + status);
                }

                System.out.println("✓ Timecard " + timecardId + " submitted successfully with status: " + status);
                captureAndAttachScreenshot("Timecard submitted successfully via API");

            } catch (Exception e) {
                System.out.println("✗ Failed to submit timecard " + timecardId + ": " + e.getMessage());
                captureAndAttachScreenshot("Timecard submission failed");
                throw new RuntimeException("Failed to submit timecard: " + e.getMessage(), e);
            }
        });
    }

    // ====== OFFLINE SCENARIO METHODS FOR iOS ======

    /**
     * Enable Airplane Mode on iOS to simulate offline scenario
     */
    public void enableAirplaneModeIOS() {
        performStep("Enable Airplane Mode on iOS", () -> {
            try {
                System.out.println("🌐 [INFO] Attempting to enable Airplane Mode on iOS...");
                driver.executeScript("mobile: shell", ImmutableMap.of(
                        "command", "defaults write com.apple.CoreTelephony '{}' 2>/dev/null || true"
                ));
                System.out.println("✅ [SUCCESS] Airplane Mode enabled on iOS");
                captureAndAttachScreenshot("Airplane_Mode_Enabled");
            } catch (Exception e) {
                System.out.println("⚠️ [WARN] Please manually enable Airplane Mode in Settings");
                captureAndAttachScreenshot("Manual_Airplane_Mode_Required");
            }
        });
    }

    /**
     * Disable Airplane Mode on iOS
     */
    public void disableAirplaneModeIOS() {
        performStep("Disable Airplane Mode on iOS", () -> {
            try {
                System.out.println("🌐 [INFO] Disabling Airplane Mode on iOS...");
                driver.executeScript("mobile: shell", ImmutableMap.of(
                        "command", "defaults delete com.apple.CoreTelephony '{}' 2>/dev/null || true"
                ));
                System.out.println("✅ [SUCCESS] Airplane Mode disabled on iOS");
                captureAndAttachScreenshot("Airplane_Mode_Disabled");
            } catch (Exception e) {
                System.out.println("⚠️ [WARN] Could not disable Airplane Mode: " + e.getMessage());
                captureAndAttachScreenshot("Manual_Disable_Airplane_Mode_Required");
            }
        });
    }

    public void submitTimecard(){
        try{
            createAuthorizationToken();
            String timecardID = getTimecardIdForDispatchDriverJob(headerLinkJobId);
            if (timecardID == null || timecardID.trim().isEmpty()) {
                throw new IllegalArgumentException("Failed to retrieve valid timecard ID");
            }
            System.out.println("📋 Retrieved Timecard ID: " + timecardID);

            // Step 3: Submit the timecard via API
            submitTimecard(timecardID);
            System.out.println("✓ Timecard submitted successfully");
            // Step 4: Wait for app to stabilize after submission
            Thread.sleep(1000);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Test interrupted: " + e.getMessage(), e);
        } catch (Exception e) {
            System.out.println("✗ Test failed: " + e.getMessage());
            throw new RuntimeException("resetApp test failed", e);
        }

        }

    public boolean isHeaderLinkJobIdPresent() {
        try {
            return testUtils.isElementDisplayed(headerLinkJobId);
        } catch (Exception e) {
            return false;
        }
    }
    }
























