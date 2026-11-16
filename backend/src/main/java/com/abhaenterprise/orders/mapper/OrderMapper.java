package com.abhaenterprise.orders.mapper;

import com.abhaenterprise.orders.dto.*;
import com.abhaenterprise.orders.entity.*;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * MapStruct Mapper for Order entities
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.email", target = "customerEmail")
    @Mapping(source = "customer.phone", target = "customerPhone")
    OrderDTO toDTO(Order order);

    List<OrderDTO> toDTOList(List<Order> orders);

    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "productVariant.id", target = "productVariantId")
    OrderItemDTO toItemDTO(OrderItem orderItem);

    List<OrderItemDTO> toItemDTOList(List<OrderItem> orderItems);

    // Booking mappings
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.email", target = "customerEmail")
    @Mapping(source = "customer.phone", target = "customerPhone")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "productVariant.id", target = "productVariantId")
    @Mapping(source = "productVariant.variantName", target = "variantName")
    BookingDTO toBookingDTO(Booking booking);

    List<BookingDTO> toBookingDTOList(List<Booking> bookings);

    default Page<OrderDTO> toDTOPage(Page<Order> page) {
        return page.map(this::toDTO);
    }

    default Page<BookingDTO> toBookingDTOPage(Page<Booking> page) {
        return page.map(this::toBookingDTO);
    }
}
