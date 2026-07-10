package tests;

import java.time.Duration;
import java.util.Arrays;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Pause;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import io.appium.java_client.AppiumDriver;

/**
 * DemoAppiumTest
 */
public class DemoAppiumTest {

    public void swipeScreen(AppiumDriver driver, Point start, Point end) {
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence swipe = new Sequence(finger, 1)
                .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), start.x, start.y))
                .addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
                .addAction(
                        finger.createPointerMove(Duration.ofMillis(500), PointerInput.Origin.viewport(), end.x, end.y))
                .addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
        driver.perform(Arrays.asList(swipe));
    }

    public void longPressElement(AppiumDriver driver, WebElement element) {
        Point loc = element.getLocation();
        Point center = new Point(loc.x + element.getSize().getWidth() / 2,
                loc.y + element.getSize().getHeight() / 2);
        PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger");
        Sequence longPress = new Sequence(finger, 1)
                .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), center.x, center.y))
                .addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
                .addAction(new Pause(finger, Duration.ofSeconds(2)))
                .addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));
        driver.perform(Arrays.asList(longPress));
    }

        

    // public void handleWebView(AppiumDriver driver){
    // String nativeContext = driver.getContext();
    // Set<String> contexts = driver.getContexts();
    // String webViewContext = null;
    // for (String ctx : contexts) {
    // if (ctx.contains("WEBVIEW")) {
    // webViewContext = ctx;
    // break;
    // }
    // }

    // if (webViewContext != null) {
    // driver.context(webViewContext);
    // //do some actions and
    // driver.context(nativeContext);
    // }

    // }

}