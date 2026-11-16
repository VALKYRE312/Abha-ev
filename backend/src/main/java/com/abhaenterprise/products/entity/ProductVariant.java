package com.abhaenterprise.products.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * ProductVariant Entity
 * 
 * Product variants (different colors, battery capacities, etc.)
 */
@Entity
@Table(name = "product_variants", indexes = {
    @Index(name = "idx_variants_product_id", columnList = "product_id"),
    @Index(name = "idx_variants_sku", columnList = "sku")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @Column(name = "sku", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Variant SKU is required")
    private String sku;

    @Column(name = "variant_name", nullable = false, length = 255)
    @NotBlank(message = "Variant name is required")
    private String variantName;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "color_hex", length = 7)
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color hex must be valid")
    private String colorHex;

    @Column(name = "battery_capacity_kwh", precision = 10, scale = 2)
    private BigDecimal batteryCapacityKwh;

    @Column(name = "range_km")
    private Integer rangeKm;

    @Column(name = "motor_power_kw", precision = 10, scale = 2)
    private BigDecimal motorPowerKw;

    @Column(name = "max_speed_kmh")
    private Integer maxSpeedKmh;

    @Column(name = "charging_time_hrs", precision = 5, scale = 2)
    private BigDecimal chargingTimeHrs;

    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal basePrice;

    @Column(name = "tax_rate", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Tax rate cannot be negative")
    private BigDecimal taxRate;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "weight_kg", precision = 10, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "warranty_months")
    private Integer warrantyMonths;

    // Business methods
    public BigDecimal calculateFinalPrice() {
        if (taxRate == null || taxRate.compareTo(BigDecimal.ZERO) == 0) {
            return basePrice;
        }
        BigDecimal taxAmount = basePrice.multiply(taxRate).divide(new BigDecimal("100"));
        return basePrice.add(taxAmount);
    }

    public void markAvailable() {
        this.isAvailable = true;
    }

    public void markUnavailable() {
        this.isAvailable = false;
    }
}
