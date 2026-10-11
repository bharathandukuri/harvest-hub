package csp.harvest_hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import csp.harvest_hub.model.SellerApplication;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, Long> {
    List<SellerApplication> findByAppliedById(Long id);
}
