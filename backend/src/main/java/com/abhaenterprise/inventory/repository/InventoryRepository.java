package com.abhaenterprise.inventory.repository;

import com.abhaenterprise.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Inventory Repository
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    Optional<Inventory> findByProductVariantIdAndLocationId(UUID productVariantId, UUID locationId);

    List<Inventory> findByProductVariantId(UUID productVariantId);

    List<Inventory> findByLocationId(UUID locationId);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand - i.quantityReserved > 0")
    List<Inventory> findAllInStock();

    @Query("SELECT i FROM Inventory i WHERE i.reorderPoint IS NOT NULL AND i.quantityOnHand <= i.reorderPoint")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.productVariantId = :variantId AND (i.quantityOnHand - i.quantityReserved) >= :quantity")
    List<Inventory> findAvailableInventory(@Param("variantId") UUID variantId, @Param("quantity") int quantity);

    @Query("SELECT SUM(i.quantityOnHand) FROM Inventory i WHERE i.productVariantId = :variantId")
    Integer getTotalQuantityByVariant(@Param("variantId") UUID variantId);
}
