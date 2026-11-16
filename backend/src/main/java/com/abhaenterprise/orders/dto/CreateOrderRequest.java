package com.abhaenterprise.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Create Order Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    @NotEmpty(message = "Order items are required")
    @Valid
    private List<CreateOrderItemRequest> items;

    private String deliveryType;
    private String deliveryAddressLine1;
    private String deliveryAddressLine2;
    private String deliveryCity;
    private String deliveryState;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String deliveryPincode;

    private String customerNotes;
}
