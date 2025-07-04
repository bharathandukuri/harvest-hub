package csp.harvest_hub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import csp.harvest_hub.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
