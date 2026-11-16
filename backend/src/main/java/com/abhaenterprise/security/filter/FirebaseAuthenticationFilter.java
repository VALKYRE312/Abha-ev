package com.abhaenterprise.security.filter;

import com.abhaenterprise.security.FirebaseUserDetails;
import com.abhaenterprise.security.service.FirebaseAuthenticationService;
import com.abhaenterprise.users.entity.User;
import com.abhaenterprise.users.repository.UserRepository;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Firebase Authentication Filter
 * 
 * Extracts and validates Firebase ID token from Authorization header.
 * Loads user details and sets Spring Security authentication context.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseAuthenticationService firebaseAuthenticationService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        try {
            String token = extractToken(request);
            
            if (token != null && !token.isEmpty()) {
                authenticateUser(token, request);
            }
        } catch (Exception e) {
            log.error("Error during Firebase authentication: {}", e.getMessage(), e);
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * Extract Firebase ID token from Authorization header
     */
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        return null;
    }

    /**
     * Authenticate user with Firebase token
     */
    private void authenticateUser(String token, HttpServletRequest request) {
        FirebaseToken firebaseToken = firebaseAuthenticationService.verifyToken(token);
        
        if (firebaseToken == null) {
            log.warn("Invalid Firebase token");
            return;
        }

        String firebaseUid = firebaseToken.getUid();
        
        // Load user from database
        User user = userRepository.findByAuthUidWithRoles(firebaseUid).orElse(null);
        
        if (user == null) {
            log.warn("User not found for Firebase UID: {}", firebaseUid);
            return;
        }

        if (!user.getIsActive()) {
            log.warn("User account is not active: {}", firebaseUid);
            return;
        }

        // Update last login
        user.updateLastLogin();
        userRepository.save(user);

        // Build user details
        FirebaseUserDetails userDetails = firebaseAuthenticationService.buildUserDetails(user, firebaseToken);

        // Set authentication in security context
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
            );
        
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        log.debug("Authenticated user: {} ({})", user.getFullName(), user.getEmail());
    }
}
