package csp.harvest_hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import csp.harvest_hub.enums.ApplicationStatus;
import csp.harvest_hub.model.ProductEditApplication;

public interface ProductEditApplicationRepository extends JpaRepository<ProductEditApplication, Long> {
    public List<ProductEditApplication> findByAppliedById(Long id);

    boolean existsByAppliedByIdAndOriginalProductIdAndApplicationStatus(Long userId, Long productId,
            ApplicationStatus status);
}
