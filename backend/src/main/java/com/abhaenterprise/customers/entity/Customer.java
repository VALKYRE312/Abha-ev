package com.abhaenterprise.customers.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.users.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Customer Entity
 * 
 * Customer profile information for buyers and leads.
 * May or may not have an associated user account.
 */
@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customers_user_id", columnList = "user_id"),
    @Index(name = "idx_customers_customer_number", columnList = "customer_number"),
    @Index(name = "idx_customers_assigned_to", columnList = "assigned_to")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "customer_number", unique = true, length = 50)
    private String customerNumber;

    @Column(name = "name", nullable = false, length = 255)
    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 255)
    private String name;

    @Column(name = "email", length = 255)
    @Email(message = "Email must be valid")
    private String email;

    @Column(name = "phone", length = 20)
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    private String phone;

    @Column(name = "alternate_phone", length = 20)
    private String alternatePhone;

    @Column(name = "address_line1", length = 255)
    private String addressLine1;

    @Column(name = "address_line2", length = 255)
    private String addressLine2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 10)
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    @Column(name = "country", length = 50)
    @Builder.Default
    private String country = "India";

    @Column(name = "consent_marketing")
    @Builder.Default
    private Boolean consentMarketing = false;

    @Column(name = "consent_at")
    private Instant consentAt;

    @Column(name = "lead_source", length = 50)
    private String leadSource;

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Business methods
    public void setEmail(String email) {
        this.email = email != null ? email.toLowerCase().trim() : null;
    }

    public void giveMarketingConsent() {
        this.consentMarketing = true;
        this.consentAt = Instant.now();
    }

    public void revokeMarketingConsent() {
        this.consentMarketing = false;
    }

    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (addressLine1 != null) address.append(addressLine1);
        if (addressLine2 != null) address.append(", ").append(addressLine2);
        if (city != null) address.append(", ").append(city);
        if (state != null) address.append(", ").append(state);
        if (pincode != null) address.append(" - ").append(pincode);
        return address.toString();
    }
}
