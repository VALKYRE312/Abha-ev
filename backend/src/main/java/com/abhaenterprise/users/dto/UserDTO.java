package com.abhaenterprise.users.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

/**
 * User DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;

    @NotBlank(message = "Auth UID is required")
    private String authUid;

    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    private String phone;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255)
    private String fullName;

    private Boolean isActive;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private Instant lastLoginAt;

    private Set<String> roles;
    private Set<String> permissions;

    private Instant createdAt;
    private Instant updatedAt;
}
