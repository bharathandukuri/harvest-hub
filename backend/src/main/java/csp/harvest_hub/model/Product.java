package csp.harvest_hub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import csp.harvest_hub.enums.ProductStatus;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    private String description;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;

    private String price;

    private String stock;

    @ElementCollection
    @CollectionTable(name = "product_badges", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "badge_name")
    private List<String> badges;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    private ProductStatus productStatus;

    @Transient
    public double getRating() {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
