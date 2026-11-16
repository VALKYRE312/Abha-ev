'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  FileText,
  IndianRupee,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for dashboard
const dashboardMetrics = {
  totalRevenue: 4875000,
  revenueChange: 12.5,
  totalOrders: 145,
  ordersChange: 8.2,
  totalCustomers: 892,
  customersChange: 15.3,
  pendingLoans: 23,
  loansChange: -5.5,
};

const revenueChartData = [
  { month: 'Jan', revenue: 285000, orders: 45 },
  { month: 'Feb', revenue: 390000, orders: 52 },
  { month: 'Mar', revenue: 425000, orders: 61 },
  { month: 'Apr', revenue: 380000, orders: 48 },
  { month: 'May', revenue: 520000, orders: 74 },
  { month: 'Jun', revenue: 485000, orders: 68 },
];

const categoryData = [
  { name: 'Scooters', value: 450, color: '#D5B893' },
  { name: 'Bikes', value: 280, color: '#617891' },
  { name: 'Three-Wheelers', value: 180, color: '#6F4D38' },
];

const recentOrders = [
  {
    id: 'ORD-2024-1234',
    customer: 'Rajesh Kumar',
    product: 'Ather 450X',
    amount: 145000,
    status: 'Completed',
    date: '2024-11-14',
  },
  {
    id: 'ORD-2024-1233',
    customer: 'Priya Sharma',
    product: 'Ola S1 Pro',
    amount: 128000,
    status: 'Processing',
    date: '2024-11-13',
  },
  {
    id: 'ORD-2024-1232',
    customer: 'Amit Patel',
    product: 'TVS iQube',
    amount: 95000,
    status: 'Failed',
    date: '2024-11-13',
  },
  {
    id: 'ORD-2024-1231',
    customer: 'Sneha Reddy',
    product: 'Revolt RV400',
    amount: 112000,
    status: 'Pending',
    date: '2024-11-12',
  },
];

const lowStockItems = [
  { id: '1', product: 'Ather 450X', sku: 'ATH-450X-BLK', stock: 3, minStock: 5 },
  { id: '2', product: 'Ola S1 Pro', sku: 'OLA-S1P-RED', stock: 2, minStock: 5 },
  { id: '3', product: 'Bajaj Chetak', sku: 'BAJ-CHK-BLU', stock: 4, minStock: 6 },
];

const recentActivities = [
  {
    id: '1',
    action: 'Order placed',
    description: 'New order #ORD-2024-1234 for Ather 450X',
    user: 'System',
    time: '5 minutes ago',
    type: 'order',
  },
  {
    id: '2',
    action: 'Product updated',
    description: 'Price updated for Ola S1 Pro',
    user: 'Admin User',
    time: '1 hour ago',
    type: 'product',
  },
  {
    id: '3',
    action: 'Loan approved',
    description: 'Loan application #LA-2024-5678 approved',
    user: 'Finance Manager',
    time: '2 hours ago',
    type: 'finance',
  },
  {
    id: '4',
    action: 'Stock adjusted',
    description: 'Inventory adjusted for TVS iQube',
    user: 'Inventory Manager',
    time: '3 hours ago',
    type: 'inventory',
  },
];

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  format = 'number',
}: {
  title: string;
  value: number;
  change: number;
  icon: any;
  trend: 'up' | 'down';
  format?: 'number' | 'currency';
}) {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card variant="elevated" className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold text-slate-gray">{title}</CardTitle>
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-tan to-tan-600 flex items-center justify-center shadow-tan">
          <Icon className="h-5 w-5 text-space-cadet" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-space-cadet mb-2">
          {format === 'currency' && '₹'}
          {format === 'currency'
            ? (value / 1000).toFixed(0) + 'K'
            : value.toLocaleString('en-IN')}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold',
            isPositive ? 'bg-green-50 text-green-700' : 'bg-caput-mortuum-50 text-caput-mortuum-700'
          )}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-slate-gray text-xs">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-space-cadet mb-2">Dashboard</h1>
          <p className="text-slate-gray text-lg">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="border-2" asChild>
            <Link href="/admin/reports">
              <TrendingUp className="mr-2 h-5 w-5" />
              View Reports
            </Link>
          </Button>
          <Button variant="primary" size="lg" asChild>
            <Link href="/admin/products/new">
              <Package className="mr-2 h-5 w-5" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={dashboardMetrics.totalRevenue}
          change={dashboardMetrics.revenueChange}
          icon={IndianRupee}
          trend="up"
          format="currency"
        />
        <MetricCard
          title="Total Orders"
          value={dashboardMetrics.totalOrders}
          change={dashboardMetrics.ordersChange}
          icon={ShoppingCart}
          trend="up"
        />
        <MetricCard
          title="Total Customers"
          value={dashboardMetrics.totalCustomers}
          change={dashboardMetrics.customersChange}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Pending Loans"
          value={dashboardMetrics.pendingLoans}
          change={dashboardMetrics.loansChange}
          icon={FileText}
          trend="down"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card variant="elevated" className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-space-cadet">Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue and order trends</CardDescription>
              </div>
              <Badge className="bg-tan text-space-cadet font-bold">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#617891' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#617891' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #D5B893',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue'
                      ? `₹${(value / 1000).toFixed(0)}K`
                      : value,
                    name === 'revenue' ? 'Revenue' : 'Orders',
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" fill="#D5B893" name="Revenue" radius={[8, 8, 0, 0]} />
                <Bar dataKey="orders" fill="#617891" name="Orders" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card variant="elevated" className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-space-cadet">Sales by Category</CardTitle>
            <CardDescription>Product category distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="mt-6 space-y-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-slate-gray">{category.name}</span>
                  </div>
                  <span className="text-sm font-bold text-space-cadet">{category.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card variant="elevated" className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-space-cadet">Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="text-tan hover:text-tan-600 font-semibold">
                View All →
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-slate-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-tan-50/50 -mx-6 px-6 py-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-space-cadet font-mono">{order.id}</p>
                      <Badge
                        variant={
                          order.status === 'Completed'
                            ? 'default'
                            : order.status === 'Processing'
                            ? 'secondary'
                            : order.status === 'Failed'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-gray">
                      {order.customer} • {order.product}
                    </p>
                    <p className="text-xs text-slate-gray">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-space-cadet">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </p>
                    <Button variant="ghost" size="sm" asChild className="mt-1">
                      <Link href={`/admin/orders/${order.id.toLowerCase()}`} className="text-tan hover:text-tan-600">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock & Activities */}
        <div className="space-y-6 lg:col-span-3">
          {/* Low Stock Alerts */}
          <Card variant="elevated" className="border-2 border-coffee/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-coffee">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Items running low</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm p-3 bg-coffee-50/30 rounded-lg hover:bg-coffee-50/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-space-cadet">{item.product}</p>
                      <p className="text-xs text-slate-gray font-mono">{item.sku}</p>
                    </div>
                    <Badge variant="destructive" className="ml-2 font-bold">
                      {item.stock} units
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full border-2 border-coffee text-coffee hover:bg-coffee hover:text-white font-bold" asChild>
                <Link href="/admin/inventory">Manage Inventory</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-space-cadet flex items-center gap-2">
                <Activity className="h-5 w-5 text-tan" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tan/10">
                      <Zap className="h-4 w-4 text-tan" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-space-cadet">{activity.action}</p>
                      <p className="text-xs text-slate-gray leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-gray/70">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
