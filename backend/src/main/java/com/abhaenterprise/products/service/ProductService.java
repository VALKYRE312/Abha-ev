package com.abhaenterprise.products.service;

import com.abhaenterprise.common.exception.ResourceNotFoundException;
import com.abhaenterprise.products.dto.ProductDTO;
import com.abhaenterprise.products.dto.ProductDetailDTO;
import com.abhaenterprise.products.entity.Product;
import com.abhaenterprise.products.mapper.ProductMapper;
import com.abhaenterprise.products.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Product Service
 * 
 * Business logic for product operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public Page<ProductDTO> listProducts(
            String search,
            UUID categoryId,
            String categorySlug,
            UUID brandId,
            String brandSlug,
            Double minPrice,
            Double maxPrice,
            String productType,
            Boolean isFeatured,
            Pageable pageable) {
        
        log.debug("Listing products with filters - search: {}, category: {}, brand: {}", 
                  search, categorySlug, brandSlug);
        
        // For now, simple implementation - can be enhanced with Specifications
        Page<Product> products;
        
        if (isFeatured != null && isFeatured) {
            products = productRepository.findByIsFeaturedAndStatus(true, "ACTIVE", pageable);
        } else if (categorySlug != null) {
            products = productRepository.findByCategorySlugAndStatus(categorySlug, "ACTIVE", pageable);
        } else if (brandSlug != null) {
            products = productRepository.findByBrandSlugAndStatus(brandSlug, "ACTIVE", pageable);
        } else {
            products = productRepository.findByStatus("ACTIVE", pageable);
        }
        
        return products.map(productMapper::toDTO);
    }

    public ProductDetailDTO getProductDetails(String slugOrId) {
        log.debug("Fetching product details for: {}", slugOrId);
        
        Product product;
        try {
            UUID id = UUID.fromString(slugOrId);
            product = productRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        } catch (IllegalArgumentException e) {
            product = productRepository.findBySlugAndStatus(slugOrId, "ACTIVE")
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slugOrId));
        }
        
        return productMapper.toDetailDTO(product);
    }

    public List<ProductDTO> getFeaturedProducts(int limit) {
        log.debug("Fetching {} featured products", limit);
        
        Pageable pageable = PageRequest.of(0, limit);
        Page<Product> products = productRepository.findByIsFeaturedAndStatus(true, "ACTIVE", pageable);
        
        return products.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }
}
