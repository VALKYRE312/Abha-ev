package com.abhaenterprise.products.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Brand DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDTO {
    private UUID id;

    @NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must be lowercase with hyphens")
    private String slug;

    private String logoUrl;
    private String description;
    private String website;
    private Boolean isActive;
    private Integer displayOrder;
    private Instant createdAt;
    private Instant updatedAt;
}
