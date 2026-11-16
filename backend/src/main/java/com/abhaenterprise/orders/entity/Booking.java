package com.abhaenterprise.orders.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.common.enums.BookingStatus;
import com.abhaenterprise.customers.entity.Customer;
import com.abhaenterprise.products.entity.Product;
import com.abhaenterprise.products.entity.ProductVariant;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Booking Entity
 * 
 * Vehicle booking/reservation before final purchase.
 */
@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_bookings_customer_id", columnList = "customer_id"),
    @Index(name = "idx_bookings_booking_number", columnList = "booking_number"),
    @Index(name = "idx_bookings_status", columnList = "status"),
    @Index(name = "idx_bookings_product_id", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @Column(name = "booking_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Booking number is required")
    private String bookingNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Column(name = "booking_date", nullable = false)
    @Builder.Default
    private Instant bookingDate = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "vehicle_price", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Vehicle price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal vehiclePrice;

    @Column(name = "booking_amount", precision = 12, scale = 2)
    @DecimalMin(value = "0.0", message = "Booking amount cannot be negative")
    private BigDecimal bookingAmount;

    @Column(name = "expected_delivery_date")
    private Instant expectedDeliveryDate;

    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    // Business methods
    public void confirm() {
        this.status = BookingStatus.CONFIRMED;
        this.confirmedAt = Instant.now();
    }

    public void markDepositPaid() {
        this.status = BookingStatus.DEPOSIT_PAID;
    }

    public void markReadyForDelivery() {
        this.status = BookingStatus.READY_FOR_DELIVERY;
    }

    public void complete() {
        this.status = BookingStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    public void cancel(String reason) {
        this.status = BookingStatus.CANCELLED;
        this.cancelledAt = Instant.now();
        this.cancellationReason = reason;
    }

    public boolean isCancellable() {
        return status == BookingStatus.PENDING || status == BookingStatus.CONFIRMED;
    }
}
