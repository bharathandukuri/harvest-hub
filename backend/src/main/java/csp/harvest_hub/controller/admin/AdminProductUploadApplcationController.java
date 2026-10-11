package csp.harvest_hub.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.ProductStatus;
import csp.harvest_hub.model.ProductUploadApplication;
import csp.harvest_hub.repository.ProductRepository;
import csp.harvest_hub.repository.ProductUploadApplicationRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/admin/seller-products/upload")
@AllArgsConstructor
public class AdminProductUploadApplcationController {

    private ProductUploadApplicationRepository repository;
    private ProductRepository productRepository;
    private UserRepository userRepository;
    private JwtUtils jwtUtils;

    @GetMapping()
    public List<ProductUploadApplication> getAllApplications() {
        return repository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplicationStatus(
            @RequestBody TempApplicationStatus applicationStatus,
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized: Invalid user token.");
        }

        var applicationOpt = repository.findById(id);
        if (applicationOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Application not found.");
        }

        var application = applicationOpt.get();

        var productOpt = productRepository.findById(application.getProduct().getId());
        if (productOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Associated product not found.");
        }

        var product = productOpt.get();

        if (applicationStatus.status == ApplicationStatus.APPROVED) {
            product.setProductStatus(ProductStatus.APPROVED);
        } else {
            product.setProductStatus(ProductStatus.REJECTED);
        }

        application.setApplicationStatus(applicationStatus.status);

        productRepository.save(product);
        repository.save(application);

        return ResponseEntity.ok("Application status updated successfully.");
    }

    @AllArgsConstructor
    public static class TempApplicationStatus {
        public ApplicationStatus status;
    }

}
