package com.abhaenterprise.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Firebase Authentication Filter
 * 
 * Intercepts requests and validates Firebase ID tokens from Authorization header.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (firebaseAuth != null) {
                    // Production mode - verify Firebase token
                    FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
                    
                    String uid = decodedToken.getUid();
                    String email = decodedToken.getEmail();

                    // Create authentication token with user details
                    FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(
                            uid,
                            email,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Authenticated user: {} ({})", email, uid);
                } else {
                    // Demo mode - accept any token for development
                    log.debug("Demo mode: Accepting token without Firebase verification");
                    FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(
                            "demo-user-" + System.currentTimeMillis(),
                            "demo@example.com",
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                log.error("Failed to authenticate token: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
