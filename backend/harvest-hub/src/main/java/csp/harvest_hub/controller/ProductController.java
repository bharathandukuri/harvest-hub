package csp.harvest_hub.controller;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import csp.harvest_hub.dto.ReviewRequest;
import csp.harvest_hub.enums.ProductStatus;
import csp.harvest_hub.model.Product;
import csp.harvest_hub.model.Review;
import csp.harvest_hub.model.User;
import csp.harvest_hub.repository.ProductRepository;
import csp.harvest_hub.repository.ReviewRepository;
import csp.harvest_hub.repository.UserRepository;
import java.util.Collections;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/products")
@AllArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByProductStatus(ProductStatus.APPROVED);
    }

    @GetMapping("/top")
    public List<Product> getTop5RatedProducts() {
        List<Product> products = productRepository.findByProductStatus(ProductStatus.APPROVED);

        List<Product> ratedProducts = products.stream()
                .filter(p -> p.getRating() > 0)
                .sorted(Comparator.comparingDouble(Product::getRating).reversed())
                .limit(5)
                .collect(Collectors.toList());

        if (ratedProducts.isEmpty()) {
            Collections.shuffle(products);
            return products.stream().limit(5).collect(Collectors.toList());
        }

        return ratedProducts;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> writeReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest request) {

        var productOpt = productRepository.findById(productId);
        var userOpt = userRepository.findById(request.getUserId());

        if (productOpt.isEmpty())
            return ResponseEntity.notFound().build();
        if (userOpt.isEmpty())
            return ResponseEntity.badRequest().body("User not found");

        Product product = productOpt.get();
        User user = userOpt.get();

        Review review = new Review();
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setDescription(request.getDescription());
        review.setImages(request.getImages());
        review.setBy(user);
        review.setProduct(product);

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }
}
