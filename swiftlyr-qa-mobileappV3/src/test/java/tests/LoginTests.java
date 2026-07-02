package tests;

import org.testng.annotations.Test;

public class  LoginTests extends BaseTest {

    @Test()
    public void verifySignInButtonShouldBeDisplayed() {
        loginPage.verifySignInButtonDisplayed();
    }


    @Test()
    public void VerifySignInPageShouldBeDisplayedFieldsSuchAsEmailAddressPasswordAndSingInWithEmailButton() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.verifySignInPageDisplayedAllFields();
    }

    @Test()
    public void VerifyEmailAddressIsTextInputFieldAndUserAbleToEnterTheValidEmailAddress() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress("xyzabc123@gmsil.com");
    }

    @Test()
    public void VerifyPasswordFieldIsTextInputFieldAndUserAbleToEnterThePassword() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterPassword("Aaaaa@123");
    }

    @Test()
    public void verifySignInWithEmailButtonEnablesWhenEmailAndPasswordFieldsEntered() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress("xyzabc123@gmail.com");
        loginPage.enterPassword("Aaaaa@123!");
        loginPage.verifySignInWithEmailButtonEnabled();
    }

    @Test
    public void verifyEmailFieldShouldBeInValidFormat() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.verifyEmailIsInValidFormatForSign("test@example.com");
        loginPage.verifyEmailIsInvalidFormat("test@invalid");
    }

    @Test
    public void verifyTheErrorMessageWhenPasswordIsLessThanEightCharacter() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.verifyErrorMessageForPassword("Aa@12");
    }

    @Test
    public void verifyErrorMessageIfPasswordNotContainUppercase_lowercaseNumberAndSpecialCharacter() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.verifyErrorMessageForPassword("12345");
    }

    @Test
    public void VerifyPasswordShouldNotAbleToEnterMoreThan_33_characters() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.verifyErrorMessageForPassword("Aa@1234567890123456789012345678901");
    }

    @Test
    public void verifyThatTheSignInButtonRemainsDisabledUntilBothFieldsArefFilledIn() {
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.verifySignInWithEmailButtonDisable();
        loginPage.enterEmailAddress("a@gmail.com");
        loginPage.verifySignInWithEmailButtonDisable();
        loginPage.enterPassword("Aaaa@1234");
        loginPage.verifySignInWithEmailButtonEnabled();
    }

    @Test
    public void verifyWhenValidEmailAddressAndPasswordAreEnteredTheDriveIsAbleToProceedToTheDashboard() {

        loginPage.verifyAllowWhileUsingAppButtonDisplayedAndClick();
        loginPage.verifySignInButtonDisplayed();
        loginPage.clickOnSignButton();
        loginPage.enterEmailAddress(credProp.getProperty("shubhamEmail"));
        loginPage.enterPassword(credProp.getProperty("shubhamPass"));
        loginPage.clickOnSignInWithEmailButton();
        loginPage.verifyJobsIsVisible();
    }


}
