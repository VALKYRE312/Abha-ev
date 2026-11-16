'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Package, Search, TrendingDown, TrendingUp } from 'lucide-react';

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  onHand: number;
  reserved: number;
  available: number;
  minStock: number;
  location: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', productName: 'Ather 450X - Space Grey', sku: 'ATH-450X-GREY', onHand: 12, reserved: 2, available: 10, minStock: 5, location: 'Warehouse A' },
  { id: '2', productName: 'Ather 450X - Cosmic Black', sku: 'ATH-450X-BLK', onHand: 3, reserved: 1, available: 2, minStock: 5, location: 'Warehouse A' },
  { id: '3', productName: 'Ola S1 Pro - Jet Black', sku: 'OLA-S1P-BLK', onHand: 8, reserved: 0, available: 8, minStock: 5, location: 'Warehouse B' },
  { id: '4', productName: 'TVS iQube', sku: 'TVS-IQB-BLU', onHand: 15, reserved: 3, available: 12, minStock: 6, location: 'Warehouse A' },
];

export default function InventoryPage() {
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState('');

  const lowStockItems = inventory.filter(item => item.available < item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + (item.onHand * 100000), 0);

  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Manage stock levels and locations</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.reduce((sum, item) => sum + item.onHand, 0)} units
            </div>
            <p className="text-xs text-muted-foreground">On hand inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below minimum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Estimated total value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>On Hand</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.onHand}</TableCell>
                  <TableCell>{item.reserved}</TableCell>
                  <TableCell className="font-semibold">{item.available}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>
                    {item.available < item.minStock ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : item.available < item.minStock * 2 ? (
                      <Badge variant="warning">Warning</Badge>
                    ) : (
                      <Badge variant="default">Good</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
