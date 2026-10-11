package csp.harvest_hub.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import csp.harvest_hub.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
