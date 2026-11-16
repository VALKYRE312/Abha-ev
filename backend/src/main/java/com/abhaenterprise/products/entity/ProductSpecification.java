package com.abhaenterprise.products.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * ProductSpecification Entity
 * 
 * Technical specifications and features for products.
 */
@Entity
@Table(name = "product_specifications", indexes = {
    @Index(name = "idx_specs_product_id", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @Column(name = "spec_key", nullable = false, length = 100)
    @NotBlank(message = "Specification key is required")
    private String specKey;

    @Column(name = "spec_value", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Specification value is required")
    private String specValue;

    @Column(name = "spec_group", length = 100)
    private String specGroup;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_highlight")
    @Builder.Default
    private Boolean isHighlight = false;
}
