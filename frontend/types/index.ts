// Common types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}

// Product types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  parentId?: string;
  displayOrder: number;
  children?: Category[];
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  productType: 'vehicle' | 'accessory' | 'spare_part';
  brand?: Brand;
  category: Category;
  primaryImage?: ProductMedia;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  isFeatured: boolean;
  status: 'draft' | 'active' | 'archived';
}

export interface ProductVariant {
  id: string;
  sku: string;
  variantName: string;
  colour?: string;
  batteryOption?: string;
  price: number;
  compareAtPrice?: number;
  isAvailable: boolean;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface ProductSpec {
  key: string;
  label: string;
  value: string;
  unit?: string;
}

export interface ProductSpecGroup {
  group: string;
  specs: ProductSpec[];
}

export interface ProductMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductDetail extends Product {
  variants: ProductVariant[];
  specifications: ProductSpecGroup[];
  media: ProductMedia[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

// Customer types
export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  consentMarketing: boolean;
  leadSource?: string;
  createdAt: string;
}

// Cart types
export interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  variant: {
    id: string;
    sku: string;
    variantName: string;
    colour?: string;
  };
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  updatedAt: string;
}

// Order types
export type OrderStatus = 
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'ready_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'partially_paid'
  | 'paid'
  | 'refunded'
  | 'failed';

export type FulfilmentStatus = 
  | 'pending'
  | 'processing'
  | 'ready'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  orderType: 'purchase' | 'booking';
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  currency: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

// Finance types
export interface FinancePartner {
  id: string;
  name: string;
  code: string;
  partnerType: 'bank' | 'nbfc' | 'other';
  logoUrl?: string;
  website?: string;
}

export interface FinanceProduct {
  id: string;
  partner: {
    id: string;
    name: string;
  };
  name: string;
  description?: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  minInterestRate: number;
  maxInterestRate: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  processingFeePct: number;
  disclaimer?: string;
}

export interface EMICalculation {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emi: number;
  totalPayable: number;
  totalInterest: number;
  disclaimer: string;
}

export type LoanApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'documents_pending'
  | 'documents_verified'
  | 'referred_to_partner'
  | 'partner_decision_pending'
  | 'approved'
  | 'rejected'
  | 'withdrawn'
  | 'disbursed';

export interface LoanApplication {
  id: string;
  applicationNumber: string;
  productName: string;
  variantName: string;
  vehiclePrice: number;
  downPayment: number;
  requestedAmount: number;
  tenureMonths: number;
  estimatedEmi: number;
  status: LoanApplicationStatus;
  partnerName: string;
  submittedAt: string;
  lastUpdatedAt: string;
}

// Filter types
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandId?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  productType?: string;
  isFeatured?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
