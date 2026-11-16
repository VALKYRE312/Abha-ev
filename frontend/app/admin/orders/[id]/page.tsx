'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, User, Phone, Mail } from 'lucide-react';

interface OrderDetail {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  product: {
    name: string;
    sku: string;
    variant: string;
  };
  amount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  paymentMethod: string;
  orderStatus: 'COMPLETED' | 'PROCESSING' | 'SHIPPED' | 'PENDING';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  dates: {
    orderDate: string;
    paymentDate?: string;
    shippedDate?: string;
    deliveredDate?: string;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
}

const mockOrderDetail: OrderDetail = {
  id: '1',
  orderNumber: 'ORD-2024-1234',
  customer: {
    name: 'Rajesh Kumar',
    email: 'rajesh.k@example.com',
    phone: '+91 98765 43210',
  },
  product: {
    name: 'Ather 450X',
    sku: 'ATH-450X-GREY',
    variant: 'Space Grey',
  },
  amount: 145000,
  paymentStatus: 'PAID',
  paymentMethod: 'Online Payment',
  orderStatus: 'COMPLETED',
  shippingAddress: {
    street: '123, MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
  },
  dates: {
    orderDate: '2024-11-14T10:30:00',
    paymentDate: '2024-11-14T10:32:00',
    shippedDate: '2024-11-15T14:20:00',
    deliveredDate: '2024-11-16T16:45:00',
  },
  timeline: [
    { status: 'Order Placed', timestamp: '2024-11-14 10:30 AM', description: 'Order has been placed successfully' },
    { status: 'Payment Confirmed', timestamp: '2024-11-14 10:32 AM', description: 'Payment of ₹1,45,000 received' },
    { status: 'Order Confirmed', timestamp: '2024-11-14 11:00 AM', description: 'Order confirmed and being prepared' },
    { status: 'Shipped', timestamp: '2024-11-15 02:20 PM', description: 'Order shipped from warehouse' },
    { status: 'Out for Delivery', timestamp: '2024-11-16 10:00 AM', description: 'Vehicle out for delivery' },
    { status: 'Delivered', timestamp: '2024-11-16 04:45 PM', description: 'Order delivered successfully' },
  ],
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrderDetail);
      setLoading(false);
    }, 300);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-muted-foreground mb-4">Order not found</div>
        <Button onClick={() => router.push('/admin/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const getOrderStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      COMPLETED: 'default',
      PROCESSING: 'secondary',
      SHIPPED: 'outline',
      PENDING: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      PAID: 'default',
      PENDING: 'secondary',
      FAILED: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground mt-1">{order.orderNumber}</p>
        </div>
        <div className="flex gap-2">
          {getOrderStatusBadge(order.orderStatus)}
          {getPaymentStatusBadge(order.paymentStatus)}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{order.product.name}</div>
                  <div className="text-sm text-muted-foreground">Variant: {order.product.variant}</div>
                  <div className="text-sm text-muted-foreground font-mono">SKU: {order.product.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{order.amount.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customer.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-sm leading-relaxed">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                PIN: {order.shippingAddress.pincode}
              </address>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                        {index + 1}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className="absolute left-4 top-8 h-full w-0.5 bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="font-semibold">{event.status}</div>
                      <div className="text-sm text-muted-foreground">{event.timestamp}</div>
                      <div className="text-sm mt-1">{event.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>₹{order.amount.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-medium">
                  {new Date(order.dates.orderDate).toLocaleDateString('en-IN')}
                </span>
              </div>
              {order.dates.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Date</span>
                  <span className="font-medium">
                    {new Date(order.dates.paymentDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
              {order.dates.shippedDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipped Date</span>
                  <span className="font-medium">
                    {new Date(order.dates.shippedDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
              {order.dates.deliveredDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivered Date</span>
                  <span className="font-medium">
                    {new Date(order.dates.deliveredDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Print Invoice
              </Button>
              <Button className="w-full" variant="outline">
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                Track Shipment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
