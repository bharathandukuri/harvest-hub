package csp.harvest_hub.controller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.UserRepository;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/admin/user")
@AllArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<User> emailOwner = userRepository.findByEmail(updatedUser.getEmail());
        if (emailOwner.isPresent() && !emailOwner.get().getId().equals(id)) {
            return ResponseEntity
                    .status(409)
                    .body("Email is already taken by another user.");
        }

        User existingUser = optionalUser.get();

        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());
        existingUser.setAccountVerified(updatedUser.isAccountVerified());
        existingUser.setProfilePicUrl(updatedUser.getProfilePicUrl());
        existingUser.setBio(updatedUser.getBio());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setDob(updatedUser.getDob());
        existingUser.setAddress(updatedUser.getAddress());

        existingUser.setBusinessName(updatedUser.getBusinessName());
        existingUser.setBusinessLogoUrl(updatedUser.getBusinessLogoUrl());
        existingUser.setSellingCategories(updatedUser.getSellingCategories());
        existingUser.setFarmLocation(updatedUser.getFarmLocation());

        userRepository.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", user.isPresent());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "User deleted successfully"));
    }

    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody User newUser) {
        if (userRepository.existsByEmail(newUser.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists"));
        }

        if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        }

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}
