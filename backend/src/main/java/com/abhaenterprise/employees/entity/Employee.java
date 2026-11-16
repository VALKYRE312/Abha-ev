package com.abhaenterprise.employees.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import com.abhaenterprise.users.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Employee Entity
 * 
 * Staff member information.
 */
@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_employees_user_id", columnList = "user_id"),
    @Index(name = "idx_employees_employee_number", columnList = "employee_number"),
    @Index(name = "idx_employees_department", columnList = "department")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @NotNull(message = "User is required")
    private User user;

    @Column(name = "employee_number", unique = true, length = 50)
    private String employeeNumber;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @Column(name = "date_of_leaving")
    private LocalDate dateOfLeaving;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "manager_id")
    private java.util.UUID managerId;

    @Column(name = "work_email", length = 255)
    @Email(message = "Email must be valid")
    private String workEmail;

    @Column(name = "work_phone", length = 20)
    private String workPhone;

    @Column(name = "emergency_contact_name", length = 255)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Business methods
    public void activate() {
        this.isActive = true;
        this.dateOfLeaving = null;
    }

    public void deactivate() {
        this.isActive = false;
        this.dateOfLeaving = LocalDate.now();
    }

    public boolean isCurrentlyEmployed() {
        return isActive && (dateOfLeaving == null || dateOfLeaving.isAfter(LocalDate.now()));
    }

    public void setWorkEmail(String email) {
        this.workEmail = email != null ? email.toLowerCase().trim() : null;
    }
}
