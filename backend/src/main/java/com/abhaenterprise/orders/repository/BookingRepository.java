package com.abhaenterprise.orders.repository;

import com.abhaenterprise.common.enums.BookingStatus;
import com.abhaenterprise.orders.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Booking Repository
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByBookingNumber(String bookingNumber);

    Page<Booking> findByCustomerId(UUID customerId, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Page<Booking> findByProductId(UUID productId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:customerId IS NULL OR b.customer.id = :customerId) AND " +
           "(:productId IS NULL OR b.product.id = :productId)")
    Page<Booking> filterBookings(
        @Param("status") BookingStatus status,
        @Param("customerId") UUID customerId,
        @Param("productId") UUID productId,
        Pageable pageable
    );

    long countByStatus(BookingStatus status);

    boolean existsByBookingNumber(String bookingNumber);
}
