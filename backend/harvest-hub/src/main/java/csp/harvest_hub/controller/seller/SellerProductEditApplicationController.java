package csp.harvest_hub.controller.seller;

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
@RequestMapping("/seller/product-applications/edit")
@AllArgsConstructor
public class SellerProductEditApplicationController {

    private final ProductEditApplicationRepository repository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final JwtUtils jwtUtils;

    @GetMapping("/")
    public List<ProductEditApplication> getAllUserEditApplications(
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        Long userId = userRepository.findByEmail(email).get().getId();
        return repository.findByAppliedById(userId);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> submitEditApplication(
            @PathVariable Long productId,
            @RequestBody Product updatedProductData,
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid user token.");
        }
        var user = userOpt.get();

        var originalProductOpt = productRepository.findById(productId);
        if (originalProductOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Original product not found.");
        }

        boolean alreadyPending = repository.existsByAppliedByIdAndOriginalProductIdAndApplicationStatus(
                user.getId(), productId, ApplicationStatus.PENDING);

        if (alreadyPending) {
            return ResponseEntity.badRequest().body("You already have a pending edit request for this product.");
        }

        updatedProductData.setId(null);
        updatedProductData.setProductStatus(ProductStatus.PENDING);
        updatedProductData.setSeller(user);
        Product savedUpdatedProduct = productRepository.save(updatedProductData);

        ProductEditApplication application = new ProductEditApplication();
        application.setAppliedBy(user);
        application.setOriginalProduct(originalProductOpt.get());
        application.setUpdatedProduct(savedUpdatedProduct);
        application.setApplicationStatus(ApplicationStatus.PENDING);

        ProductEditApplication saved = repository.save(application);
        return ResponseEntity.ok(saved);
    }
}
