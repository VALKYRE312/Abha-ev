package com.abhaenterprise.payments.repository;

import com.abhaenterprise.common.enums.PaymentStatus;
import com.abhaenterprise.payments.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Payment Repository
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByPaymentNumber(String paymentNumber);

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByOrderId(UUID orderId);

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    List<Payment> findByReferenceTypeAndReferenceId(String referenceType, UUID referenceId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    BigDecimal getTotalAmountByStatus(@Param("status") PaymentStatus status);

    long countByStatus(PaymentStatus status);

    boolean existsByPaymentNumber(String paymentNumber);

    boolean existsByTransactionId(String transactionId);
}
