package csp.harvest_hub.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.ProductStatus;
import csp.harvest_hub.model.Product;
import csp.harvest_hub.model.ProductDeleteApplication;
import csp.harvest_hub.repository.ProductDeleteApplicationRepository;
import csp.harvest_hub.repository.ProductRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.Data;

@RestController
@RequestMapping("/admin/seller-products/delete")
@AllArgsConstructor
public class AdminProductDeleteApplicationController {

    private final ProductDeleteApplicationRepository repository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @GetMapping
    public List<ProductDeleteApplication> getAllDeleteApplications() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeleteApplicationStatus(
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
            return ResponseEntity.status(404).body("Delete application not found.");
        }

        var application = applicationOpt.get();
        Product product = application.getProduct();

        if (statusWrapper.status == ApplicationStatus.APPROVED) {
            product.setProductStatus(ProductStatus.ARCHIVED); // Or DELETED if you have it
        }

        application.setApplicationStatus(statusWrapper.status);
        productRepository.save(product);
        repository.save(application);

        return ResponseEntity.ok("Delete application status updated successfully.");
    }

    @Data
    public static class TempApplicationStatus {
        public ApplicationStatus status;
    }
}
