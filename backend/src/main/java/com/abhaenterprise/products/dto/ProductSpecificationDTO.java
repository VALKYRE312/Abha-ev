package com.abhaenterprise.products.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Product Specification DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecificationDTO {
    private UUID id;
    private UUID productId;

    @NotBlank(message = "Specification key is required")
    private String specKey;

    @NotBlank(message = "Specification value is required")
    private String specValue;

    private String specGroup;
    private Integer displayOrder;
    private Boolean isHighlight;
}
