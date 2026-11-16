package com.abhaenterprise.users.entity;

import com.abhaenterprise.common.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Role Entity
 * 
 * Defines system roles for RBAC (Role-Based Access Control).
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    @NotBlank(message = "Role name is required")
    @Size(min = 2, max = 100)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Role code is required")
    @Pattern(regexp = "^[A-Z_]+$", message = "Role code must be uppercase with underscores")
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_system", nullable = false)
    @Builder.Default
    private Boolean isSystem = false;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<RolePermission> rolePermissions = new HashSet<>();

    // Business methods
    public void addPermission(Permission permission) {
        RolePermission rolePermission = RolePermission.builder()
                .role(this)
                .permission(permission)
                .build();
        rolePermissions.add(rolePermission);
    }

    public void removePermission(Permission permission) {
        rolePermissions.removeIf(rp -> rp.getPermission().equals(permission));
    }
}
