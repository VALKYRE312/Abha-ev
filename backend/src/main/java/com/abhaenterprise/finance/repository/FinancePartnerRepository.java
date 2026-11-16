package com.abhaenterprise.finance.repository;

import com.abhaenterprise.finance.entity.FinancePartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Finance Partner Repository
 */
@Repository
public interface FinancePartnerRepository extends JpaRepository<FinancePartner, UUID> {

    Optional<FinancePartner> findByCode(String code);

    List<FinancePartner> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);

    List<FinancePartner> findByPartnerType(String partnerType);

    boolean existsByCode(String code);
}
