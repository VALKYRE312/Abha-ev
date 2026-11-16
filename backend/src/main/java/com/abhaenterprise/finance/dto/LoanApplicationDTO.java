package com.abhaenterprise.finance.dto;

import com.abhaenterprise.common.enums.LoanApplicationStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Loan Application DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplicationDTO {
    private UUID id;
    private String applicationNumber;

    private UUID customerId;
    private String customerName;

    private UUID productId;
    private String productName;

    private UUID financePartnerId;
    private String financePartnerName;

    private Instant applicationDate;
    private LoanApplicationStatus status;

    @NotNull(message = "Vehicle price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal vehiclePrice;

    @NotNull(message = "Down payment is required")
    @DecimalMin(value = "0.0")
    private BigDecimal downPayment;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal loanAmount;

    @NotNull(message = "Tenure is required")
    @Min(value = 1)
    @Max(value = 84)
    private Integer requestedTenureMonths;

    private BigDecimal estimatedInterestRate;
    private BigDecimal estimatedEmi;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @Email
    private String applicantEmail;

    @NotBlank(message = "Phone is required")
    private String applicantPhone;

    private String applicantCity;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String applicantPincode;

    private String employmentType;
    private BigDecimal monthlyIncome;

    private UUID assignedTo;
    private String assignedToName;
    private String internalNotes;

    private Instant approvedAt;
    private Instant rejectedAt;
    private String rejectionReason;
    private Instant disbursedAt;

    private Boolean consentProvided;
    private Instant consentAt;

    private Instant createdAt;
    private Instant updatedAt;
}
