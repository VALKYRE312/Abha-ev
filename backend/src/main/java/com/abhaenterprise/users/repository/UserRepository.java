package com.abhaenterprise.users.repository;

import com.abhaenterprise.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * User Repository
 * 
 * Spring Data JPA repository for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by Firebase authentication UID
     */
    Optional<User> findByAuthUid(String authUid);

    /**
     * Find user by Firebase UID with roles eagerly loaded
     */
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.userRoles ur " +
           "LEFT JOIN FETCH ur.role r " +
           "LEFT JOIN FETCH r.rolePermissions rp " +
           "LEFT JOIN FETCH rp.permission " +
           "WHERE u.authUid = :authUid")
    Optional<User> findByAuthUidWithRoles(@Param("authUid") String authUid);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by phone
     */
    Optional<User> findByPhone(String phone);

    /**
     * Check if user exists with given auth UID
     */
    boolean existsByAuthUid(String authUid);

    /**
     * Check if user exists with given email
     */
    boolean existsByEmail(String email);
}
