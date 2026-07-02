package Utils;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

    public class TimeGenerator {

        private static final ZoneId ZONE_ID = ZoneId.of("Asia/Kolkata");
        private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

        public static String getStartDate() {
            ZonedDateTime now = ZonedDateTime.now(ZONE_ID);
            return now.format(FORMATTER);
        }

        public static String getStartTime() {
            ZonedDateTime startTime = ZonedDateTime.now(ZONE_ID)
                    .plusMinutes(10)
                    .withSecond(0)
                    .withNano(0);
            return startTime.format(FORMATTER);
        }

        public static String getStartTime30min() {
            ZonedDateTime startTime = ZonedDateTime.now(ZONE_ID)
                    .plusMinutes(33)
                    .withSecond(0)
                    .withNano(0);
            return startTime.format(FORMATTER);
        }

        public static String getStartTimeForEarlyArrival() {
            ZonedDateTime startTime = ZonedDateTime.now(ZONE_ID)
                    .plusMinutes(10)
                    .withSecond(0)
                    .withNano(0);
            return startTime.format(FORMATTER);
        }

        public static String getEndTime() {
            ZonedDateTime endOfDay = ZonedDateTime.now(ZONE_ID)
                    .withHour(23)
                    .withMinute(59)
                    .withSecond(0)
                    .withNano(0);
            return endOfDay.format(FORMATTER);
        }
    }

