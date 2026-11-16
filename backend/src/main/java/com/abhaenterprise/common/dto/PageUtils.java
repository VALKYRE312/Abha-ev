package com.abhaenterprise.common.dto;

import org.springframework.data.domain.Page;

/**
 * Utility class for converting Spring Data Page to PageResponse
 */
public class PageUtils {

    private PageUtils() {
        // Utility class
    }

    /**
     * Convert Spring Data Page to PageResponse DTO
     */
    public static <T> PageResponse<T> toPageResponse(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .empty(page.isEmpty())
                .build();
    }
}
