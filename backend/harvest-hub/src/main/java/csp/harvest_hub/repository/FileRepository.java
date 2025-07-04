package csp.harvest_hub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import csp.harvest_hub.model.File;

public interface FileRepository extends JpaRepository<File, Long> {

}
