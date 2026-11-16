package com.abhaenterprise.finance.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.common.enums.LoanApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * LoanStatusHistory Entity
 * 
 * Audit trail for loan application status changes.
 */
@Entity
@Table(name = "loan_status_history", indexes = {
    @Index(name = "idx_loan_status_hist_app_id", columnList = "loan_application_id"),
    @Index(name = "idx_loan_status_hist_changed_at", columnList = "changed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanStatusHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loan_application_id", nullable = false)
    private LoanApplication loanApplication;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 50)
    private LoanApplicationStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 50)
    private LoanApplicationStatus toStatus;

    @Column(name = "changed_by", nullable = false)
    private UUID changedBy;

    @Column(name = "changed_at", nullable = false)
    @Builder.Default
    private Instant changedAt = Instant.now();

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
