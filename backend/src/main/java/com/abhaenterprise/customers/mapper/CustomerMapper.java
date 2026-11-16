package com.abhaenterprise.customers.mapper;

import com.abhaenterprise.customers.dto.CustomerDTO;
import com.abhaenterprise.customers.entity.Customer;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * MapStruct Mapper for Customer entities
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {

    @Mapping(source = "user.id", target = "userId")
    CustomerDTO toDTO(Customer customer);

    List<CustomerDTO> toDTOList(List<Customer> customers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Customer toEntity(CustomerDTO dto);

    default Page<CustomerDTO> toDTOPage(Page<Customer> page) {
        return page.map(this::toDTO);
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(CustomerDTO dto, @MappingTarget Customer customer);
}
