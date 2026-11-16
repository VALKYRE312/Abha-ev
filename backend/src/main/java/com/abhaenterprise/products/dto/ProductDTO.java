package com.abhaenterprise.products.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Product DTO for list views
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    
    private UUID id;
    private String sku;
    private String slug;
    private String name;
    private String shortDescription;
    private String productType;
    private String status;
    private Boolean isFeatured;
    
    private BrandDTO brand;
    private CategoryDTO category;
    private MediaDTO primaryImage;
    private PriceRangeDTO priceRange;
    
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BrandDTO {
        private UUID id;
        private String name;
        private String slug;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDTO {
        private UUID id;
        private String name;
        private String slug;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MediaDTO {
        private String url;
        private String altText;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceRangeDTO {
        private BigDecimal min;
        private BigDecimal max;
        private String currency;
    }
}
