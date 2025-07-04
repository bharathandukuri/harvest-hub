package csp.harvest_hub.controller;

import csp.harvest_hub.dto.UserProfileDto;
import csp.harvest_hub.enums.ResponseCode;
import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import csp.harvest_hub.util.ResponseFactory;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/profile")
@AllArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtils.getEmailFromToken(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found");
        }

        User user = userOpt.get();
        UserProfileDto dto = UserProfileDto.fromUser(user);
        return ResponseFactory.success(ResponseCode.SUCCESS, "Profile fetched", dto);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserProfileDto profileDto) {
        String email = jwtUtils.getEmailFromToken(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found");
        }

        User user = userOpt.get();

        user.setFullName(profileDto.getFullName());
        user.setPhone(profileDto.getPhoneNumber());
        user.setBio(profileDto.getBio());
        user.setProfilePicUrl(profileDto.getProfilePicUrl());

        if (profileDto.getDateOfBirth() != null) {
            user.setDob(profileDto.getDateOfBirth());
        }

        if (profileDto.getAddress() != null) {
            user.setAddress(profileDto.getAddress());
        }

        userRepository.save(user);

        return ResponseFactory.success(ResponseCode.SUCCESS, "Profile updated", null);
    }

    @PutMapping("/image")
    public ResponseEntity<?> updateImage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("url") String imageUrl) {

        String email = jwtUtils.getEmailFromToken(authHeader.replace("Bearer ", ""));
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found");
        }

        User user = userOpt.get();
        user.setProfilePicUrl(imageUrl);
        userRepository.save(user);

        return ResponseFactory.success(ResponseCode.SUCCESS, "Profile image updated", null);
    }

}
