package csp.harvest_hub.controller.seller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.ProductStatus;
import csp.harvest_hub.model.Product;
import csp.harvest_hub.model.ProductUploadApplication;
import csp.harvest_hub.repository.ProductRepository;
import csp.harvest_hub.repository.ProductUploadApplicationRepository;
import csp.harvest_hub.repository.UserRepository;
import csp.harvest_hub.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/seller/product-applications/upload")
@AllArgsConstructor
public class SellerProductUploadApplicationController {

    private final ProductUploadApplicationRepository repository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final ProductRepository productRepository;

    @GetMapping("/")
    public List<ProductUploadApplication> getAllUserApplications(@RequestHeader("Authorization") String authorization) {
        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        return repository.findByAppliedById(userRepository.findByEmail(email).get().getId());
    }

    @PostMapping("/")
    public ResponseEntity<?> submitUploadApplication(
            @RequestBody Product product,
            @RequestHeader("Authorization") String authorization) {

        String email = jwtUtils.getEmailFromToken(authorization.replace("Bearer ", ""));
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid user token.");
        }

        product.setProductStatus(ProductStatus.PENDING);
        product.setSeller(userOpt.get());
        product = productRepository.save(product);

        ProductUploadApplication application = new ProductUploadApplication();
        application.setApplicationStatus(ApplicationStatus.PENDING);
        application.setAppliedBy(userOpt.get());
        application.setProduct(product);

        ProductUploadApplication saved = repository.save(application);
        return ResponseEntity.ok(saved);
    }
}
