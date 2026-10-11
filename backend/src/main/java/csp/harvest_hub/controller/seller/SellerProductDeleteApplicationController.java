package csp.harvest_hub.controller.seller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.model.ProductDeleteApplication;
import csp.harvest_hub.repository.ProductDeleteApplicationRepository;
import csp.harvest_hub.repository.ProductRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/seller/product-applications/delete")
@AllArgsConstructor
public class SellerProductDeleteApplicationController {

    private final ProductDeleteApplicationRepository repository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final JwtUtils jwtUtils;

    @GetMapping("/")
    public List<ProductDeleteApplication> getAllUserDeleteApplications(
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        Long userId = userRepository.findByEmail(email).get().getId();
        return repository.findByAppliedById(userId);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> submitDeleteApplication(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid user token.");
        }
        var user = userOpt.get();

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found.");
        }

        boolean alreadyPending = repository.existsByAppliedByIdAndProductIdAndApplicationStatus(
                user.getId(), productId, ApplicationStatus.PENDING);

        if (alreadyPending) {
            return ResponseEntity.badRequest().body("You already have a pending delete request for this product.");
        }

        ProductDeleteApplication application = new ProductDeleteApplication();
        application.setAppliedBy(user);
        application.setProduct(productOpt.get());
        application.setApplicationStatus(ApplicationStatus.PENDING);

        ProductDeleteApplication saved = repository.save(application);
        return ResponseEntity.ok(saved);
    }
}
