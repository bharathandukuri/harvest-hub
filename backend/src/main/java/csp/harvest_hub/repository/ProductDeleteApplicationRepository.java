package csp.harvest_hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.model.ProductDeleteApplication;

public interface ProductDeleteApplicationRepository extends JpaRepository<ProductDeleteApplication, Long> {
    public List<ProductDeleteApplication> findByAppliedById(Long id);

    boolean existsByAppliedByIdAndProductIdAndApplicationStatus(Long userId, Long productId,
            ApplicationStatus status);
}
