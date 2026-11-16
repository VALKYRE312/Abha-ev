package com.abhaenterprise.products.dto;

import com.abhaenterprise.common.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Product Summary DTO (lightweight for lists)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummaryDTO {
    private UUID id;
    private String sku;
    private String slug;
    private String name;
    private String shortDescription;
    private ProductStatus status;
    private Boolean isFeatured;
    
    // Simplified relationships
    private UUID brandId;
    private String brandName;
    private UUID categoryId;
    private String categoryName;
    
    // Primary image
    private String primaryImageUrl;
}
