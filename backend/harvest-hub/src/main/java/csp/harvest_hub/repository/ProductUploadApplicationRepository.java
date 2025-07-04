package csp.harvest_hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import csp.harvest_hub.model.ProductUploadApplication;

public interface ProductUploadApplicationRepository extends JpaRepository<ProductUploadApplication, Long> {
    public List<ProductUploadApplication> findByAppliedById(Long id);

}
