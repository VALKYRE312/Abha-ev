package com.abhaenterprise.finance.repository;

import com.abhaenterprise.common.enums.LoanApplicationStatus;
import com.abhaenterprise.finance.entity.LoanApplication;
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
 * Loan Application Repository
 */
@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, UUID> {

    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);

    Page<LoanApplication> findByCustomerId(UUID customerId, Pageable pageable);

    Page<LoanApplication> findByStatus(LoanApplicationStatus status, Pageable pageable);

    Page<LoanApplication> findByAssignedTo(UUID assignedTo, Pageable pageable);

    Page<LoanApplication> findByFinancePartnerId(UUID financePartnerId, Pageable pageable);

    @Query("SELECT l FROM LoanApplication l WHERE " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:customerId IS NULL OR l.customer.id = :customerId) AND " +
           "(:assignedTo IS NULL OR l.assignedTo = :assignedTo) AND " +
           "(:partnerId IS NULL OR l.financePartner.id = :partnerId)")
    Page<LoanApplication> filterApplications(
        @Param("status") LoanApplicationStatus status,
        @Param("customerId") UUID customerId,
        @Param("assignedTo") UUID assignedTo,
        @Param("partnerId") UUID partnerId,
        Pageable pageable
    );

    @Query("SELECT l FROM LoanApplication l WHERE " +
           "l.status = :status AND " +
           "(LOWER(l.applicantName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(l.applicantEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "l.applicantPhone LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(l.applicationNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<LoanApplication> searchApplications(@Param("search") String search, @Param("status") LoanApplicationStatus status, Pageable pageable);

    long countByStatus(LoanApplicationStatus status);

    @Query("SELECT SUM(l.loanAmount) FROM LoanApplication l WHERE l.status = :status")
    BigDecimal getTotalLoanAmountByStatus(@Param("status") LoanApplicationStatus status);

    List<LoanApplication> findByStatusAndAssignedTo(LoanApplicationStatus status, UUID assignedTo);

    boolean existsByApplicationNumber(String applicationNumber);
}
