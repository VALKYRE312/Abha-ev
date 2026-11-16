package com.abhaenterprise.orders.dto;

import com.abhaenterprise.common.enums.OrderStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Order DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private UUID id;
    private String orderNumber;
    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private Instant orderDate;
    private OrderStatus status;

    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.0")
    private BigDecimal subtotal;

    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal deliveryCharges;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0")
    private BigDecimal totalAmount;

    private String deliveryType;
    private String deliveryAddressLine1;
    private String deliveryAddressLine2;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;

    private String customerNotes;
    private String internalNotes;

    private Instant confirmedAt;
    private Instant deliveredAt;
    private Instant cancelledAt;
    private String cancellationReason;

    private List<OrderItemDTO> orderItems;

    private Instant createdAt;
    private Instant updatedAt;
}
