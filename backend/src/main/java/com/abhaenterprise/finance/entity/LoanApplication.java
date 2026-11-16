package com.abhaenterprise.finance.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.customers.entity.Customer;
import com.abhaenterprise.products.entity.ProductVariant;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Loan Application Entity
 * 
 * Customer finance enquiries and loan applications.
 */
@Entity
@Table(name = "loan_applications", indexes = {
    @Index(name = "idx_loan_apps_customer_id", columnList = "customer_id"),
    @Index(name = "idx_loan_apps_application_number", columnList = "application_number"),
    @Index(name = "idx_loan_apps_status", columnList = "status"),
    @Index(name = "idx_loan_apps_partner_id", columnList = "partner_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplication extends BaseEntity {

    @Column(name = "application_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Application number is required")
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull(message = "Customer is required")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id")
    private FinancePartner partner;

    @Column(name = "vehicle_price", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Vehicle price is required")
    @DecimalMin(value = "0.01", message = "Vehicle price must be positive")
    private BigDecimal vehiclePrice;

    @Column(name = "down_payment", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Down payment is required")
    @DecimalMin(value = "0.0", message = "Down payment must be non-negative")
    private BigDecimal downPayment;

    @Column(name = "requested_amount", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Requested amount is required")
    @DecimalMin(value = "0.01", message = "Requested amount must be positive")
    private BigDecimal requestedAmount;

    @Column(name = "tenure_months", nullable = false)
    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Tenure must be at least 1 month")
    @Max(value = 84, message = "Tenure cannot exceed 84 months")
    private Integer tenureMonths;

    @Column(name = "estimated_emi", precision = 12, scale = 2)
    private BigDecimal estimatedEmi;

    @Column(name = "estimated_rate", precision = 5, scale = 2)
    private BigDecimal estimatedRate;

    @Column(name = "status", nullable = false, length = 50)
    @NotBlank(message = "Status is required")
    @Builder.Default
    private String status = "submitted";

    @Column(name = "applicant_name", nullable = false, length = 255)
    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @Column(name = "applicant_email", length = 255)
    @Email(message = "Invalid email format")
    private String applicantEmail;

    @Column(name = "applicant_phone", nullable = false, length = 20)
    @NotBlank(message = "Applicant phone is required")
    private String applicantPhone;

    @Column(name = "applicant_city", length = 100)
    private String applicantCity;

    @Column(name = "applicant_pincode", length = 10)
    private String applicantPincode;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(name = "monthly_income", precision = 12, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(name = "consent_at", nullable = false)
    @NotNull(message = "Consent is required")
    private Instant consentAt;

    @Column(name = "consent_text", columnDefinition = "TEXT")
    private String consentText;

    @Column(name = "submitted_at", nullable = false)
    @Builder.Default
    private Instant submittedAt = Instant.now();

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "approved_amount", precision = 12, scale = 2)
    private BigDecimal approvedAmount;

    @Column(name = "approved_tenure")
    private Integer approvedTenure;

    @Column(name = "approved_rate", precision = 5, scale = 2)
    private BigDecimal approvedRate;

    @Column(name = "rejected_at")
    private Instant rejectedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // Business methods
    public void approve(BigDecimal approvedAmount, Integer approvedTenure, BigDecimal approvedRate) {
        this.status = "approved";
        this.approvedAt = Instant.now();
        this.approvedAmount = approvedAmount;
        this.approvedTenure = approvedTenure;
        this.approvedRate = approvedRate;
    }

    public void reject(String reason) {
        this.status = "rejected";
        this.rejectedAt = Instant.now();
        this.rejectionReason = reason;
    }

    public void moveToUnderReview() {
        this.status = "under_review";
    }

    public void referToPartner(FinancePartner partner) {
        this.partner = partner;
        this.status = "referred_to_partner";
    }

    public boolean isApproved() {
        return "approved".equals(this.status);
    }

    public boolean isRejected() {
        return "rejected".equals(this.status);
    }
}
