package com.abhaenterprise.finance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Finance Partner DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancePartnerDTO {
    private UUID id;

    @NotBlank(message = "Partner code is required")
    private String code;

    @NotBlank(message = "Partner name is required")
    @Size(min = 2, max = 255)
    private String name;

    @NotBlank(message = "Partner type is required")
    private String partnerType;

    private String logoUrl;
    private String description;
    private String contactPerson;

    @Email
    private String contactEmail;

    private String contactPhone;
    private String website;
    private Boolean isActive;
    private Integer displayOrder;
}
