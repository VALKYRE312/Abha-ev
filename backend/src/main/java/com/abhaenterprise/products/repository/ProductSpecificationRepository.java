package com.abhaenterprise.products.repository;

import com.abhaenterprise.products.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Product Specification Repository
 */
@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, UUID> {

    List<ProductSpecification> findByProductIdOrderByDisplayOrderAsc(UUID productId);

    List<ProductSpecification> findByProductIdAndIsHighlightOrderByDisplayOrderAsc(UUID productId, Boolean isHighlight);

    List<ProductSpecification> findByProductIdAndSpecGroupOrderByDisplayOrderAsc(UUID productId, String specGroup);
}
