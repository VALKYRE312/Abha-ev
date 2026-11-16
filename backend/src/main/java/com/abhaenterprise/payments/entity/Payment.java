package com.abhaenterprise.payments.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.common.enums.PaymentStatus;
import com.abhaenterprise.orders.entity.Order;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Payment Entity
 * 
 * Payment records for orders and bookings.
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_order_id", columnList = "order_id"),
    @Index(name = "idx_payments_payment_number", columnList = "payment_number"),
    @Index(name = "idx_payments_status", columnList = "status"),
    @Index(name = "idx_payments_reference", columnList = "reference_type, reference_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Column(name = "payment_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Payment number is required")
    private String paymentNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private UUID referenceId;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be positive")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "payment_method", nullable = false, length = 50)
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @Column(name = "payment_provider", length = 100)
    private String paymentProvider;

    @Column(name = "transaction_id", length = 255)
    private String transactionId;

    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;

    @Column(name = "payment_date")
    private Instant paymentDate;

    @Column(name = "processed_at")
    private Instant processedAt;

    @Column(name = "failed_at")
    private Instant failedAt;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "refunded_at")
    private Instant refundedAt;

    @Column(name = "refund_amount", precision = 12, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Business methods
    public void markProcessing() {
        this.status = PaymentStatus.PROCESSING;
    }

    public void markCompleted(String transactionId) {
        this.status = PaymentStatus.COMPLETED;
        this.transactionId = transactionId;
        this.processedAt = Instant.now();
        this.paymentDate = Instant.now();
    }

    public void markFailed(String reason) {
        this.status = PaymentStatus.FAILED;
        this.failureReason = reason;
        this.failedAt = Instant.now();
    }

    public void markRefunded(BigDecimal refundAmount) {
        this.status = PaymentStatus.REFUNDED;
        this.refundAmount = refundAmount;
        this.refundedAt = Instant.now();
    }

    public void markPartiallyRefunded(BigDecimal refundAmount) {
        this.status = PaymentStatus.PARTIALLY_REFUNDED;
        this.refundAmount = refundAmount;
        this.refundedAt = Instant.now();
    }

    public boolean isCompleted() {
        return PaymentStatus.COMPLETED.equals(status);
    }

    public boolean canBeRefunded() {
        return PaymentStatus.COMPLETED.equals(status);
    }
}
