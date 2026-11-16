package com.abhaenterprise.products.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Brand Entity
 * 
 * Vehicle manufacturers and brands.
 */
@Entity
@Table(name = "brands", indexes = {
    @Index(name = "idx_brands_slug", columnList = "slug"),
    @Index(name = "idx_brands_is_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 100)
    private String name;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase with hyphens")
    private String slug;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    // Business methods
    public void activate() {
        this.isActive = true;
    }

    public void deactivate() {
        this.isActive = false;
    }
}
