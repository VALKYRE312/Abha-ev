package com.abhaenterprise.orders.dto;

import com.abhaenterprise.common.enums.BookingStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Booking DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private UUID id;
    private String bookingNumber;

    private UUID customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private UUID productId;
    private String productName;
    private UUID productVariantId;
    private String variantName;

    private Instant bookingDate;
    private BookingStatus status;

    @NotNull(message = "Vehicle price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal vehiclePrice;

    @DecimalMin(value = "0.0")
    private BigDecimal bookingAmount;

    private Instant expectedDeliveryDate;
    private String customerNotes;
    private String internalNotes;

    private Instant confirmedAt;
    private Instant completedAt;
    private Instant cancelledAt;
    private String cancellationReason;

    private Instant createdAt;
    private Instant updatedAt;
}
