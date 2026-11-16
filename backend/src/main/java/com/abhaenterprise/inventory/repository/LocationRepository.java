package com.abhaenterprise.inventory.repository;

import com.abhaenterprise.inventory.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Location Repository
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {

    Optional<Location> findByCode(String code);

    Optional<Location> findByIsDefault(Boolean isDefault);

    List<Location> findByIsActive(Boolean isActive);

    List<Location> findByLocationType(String locationType);

    boolean existsByCode(String code);
}
