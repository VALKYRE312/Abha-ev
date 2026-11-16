'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Package, Tag, IndianRupee } from 'lucide-react';
import { productsApi, Product } from '@/lib/api/admin/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await productsApi.getProduct(params.id as string);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-muted-foreground mb-4">Product not found</div>
        <Button onClick={() => router.push('/admin/products')}>Back to Products</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      PUBLISHED: 'default',
      DRAFT: 'secondary',
      ARCHIVED: 'outline',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground mt-1">{product.sku}</p>
        </div>
        <div className="flex gap-2 items-center">
          {getStatusBadge(product.status)}
          <Button asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <p className="mt-1">{product.description}</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Brand</div>
                  <div className="font-medium">{product.brandName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-medium">{product.categoryName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">SKU</div>
                  <div className="font-mono">{product.sku}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Slug</div>
                  <div className="font-mono text-sm">{product.slug}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Range</div>
                  <div className="font-semibold">{product.range} km</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Top Speed</div>
                  <div className="font-semibold">{product.topSpeed} km/h</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Charging Time</div>
                  <div className="font-semibold">{product.chargingTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Warranty</div>
                  <div className="font-semibold">{product.warranty}</div>
                </div>
              </div>
              {product.specifications.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {product.specifications.map((spec) => (
                      <div key={spec.id} className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">{spec.name}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants ({product.variants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {product.variants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No variants available
                </div>
              ) : (
                <div className="space-y-4">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full border-2"
                            style={{ backgroundColor: variant.colorCode }}
                            title={variant.color}
                          />
                          <div>
                            <div className="font-semibold">{variant.color}</div>
                            <div className="text-sm text-muted-foreground font-mono">{variant.sku}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{variant.price.toLocaleString('en-IN')}</div>
                          {variant.comparePrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{variant.comparePrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Battery</div>
                          <div className="font-medium">{variant.batteryCapacity}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Motor</div>
                          <div className="font-medium">{variant.motorPower}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Stock</div>
                          <div className="font-semibold">
                            <Badge variant={variant.stock < 5 ? 'destructive' : 'default'}>
                              {variant.stock} units
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Base Price</div>
                <div className="text-2xl font-bold">₹{product.basePrice.toLocaleString('en-IN')}</div>
              </div>
              {product.comparePrice && (
                <div>
                  <div className="text-sm text-muted-foreground">Compare at Price</div>
                  <div className="text-lg line-through text-muted-foreground">
                    ₹{product.comparePrice.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Tax Rate</div>
                <div className="font-semibold">{product.taxRate}%</div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Total Stock</div>
                <div className="text-2xl font-bold">
                  {product.variants.reduce((sum, v) => sum + v.stock, 0)} units
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Variants</div>
                <div className="font-semibold">{product.variants.length} variant(s)</div>
              </div>
            </CardContent>
          </Card>

          {/* Status & Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Status & Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                {getStatusBadge(product.status)}
              </div>
              <Separator />
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-sm">
                  {new Date(product.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-sm">
                  {new Date(product.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.status === 'DRAFT' && (
                <Button className="w-full" variant="default">
                  Publish Product
                </Button>
              )}
              {product.status === 'PUBLISHED' && (
                <Button className="w-full" variant="outline">
                  Unpublish
                </Button>
              )}
              <Button className="w-full" variant="outline">
                Archive Product
              </Button>
              <Button className="w-full" variant="outline">
                Duplicate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
