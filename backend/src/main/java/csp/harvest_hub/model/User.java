package csp.harvest_hub.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import csp.harvest_hub.enums.Category;
import csp.harvest_hub.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private boolean isAccountVerified = false;

    private String lastVerificationOtp;
    private LocalDateTime verificationOtpGeneratedAt;

    private String lastForgotPasswordOtp;
    private LocalDateTime forgotPasswordOtpGeneratedAt;

    private boolean forgotPasswordOtpVerified;
    private LocalDateTime forgotPasswordOtpVerifiedAt;

    private String profilePicUrl;
    private String bio;

    @Column(length = 15)
    private String phone;

    private LocalDate dob;

    @Embedded
    private Address address;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // seller properties
    @Column(unique = true, nullable = true)
    private String businessName;

    @Column(length = 1000, nullable = true)
    private String description;

    private String businessLogoUrl;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Product> products;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_selling_categories", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "category")
    private List<Category> sellingCategories;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "landmark", column = @Column(name = "farm_landmark")),
            @AttributeOverride(name = "street", column = @Column(name = "farm_street")),
            @AttributeOverride(name = "city", column = @Column(name = "farm_city")),
            @AttributeOverride(name = "district", column = @Column(name = "farm_district")),
            @AttributeOverride(name = "state", column = @Column(name = "farm_state")),
            @AttributeOverride(name = "country", column = @Column(name = "farm_country")),
            @AttributeOverride(name = "pincode", column = @Column(name = "farm_pincode")),
            @AttributeOverride(name = "latitude", column = @Column(name = "farm_latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "farm_longitude"))
    })
    private Location farmLocation;

    @Transient
    public double getRating() {
        if (products == null || products.isEmpty()) {
            return 0.0;
        }
        return products.stream()
                .mapToDouble(Product::getRating)
                .average()
                .orElse(0.0);
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Notification> notifications;
}
