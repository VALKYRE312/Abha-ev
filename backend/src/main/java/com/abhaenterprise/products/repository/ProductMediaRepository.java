package com.abhaenterprise.products.repository;

import com.abhaenterprise.products.entity.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Product Media Repository
 */
@Repository
public interface ProductMediaRepository extends JpaRepository<ProductMedia, UUID> {

    List<ProductMedia> findByProductIdOrderByDisplayOrderAsc(UUID productId);

    Optional<ProductMedia> findByProductIdAndIsPrimary(UUID productId, Boolean isPrimary);

    List<ProductMedia> findByProductIdAndMediaType(UUID productId, String mediaType);
}
