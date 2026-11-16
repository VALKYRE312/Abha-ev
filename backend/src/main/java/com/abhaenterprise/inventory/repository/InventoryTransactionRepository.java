package com.abhaenterprise.inventory.repository;

import com.abhaenterprise.common.enums.InventoryTransactionType;
import com.abhaenterprise.inventory.entity.InventoryTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Inventory Transaction Repository
 */
@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, UUID> {

    Page<InventoryTransaction> findByProductVariantId(UUID productVariantId, Pageable pageable);

    Page<InventoryTransaction> findByLocationId(UUID locationId, Pageable pageable);

    List<InventoryTransaction> findByReferenceTypeAndReferenceId(String referenceType, UUID referenceId);

    Page<InventoryTransaction> findByTransactionType(InventoryTransactionType transactionType, Pageable pageable);

    Page<InventoryTransaction> findByPerformedBy(UUID performedBy, Pageable pageable);
}
