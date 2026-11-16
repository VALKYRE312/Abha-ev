package com.abhaenterprise.orders.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.customers.entity.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Order Entity
 * 
 * Customer purchase orders with line items, payments, and fulfilment tracking.
 */
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_orders_customer_id", columnList = "customer_id"),
    @Index(name = "idx_orders_order_number", columnList = "order_number"),
    @Index(name = "idx_orders_status", columnList = "status"),
    @Index(name = "idx_orders_payment_status", columnList = "payment_status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Order number is required")
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private Customer customer;

    @Column(name = "order_type", nullable = false, length = 50)
    @NotBlank(message = "Order type is required")
    @Builder.Default
    private String orderType = "purchase";

    @Column(name = "status", nullable = false, length = 50)
    @NotBlank(message = "Status is required")
    @Builder.Default
    private String status = "pending_confirmation";

    @Column(name = "payment_status", nullable = false, length = 50)
    @NotBlank(message = "Payment status is required")
    @Builder.Default
    private String paymentStatus = "pending";

    @Column(name = "fulfilment_status", nullable = false, length = 50)
    @NotBlank(message = "Fulfilment status is required")
    @Builder.Default
    private String fulfilmentStatus = "pending";

    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.0", message = "Subtotal must be positive")
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "tax_amount", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Tax amount is required")
    @DecimalMin(value = "0.0", message = "Tax amount must be positive")
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "delivery_charge", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Column(name = "grand_total", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Grand total is required")
    @DecimalMin(value = "0.0", message = "Grand total must be positive")
    private BigDecimal grandTotal;

    @Column(name = "currency", length = 3)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "customer_note", columnDefinition = "TEXT")
    private String customerNote;

    @Column(name = "internal_note", columnDefinition = "TEXT")
    private String internalNote;

    // Business methods
    public void calculateGrandTotal() {
        this.grandTotal = subtotal
                .add(taxAmount)
                .add(deliveryCharge)
                .subtract(discountAmount);
    }

    public void confirm() {
        this.status = "confirmed";
    }

    public void markAsPaid() {
        this.paymentStatus = "paid";
    }

    public void startProcessing() {
        this.status = "processing";
        this.fulfilmentStatus = "processing";
    }

    public void deliver() {
        this.status = "delivered";
        this.fulfilmentStatus = "delivered";
    }

    public boolean isPaid() {
        return "paid".equals(this.paymentStatus);
    }
}
