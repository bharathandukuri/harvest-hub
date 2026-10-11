package csp.harvest_hub.util;

import java.security.SecureRandom;
import java.time.LocalDateTime;

public class OtpUtil {
    private static final SecureRandom random = new SecureRandom();

    public static String generateOtp() {
        return String.valueOf(100000 + random.nextInt(900000));
    }

    public static boolean isOtpExpired(LocalDateTime generatedAt, int expiryMinutes) {
        if (generatedAt == null)
            return true;
        return generatedAt.plusMinutes(expiryMinutes).isBefore(LocalDateTime.now());
    }
}
