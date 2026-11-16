package com.abhaenterprise.products.controller;

import com.abhaenterprise.common.dto.ApiResponse;
import com.abhaenterprise.common.dto.PageResponse;
import com.abhaenterprise.products.dto.ProductDTO;
import com.abhaenterprise.products.dto.ProductDetailDTO;
import com.abhaenterprise.products.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Product Catalogue Controller
 * 
 * Public endpoints for browsing product catalogue.
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalogue APIs")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List products", description = "Browse product catalogue with filtering and search")
    public ResponseEntity<PageResponse<ProductDTO>> listProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) String brandSlug,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) Boolean isFeatured,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<ProductDTO> products = productService.listProducts(
                search, categoryId, categorySlug, brandId, brandSlug,
                minPrice, maxPrice, productType, isFeatured, pageable);
        
        return ResponseEntity.ok(PageResponse.of(products));
    }

    @GetMapping("/{slugOrId}")
    @Operation(summary = "Get product details", description = "Retrieve complete product information")
    public ResponseEntity<ApiResponse<ProductDetailDTO>> getProductDetails(
            @PathVariable String slugOrId) {
        
        ProductDetailDTO product = productService.getProductDetails(slugOrId);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products", description = "Retrieve featured products for homepage")
    public ResponseEntity<ApiResponse<java.util.List<ProductDTO>>> getFeaturedProducts(
            @RequestParam(defaultValue = "6") int limit) {
        
        var products = productService.getFeaturedProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products));
    }
}
