package com.abhaenterprise.users.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Permission Entity
 * 
 * Fine-grained permission catalogue for RBAC.
 * Format: {module}.{action} (e.g., "products.read", "orders.write")
 */
@Entity
@Table(name = "permissions", indexes = {
    @Index(name = "idx_permissions_module", columnList = "module")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Permission code is required")
    @Pattern(regexp = "^[a-z_\\.]+$", message = "Permission code must be lowercase with dots/underscores")
    private String code;

    @Column(name = "module", nullable = false, length = 50)
    @NotBlank(message = "Module is required")
    private String module;

    @Column(name = "action", nullable = false, length = 50)
    @NotBlank(message = "Action is required")
    private String action;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
