package Utils;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvManager {

    private static EnvManager instance;
    private final Dotenv dotenv;

    private EnvManager() {
        dotenv = Dotenv.configure()
                .ignoreIfMissing()   // no crash if .env absent — CI uses real OS env vars
                .load();
    }

    public static EnvManager getInstance() {
        if (instance == null) {
            instance = new EnvManager();
        }
        return instance;
    }

    /**
     * Returns the value for the given env key.
     * Checks .env file first, then OS environment variables.
     * Returns null if not found in either.
     */
    public String get(String envKey) {
        try {
            return dotenv.get(envKey);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Converts a .properties key to its UPPER_SNAKE_CASE env var equivalent.
     *
     * Examples:
     *   "appium.server.url"  →  "APPIUM_SERVER_URL"
     *   "udid.ios"           →  "UDID_IOS"
     *   "shubhamEmail"       →  "SHUBHAM_EMAIL"
     *   "android.app.package"→  "ANDROID_APP_PACKAGE"
     */
    public static String toEnvKey(String propertyKey) {
        return propertyKey
                .replaceAll("([a-z])([A-Z])", "$1_$2")   // camelCase → snake_case
                .replace(".", "_")                         // dots → underscores
                .replace("-", "_")                         // hyphens → underscores
                .toUpperCase();
    }
}
