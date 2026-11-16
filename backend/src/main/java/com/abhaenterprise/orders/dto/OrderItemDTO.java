package com.abhaenterprise.orders.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Order Item DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private UUID id;
    private UUID orderId;
    private UUID productId;
    private UUID productVariantId;

    @NotBlank(message = "Product name is required")
    private String productNameSnapshot;

    private String variantNameSnapshot;
    private String skuSnapshot;

    @NotNull(message = "Quantity is required")
    @Min(value = 1)
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0")
    private BigDecimal unitPrice;

    private BigDecimal taxRate;
    private BigDecimal taxAmount;

    @NotNull(message = "Line total is required")
    private BigDecimal lineTotal;
}
