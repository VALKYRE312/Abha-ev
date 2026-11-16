package com.abhaenterprise.inventory.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.products.entity.ProductVariant;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Inventory Entity
 * 
 * Stock levels for product variants at specific locations.
 */
@Entity
@Table(name = "inventory",
    uniqueConstraints = @UniqueConstraint(columnNames = {"product_variant_id", "location_id"}),
    indexes = {
        @Index(name = "idx_inventory_variant_id", columnList = "product_variant_id"),
        @Index(name = "idx_inventory_location_id", columnList = "location_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    @NotNull(message = "Product variant is required")
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    @NotNull(message = "Location is required")
    private Location location;

    @Column(name = "quantity_on_hand", nullable = false)
    @Builder.Default
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantityOnHand = 0;

    @Column(name = "quantity_reserved", nullable = false)
    @Builder.Default
    @Min(value = 0, message = "Reserved quantity cannot be negative")
    private Integer quantityReserved = 0;

    @Column(name = "reorder_point")
    private Integer reorderPoint;

    @Column(name = "reorder_quantity")
    private Integer reorderQuantity;

    // Business methods
    public Integer getAvailableQuantity() {
        return quantityOnHand - quantityReserved;
    }

    public boolean isInStock() {
        return getAvailableQuantity() > 0;
    }

    public boolean needsReorder() {
        return reorderPoint != null && quantityOnHand <= reorderPoint;
    }

    public void addStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Cannot add negative quantity");
        }
        this.quantityOnHand += quantity;
    }

    public void removeStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Cannot remove negative quantity");
        }
        if (quantity > getAvailableQuantity()) {
            throw new IllegalStateException("Insufficient available stock");
        }
        this.quantityOnHand -= quantity;
    }

    public void reserveStock(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Cannot reserve negative quantity");
        }
        if (quantity > getAvailableQuantity()) {
            throw new IllegalStateException("Insufficient available stock to reserve");
        }
        this.quantityReserved += quantity;
    }

    public void releaseReservation(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Cannot release negative quantity");
        }
        if (quantity > quantityReserved) {
            throw new IllegalStateException("Cannot release more than reserved");
        }
        this.quantityReserved -= quantity;
    }
}
