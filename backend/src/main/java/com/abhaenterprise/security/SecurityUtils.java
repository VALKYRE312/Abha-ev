package com.abhaenterprise.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

/**
 * Security Utilities
 * 
 * Helper methods for accessing current user information.
 */
public class SecurityUtils {

    private SecurityUtils() {
        // Utility class
    }

    /**
     * Get currently authenticated user details
     */
    public static FirebaseUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof FirebaseUserDetails) {
            return (FirebaseUserDetails) authentication.getPrincipal();
        }
        
        return null;
    }

    /**
     * Get current user ID
     */
    public static UUID getCurrentUserId() {
        FirebaseUserDetails user = getCurrentUser();
        return user != null ? user.getUserId() : null;
    }

    /**
     * Get current user's Firebase UID
     */
    public static String getCurrentFirebaseUid() {
        FirebaseUserDetails user = getCurrentUser();
        return user != null ? user.getFirebaseUid() : null;
    }

    /**
     * Get current user's email
     */
    public static String getCurrentUserEmail() {
        FirebaseUserDetails user = getCurrentUser();
        return user != null ? user.getEmail() : null;
    }

    /**
     * Check if current user has a specific role
     */
    public static boolean hasRole(String role) {
        FirebaseUserDetails user = getCurrentUser();
        return user != null && user.hasRole(role);
    }

    /**
     * Check if current user has a specific permission
     */
    public static boolean hasPermission(String permission) {
        FirebaseUserDetails user = getCurrentUser();
        return user != null && user.hasPermission(permission);
    }

    /**
     * Check if user is authenticated
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && 
               authentication.isAuthenticated() && 
               authentication.getPrincipal() instanceof FirebaseUserDetails;
    }

    /**
     * Check if current user has any of the given roles
     */
    public static boolean hasAnyRole(String... roles) {
        FirebaseUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        
        for (String role : roles) {
            if (user.hasRole(role)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if current user has any of the given permissions
     */
    public static boolean hasAnyPermission(String... permissions) {
        FirebaseUserDetails user = getCurrentUser();
        if (user == null) {
            return false;
        }
        
        for (String permission : permissions) {
            if (user.hasPermission(permission)) {
                return true;
            }
        }
        
        return false;
    }
}
