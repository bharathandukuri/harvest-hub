package csp.harvest_hub.controller.admin;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.Role;
import csp.harvest_hub.model.SellerApplication;
import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.SellerApplicationRepository;
import csp.harvest_hub.repository.UserRepository;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/admin/seller-applications")
@AllArgsConstructor
public class AdminSellerApplicationsController {

    private SellerApplicationRepository sApplicationRepository;
    private UserRepository userRepository;

    @GetMapping("/")
    public List<SellerApplication> getAllApplications() {
        return sApplicationRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {

        Optional<SellerApplication> optionalApplication = sApplicationRepository.findById(id);
        if (optionalApplication.isEmpty()) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "Seller application not found with ID: " + id));
        }

        SellerApplication application = optionalApplication.get();

        if (request.getStatus() == ApplicationStatus.APPROVED) {

            Optional<User> userOpt = userRepository.findById(application.getAppliedBy().getId());
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(
                        Map.of("message", "User associated with the application was not found."));
            }

            User user = userOpt.get();
            user.setRole(Role.SELLER);
            user.setBusinessName(application.getBusinessName());
            user.setBusinessLogoUrl(application.getBusinessLogoUrl());
            user.setFarmLocation(application.getFarmLocation());
            user.setSellingCategories(new ArrayList<>(application.getCategories()));
            user.setDescription(application.getDescription());
            userRepository.save(user);
        }

        application.setStatus(request.getStatus());
        sApplicationRepository.save(application);

        return ResponseEntity.ok(
                Map.of("message", "Application ID " + id + " status successfully updated to " + request.getStatus()));
    }

    @lombok.Data
    public static class StatusUpdateRequest {
        private ApplicationStatus status;
    }
}
