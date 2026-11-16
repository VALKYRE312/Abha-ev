'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Phone, MessageSquare, UserPlus } from 'lucide-react';

interface Enquiry {
  id: string;
  leadId: string;
  customerName: string;
  phone: string;
  email: string;
  interestedIn: string;
  source: 'WEBSITE' | 'PHONE' | 'WALK_IN' | 'CAMPAIGN';
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  assignedTo: string;
  followUpDate: string;
  createdDate: string;
}

const mockEnquiries: Enquiry[] = [
  { id: '1', leadId: 'LEAD-2024-001', customerName: 'Sanjay Gupta', phone: '+91 98765 44444', email: 'sanjay.g@example.com', interestedIn: 'Ather 450X', source: 'WEBSITE', status: 'NEW', assignedTo: 'Priya Singh', followUpDate: '2024-11-16', createdDate: '2024-11-15' },
  { id: '2', leadId: 'LEAD-2024-002', customerName: 'Neha Joshi', phone: '+91 98765 44445', email: 'neha.j@example.com', interestedIn: 'Ola S1 Pro', source: 'PHONE', status: 'CONTACTED', assignedTo: 'Amit Kumar', followUpDate: '2024-11-17', createdDate: '2024-11-14' },
  { id: '3', leadId: 'LEAD-2024-003', customerName: 'Karan Malhotra', phone: '+91 98765 44446', email: 'karan.m@example.com', interestedIn: 'TVS iQube', source: 'WALK_IN', status: 'QUALIFIED', assignedTo: 'Priya Singh', followUpDate: '2024-11-18', createdDate: '2024-11-13' },
];

export default function CRMPage() {
  const [enquiries] = useState<Enquiry[]>(mockEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = enq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      enq.phone.includes(search) ||
      enq.leadId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newLeads = enquiries.filter(e => e.status === 'NEW').length;
  const qualifiedLeads = enquiries.filter(e => e.status === 'QUALIFIED').length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      NEW: 'secondary',
      CONTACTED: 'outline',
      QUALIFIED: 'default',
      CONVERTED: 'default',
      LOST: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getSourceBadge = (source: string) => {
    return <Badge variant="outline">{source.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM & Enquiries</h1>
        <p className="text-muted-foreground mt-1">Manage leads and customer enquiries</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enquiries.length}</div>
            <p className="text-xs text-muted-foreground">All enquiries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeads}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">Hot prospects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((enquiries.filter(e => e.status === 'CONVERTED').length / enquiries.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Lead to customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or lead ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Enquiries ({filteredEnquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Interested In</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Follow Up</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.map((enq) => (
                <TableRow key={enq.id}>
                  <TableCell className="font-mono font-medium">{enq.leadId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{enq.customerName}</div>
                      <div className="text-sm text-muted-foreground">{enq.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{enq.interestedIn}</TableCell>
                  <TableCell>{getSourceBadge(enq.source)}</TableCell>
                  <TableCell>{getStatusBadge(enq.status)}</TableCell>
                  <TableCell>{enq.assignedTo}</TableCell>
                  <TableCell>{enq.followUpDate}</TableCell>
                  <TableCell>{enq.createdDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
