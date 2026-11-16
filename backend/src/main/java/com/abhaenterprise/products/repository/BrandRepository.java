package com.abhaenterprise.products.repository;

import com.abhaenterprise.products.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Brand Repository
 */
@Repository
public interface BrandRepository extends JpaRepository<Brand, UUID> {

    Optional<Brand> findBySlug(String slug);

    List<Brand> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);

    List<Brand> findAllByOrderByDisplayOrderAsc();

    boolean existsBySlug(String slug);

    boolean existsByName(String name);
}
