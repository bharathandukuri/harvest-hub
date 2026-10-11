package csp.harvest_hub.controller.admin;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.ProductStatus;
import csp.harvest_hub.model.Product;
import csp.harvest_hub.model.ProductEditApplication;
import csp.harvest_hub.repository.ProductEditApplicationRepository;
import csp.harvest_hub.repository.ProductRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/admin/seller-products/edit")
@AllArgsConstructor
public class AdminProductEditApplicationController {

    private final ProductEditApplicationRepository repository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @GetMapping
    public List<ProductEditApplication> getAllEditApplications() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEditApplicationStatus(
            @PathVariable Long id,
            @RequestBody TempApplicationStatus statusWrapper,
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized: Invalid user token.");
        }

        var applicationOpt = repository.findById(id);
        if (applicationOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Edit application not found.");
        }

        var application = applicationOpt.get();
        Product original = application.getOriginalProduct();
        Product updated = application.getUpdatedProduct();

        if (statusWrapper.status == ApplicationStatus.APPROVED) {

            original.setName(updated.getName());
            original.setDescription(updated.getDescription());
            original.setPrice(updated.getPrice());
            original.setBadges(new ArrayList<>(updated.getBadges()));
            original.setStock(updated.getStock());
            original.setImages(new ArrayList<>(updated.getImages()));
            original.setProductStatus(ProductStatus.APPROVED);
            updated.setProductStatus(ProductStatus.ARCHIVED);
        } else {
            updated.setProductStatus(ProductStatus.REJECTED);
        }

        application.setApplicationStatus(statusWrapper.status);
        productRepository.save(original);
        productRepository.save(updated);
        repository.save(application);

        return ResponseEntity.ok("Edit application status updated successfully.");
    }

    @AllArgsConstructor
    public static class TempApplicationStatus {
        public ApplicationStatus status;
    }
}
