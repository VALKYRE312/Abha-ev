package com.abhaenterprise.security.service;

import com.abhaenterprise.security.FirebaseUserDetails;
import com.abhaenterprise.users.entity.Permission;
import com.abhaenterprise.users.entity.Role;
import com.abhaenterprise.users.entity.User;
import com.abhaenterprise.users.entity.UserRole;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Firebase Authentication Service
 * 
 * Handles Firebase token verification and user details loading.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseAuthenticationService {

    private final FirebaseAuth firebaseAuth;

    /**
     * Verify Firebase ID token and return FirebaseToken
     */
    public FirebaseToken verifyToken(String idToken) {
        if (firebaseAuth == null) {
            log.warn("Firebase Auth not initialized");
            return null;
        }

        try {
            return firebaseAuth.verifyIdToken(idToken);
        } catch (Exception e) {
            log.error("Error verifying Firebase token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Build FirebaseUserDetails from User entity
     */
    public FirebaseUserDetails buildUserDetails(User user, FirebaseToken firebaseToken) {
        Set<String> roles = extractRoles(user);
        Set<String> permissions = extractPermissions(user);

        return FirebaseUserDetails.builder()
                .userId(user.getId())
                .firebaseUid(user.getAuthUid())
                .email(user.getEmail())
                .name(user.getFullName())
                .roles(roles)
                .permissions(permissions)
                .enabled(user.getIsActive())
                .build();
    }

    /**
     * Extract role codes from user
     */
    private Set<String> extractRoles(User user) {
        if (user.getUserRoles() == null) {
            return new HashSet<>();
        }

        return user.getUserRoles().stream()
                .filter(ur -> !ur.isExpired())
                .map(UserRole::getRole)
                .map(Role::getCode)
                .collect(Collectors.toSet());
    }

    /**
     * Extract permission codes from user's roles
     */
    private Set<String> extractPermissions(User user) {
        if (user.getUserRoles() == null) {
            return new HashSet<>();
        }

        return user.getUserRoles().stream()
                .filter(ur -> !ur.isExpired())
                .map(UserRole::getRole)
                .flatMap(role -> role.getRolePermissions().stream())
                .map(rp -> rp.getPermission())
                .map(Permission::getCode)
                .collect(Collectors.toSet());
    }
}
