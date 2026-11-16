package com.abhaenterprise.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Firebase Authentication Token
 * 
 * Custom authentication token that holds Firebase user information.
 */
public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final String firebaseUid;
    private final String email;
    private final Object principal;

    public FirebaseAuthenticationToken(
            String firebaseUid,
            String email,
            Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.firebaseUid = firebaseUid;
        this.email = email;
        this.principal = email != null ? email : firebaseUid;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public String getEmail() {
        return email;
    }
}
