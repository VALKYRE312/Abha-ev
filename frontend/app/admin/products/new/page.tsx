'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { productsApi } from '@/lib/api/admin/products';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(2, 'SKU is required'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.number().min(1, 'Price must be greater than 0'),
  comparePrice: z.number().optional(),
  taxRate: z.number().min(0).max(100),
  warranty: z.string(),
  range: z.number().min(0),
  topSpeed: z.number().min(0),
  chargingTime: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'DRAFT',
      taxRate: 5,
      range: 0,
      topSpeed: 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      await productsApi.createProduct({
        ...data,
        variants: [],
        specifications: [],
        media: [],
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    if (!watch('slug')) {
      setValue('slug', generateSlug(name));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product in your catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    onChange={handleNameChange}
                    placeholder="e.g. Ather 450X"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" {...register('sku')} placeholder="ATH-450X" />
                    {errors.sku && (
                      <p className="mt-1 text-sm text-destructive">{errors.sku.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input id="slug" {...register('slug')} placeholder="ather-450x" />
                    {errors.slug && (
                      <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Detailed product description..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="range">Range (km) *</Label>
                    <Input
                      id="range"
                      type="number"
                      {...register('range', { valueAsNumber: true })}
                      placeholder="85"
                    />
                    {errors.range && (
                      <p className="mt-1 text-sm text-destructive">{errors.range.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="topSpeed">Top Speed (km/h) *</Label>
                    <Input
                      id="topSpeed"
                      type="number"
                      {...register('topSpeed', { valueAsNumber: true })}
                      placeholder="90"
                    />
                    {errors.topSpeed && (
                      <p className="mt-1 text-sm text-destructive">{errors.topSpeed.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="chargingTime">Charging Time *</Label>
                    <Input
                      id="chargingTime"
                      {...register('chargingTime')}
                      placeholder="5 hours"
                    />
                    {errors.chargingTime && (
                      <p className="mt-1 text-sm text-destructive">{errors.chargingTime.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="warranty">Warranty *</Label>
                    <Input
                      id="warranty"
                      {...register('warranty')}
                      placeholder="3 Years or 50,000 km"
                    />
                    {errors.warranty && (
                      <p className="mt-1 text-sm text-destructive">{errors.warranty.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select onValueChange={(value) => setValue('categoryId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Electric Scooters</SelectItem>
                      <SelectItem value="2">Electric Bikes</SelectItem>
                      <SelectItem value="3">Three-Wheelers</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-destructive">{errors.categoryId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="brandId">Brand *</Label>
                  <Select onValueChange={(value) => setValue('brandId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ather Energy</SelectItem>
                      <SelectItem value="2">Ola Electric</SelectItem>
                      <SelectItem value="3">TVS Motor</SelectItem>
                      <SelectItem value="4">Revolt Motors</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.brandId && (
                    <p className="mt-1 text-sm text-destructive">{errors.brandId.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="basePrice">Base Price (₹) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    {...register('basePrice', { valueAsNumber: true })}
                    placeholder="145000"
                  />
                  {errors.basePrice && (
                    <p className="mt-1 text-sm text-destructive">{errors.basePrice.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="comparePrice">Compare Price (₹)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    {...register('comparePrice', { valueAsNumber: true })}
                    placeholder="160000"
                  />
                </div>

                <div>
                  <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    {...register('taxRate', { valueAsNumber: true })}
                    placeholder="5"
                  />
                  {errors.taxRate && (
                    <p className="mt-1 text-sm text-destructive">{errors.taxRate.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="status">Product Status *</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as 'DRAFT' | 'PUBLISHED')}
                    defaultValue="DRAFT"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
