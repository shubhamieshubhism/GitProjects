package Utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertyManager {
    private static final String DEFAULT_CONFIG_FILE = "src/test/resources/config.properties";
    private Properties properties;

    public PropertyManager() {
        this(getConfigFileName());
    }
    
    public PropertyManager(String configFileName) {
        properties = new Properties();
        try {
            FileInputStream fis = new FileInputStream(configFileName);
            properties.load(fis);
            fis.close();
            System.out.println("✅ Loaded configuration from: " + configFileName);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load config properties from " + configFileName + ": " + e.getMessage());
        }
    }
    
    private static String getConfigFileName() {
        // Check for system property to override config file
        String configFile = System.getProperty("config.file");
        if (configFile != null && !configFile.isEmpty()) {
            return "src/test/resources/" + configFile;
        }
        
        // Check for platform-specific config
        String platform = System.getProperty("platform");
        if ("ios".equalsIgnoreCase(platform)) {
            return "src/test/resources/config-ios.properties";
        } else if ("android".equalsIgnoreCase(platform)) {
            return DEFAULT_CONFIG_FILE;
        }
        
        return DEFAULT_CONFIG_FILE;
    }

    public String getProperty(String key) {
        String envValue = EnvManager.getInstance().get(EnvManager.toEnvKey(key));
        if (envValue != null && !envValue.isEmpty()) {
            return envValue;
        }
        return properties.getProperty(key);
    }
}