package csp.harvest_hub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import csp.harvest_hub.dto.UserLoginDto;
import csp.harvest_hub.dto.UserRegisterDto;
import csp.harvest_hub.service.UserService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDto userRegisterDto) {
        return userService.registerUser(userRegisterDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto userLoginDto) {
        return userService.loginUser(userLoginDto);
    }

    @GetMapping("/resend-verification")
    public ResponseEntity<?> requestVerificationOtp(@RequestParam String email) {
        return userService.requestVerificationMail(email);
    }

    @PostMapping("/verify-account")
    public ResponseEntity<?> verifyAccount(
            @RequestParam String email,
            @RequestParam String otp) {
        return userService.verifyAccount(otp, email);
    }

    @GetMapping("/forgot-password/otp")
    public ResponseEntity<?> requestForgotPasswordOtp(@RequestParam String email) {
        return userService.requestForgotPasswordOtp(email);
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<?> verifyForgotPasswordOtp(
            @RequestParam String email,
            @RequestParam String otp) {
        return userService.verifyForgotPasswordOtp(email, otp);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody UserLoginDto userLoginDto) {
        return userService.resetPassword(userLoginDto.getEmail(), userLoginDto.getPassword());
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserData(@RequestParam("token") String token) {
        return userService.getUserData(token);
    }
}
