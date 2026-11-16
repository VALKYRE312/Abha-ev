package com.abhaenterprise.crm.repository;

import com.abhaenterprise.crm.entity.Enquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Enquiry Repository
 */
@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, UUID> {

    Page<Enquiry> findByCustomerId(UUID customerId, Pageable pageable);

    Page<Enquiry> findByStatus(String status, Pageable pageable);

    Page<Enquiry> findByAssignedTo(UUID assignedTo, Pageable pageable);

    Page<Enquiry> findByEnquiryType(String enquiryType, Pageable pageable);

    Page<Enquiry> findByProductId(UUID productId, Pageable pageable);

    @Query("SELECT e FROM Enquiry e WHERE " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:assignedTo IS NULL OR e.assignedTo = :assignedTo) AND " +
           "(:enquiryType IS NULL OR e.enquiryType = :enquiryType) AND " +
           "(:priority IS NULL OR e.priority = :priority)")
    Page<Enquiry> filterEnquiries(
        @Param("status") String status,
        @Param("assignedTo") UUID assignedTo,
        @Param("enquiryType") String enquiryType,
        @Param("priority") String priority,
        Pageable pageable
    );

    @Query("SELECT e FROM Enquiry e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "e.phone LIKE CONCAT('%', :search, '%')")
    Page<Enquiry> searchEnquiries(@Param("search") String search, Pageable pageable);

    long countByStatus(String status);

    long countByAssignedTo(UUID assignedTo);
}
