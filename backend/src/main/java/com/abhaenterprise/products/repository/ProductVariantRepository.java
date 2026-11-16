package com.abhaenterprise.products.repository;

import com.abhaenterprise.products.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Product Variant Repository
 */
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {

    Optional<ProductVariant> findBySku(String sku);

    List<ProductVariant> findByProductId(UUID productId);

    List<ProductVariant> findByProductIdAndIsAvailable(UUID productId, Boolean isAvailable);

    boolean existsBySku(String sku);
}
