# ABHA ENTERPRISE - REST API SPECIFICATION
## Complete API Endpoint Documentation

**Document Version:** 1.0  
**Date:** November 14, 2026  
**Base URL:** `https://api.abhaenterprise.com`  
**API Version:** v1  
**Protocol:** HTTPS only

---

## TABLE OF CONTENTS
1. [API Design Principles](#1-api-design-principles)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Public Catalogue APIs](#3-public-catalogue-apis)
4. [Customer APIs](#4-customer-apis)
5. [Cart & Checkout APIs](#5-cart--checkout-apis)
6. [Finance APIs](#6-finance-apis)
7. [Admin Product APIs](#7-admin-product-apis)
8. [Admin Inventory APIs](#8-admin-inventory-apis)
9. [Admin Order APIs](#9-admin-order-apis)
10. [Admin Finance APIs](#10-admin-finance-apis)
11. [Admin CRM APIs](#11-admin-crm-apis)
12. [Admin User Management APIs](#12-admin-user-management-apis)
13. [Error Handling](#13-error-handling)
14. [Rate Limiting](#14-rate-limiting)

---

## 1. API DESIGN PRINCIPLES

### 1.1 REST Conventions

- **Resources:** Use plural nouns (`/products`, `/orders`)
- **Actions:** Use HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **Nesting:** Max 2 levels (`/orders/{id}/items`)
- **Filtering:** Query parameters (`?status=active&category=scooters`)
- **Pagination:** Offset-based with meta (`?page=1&size=20`)
- **Sorting:** Query parameter (`?sort=createdAt,desc`)

### 1.2 Versioning

- **URL-based versioning:** `/api/v1/products`
- **Version in path:** Required for all endpoints
- **Deprecation:** 6-month notice for breaking changes

### 1.3 Standard Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-14T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "timestamp": "2026-11-14T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-11-14T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### 1.4 HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE (no content) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 422 | Unprocessable entity (business logic error) |
| 429 | Too many requests (rate limited) |
| 500 | Internal server error |

---

## 2. AUTHENTICATION & AUTHORIZATION

### 2.1 Firebase Authentication Flow

1. **Client:** User authenticates with Firebase
2. **Client:** Obtains Firebase ID token
3. **Client:** Includes token in `Authorization` header
4. **Server:** Validates token with Firebase Admin SDK
5. **Server:** Checks user permissions
6. **Server:** Returns response

### 2.2 Request Headers

```http
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
X-Request-ID: <optional-client-request-id>
```

### 2.3 Permission-Based Access Control

Each endpoint specifies required permissions. Example:
- **Permission:** `products.read`
- **Roles with access:** All authenticated users
- **Enforcement:** Service layer + controller annotation

---

## 3. PUBLIC CATALOGUE APIS

These endpoints are accessible without authentication.

### 3.1 List Product Categories

**Endpoint:** `GET /api/v1/categories`

**Description:** Retrieve all active product categories with hierarchy.

**Query Parameters:**
- `includeInactive` (boolean, optional): Include inactive categories (admin only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Electric Scooters",
      "slug": "electric-scooters",
      "description": "Two-wheeler electric scooters",
      "imageUrl": "https://cdn.abha.com/categories/scooters.jpg",
      "icon": "scooter",
      "parentId": null,
      "displayOrder": 1,
      "children": [
        {
          "id": "uuid",
          "name": "City Scooters",
          "slug": "city-scooters",
          "parentId": "uuid",
          "displayOrder": 1
        }
      ]
    }
  ]
}
```

---

### 3.2 List Brands

**Endpoint:** `GET /api/v1/brands`

**Description:** Retrieve all active brands.

**Query Parameters:**
- `page` (integer, default: 0)
- `size` (integer, default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Brand Name",
      "slug": "brand-name",
      "logoUrl": "https://cdn.abha.com/brands/logo.png",
      "description": "Brand description",
      "website": "https://brand.com"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 15,
    "totalPages": 1
  }
}
```

---

### 3.3 List Products

**Endpoint:** `GET /api/v1/products`

**Description:** Browse product catalogue with filtering and search.

**Query Parameters:**
- `page` (integer, default: 0)
- `size` (integer, default: 20, max: 100)
- `search` (string): Search in name, description, SKU
- `categoryId` (uuid): Filter by category
- `categorySlug` (string): Filter by category slug
- `brandId` (uuid): Filter by brand
- `brandSlug` (string): Filter by brand slug
- `minPrice` (decimal): Minimum price filter
- `maxPrice` (decimal): Maximum price filter
- `productType` (string): Filter by type (vehicle, accessory, spare_part)
- `isFeatured` (boolean): Only featured products
- `sort` (string): Sort field and direction (e.g., `price,asc`, `name,asc`, `createdAt,desc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "sku": "EV-SCOOTER-001",
      "slug": "city-e-scooter",
      "name": "City E-Scooter",
      "shortDescription": "Perfect for urban commuting",
      "brand": {
        "id": "uuid",
        "name": "Brand Name",
        "slug": "brand-name"
      },
      "category": {
        "id": "uuid",
        "name": "Electric Scooters",
        "slug": "electric-scooters"
      },
      "primaryImage": {
        "url": "https://cdn.abha.com/products/scooter.jpg",
        "altText": "City E-Scooter"
      },
      "priceRange": {
        "min": 89999.00,
        "max": 94999.00,
        "currency": "INR"
      },
      "isFeatured": true,
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 45,
    "totalPages": 3
  }
}
```

---

### 3.4 Get Product Details

**Endpoint:** `GET /api/v1/products/{slugOrId}`

**Description:** Retrieve complete product information including variants, specs, and media.

**Path Parameters:**
- `slugOrId` (string): Product slug or UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "EV-SCOOTER-001",
    "slug": "city-e-scooter",
    "name": "City E-Scooter",
    "shortDescription": "Perfect for urban commuting",
    "description": "Full product description with features...",
    "productType": "vehicle",
    "brand": {
      "id": "uuid",
      "name": "Brand Name",
      "slug": "brand-name",
      "logoUrl": "https://cdn.abha.com/brands/logo.png"
    },
    "category": {
      "id": "uuid",
      "name": "Electric Scooters",
      "slug": "electric-scooters",
      "breadcrumb": ["Electric Vehicles", "Electric Scooters"]
    },
    "variants": [
      {
        "id": "uuid",
        "sku": "EV-SCOOTER-001-RED-2.5",
        "variantName": "Red - 2.5kWh Battery",
        "colour": "Red",
        "batteryOption": "2.5kWh",
        "price": 89999.00,
        "compareAtPrice": 94999.00,
        "isAvailable": true,
        "stockStatus": "IN_STOCK"
      }
    ],
    "specifications": [
      {
        "group": "Performance",
        "specs": [
          {
            "key": "claimed_range",
            "label": "Claimed Range",
            "value": "75",
            "unit": "km"
          },
          {
            "key": "top_speed",
            "label": "Top Speed",
            "value": "65",
            "unit": "km/h"
          }
        ]
      },
      {
        "group": "Battery",
        "specs": [
          {
            "key": "battery_capacity",
            "label": "Battery Capacity",
            "value": "2.5",
            "unit": "kWh"
          },
          {
            "key": "charging_time",
            "label": "Charging Time",
            "value": "4-5",
            "unit": "hours"
          }
        ]
      }
    ],
    "media": [
      {
        "id": "uuid",
        "type": "image",
        "url": "https://cdn.abha.com/products/scooter-1.jpg",
        "thumbnailUrl": "https://cdn.abha.com/products/thumb/scooter-1.jpg",
        "altText": "City E-Scooter Front View",
        "isPrimary": true,
        "displayOrder": 1
      }
    ],
    "isFeatured": true,
    "metaTitle": "City E-Scooter - Electric Scooter for Urban Commuting",
    "metaDescription": "Buy City E-Scooter online...",
    "createdAt": "2026-10-01T10:00:00Z"
  }
}
```

---

### 3.5 Check Product Availability

**Endpoint:** `GET /api/v1/products/{id}/availability`

**Description:** Check real-time stock availability for a product variant.

**Query Parameters:**
- `variantId` (uuid, required): Product variant ID
- `quantity` (integer, default: 1): Quantity to check
- `locationId` (uuid, optional): Specific location

**Response:**
```json
{
  "success": true,
  "data": {
    "variantId": "uuid",
    "isAvailable": true,
    "quantityAvailable": 15,
    "locations": [
      {
        "locationId": "uuid",
        "locationName": "Main Showroom, Mumbai",
        "quantityAvailable": 10
      },
      {
        "locationId": "uuid",
        "locationName": "Warehouse, Pune",
        "quantityAvailable": 5
      }
    ],
    "estimatedDelivery": "3-5 business days"
  }
}
```

---

## 4. CUSTOMER APIS

Requires authentication. Customer can only access their own data.

### 4.1 Get Current Customer Profile

**Endpoint:** `GET /api/v1/me`

**Permission:** Authenticated customer

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerNumber": "CUST-2026-00001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "alternatePhone": null,
    "address": {
      "line1": "123 Main Street",
      "line2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "consentMarketing": true,
    "leadSource": "website",
    "createdAt": "2026-09-15T08:30:00Z"
  }
}
```

---

### 4.2 Update Customer Profile

**Endpoint:** `PATCH /api/v1/me`

**Permission:** Authenticated customer

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "alternatePhone": "+919876543211",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "consentMarketing": true
}
```

**Response:** Updated customer profile (same as GET /api/v1/me)

---

### 4.3 List Customer Orders

**Endpoint:** `GET /api/v1/me/orders`

**Permission:** Authenticated customer

**Query Parameters:**
- `page` (integer, default: 0)
- `size` (integer, default: 20)
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2026-11-00123",
      "orderType": "purchase",
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "fulfilmentStatus": "PROCESSING",
      "items": [
        {
          "productName": "City E-Scooter",
          "variantName": "Red - 2.5kWh Battery",
          "quantity": 1,
          "unitPrice": 89999.00
        }
      ],
      "subtotal": 89999.00,
      "taxAmount": 16199.82,
      "deliveryCharge": 0.00,
      "grandTotal": 106198.82,
      "currency": "INR",
      "createdAt": "2026-11-10T14:30:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 3,
    "totalPages": 1
  }
}
```

---

### 4.4 Get Order Details

**Endpoint:** `GET /api/v1/me/orders/{id}`

**Permission:** Authenticated customer (own orders only)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2026-11-00123",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "fulfilmentStatus": "PROCESSING",
    "items": [
      {
        "id": "uuid",
        "productName": "City E-Scooter",
        "sku": "EV-SCOOTER-001-RED-2.5",
        "variantName": "Red - 2.5kWh Battery",
        "quantity": 1,
        "unitPrice": 89999.00,
        "taxRate": 18.00,
        "taxAmount": 16199.82,
        "lineTotal": 106198.82,
        "warrantyStartDate": "2026-11-10",
        "warrantyEndDate": "2029-11-10"
      }
    ],
    "billingAddress": {
      "fullName": "John Doe",
      "phone": "+919876543210",
      "line1": "123 Main Street",
      "line2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "deliveryAddress": {
      "fullName": "John Doe",
      "phone": "+919876543210",
      "line1": "456 Work Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400002"
    },
    "subtotal": 89999.00,
    "discountAmount": 0.00,
    "taxAmount": 16199.82,
    "deliveryCharge": 0.00,
    "grandTotal": 106198.82,
    "currency": "INR",
    "payments": [
      {
        "id": "uuid",
        "method": "upi",
        "amount": 106198.82,
        "status": "paid",
        "paidAt": "2026-11-10T14:35:00Z"
      }
    ],
    "delivery": {
      "type": "home_delivery",
      "status": "pending",
      "scheduledDate": "2026-11-15",
      "trackingNumber": null
    },
    "customerNote": "Please call before delivery",
    "createdAt": "2026-11-10T14:30:00Z",
    "updatedAt": "2026-11-10T14:35:00Z"
  }
}
```

---

### 4.5 List Customer Bookings

**Endpoint:** `GET /api/v1/me/bookings`

**Permission:** Authenticated customer

**Response:** Similar to orders list

---

### 4.6 List Customer Finance Applications

**Endpoint:** `GET /api/v1/me/finance-applications`

**Permission:** Authenticated customer

**Query Parameters:**
- `page` (integer, default: 0)
- `size` (integer, default: 20)
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicationNumber": "LOAN-2026-11-00045",
      "productName": "City E-Scooter",
      "variantName": "Red - 2.5kWh Battery",
      "vehiclePrice": 89999.00,
      "downPayment": 20000.00,
      "requestedAmount": 69999.00,
      "tenureMonths": 24,
      "estimatedEmi": 3245.00,
      "status": "UNDER_REVIEW",
      "partnerName": "XYZ Bank",
      "submittedAt": "2026-11-12T10:00:00Z",
      "lastUpdatedAt": "2026-11-13T15:30:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

---

## 5. CART & CHECKOUT APIS

### 5.1 Get Cart

**Endpoint:** `GET /api/v1/cart`

**Permission:** Authenticated customer or guest session

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "product": {
          "id": "uuid",
          "name": "City E-Scooter",
          "slug": "city-e-scooter"
        },
        "variant": {
          "id": "uuid",
          "sku": "EV-SCOOTER-001-RED-2.5",
          "variantName": "Red - 2.5kWh Battery",
          "colour": "Red"
        },
        "quantity": 1,
        "unitPrice": 89999.00,
        "lineTotal": 89999.00,
        "isAvailable": true,
        "imageUrl": "https://cdn.abha.com/products/scooter-1.jpg"
      }
    ],
    "subtotal": 89999.00,
    "itemCount": 1,
    "updatedAt": "2026-11-14T10:15:00Z"
  }
}
```

---

### 5.2 Add Item to Cart

**Endpoint:** `POST /api/v1/cart/items`

**Permission:** Authenticated customer or guest session

**Request Body:**
```json
{
  "variantId": "uuid",
  "quantity": 1
}
```

**Response:** Updated cart (same as GET /api/v1/cart)

---

### 5.3 Update Cart Item

**Endpoint:** `PATCH /api/v1/cart/items/{itemId}`

**Permission:** Authenticated customer or guest session

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response:** Updated cart

---

### 5.4 Remove Cart Item

**Endpoint:** `DELETE /api/v1/cart/items/{itemId}`

**Permission:** Authenticated customer or guest session

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Item removed from cart"
  }
}
```

---

### 5.5 Create Order (Checkout)

**Endpoint:** `POST /api/v1/orders`

**Permission:** Authenticated customer

**Request Body:**
```json
{
  "orderType": "purchase",
  "billingAddress": {
    "fullName": "John Doe",
    "phone": "+919876543210",
    "line1": "123 Main Street",
    "line2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "deliveryAddress": {
    "fullName": "John Doe",
    "phone": "+919876543210",
    "line1": "456 Work Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  },
  "deliveryType": "home_delivery",
  "customerNote": "Please call before delivery",
  "paymentMethod": "upi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-2026-11-00123",
    "status": "PENDING_CONFIRMATION",
    "grandTotal": 106198.82,
    "paymentRequired": true,
    "paymentDetails": {
      "method": "upi",
      "amount": 106198.82,
      "currency": "INR",
      "providerOrderId": "razorpay_xyz123"
    }
  }
}
```

---

## 6. FINANCE APIS

### 6.1 List Finance Partners

**Endpoint:** `GET /api/v1/finance/partners`

**Permission:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "XYZ Bank",
      "code": "XYZ_BANK",
      "partnerType": "bank",
      "logoUrl": "https://cdn.abha.com/partners/xyz-bank.png",
      "website": "https://xyzbank.com"
    }
  ]
}
```

---

### 6.2 List Finance Products

**Endpoint:** `GET /api/v1/finance/products`

**Permission:** Public

**Query Parameters:**
- `partnerId` (uuid, optional): Filter by partner

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "partner": {
        "id": "uuid",
        "name": "XYZ Bank"
      },
      "name": "EV Loan Standard",
      "description": "Competitive rates for electric vehicles",
      "minLoanAmount": 50000.00,
      "maxLoanAmount": 500000.00,
      "minInterestRate": 8.50,
      "maxInterestRate": 12.50,
      "minTenureMonths": 12,
      "maxTenureMonths": 60,
      "processingFeePct": 1.00,
      "disclaimer": "Rates are indicative and subject to credit approval"
    }
  ]
}
```

---

### 6.3 Calculate EMI

**Endpoint:** `POST /api/v1/finance/calculate-emi`

**Permission:** Public

**Request Body:**
```json
{
  "loanAmount": 69999.00,
  "interestRate": 10.50,
  "tenureMonths": 24
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loanAmount": 69999.00,
    "interestRate": 10.50,
    "tenureMonths": 24,
    "emi": 3245.67,
    "totalPayable": 77896.08,
    "totalInterest": 7897.08,
    "disclaimer": "This is an indicative calculation. Actual EMI may vary based on lender terms."
  }
}
```

---

### 6.4 Submit Finance Application

**Endpoint:** `POST /api/v1/finance/applications`

**Permission:** Authenticated customer

**Request Body:**
```json
{
  "variantId": "uuid",
  "partnerId": "uuid",
  "vehiclePrice": 89999.00,
  "downPayment": 20000.00,
  "requestedAmount": 69999.00,
  "tenureMonths": 24,
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "applicantPhone": "+919876543210",
  "applicantCity": "Mumbai",
  "applicantPincode": "400001",
  "employmentType": "salaried",
  "monthlyIncome": 75000.00,
  "consentText": "I consent to share my information...",
  "consentGiven": true
}
```

**Validation Rules:**
- `requestedAmount` must be <= `vehiclePrice - downPayment`
- `downPayment` must be >= 0
- `consentGiven` must be true
- `tenureMonths` must be within partner limits

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationNumber": "LOAN-2026-11-00045",
    "status": "SUBMITTED",
    "submittedAt": "2026-11-14T11:00:00Z",
    "message": "Your application has been submitted successfully. Our team will contact you within 24 hours."
  }
}
```

---

### 6.5 Get Finance Application Details

**Endpoint:** `GET /api/v1/finance/applications/{id}`

**Permission:** Authenticated customer (own applications only)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationNumber": "LOAN-2026-11-00045",
    "product": {
      "name": "City E-Scooter",
      "variantName": "Red - 2.5kWh Battery",
      "imageUrl": "https://cdn.abha.com/products/scooter-1.jpg"
    },
    "partner": {
      "name": "XYZ Bank",
      "logoUrl": "https://cdn.abha.com/partners/xyz-bank.png"
    },
    "vehiclePrice": 89999.00,
    "downPayment": 20000.00,
    "requestedAmount": 69999.00,
    "tenureMonths": 24,
    "estimatedEmi": 3245.67,
    "estimatedRate": 10.50,
    "status": "UNDER_REVIEW",
    "statusHistory": [
      {
        "status": "SUBMITTED",
        "timestamp": "2026-11-14T11:00:00Z",
        "note": "Application submitted"
      },
      {
        "status": "UNDER_REVIEW",
        "timestamp": "2026-11-14T15:30:00Z",
        "note": "Application is being reviewed by our team"
      }
    ],
    "documents": [
      {
        "id": "uuid",
        "type": "identity",
        "name": "Aadhaar Card",
        "status": "pending",
        "uploadedAt": "2026-11-14T11:05:00Z"
      }
    ],
    "assignedOfficer": {
      "name": "Jane Smith",
      "phone": "+919876543299",
      "email": "jane@abhaenterprise.com"
    },
    "submittedAt": "2026-11-14T11:00:00Z",
    "lastUpdatedAt": "2026-11-14T15:30:00Z"
  }
}
```

---

## 7. ADMIN PRODUCT APIS

All admin endpoints require authentication and appropriate permissions.

### 7.1 List Products (Admin)

**Endpoint:** `GET /api/v1/admin/products`

**Permission:** `products.read`

**Query Parameters:**
- `page`, `size`, `search`, `status`, `categoryId`, `brandId`, `sort`

**Response:** Similar to public product list but includes draft/archived products

---

### 7.2 Create Product

**Endpoint:** `POST /api/v1/admin/products`

**Permission:** `products.write`

**Request Body:**
```json
{
  "brandId": "uuid",
  "categoryId": "uuid",
  "sku": "EV-SCOOTER-002",
  "slug": "premium-e-scooter",
  "name": "Premium E-Scooter",
  "shortDescription": "High-performance electric scooter",
  "description": "Complete product description...",
  "productType": "vehicle",
  "status": "DRAFT",
  "isFeatured": false,
  "metaTitle": "Premium E-Scooter",
  "metaDescription": "Buy Premium E-Scooter..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sku": "EV-SCOOTER-002",
    "slug": "premium-e-scooter",
    "name": "Premium E-Scooter",
    "status": "DRAFT",
    "createdAt": "2026-11-14T12:00:00Z"
  }
}
```

---

### 7.3 Update Product

**Endpoint:** `PATCH /api/v1/admin/products/{id}`

**Permission:** `products.write`

**Request Body:** Partial product update (same fields as create)

**Response:** Updated product

---

### 7.4 Delete (Archive) Product

**Endpoint:** `DELETE /api/v1/admin/products/{id}`

**Permission:** `products.delete`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product archived successfully"
  }
}
```

---

### 7.5 Add Product Variant

**Endpoint:** `POST /api/v1/admin/products/{id}/variants`

**Permission:** `products.write`

**Request Body:**
```json
{
  "sku": "EV-SCOOTER-002-BLUE-3.0",
  "variantName": "Blue - 3.0kWh Battery",
  "colour": "Blue",
  "batteryOption": "3.0kWh",
  "price": 94999.00,
  "compareAtPrice": 99999.00,
  "costPrice": 75000.00
}
```

**Response:** Created variant

---

### 7.6 Add Product Specification

**Endpoint:** `POST /api/v1/admin/products/{id}/specs`

**Permission:** `products.write`

**Request Body:**
```json
{
  "specKey": "claimed_range",
  "specValue": "85",
  "unit": "km",
  "specGroup": "performance",
  "displayOrder": 1
}
```

**Response:** Created specification

---

### 7.7 Upload Product Media

**Endpoint:** `POST /api/v1/admin/products/{id}/media`

**Permission:** `products.write`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file, required): Image file
- `altText` (string, optional)
- `isPrimary` (boolean, default: false)
- `displayOrder` (integer, default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://cdn.abha.com/products/scooter-new.jpg",
    "thumbnailUrl": "https://cdn.abha.com/products/thumb/scooter-new.jpg",
    "altText": "Premium E-Scooter",
    "isPrimary": false,
    "displayOrder": 2
  }
}
```

---

## 8. ADMIN INVENTORY APIS

### 8.1 Get Inventory Overview

**Endpoint:** `GET /api/v1/admin/inventory`

**Permission:** `inventory.read`

**Query Parameters:**
- `locationId` (uuid, optional)
- `variantId` (uuid, optional)
- `lowStock` (boolean): Show only low-stock items
- `page`, `size`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "variant": {
        "id": "uuid",
        "sku": "EV-SCOOTER-001-RED-2.5",
        "productName": "City E-Scooter",
        "variantName": "Red - 2.5kWh Battery"
      },
      "location": {
        "id": "uuid",
        "name": "Main Showroom, Mumbai",
        "code": "MUM-001"
      },
      "quantityOnHand": 25,
      "quantityReserved": 5,
      "quantityAvailable": 20,
      "reorderLevel": 10,
      "stockStatus": "IN_STOCK",
      "lastStockCheck": "2026-11-14T09:00:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

---

### 8.2 Create Inventory Transaction

**Endpoint:** `POST /api/v1/admin/inventory/transactions`

**Permission:** `inventory.write`

**Request Body:**
```json
{
  "inventoryId": "uuid",
  "transactionType": "receive",
  "quantityDelta": 10,
  "referenceType": "purchase_order",
  "referenceId": "uuid",
  "serialNumber": "VIN123456789",
  "note": "Stock receipt from supplier"
}
```

**Transaction Types:**
- `receive`: Stock arrival (+)
- `reserve`: Allocate to order (-)
- `release`: Cancel reservation (+)
- `dispatch`: Ship to customer (-)
- `adjustment`: Manual correction (+/-)
- `transfer_in`: From another location (+)
- `transfer_out`: To another location (-)
- `return`: Customer return (+)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "transactionType": "receive",
    "quantityDelta": 10,
    "newQuantityOnHand": 35,
    "newQuantityAvailable": 30,
    "createdAt": "2026-11-14T13:00:00Z"
  }
}
```

---

### 8.3 Get Inventory Transaction History

**Endpoint:** `GET /api/v1/admin/inventory/{inventoryId}/transactions`

**Permission:** `inventory.read`

**Query Parameters:**
- `page`, `size`
- `transactionType` (string, optional)
- `startDate` (ISO 8601, optional)
- `endDate` (ISO 8601, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "transactionType": "reserve",
      "quantityDelta": -1,
      "referenceType": "order",
      "referenceId": "uuid",
      "note": "Reserved for order ORD-2026-11-00123",
      "createdBy": {
        "name": "System",
        "email": null
      },
      "createdAt": "2026-11-14T12:30:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 50,
    "totalElements": 245,
    "totalPages": 5
  }
}
```

---

## 9. ADMIN ORDER APIS

### 9.1 List Orders (Admin)

**Endpoint:** `GET /api/v1/admin/orders`

**Permission:** `orders.read`

**Query Parameters:**
- `page`, `size`
- `status` (string): Filter by order status
- `paymentStatus` (string): Filter by payment status
- `fulfilmentStatus` (string): Filter by fulfilment status
- `customerId` (uuid): Filter by customer
- `startDate`, `endDate`: Date range filter
- `search` (string): Search by order number, customer name
- `sort` (string): Sort field and direction

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2026-11-00123",
      "customer": {
        "id": "uuid",
        "name": "John Doe",
        "phone": "+919876543210"
      },
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "fulfilmentStatus": "PROCESSING",
      "grandTotal": 106198.82,
      "itemCount": 1,
      "createdAt": "2026-11-10T14:30:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 342,
    "totalPages": 18
  }
}
```

---

### 9.2 Get Order Details (Admin)

**Endpoint:** `GET /api/v1/admin/orders/{id}`

**Permission:** `orders.read`

**Response:** Complete order details including internal notes

---

### 9.3 Update Order Status

**Endpoint:** `PATCH /api/v1/admin/orders/{id}/status`

**Permission:** `orders.write`

**Request Body:**
```json
{
  "status": "PROCESSING",
  "internalNote": "Order confirmed, preparing for dispatch"
}
```

**Allowed Transitions:**
- PENDING_CONFIRMATION → CONFIRMED
- CONFIRMED → PROCESSING
- PROCESSING → READY_FOR_DELIVERY
- READY_FOR_DELIVERY → DELIVERED
- Any status → CANCELLED (with reason)

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "oldStatus": "CONFIRMED",
    "newStatus": "PROCESSING",
    "updatedAt": "2026-11-14T14:00:00Z"
  }
}
```

---

### 9.4 Update Fulfilment Status

**Endpoint:** `PATCH /api/v1/admin/orders/{id}/fulfilment`

**Permission:** `orders.write`

**Request Body:**
```json
{
  "fulfilmentStatus": "DISPATCHED",
  "trackingNumber": "TRK123456789",
  "carrier": "Blue Dart",
  "note": "Dispatched via Blue Dart"
}
```

**Response:** Updated order

---

### 9.5 Generate Invoice

**Endpoint:** `POST /api/v1/admin/orders/{id}/invoice`

**Permission:** `orders.write`

**Request Body:**
```json
{
  "invoiceDate": "2026-11-14",
  "dueDate": "2026-11-29",
  "paymentTerms": "Net 15 days",
  "notes": "Thank you for your business"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "uuid",
    "invoiceNumber": "INV-2026-11-00123",
    "fileUrl": "https://cdn.abha.com/invoices/INV-2026-11-00123.pdf",
    "generatedAt": "2026-11-14T14:30:00Z"
  }
}
```

---

## 10. ADMIN FINANCE APIS

### 10.1 List Loan Applications (Admin)

**Endpoint:** `GET /api/v1/admin/finance/applications`

**Permission:** `loans.read`

**Query Parameters:**
- `page`, `size`
- `status` (string): Filter by status
- `partnerId` (uuid): Filter by partner
- `assignedTo` (uuid): Filter by assigned officer
- `startDate`, `endDate`: Submission date range
- `search` (string): Search by application number, customer name
- `sort` (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicationNumber": "LOAN-2026-11-00045",
      "customer": {
        "id": "uuid",
        "name": "John Doe",
        "phone": "+919876543210"
      },
      "product": {
        "name": "City E-Scooter",
        "variantName": "Red - 2.5kWh Battery"
      },
      "partner": {
        "name": "XYZ Bank"
      },
      "requestedAmount": 69999.00,
      "tenureMonths": 24,
      "status": "UNDER_REVIEW",
      "assignedTo": {
        "name": "Jane Smith"
      },
      "submittedAt": "2026-11-14T11:00:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 78,
    "totalPages": 4
  }
}
```

---

### 10.2 Get Loan Application Details (Admin)

**Endpoint:** `GET /api/v1/admin/finance/applications/{id}`

**Permission:** `loans.read`

**Response:** Complete application details including sensitive data

---

### 10.3 Update Loan Application Status

**Endpoint:** `PATCH /api/v1/admin/finance/applications/{id}/status`

**Permission:** `loans.write`

**Request Body:**
```json
{
  "status": "DOCUMENTS_VERIFIED",
  "reason": "All documents verified and approved",
  "notes": "Proceeding to partner referral"
}
```

**Status Workflow:**
```
SUBMITTED → UNDER_REVIEW → DOCUMENTS_PENDING → DOCUMENTS_VERIFIED 
→ REFERRED_TO_PARTNER → PARTNER_DECISION_PENDING 
→ APPROVED / REJECTED / WITHDRAWN → DISBURSED (if approved)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "applicationId": "uuid",
    "oldStatus": "UNDER_REVIEW",
    "newStatus": "DOCUMENTS_VERIFIED",
    "updatedBy": {
      "name": "Jane Smith"
    },
    "updatedAt": "2026-11-14T15:00:00Z"
  }
}
```

---

### 10.4 Assign Loan Application

**Endpoint:** `PATCH /api/v1/admin/finance/applications/{id}/assign`

**Permission:** `loans.write`

**Request Body:**
```json
{
  "assignedTo": "uuid"
}
```

**Response:** Updated application

---

### 10.5 Upload Loan Document

**Endpoint:** `POST /api/v1/admin/finance/applications/{id}/documents`

**Permission:** `loans.documents.write`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file, required)
- `documentType` (string, required): identity, address, income, bank_statement, other
- `documentName` (string, required)
- `expiryDate` (date, optional): Document validity expiration

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "documentType": "identity",
    "documentName": "Aadhaar Card",
    "reviewStatus": "pending",
    "uploadedAt": "2026-11-14T15:30:00Z"
  }
}
```

**Security Note:** Document files are stored in private storage. Access URLs are time-limited signed URLs generated on-demand.

---

### 10.6 Get Loan Document (Signed URL)

**Endpoint:** `GET /api/v1/admin/finance/applications/{id}/documents/{documentId}`

**Permission:** `loans.documents.read`

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "documentName": "Aadhaar Card",
    "documentType": "identity",
    "fileUrl": "https://storage.abha.com/documents/...?signature=...&expires=...",
    "urlExpiresAt": "2026-11-14T16:00:00Z",
    "reviewStatus": "approved"
  }
}
```

---

### 10.7 Review Loan Document

**Endpoint:** `PATCH /api/v1/admin/finance/applications/{id}/documents/{documentId}/review`

**Permission:** `loans.documents.write`

**Request Body:**
```json
{
  "reviewStatus": "approved",
  "reviewNotes": "Document verified successfully",
  "isVerified": true
}
```

**Response:** Updated document status

---

## 11. ADMIN CRM APIS

### 11.1 List Enquiries

**Endpoint:** `GET /api/v1/admin/enquiries`

**Permission:** `customers.read`

**Query Parameters:**
- `page`, `size`
- `status`, `priority`, `enquiryType`, `source`
- `assignedTo` (uuid)
- `startDate`, `endDate`
- `search`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "enquiryNumber": "ENQ-2026-11-00234",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+919876543211",
      "enquiryType": "product",
      "source": "website",
      "status": "NEW",
      "priority": "medium",
      "product": {
        "name": "City E-Scooter"
      },
      "assignedTo": null,
      "createdAt": "2026-11-14T10:00:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 125,
    "totalPages": 7
  }
}
```

---

### 11.2 Create Enquiry

**Endpoint:** `POST /api/v1/admin/enquiries`

**Permission:** `customers.write`

**Request Body:**
```json
{
  "customerId": "uuid",
  "source": "phone",
  "enquiryType": "product",
  "productId": "uuid",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+919876543211",
  "city": "Mumbai",
  "message": "Interested in City E-Scooter",
  "priority": "medium"
}
```

**Response:** Created enquiry

---

### 11.3 Update Enquiry

**Endpoint:** `PATCH /api/v1/admin/enquiries/{id}`

**Permission:** `customers.write`

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "priority": "high",
  "assignedTo": "uuid",
  "resolutionNotes": "Called customer, interested in test drive"
}
```

**Response:** Updated enquiry

---

### 11.4 Create Call Log

**Endpoint:** `POST /api/v1/admin/call-logs`

**Permission:** `customers.write`

**Request Body:**
```json
{
  "customerId": "uuid",
  "enquiryId": "uuid",
  "callType": "outbound",
  "callDurationSec": 180,
  "outcome": "connected",
  "notes": "Customer interested in test drive. Scheduled for Nov 16.",
  "nextFollowupAt": "2026-11-16T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "callType": "outbound",
    "callAt": "2026-11-14T14:00:00Z",
    "outcome": "connected",
    "nextFollowupAt": "2026-11-16T10:00:00Z"
  }
}
```

---

### 11.5 Create Task

**Endpoint:** `POST /api/v1/admin/tasks`

**Permission:** `customers.write`

**Request Body:**
```json
{
  "title": "Schedule test drive for Jane Smith",
  "description": "Customer requested test drive for City E-Scooter",
  "taskType": "followup",
  "priority": "high",
  "assignedTo": "uuid",
  "dueAt": "2026-11-16T10:00:00Z",
  "relatedType": "enquiry",
  "relatedId": "uuid"
}
```

**Response:** Created task

---

## 12. ADMIN USER MANAGEMENT APIS

### 12.1 List Users

**Endpoint:** `GET /api/v1/admin/users`

**Permission:** `users.manage`

**Query Parameters:**
- `page`, `size`
- `isActive` (boolean)
- `roleCode` (string): Filter by role
- `search`: Search by name, email, phone

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "authUid": "firebase_uid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "isActive": true,
      "roles": [
        {
          "code": "CUSTOMER",
          "name": "Customer"
        }
      ],
      "lastLoginAt": "2026-11-14T09:00:00Z",
      "createdAt": "2026-09-15T08:30:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 1250,
    "totalPages": 63
  }
}
```

---

### 12.2 Assign Role to User

**Endpoint:** `POST /api/v1/admin/users/{id}/roles`

**Permission:** `users.manage`

**Request Body:**
```json
{
  "roleId": "uuid",
  "expiresAt": "2027-11-14T23:59:59Z"
}
```

**Response:** Updated user with roles

---

### 12.3 Remove Role from User

**Endpoint:** `DELETE /api/v1/admin/users/{id}/roles/{roleId}`

**Permission:** `users.manage`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Role removed successfully"
  }
}
```

---

### 12.4 List Roles

**Endpoint:** `GET /api/v1/admin/roles`

**Permission:** `users.manage`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Business Manager",
      "code": "BUSINESS_MANAGER",
      "description": "Manages products, orders, and operations",
      "isSystem": true,
      "permissions": [
        {
          "code": "products.read",
          "module": "products",
          "action": "read"
        }
      ]
    }
  ]
}
```

---

### 12.5 Update Role Permissions

**Endpoint:** `PATCH /api/v1/admin/roles/{id}/permissions`

**Permission:** `users.manage`

**Request Body:**
```json
{
  "addPermissions": ["orders.write", "customers.read"],
  "removePermissions": ["products.delete"]
}
```

**Response:** Updated role with permissions

---

## 13. ERROR HANDLING

### 13.1 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ ... ]
  },
  "meta": {
    "timestamp": "2026-11-14T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### 13.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| AUTHENTICATION_REQUIRED | 401 | Missing or invalid authentication |
| INSUFFICIENT_PERMISSIONS | 403 | User lacks required permissions |
| RESOURCE_NOT_FOUND | 404 | Requested resource doesn't exist |
| DUPLICATE_RESOURCE | 409 | Resource already exists |
| INSUFFICIENT_STOCK | 422 | Not enough inventory available |
| INVALID_STATUS_TRANSITION | 422 | Status change not allowed |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |

### 13.3 Validation Error Details

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "code": "INVALID_EMAIL",
        "message": "Email format is invalid"
      },
      {
        "field": "phone",
        "code": "REQUIRED",
        "message": "Phone number is required"
      }
    ]
  }
}
```

---

## 14. RATE LIMITING

### 14.1 Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1731580800
```

### 14.2 Rate Limits by User Type

| User Type | Requests per Minute | Requests per Hour |
|-----------|---------------------|-------------------|
| Guest | 20 | 100 |
| Customer | 60 | 1000 |
| Admin | 120 | 5000 |

### 14.3 Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

---

## SUMMARY

### API Statistics
- **Total Endpoints:** 60+
- **Public Endpoints:** 10
- **Customer Endpoints:** 12
- **Admin Endpoints:** 40+
- **HTTP Methods:** GET, POST, PATCH, DELETE
- **Authentication:** Firebase ID Token
- **Authorization:** Permission-based RBAC

### Key Features
✅ RESTful design principles  
✅ Versioned endpoints (/api/v1)  
✅ Consistent response format  
✅ Comprehensive error handling  
✅ Pagination support  
✅ Filter and search capabilities  
✅ Permission-based access control  
✅ Rate limiting  
✅ Audit logging  
✅ Secure file uploads with signed URLs

### Security Highlights
- Firebase token validation on every request
- Permission checks at service layer
- Sensitive data access logging
- Time-limited signed URLs for documents
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)

### Next Steps
1. ✅ REST API specification complete
2. ⏭️ Design RBAC permission matrix
3. ⏭️ Create system architecture diagrams
4. ⏭️ Define user journeys
5. ⏭️ Implement OpenAPI/Swagger documentation

---

**Document Status:** Complete  
**Next Deliverable:** RBAC Permission Matrix and Security Model
