package com.abhaenterprise.finance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Create Loan Application Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLoanApplicationRequest {
    private UUID productId;
    private UUID financePartnerId;

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

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @Email(message = "Email must be valid")
    private String applicantEmail;

    @NotBlank(message = "Phone is required")
    private String applicantPhone;

    private String applicantCity;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String applicantPincode;

    private String employmentType;
    private BigDecimal monthlyIncome;

    @NotNull(message = "Consent is required")
    private Boolean consentProvided;
}
