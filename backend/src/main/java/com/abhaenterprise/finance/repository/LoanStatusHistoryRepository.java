package com.abhaenterprise.finance.repository;

import com.abhaenterprise.finance.entity.LoanStatusHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Loan Status History Repository
 */
@Repository
public interface LoanStatusHistoryRepository extends JpaRepository<LoanStatusHistory, UUID> {

    List<LoanStatusHistory> findByLoanApplicationIdOrderByChangedAtDesc(UUID loanApplicationId);

    Page<LoanStatusHistory> findByLoanApplicationId(UUID loanApplicationId, Pageable pageable);

    List<LoanStatusHistory> findByChangedBy(UUID changedBy);
}
