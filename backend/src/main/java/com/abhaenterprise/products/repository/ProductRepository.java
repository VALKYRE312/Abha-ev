package com.abhaenterprise.products.repository;

import com.abhaenterprise.products.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Product Repository
 * 
 * Data access for products.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    Optional<Product> findBySlugAndStatus(String slug, String status);
    
    Page<Product> findByStatus(String status, Pageable pageable);
    
    Page<Product> findByIsFeaturedAndStatus(Boolean isFeatured, String status, Pageable pageable);
    
    Page<Product> findByCategorySlugAndStatus(String categorySlug, String status, Pageable pageable);
    
    Page<Product> findByBrandSlugAndStatus(String brandSlug, String status, Pageable pageable);
}
