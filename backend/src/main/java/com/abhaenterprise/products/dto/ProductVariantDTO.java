package com.abhaenterprise.products.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Product Variant DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDTO {
    private UUID id;
    private UUID productId;

    @NotBlank(message = "Variant SKU is required")
    private String sku;

    @NotBlank(message = "Variant name is required")
    private String variantName;

    private String color;
    private String colorHex;
    private BigDecimal batteryCapacityKwh;
    private Integer rangeKm;
    private BigDecimal motorPowerKw;
    private Integer maxSpeedKmh;
    private BigDecimal chargingTimeHrs;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal basePrice;

    private BigDecimal taxRate;
    private BigDecimal finalPrice;
    private Boolean isAvailable;
    private BigDecimal weightKg;
    private Integer warrantyMonths;
    
    // Inventory info (can be added from service layer)
    private Integer availableQuantity;
}
