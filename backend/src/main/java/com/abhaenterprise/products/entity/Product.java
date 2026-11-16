package com.abhaenterprise.products.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.common.enums.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Product Entity
 * 
 * Core product catalogue item (EV vehicles, accessories, parts).
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_brand_id", columnList = "brand_id"),
    @Index(name = "idx_products_category_id", columnList = "category_id"),
    @Index(name = "idx_products_sku", columnList = "sku"),
    @Index(name = "idx_products_slug", columnList = "slug"),
    @Index(name = "idx_products_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Category is required")
    private ProductCategory category;

    @Column(name = "sku", nullable = false, unique = true, length = 100)
    @NotBlank(message = "SKU is required")
    private String sku;

    @Column(name = "slug", nullable = false, unique = true, length = 200)
    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase with hyphens")
    private String slug;

    @Column(name = "name", nullable = false, length = 255)
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 255)
    private String name;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "product_type", nullable = false, length = 50)
    @NotBlank(message = "Product type is required")
    private String productType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private ProductStatus status = ProductStatus.DRAFT;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    // Business methods
    public void publish() {
        this.status = ProductStatus.ACTIVE;
    }

    public void unpublish() {
        this.status = ProductStatus.DRAFT;
    }

    public void archive() {
        this.status = ProductStatus.ARCHIVED;
    }

    public boolean isActive() {
        return ProductStatus.ACTIVE.equals(this.status);
    }

    public void setAsFeatured() {
        this.isFeatured = true;
    }

    public void removeFromFeatured() {
        this.isFeatured = false;
    }
}
