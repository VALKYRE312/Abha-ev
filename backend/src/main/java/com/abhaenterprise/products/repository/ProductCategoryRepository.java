package com.abhaenterprise.products.repository;

import com.abhaenterprise.products.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Product Category Repository
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {

    Optional<ProductCategory> findBySlug(String slug);

    @Query("SELECT c FROM ProductCategory c WHERE c.parent IS NULL AND c.isActive = true ORDER BY c.displayOrder ASC")
    List<ProductCategory> findTopLevelCategories();

    List<ProductCategory> findByParentIdAndIsActiveOrderByDisplayOrderAsc(UUID parentId, Boolean isActive);

    List<ProductCategory> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);

    List<ProductCategory> findAllByOrderByDisplayOrderAsc();

    boolean existsBySlug(String slug);

    boolean existsByName(String name);
}
