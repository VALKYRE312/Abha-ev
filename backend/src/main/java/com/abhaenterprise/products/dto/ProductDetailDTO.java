package com.abhaenterprise.products.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Product Detail DTO with variants, specs, and media
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    
    private UUID id;
    private String sku;
    private String slug;
    private String name;
    private String shortDescription;
    private String description;
    private String productType;
    private String status;
    private Boolean isFeatured;
    
    private ProductDTO.BrandDTO brand;
    private ProductDTO.CategoryDTO category;
    
    private List<VariantDTO> variants;
    private List<SpecGroupDTO> specifications;
    private List<MediaDTO> media;
    
    private String metaTitle;
    private String metaDescription;
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantDTO {
        private UUID id;
        private String sku;
        private String variantName;
        private String colour;
        private String batteryOption;
        private BigDecimal price;
        private BigDecimal compareAtPrice;
        private Boolean isAvailable;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpecGroupDTO {
        private String group;
        private List<SpecDTO> specs;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpecDTO {
        private String key;
        private String label;
        private String value;
        private String unit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MediaDTO {
        private UUID id;
        private String type;
        private String url;
        private String thumbnailUrl;
        private String altText;
        private Boolean isPrimary;
        private Integer displayOrder;
    }
}
