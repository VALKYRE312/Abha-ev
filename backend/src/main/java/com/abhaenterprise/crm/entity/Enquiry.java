package com.abhaenterprise.crm.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.customers.entity.Customer;
import com.abhaenterprise.products.entity.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Enquiry Entity
 * 
 * Customer enquiries and leads from website forms.
 */
@Entity
@Table(name = "enquiries", indexes = {
    @Index(name = "idx_enquiries_customer_id", columnList = "customer_id"),
    @Index(name = "idx_enquiries_product_id", columnList = "product_id"),
    @Index(name = "idx_enquiries_enquiry_type", columnList = "enquiry_type"),
    @Index(name = "idx_enquiries_status", columnList = "status"),
    @Index(name = "idx_enquiries_assigned_to", columnList = "assigned_to")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enquiry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "enquiry_type", nullable = false, length = 50)
    @NotBlank(message = "Enquiry type is required")
    private String enquiryType;

    @Column(name = "name", nullable = false, length = 255)
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 255)
    private String name;

    @Column(name = "email", length = 255)
    @Email(message = "Email must be valid")
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    @NotBlank(message = "Phone is required")
    private String phone;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "source", length = 50)
    private String source;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "NEW";

    @Column(name = "priority", length = 20)
    @Builder.Default
    private String priority = "MEDIUM";

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    // Business methods
    public void assignTo(UUID employeeId) {
        this.assignedTo = employeeId;
    }

    public void updateStatus(String newStatus) {
        this.status = newStatus;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.toLowerCase().trim() : null;
    }
}
