'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type LoanStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENTS_PENDING' | 'DOCUMENTS_VERIFIED' | 
  'REFERRED_TO_PARTNER' | 'PARTNER_DECISION_PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN' | 'DISBURSED';

interface LoanApplication {
  id: string;
  applicationNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  loanAmount: number;
  downPayment: number;
  tenure: number;
  financePartner: string;
  status: LoanStatus;
  assignedTo: string;
  submittedDate: string;
}

const mockApplications: LoanApplication[] = [
  {
    id: '1',
    applicationNumber: 'LA-2024-5678',
    customerName: 'Rahul Mehta',
    customerPhone: '+91 98765 43210',
    productName: 'Ather 450X',
    loanAmount: 120000,
    downPayment: 25000,
    tenure: 36,
    financePartner: 'HDFC Bank',
    status: 'APPROVED',
    assignedTo: 'Priya Singh',
    submittedDate: '2024-11-10',
  },
  {
    id: '2',
    applicationNumber: 'LA-2024-5679',
    customerName: 'Anjali Verma',
    customerPhone: '+91 98765 43211',
    productName: 'Ola S1 Pro',
    loanAmount: 100000,
    downPayment: 28000,
    tenure: 24,
    financePartner: 'ICICI Bank',
    status: 'UNDER_REVIEW',
    assignedTo: 'Amit Kumar',
    submittedDate: '2024-11-12',
  },
  {
    id: '3',
    applicationNumber: 'LA-2024-5680',
    customerName: 'Vikram Patel',
    customerPhone: '+91 98765 43212',
    productName: 'TVS iQube',
    loanAmount: 75000,
    downPayment: 20000,
    tenure: 24,
    financePartner: 'Bajaj Finance',
    status: 'DOCUMENTS_PENDING',
    assignedTo: 'Priya Singh',
    submittedDate: '2024-11-13',
  },
  {
    id: '4',
    applicationNumber: 'LA-2024-5681',
    customerName: 'Meera Nair',
    customerPhone: '+91 98765 43213',
    productName: 'Revolt RV400',
    loanAmount: 90000,
    downPayment: 22000,
    tenure: 36,
    financePartner: 'Axis Bank',
    status: 'REJECTED',
    assignedTo: 'Amit Kumar',
    submittedDate: '2024-11-08',
  },
];

export default function LoanApplicationsPage() {
  const [applications] = useState<LoanApplication[]>(mockApplications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
      app.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = applications.filter(a => 
    ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_PENDING'].includes(a.status)
  ).length;
  
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const totalAmount = applications.reduce((sum, a) => sum + a.loanAmount, 0);

  const getStatusBadge = (status: LoanStatus) => {
    const config: Record<LoanStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning', icon: any }> = {
      SUBMITTED: { variant: 'secondary', icon: FileText },
      UNDER_REVIEW: { variant: 'warning', icon: Clock },
      DOCUMENTS_PENDING: { variant: 'warning', icon: AlertCircle },
      DOCUMENTS_VERIFIED: { variant: 'secondary', icon: CheckCircle },
      REFERRED_TO_PARTNER: { variant: 'secondary', icon: FileText },
      PARTNER_DECISION_PENDING: { variant: 'warning', icon: Clock },
      APPROVED: { variant: 'default', icon: CheckCircle },
      REJECTED: { variant: 'destructive', icon: AlertCircle },
      WITHDRAWN: { variant: 'destructive', icon: AlertCircle },
      DISBURSED: { variant: 'default', icon: CheckCircle },
    };

    const { variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loan Applications</h1>
        <p className="text-muted-foreground mt-1">Manage finance applications and partner referrals</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loan Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Combined loan amount</p>
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
                placeholder="Search by application number or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="DOCUMENTS_PENDING">Documents Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono font-medium">{app.applicationNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{app.customerName}</div>
                      <div className="text-sm text-muted-foreground">{app.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{app.productName}</TableCell>
                  <TableCell>₹{app.loanAmount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{app.tenure} months</TableCell>
                  <TableCell>{app.financePartner}</TableCell>
                  <TableCell>{app.assignedTo}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{app.submittedDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/loan-applications/${app.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
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
