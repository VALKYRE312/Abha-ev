package com.abhaenterprise.finance.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Finance Partner Entity
 * 
 * Banks and NBFCs offering EV loans.
 */
@Entity
@Table(name = "finance_partners", indexes = {
    @Index(name = "idx_finance_partners_code", columnList = "code"),
    @Index(name = "idx_finance_partners_is_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancePartner extends BaseEntity {

    @Column(name = "name", nullable = false, length = 255)
    @NotBlank(message = "Partner name is required")
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Partner code is required")
    private String code;

    @Column(name = "partner_type", nullable = false, length = 50)
    @NotBlank(message = "Partner type is required")
    @Builder.Default
    private String partnerType = "bank";

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "contact_person", length = 255)
    private String contactPerson;

    @Column(name = "contact_email", length = 255)
    @Email(message = "Invalid email format")
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "agreement_start")
    private LocalDate agreementStart;

    @Column(name = "agreement_end")
    private LocalDate agreementEnd;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    // Business methods
    public void activate() {
        this.isActive = true;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public boolean hasActiveAgreement() {
        if (agreementStart == null || agreementEnd == null) {
            return isActive;
        }
        LocalDate today = LocalDate.now();
        return isActive && 
               !today.isBefore(agreementStart) && 
               !today.isAfter(agreementEnd);
    }
}
