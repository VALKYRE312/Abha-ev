package com.abhaenterprise.products.mapper;

import com.abhaenterprise.products.dto.ProductDTO;
import com.abhaenterprise.products.dto.ProductDetailDTO;
import com.abhaenterprise.products.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Product Mapper using MapStruct
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {
    
    @Mapping(target = "brand.id", source = "brand.id")
    @Mapping(target = "brand.name", source = "brand.name")
    @Mapping(target = "brand.slug", source = "brand.slug")
    @Mapping(target = "category.id", source = "category.id")
    @Mapping(target = "category.name", source = "category.name")
    @Mapping(target = "category.slug", source = "category.slug")
    ProductDTO toDTO(Product product);
    
    ProductDetailDTO toDetailDTO(Product product);
}
