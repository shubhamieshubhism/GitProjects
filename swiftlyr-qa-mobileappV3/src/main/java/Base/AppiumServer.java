package Base;

import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;
import io.appium.java_client.service.local.flags.GeneralServerFlag;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URL;

public class AppiumServer {
    private static AppiumDriverLocalService service;

    public static void start() {
        if (service != null && service.isRunning()) {
            System.out.println("Appium server is already running.");
            return; // Server already running, no need to start again
        }

        // Stop any existing service gracefully
        if (service != null) {
            try {
                service.stop();
                Thread.sleep(2000);
            } catch (Exception e) {
                System.out.println("Warning: Could not stop existing service: " + e.getMessage());
            }
            service = null;
        }

        // Kill any lingering Appium or Node.js processes
        try {
            if (System.getProperty("os.name").toLowerCase().contains("mac")
                    || System.getProperty("os.name").toLowerCase().contains("linux")) {
                // Kill appium processes
                Runtime.getRuntime().exec("pkill -9 -f appium").waitFor();
                // Kill node processes on the specific port
                Runtime.getRuntime().exec("lsof -ti:4723 | xargs kill -9").waitFor();
                System.out.println("Killed existing Appium/Node processes");
            } else if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                Runtime.getRuntime().exec("taskkill /F /IM node.exe").waitFor();
                System.out.println("Killed existing Node processes on Windows");
            }
            // Wait for port to be released
            Thread.sleep(3000);
        } catch (IOException | InterruptedException e) {
            System.out.println("Warning: Failed to kill existing processes: " + e.getMessage());
        }

        // Check if port is available before starting
        boolean portAvailable = false;
        int retries = 5;
        while (!portAvailable && retries > 0) {
            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress("127.0.0.1", 4723), 1000);
                // If we get here, port is in use
                System.out.println("Port 4723 still in use. Retrying... (" + retries + " attempts left)");
                Thread.sleep(2000);
                retries--;
            } catch (IOException e) {
                // Port is available
                portAvailable = true;
                System.out.println("Port 4723 is now available.");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        if (!portAvailable) {
            throw new RuntimeException("Port 4723 is still in use after multiple cleanup attempts. " +
                    "Please manually kill the process using: lsof -ti:4723 | xargs kill -9");
        }

        // Build server with more explicit configuration
        AppiumServiceBuilder builder = new AppiumServiceBuilder();

        // Try APPIUM_NODE_PATH from .env first, then fall back to known installation paths
        String envNodePath = Utils.EnvManager.getInstance().get("APPIUM_NODE_PATH");
        String[] nodePathOptions = envNodePath != null && !envNodePath.isEmpty()
            ? new String[]{envNodePath, "/usr/local/bin/node", "/opt/homebrew/bin/node",
                           "/Users/abhijeet/.nvm/versions/node/v22.12.0/bin/node"}
            : new String[]{"/usr/local/bin/node", "/opt/homebrew/bin/node",
                           "/Users/abhijeet/.nvm/versions/node/v22.12.0/bin/node"};

        String[] appiumPathOptions = {
            "/usr/local/lib/node_modules/appium/build/lib/main.js",
            "/opt/homebrew/lib/node_modules/appium/build/lib/main.js",
            "/Users/abhijeet/.nvm/versions/node/v22.12.0/lib/node_modules/appium/build/lib/main.js"
        };
        
        File nodeExecutable = null;
        File appiumMain = null;
        
        // Find working node executable
        for (String nodePath : nodePathOptions) {
            File nodeFile = new File(nodePath);
            if (nodeFile.exists()) {
                nodeExecutable = nodeFile;
                System.out.println("✅ Found Node.js at: " + nodePath);
                break;
            }
        }
        
        // Find working appium main script
        for (String appiumPath : appiumPathOptions) {
            File appiumFile = new File(appiumPath);
            if (appiumFile.exists()) {
                appiumMain = appiumFile;
                System.out.println("✅ Found Appium at: " + appiumPath);
                break;
            }
        }
        
        if (nodeExecutable == null || appiumMain == null) {
            throw new RuntimeException("Could not find Node.js or Appium installation. Please check your setup.");
        }
        
        builder.usingDriverExecutable(nodeExecutable);
        builder.withAppiumJS(appiumMain);

        // Set server parameters
        builder.withIPAddress("127.0.0.1");
        builder.usingPort(4723);
        builder.withArgument(GeneralServerFlag.SESSION_OVERRIDE);
        builder.withArgument(GeneralServerFlag.LOG_LEVEL, "debug");

        // Build and start the service
        service = AppiumDriverLocalService.buildService(builder);
        try {
            System.out.println("🚀 Starting local Appium server...");
            service.start();

            // Wait for server to be ready with a longer timeout
            boolean serverStarted = false;
            long startTime = System.currentTimeMillis();
            long timeout = 120000; // 120 seconds timeout (increased from 60)
            int pingAttempts = 0;

            while (!serverStarted && (System.currentTimeMillis() - startTime) < timeout) {
                try {
                    URL status = new URL("http://127.0.0.1:4723/status");
                    HttpURLConnection connection = (HttpURLConnection) status.openConnection();
                    connection.setConnectTimeout(2000);
                    connection.setReadTimeout(2000);
                    connection.connect();

                    int responseCode = connection.getResponseCode();
                    if (responseCode == 200) {
                        serverStarted = true;
                        System.out.println("✓ Appium server is ready and responding");
                    }
                    connection.disconnect();
                    pingAttempts++;
                } catch (Exception e) {
                    // Server not ready yet, wait a bit
                    pingAttempts++;
                    if (pingAttempts % 10 == 0) {
                        System.out.println("Waiting for Appium server to be ready... (" + pingAttempts + " attempts)");
                    }
                    Thread.sleep(1000);
                }
            }

            if (serverStarted) {
                System.out.println("✓ Appium server started successfully at: " + service.getUrl());
            } else {
                service.stop();
                throw new RuntimeException("Appium server didn't respond within " + (timeout/1000) + " seconds. " +
                        "Total ping attempts: " + pingAttempts);
            }
        } catch (Exception e) {
            if (service != null && service.isRunning()) {
                try {
                    service.stop();
                } catch (Exception stopException) {
                    System.err.println("Failed to stop service: " + stopException.getMessage());
                }
            }
            System.err.println("Failed to start Appium server: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to start local Appium server", e);
        }

        // Verify the server started properly
        if (!service.isRunning()) {
            throw new RuntimeException("Local Appium server failed to start!");
        }
    }

    public static void stop() {
        if (service != null && service.isRunning()) {
            try {
                System.out.println("Stopping Appium server...");
                service.stop();
                System.out.println("✓ Appium server stopped");
                service = null;
                // Give it time to release the port
                Thread.sleep(2000);
            } catch (Exception e) {
                System.err.println("Warning: Error stopping Appium server: " + e.getMessage());
                service = null;
            }
        }

        // Additional cleanup for lingering processes
        try {
            if (System.getProperty("os.name").toLowerCase().contains("mac")
                    || System.getProperty("os.name").toLowerCase().contains("linux")) {
                Runtime.getRuntime().exec("pkill -9 -f appium").waitFor();
            } else if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                Runtime.getRuntime().exec("taskkill /F /IM node.exe").waitFor();
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Warning: Could not kill remaining processes: " + e.getMessage());
        }
    }

}



