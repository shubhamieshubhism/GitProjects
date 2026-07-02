package Utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class CredentialsPropertyManager {
    private static final String CONFIG_FILE = "src/test/resources/credentials.properties";
    private Properties properties;

    public CredentialsPropertyManager() {
        properties = new Properties();
        try {
            FileInputStream fis = new FileInputStream(CONFIG_FILE);
            properties.load(fis);
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load config properties: " + e.getMessage());
        }
    }

    public String getProperty(String key) {
        String envValue = EnvManager.getInstance().get(EnvManager.toEnvKey(key));
        if (envValue != null && !envValue.isEmpty()) {
            return envValue;
        }
        return properties.getProperty(key);
    }
}
