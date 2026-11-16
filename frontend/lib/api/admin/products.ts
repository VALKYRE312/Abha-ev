import { apiClient } from '@/lib/api/client';

export interface ProductVariant {
  id?: string;
  color: string;
  colorCode: string;
  batteryCapacity: string;
  motorPower: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
}

export interface ProductSpec {
  id?: string;
  name: string;
  value: string;
  category: string;
}

export interface ProductMedia {
  id?: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  brandId: string;
  brandName?: string;
  categoryId: string;
  categoryName?: string;
  basePrice: number;
  comparePrice?: number;
  taxRate: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  variants: ProductVariant[];
  specifications: ProductSpec[];
  media: ProductMedia[];
  warranty: string;
  range: number;
  topSpeed: number;
  chargingTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  brandId?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Mock data for development - clearly separated for easy API replacement
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ather 450X',
    slug: 'ather-450x',
    sku: 'ATH-450X',
    description: 'Premium electric scooter with advanced features and long range',
    brandId: '1',
    brandName: 'Ather Energy',
    categoryId: '1',
    categoryName: 'Electric Scooters',
    basePrice: 145000,
    comparePrice: 160000,
    taxRate: 5,
    status: 'PUBLISHED',
    warranty: '3 Years or 50,000 km',
    range: 85,
    topSpeed: 90,
    chargingTime: '5 hours',
    variants: [
      {
        id: '1',
        color: 'Space Grey',
        colorCode: '#2C3E50',
        batteryCapacity: '3.7 kWh',
        motorPower: '6.4 kW',
        price: 145000,
        comparePrice: 160000,
        sku: 'ATH-450X-GREY',
        stock: 12,
      },
      {
        id: '2',
        color: 'Cosmic Black',
        colorCode: '#000000',
        batteryCapacity: '3.7 kWh',
        motorPower: '6.4 kW',
        price: 145000,
        sku: 'ATH-450X-BLK',
        stock: 3,
      },
    ],
    specifications: [
      { id: '1', name: 'Battery Type', value: 'Lithium-ion', category: 'Battery' },
      { id: '2', name: 'Motor Type', value: 'PMSM', category: 'Motor' },
      { id: '3', name: 'Braking System', value: 'Disc (Front & Rear)', category: 'Safety' },
    ],
    media: [
      {
        id: '1',
        url: '/products/ather-450x-1.jpg',
        altText: 'Ather 450X - Front View',
        isPrimary: true,
        displayOrder: 1,
      },
    ],
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-11-10T15:30:00Z',
  },
  {
    id: '2',
    name: 'Ola S1 Pro',
    slug: 'ola-s1-pro',
    sku: 'OLA-S1P',
    description: 'High-performance electric scooter with impressive range',
    brandId: '2',
    brandName: 'Ola Electric',
    categoryId: '1',
    categoryName: 'Electric Scooters',
    basePrice: 128000,
    taxRate: 5,
    status: 'PUBLISHED',
    warranty: '3 Years',
    range: 135,
    topSpeed: 115,
    chargingTime: '6 hours',
    variants: [
      {
        id: '3',
        color: 'Jet Black',
        colorCode: '#000000',
        batteryCapacity: '4 kWh',
        motorPower: '8.5 kW',
        price: 128000,
        sku: 'OLA-S1P-BLK',
        stock: 8,
      },
    ],
    specifications: [
      { id: '4', name: 'Battery Capacity', value: '4 kWh', category: 'Battery' },
      { id: '5', name: 'Peak Power', value: '8.5 kW', category: 'Motor' },
    ],
    media: [],
    createdAt: '2024-10-05T14:20:00Z',
    updatedAt: '2024-11-12T09:15:00Z',
  },
  {
    id: '3',
    name: 'TVS iQube',
    slug: 'tvs-iqube',
    sku: 'TVS-IQB',
    description: 'Smart electric scooter with connected features',
    brandId: '3',
    brandName: 'TVS Motor',
    categoryId: '1',
    categoryName: 'Electric Scooters',
    basePrice: 95000,
    taxRate: 5,
    status: 'PUBLISHED',
    warranty: '3 Years',
    range: 75,
    topSpeed: 78,
    chargingTime: '4.5 hours',
    variants: [],
    specifications: [],
    media: [],
    createdAt: '2024-09-20T11:45:00Z',
    updatedAt: '2024-11-08T16:00:00Z',
  },
  {
    id: '4',
    name: 'Revolt RV400',
    slug: 'revolt-rv400',
    sku: 'RVT-RV400',
    description: 'AI-enabled electric bike with multiple riding modes',
    brandId: '4',
    brandName: 'Revolt Motors',
    categoryId: '2',
    categoryName: 'Electric Bikes',
    basePrice: 112000,
    taxRate: 5,
    status: 'DRAFT',
    warranty: '5 Years',
    range: 150,
    topSpeed: 85,
    chargingTime: '4 hours',
    variants: [],
    specifications: [],
    media: [],
    createdAt: '2024-11-01T08:30:00Z',
    updatedAt: '2024-11-14T12:20:00Z',
  },
];

export const productsApi = {
  // Get all products with filters
  getProducts: async (filters?: ProductFilters) => {
    // TODO: Replace with actual API call
    // return apiClient.get<{ data: Product[]; total: number }>('/admin/products', { params: filters });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...mockProducts];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.sku.toLowerCase().includes(search)
      );
    }
    
    if (filters?.brandId) {
      filtered = filtered.filter(p => p.brandId === filters.brandId);
    }
    
    if (filters?.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId);
    }
    
    if (filters?.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    return {
      data: filtered,
      total: filtered.length,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    };
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiClient.get<Product>(`/admin/products/${id}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  // Create new product
  createProduct: async (data: Partial<Product>) => {
    // TODO: Replace with actual API call
    // return apiClient.post<Product>('/admin/products', data);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct: Product = {
      id: String(mockProducts.length + 1),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Product;
    mockProducts.push(newProduct);
    return newProduct;
  },

  // Update existing product
  updateProduct: async (id: string, data: Partial<Product>) => {
    // TODO: Replace with actual API call
    // return apiClient.put<Product>(`/admin/products/${id}`, data);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockProducts[index];
  },

  // Delete product
  deleteProduct: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiClient.delete(`/admin/products/${id}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts.splice(index, 1);
    return { success: true };
  },

  // Archive product
  archiveProduct: async (id: string) => {
    return productsApi.updateProduct(id, { status: 'ARCHIVED' });
  },

  // Publish product
  publishProduct: async (id: string) => {
    return productsApi.updateProduct(id, { status: 'PUBLISHED' });
  },
};
