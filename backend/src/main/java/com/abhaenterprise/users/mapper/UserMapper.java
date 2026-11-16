package com.abhaenterprise.users.mapper;

import com.abhaenterprise.users.dto.UserDTO;
import com.abhaenterprise.users.entity.*;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * MapStruct Mapper for User entities
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(extractRoles(user))")
    @Mapping(target = "permissions", expression = "java(extractPermissions(user))")
    UserDTO toDTO(User user);

    List<UserDTO> toDTOList(List<User> users);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userRoles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(UserDTO dto);

    default Set<String> extractRoles(User user) {
        if (user.getUserRoles() == null) {
            return Set.of();
        }
        return user.getUserRoles().stream()
                .filter(ur -> !ur.isExpired())
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toSet());
    }

    default Set<String> extractPermissions(User user) {
        if (user.getUserRoles() == null) {
            return Set.of();
        }
        return user.getUserRoles().stream()
                .filter(ur -> !ur.isExpired())
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getCode())
                .collect(Collectors.toSet());
    }
}
