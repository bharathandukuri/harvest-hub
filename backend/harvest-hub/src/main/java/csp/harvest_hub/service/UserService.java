package csp.harvest_hub.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import csp.harvest_hub.dto.UserLoginDto;
import csp.harvest_hub.dto.UserRegisterDto;
import csp.harvest_hub.dto.UserResponseDto;
import csp.harvest_hub.enums.ResponseCode;
import csp.harvest_hub.enums.Role;
import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import csp.harvest_hub.util.OtpUtil;
import csp.harvest_hub.util.ResponseFactory;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    private static final int OTP_EXPIRY_MINUTES = 1;
    private static final int PASSWORD_RESET_EXPIRY_MINUTES = 5;

    public ResponseEntity<?> loginUser(UserLoginDto userLoginDto) {
        Optional<User> userOpt = userRepository.findByEmail(userLoginDto.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User with this email does not exist.");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            return ResponseFactory.error(ResponseCode.INVALID_CREDENTIALS, "Invalid credentials.");
        }

        if (!user.isAccountVerified()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_VERIFIED, "User is not verified.");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        Date expiryDate = jwtUtils.getExpiration(token);
        UserResponseDto userDto = new UserResponseDto(user.getFullName(), user.getEmail(),
                user.getRole());

        return ResponseFactory.success(
                ResponseCode.LOGIN_SUCCESS,
                "Login successful.",
                Map.of(
                        "token", token,
                        "tokenExpiry", expiryDate.toInstant().toString(),
                        "tokenExpiryInSeconds", expiryDate.toInstant().getEpochSecond(),
                        "user", userDto));
    }

    public ResponseEntity<?> registerUser(UserRegisterDto userRegisterDto) {
        if (userRepository.existsByEmail(userRegisterDto.getEmail())) {
            return ResponseFactory.error(ResponseCode.USER_EXISTS, "User already exists with this email.");
        }

        User newUser = new User();
        newUser.setEmail(userRegisterDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));
        newUser.setFullName(userRegisterDto.getFullName());
        newUser.setRole(Role.USER);

        String otp = OtpUtil.generateOtp();
        newUser.setLastVerificationOtp(otp);
        newUser.setVerificationOtpGeneratedAt(LocalDateTime.now());
        userRepository.save(newUser);

        sendOtpMail(newUser.getEmail(), "Harvest Hub - Verify Your Email",
                "Thanks for registering. Please verify your email using the OTP below:", otp);

        return ResponseFactory.success(ResponseCode.REGISTRATION_SUCCESS,
                "Registration successful. An OTP has been sent to your email.", null);
    }

    public ResponseEntity<?> requestVerificationMail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();
        String otp = OtpUtil.generateOtp();
        user.setLastVerificationOtp(otp);
        user.setVerificationOtpGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

        sendOtpMail(email, "Harvest Hub - Verify Your Email", "Please verify your email using the OTP below:", otp);

        return ResponseFactory.success(ResponseCode.VERIFICATION_SENT, "Verification email sent.", null);
    }

    public ResponseEntity<?> verifyAccount(String otp, String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();
        if (!otp.equals(user.getLastVerificationOtp()) ||
                OtpUtil.isOtpExpired(user.getVerificationOtpGeneratedAt(), OTP_EXPIRY_MINUTES)) {
            return ResponseFactory.error(ResponseCode.INVALID_OTP, "Invalid or expired OTP.");
        }

        user.setAccountVerified(true);
        user.setLastVerificationOtp(null);
        user.setVerificationOtpGeneratedAt(null);
        userRepository.save(user);

        return ResponseFactory.success(ResponseCode.USER_VERIFIED, "Account verified successfully.", null);
    }

    public ResponseEntity<?> requestForgotPasswordOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();
        String otp = OtpUtil.generateOtp();
        user.setLastForgotPasswordOtp(otp);
        user.setForgotPasswordOtpGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

        sendOtpMail(email, "Harvest Hub - Reset Your Password", "Use the following OTP to reset your password:", otp);

        return ResponseFactory.success(ResponseCode.VERIFICATION_SENT, "OTP for password reset sent to your email.",
                null);
    }

    public ResponseEntity<?> verifyForgotPasswordOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();
        if (!otp.equals(user.getLastForgotPasswordOtp()) ||
                OtpUtil.isOtpExpired(user.getForgotPasswordOtpGeneratedAt(), OTP_EXPIRY_MINUTES)) {
            return ResponseFactory.error(ResponseCode.INVALID_OTP, "Invalid or expired OTP.");
        }

        user.setLastForgotPasswordOtp(null);
        user.setForgotPasswordOtpGeneratedAt(null);
        user.setForgotPasswordOtpVerified(true);
        user.setForgotPasswordOtpVerifiedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseFactory.success(ResponseCode.USER_VERIFIED, "OTP verified. You can now reset your password.",
                null);
    }

    public ResponseEntity<?> resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();

        if (!Boolean.TRUE.equals(user.isForgotPasswordOtpVerified()) ||
                user.getForgotPasswordOtpVerifiedAt() == null ||
                user.getForgotPasswordOtpVerifiedAt().plusMinutes(PASSWORD_RESET_EXPIRY_MINUTES)
                        .isBefore(LocalDateTime.now())) {

            return ResponseFactory.error(ResponseCode.UNAUTHORIZED, "OTP verification expired. Please verify again.");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            return ResponseFactory.error(ResponseCode.VALIDATION_FAILED, "New password cannot be same as the old one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setForgotPasswordOtpVerified(false);
        user.setForgotPasswordOtpVerifiedAt(null);
        user.setLastForgotPasswordOtp(null);
        user.setForgotPasswordOtpGeneratedAt(null);
        userRepository.save(user);

        return ResponseFactory.success(ResponseCode.PASSWORD_RESET_SUCCESS, "Password reset successfully.", null);
    }

    private void sendOtpMail(String email, String title, String description, String otp) {
        String htmlContent = """
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>%s</title>
                        <style>
                            body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 30px; }
                            .container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #ccc; max-width: 500px; margin: auto; }
                            .otp { font-size: 24px; font-weight: bold; color: #2E86C1; margin-top: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>%s</h2>
                            <p>%s</p>
                            <p class="otp">%s</p>
                        </div>
                    </body>
                    </html>
                """
                .formatted(title, title, description, otp);

        emailService.sendHtmlEmail(email, title, htmlContent);
    }

    public ResponseEntity<?> getUserData(String token) {
        String email = jwtUtils.getEmailFromToken(token);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();

        return ResponseFactory.success(ResponseCode.SUCCESS, "User data retrieved successfully", user);
    }
}
