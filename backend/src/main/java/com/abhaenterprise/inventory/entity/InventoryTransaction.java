package com.abhaenterprise.inventory.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.common.enums.InventoryTransactionType;
import com.abhaenterprise.products.entity.ProductVariant;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * InventoryTransaction Entity
 * 
 * Audit trail for all inventory movements.
 */
@Entity
@Table(name = "inventory_transactions", indexes = {
    @Index(name = "idx_inv_trans_variant_id", columnList = "product_variant_id"),
    @Index(name = "idx_inv_trans_location_id", columnList = "location_id"),
    @Index(name = "idx_inv_trans_type", columnList = "transaction_type"),
    @Index(name = "idx_inv_trans_reference", columnList = "reference_type, reference_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    @NotNull(message = "Product variant is required")
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    @NotNull(message = "Location is required")
    private Location location;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 50)
    private InventoryTransactionType transactionType;

    @Column(name = "quantity", nullable = false)
    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @Column(name = "quantity_before", nullable = false)
    private Integer quantityBefore;

    @Column(name = "quantity_after", nullable = false)
    private Integer quantityAfter;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private UUID referenceId;

    @Column(name = "performed_by", nullable = false)
    @NotNull(message = "Performed by is required")
    private UUID performedBy;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
