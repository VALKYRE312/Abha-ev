package com.abhaenterprise.products.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Create Product Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {
    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    private String slug;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 255)
    private String name;

    private String shortDescription;
    private String description;

    @NotBlank(message = "Product type is required")
    private String productType;

    private UUID brandId;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    private Boolean isFeatured;
    private String metaTitle;
    private String metaDescription;
}
