package com.abhaenterprise.users.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * User Entity
 * 
 * Central user identity mapping for both customers and staff.
 * Maps Firebase Authentication UID to internal user record.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_auth_uid", columnList = "auth_uid"),
    @Index(name = "idx_users_is_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "auth_uid", nullable = false, unique = true, length = 255)
    @NotBlank(message = "Auth UID is required")
    private String authUid;

    @Column(name = "email", length = 255)
    @Email(message = "Email must be valid")
    private String email;

    @Column(name = "phone", length = 20)
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    private String phone;

    @Column(name = "full_name", nullable = false, length = 255)
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
    private String fullName;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "phone_verified", nullable = false)
    @Builder.Default
    private Boolean phoneVerified = false;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserRole> userRoles = new HashSet<>();

    // Business methods
    public void addRole(Role role, UUID assignedBy) {
        UserRole userRole = UserRole.builder()
                .user(this)
                .role(role)
                .assignedBy(assignedBy)
                .assignedAt(Instant.now())
                .build();
        userRoles.add(userRole);
    }

    public void removeRole(Role role) {
        userRoles.removeIf(ur -> ur.getRole().equals(role));
    }

    public void setEmail(String email) {
        this.email = email != null ? email.toLowerCase().trim() : null;
    }

    public void updateLastLogin() {
        this.lastLoginAt = Instant.now();
    }
}
