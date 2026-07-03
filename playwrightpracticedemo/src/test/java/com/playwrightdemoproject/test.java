package com.playwrightdemoproject;

import org.testng.annotations.Test;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.AriaRole;

public class test {
    @Test
    public void login() {
        try (Playwright playwright = Playwright.create()) {

            BrowserType.LaunchOptions launchOptions = new BrowserType.LaunchOptions().setHeadless(false).setSlowMo(100);

            Browser browser = playwright.chromium().launch(launchOptions);
            Browser.NewContextOptions contextOptions = new Browser.NewContextOptions()
            .setViewportSize(1280, 720)
            .setBaseURL("https://testautomationpractice.blogspot.com/")
            .setIgnoreHTTPSErrors(true);

            BrowserContext context = browser.newContext(contextOptions);
            Page page = context.newPage();

            page.navigate("https://testautomationpractice.blogspot.com");
        }
    }
    @Test
    public void input() {
        try (Playwright playwright = Playwright.create()) {

            BrowserType.LaunchOptions launchOptions = new BrowserType.LaunchOptions().setHeadless(false).setSlowMo(100);
            Browser browser = playwright.chromium().launch(launchOptions);
            Browser.NewContextOptions contextOptions = new Browser.NewContextOptions()
            .setViewportSize(1280, 720)
            .setBaseURL("https://testautomationpractice.blogspot.com/")
            .setIgnoreHTTPSErrors(true);
            BrowserContext context = browser.newContext(contextOptions);
            Page page = context.newPage();
            page.navigate("https://testautomationpractice.blogspot.com/");
            page.getByRole(AriaRole.TEXTBOX,new Page.GetByRoleOptions().setName("Enter Name")).fill("Shubham");
            page.getByRole(AriaRole.TEXTBOX, new Page.GetByRoleOptions().setName("Enter EMail")).fill("shubhamtirpude20@gmail.com");
            page.getByRole(AriaRole.TEXTBOX,new Page.GetByRoleOptions().setName("Enter Phone")).fill("8698498054");
            page.mouse().wheel(0, 250);
            //page.locator("//textarea[@id='textarea']").fill("baner, Pune"); 
            //page.getByText("Male").check();
            page.locator("//input[@id='male']").check();
            //page.getByRole(AriaRole.RADIO, new GetByRoleOptions().setName("female")).check();
            //page.getByText("Male").check();
            page.locator("//input[@id='sunday']").check();
            page.mouse().wheel(0, 250);
            Locator countryDropDown = page.locator("//select[@id='country']");
            countryDropDown.click();
            countryDropDown.selectOption("India");

            page.waitForTimeout(10000); // 10 seconds
        }
    }
}
