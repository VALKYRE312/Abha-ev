'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingCart, FileText, CreditCard } from 'lucide-react';

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'ACTIVE' | 'INACTIVE';
  orders: Array<{
    id: string;
    orderNumber: string;
    product: string;
    amount: number;
    status: string;
    date: string;
  }>;
  loanApplications: Array<{
    id: string;
    applicationNumber: string;
    product: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

const mockCustomer: CustomerDetail = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh.k@example.com',
  phone: '+91 98765 43210',
  address: {
    street: '123, MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
  },
  joinedDate: '2024-09-15',
  totalOrders: 2,
  totalSpent: 290000,
  status: 'ACTIVE',
  orders: [
    { id: '1', orderNumber: 'ORD-2024-1234', product: 'Ather 450X', amount: 145000, status: 'COMPLETED', date: '2024-11-14' },
    { id: '2', orderNumber: 'ORD-2024-1156', product: 'Ather 450X', amount: 145000, status: 'DELIVERED', date: '2024-10-20' },
  ],
  loanApplications: [
    { id: '1', applicationNumber: 'LA-2024-5678', product: 'Ather 450X', amount: 120000, status: 'APPROVED', date: '2024-11-10' },
  ],
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCustomer(mockCustomer);
      setLoading(false);
    }, 300);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading customer details...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-muted-foreground mb-4">Customer not found</div>
        <Button onClick={() => router.push('/admin/customers')}>Back to Customers</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground mt-1">Customer ID: {customer.id}</p>
        </div>
        <Badge variant={customer.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {customer.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <address className="not-italic text-sm">
                  {customer.address.street}<br />
                  {customer.address.city}, {customer.address.state}<br />
                  PIN: {customer.address.pincode}
                </address>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <div className="text-2xl font-bold">{customer.totalOrders}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold">₹{customer.totalSpent.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Joined Date</div>
                <div className="font-medium">
                  {new Date(customer.joinedDate).toLocaleDateString('en-IN', {
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
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                View Profile
              </Button>
              <Button className="w-full" variant="outline">
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="loans">Loan Applications</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No orders yet
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono font-medium">
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="hover:underline text-primary"
                              >
                                {order.orderNumber}
                              </Link>
                            </TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>₹{order.amount.toLocaleString('en-IN')}</TableCell>
                            <TableCell>
                              <Badge variant="default">{order.status}</Badge>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loan Applications Tab */}
            <TabsContent value="loans" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Loan Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.loanApplications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No loan applications
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application #</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Loan Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.loanApplications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-mono font-medium">
                              <Link
                                href={`/admin/loan-applications/${app.id}`}
                                className="hover:underline text-primary"
                              >
                                {app.applicationNumber}
                              </Link>
                            </TableCell>
                            <TableCell>{app.product}</TableCell>
                            <TableCell>₹{app.amount.toLocaleString('en-IN')}</TableCell>
                            <TableCell>
                              <Badge variant="default">{app.status}</Badge>
                            </TableCell>
                            <TableCell>{app.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
