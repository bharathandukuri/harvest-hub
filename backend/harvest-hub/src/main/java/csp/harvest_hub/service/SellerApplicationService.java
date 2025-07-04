package csp.harvest_hub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.ResponseCode;
import csp.harvest_hub.enums.Role;
import csp.harvest_hub.model.SellerApplication;
import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.SellerApplicationRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import csp.harvest_hub.util.ResponseFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerApplicationService {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final SellerApplicationRepository sellerApplicationRepository;

    public ResponseEntity<?> submitApplication(SellerApplication sellerApplication, String token) {

        String email = jwtUtils.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseFactory.error(ResponseCode.USER_NOT_FOUND, "User not found.");
        }

        User user = userOpt.get();

        if (user.getRole() == Role.SELLER || user.getRole() == Role.ADMIN) {
            return ResponseFactory.warning(
                    ResponseCode.UNAUTHORIZED,
                    "You are not allowed to submit this application.",
                    null);
        }

        List<SellerApplication> existingApps = sellerApplicationRepository.findByAppliedById(user.getId());
        boolean hasPending = existingApps.stream()
                .anyMatch(app -> app.getStatus() == ApplicationStatus.PENDING);

        if (hasPending) {
            return ResponseFactory.warning(
                    ResponseCode.APPLICATION_ALREADY_EXITS,
                    "You already have a pending seller application.",
                    null);
        }

        sellerApplication.setAppliedBy(user);
        sellerApplicationRepository.save(sellerApplication);

        return ResponseFactory.success(
                ResponseCode.SUCCESS,
                "Application submitted successfully.");
    }

    public ResponseEntity<?> getAllUserApplications(String token) {

        var userOpt = userRepository.findByEmail(jwtUtils.getEmailFromToken(token));
        if (userOpt.isPresent()) {
            return ResponseFactory.success(ResponseCode.SUCCESS, "User applications retrived",
                    sellerApplicationRepository.findByAppliedById(userOpt.get().getId()));
        }
        throw new UnsupportedOperationException();
    }
}
