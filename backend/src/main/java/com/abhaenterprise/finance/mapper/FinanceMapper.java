package com.abhaenterprise.finance.mapper;

import com.abhaenterprise.finance.dto.*;
import com.abhaenterprise.finance.entity.*;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * MapStruct Mapper for Finance entities
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FinanceMapper {

    // Finance Partner mappings
    FinancePartnerDTO toPartnerDTO(FinancePartner partner);
    
    List<FinancePartnerDTO> toPartnerDTOList(List<FinancePartner> partners);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    FinancePartner toPartnerEntity(FinancePartnerDTO dto);

    // Loan Application mappings
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "financePartner.id", target = "financePartnerId")
    @Mapping(source = "financePartner.name", target = "financePartnerName")
    LoanApplicationDTO toApplicationDTO(LoanApplication application);

    List<LoanApplicationDTO> toApplicationDTOList(List<LoanApplication> applications);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "financePartner", ignore = true)
    @Mapping(target = "applicationNumber", ignore = true)
    @Mapping(target = "applicationDate", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "statusHistory", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    LoanApplication toApplicationEntity(CreateLoanApplicationRequest request);

    default Page<LoanApplicationDTO> toApplicationDTOPage(Page<LoanApplication> page) {
        return page.map(this::toApplicationDTO);
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "financePartner", ignore = true)
    @Mapping(target = "applicationNumber", ignore = true)
    @Mapping(target = "applicationDate", ignore = true)
    @Mapping(target = "statusHistory", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateApplicationFromDTO(LoanApplicationDTO dto, @MappingTarget LoanApplication application);
}
