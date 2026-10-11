package csp.harvest_hub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import csp.harvest_hub.model.Product;
import csp.harvest_hub.enums.ProductStatus;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductStatus(ProductStatus productStatus);
}
