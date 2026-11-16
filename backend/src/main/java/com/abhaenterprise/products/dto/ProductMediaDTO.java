package com.abhaenterprise.products.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Product Media DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMediaDTO {
    private UUID id;
    private UUID productId;

    @NotBlank(message = "Media type is required")
    private String mediaType;

    @NotBlank(message = "Media URL is required")
    private String mediaUrl;

    private String thumbnailUrl;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
    private Long fileSizeBytes;
    private Integer widthPx;
    private Integer heightPx;
}
