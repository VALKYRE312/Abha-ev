package com.abhaenterprise.customers.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Customer DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private UUID id;
    private UUID userId;
    private String customerNumber;

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 255)
    private String name;

    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    private String phone;

    private String alternatePhone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    private String country;
    private Boolean consentMarketing;
    private Instant consentAt;
    private String leadSource;
    private UUID assignedTo;
    private String assignedToName;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;
}
