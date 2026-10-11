package csp.harvest_hub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.enums.Category;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "seller_applications")
public class SellerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User appliedBy;

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false, length = 2048)
    private String businessLogoUrl;

    @Embedded
    private Location farmLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(length = 1000, nullable = false)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "seller_application_categories", joinColumns = @JoinColumn(name = "application_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private List<Category> categories;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "seller_application_produce_details", joinColumns = @JoinColumn(name = "application_id"))
    private List<ProduceDetail> produceDetails;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public void addProduceDetail(ProduceDetail detail) {
        if (this.produceDetails == null) {
            this.produceDetails = new java.util.ArrayList<>();
        }
        this.produceDetails.add(detail);
    }
}