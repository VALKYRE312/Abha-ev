'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, User, Phone, Mail, CreditCard, Building2, Calendar, CheckCircle } from 'lucide-react';

type LoanStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENTS_PENDING' | 'DOCUMENTS_VERIFIED' | 
  'REFERRED_TO_PARTNER' | 'PARTNER_DECISION_PENDING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN' | 'DISBURSED';

interface LoanApplicationDetail {
  id: string;
  applicationNumber: string;
  status: LoanStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  product: {
    name: string;
    variant: string;
    price: number;
  };
  loanDetails: {
    requestedAmount: number;
    downPayment: number;
    loanAmount: number;
    tenure: number;
    estimatedEMI: number;
  };
  financePartner: {
    name: string;
    referenceNumber?: string;
  };
  assignedTo: string;
  documents: Array<{
    name: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  }>;
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
    updatedBy: string;
  }>;
  notes: string[];
  submittedDate: string;
}

const mockLoanDetail: LoanApplicationDetail = {
  id: '1',
  applicationNumber: 'LA-2024-5678',
  status: 'APPROVED',
  customer: {
    name: 'Rahul Mehta',
    email: 'rahul.m@example.com',
    phone: '+91 98765 43210',
    address: '456, Park Street, Mumbai, Maharashtra - 400001',
  },
  product: {
    name: 'Ather 450X',
    variant: 'Space Grey',
    price: 145000,
  },
  loanDetails: {
    requestedAmount: 145000,
    downPayment: 25000,
    loanAmount: 120000,
    tenure: 36,
    estimatedEMI: 3850,
  },
  financePartner: {
    name: 'HDFC Bank',
    referenceNumber: 'HDFC-LA-2024-9876',
  },
  assignedTo: 'Priya Singh',
  documents: [
    { name: 'Aadhaar Card', status: 'VERIFIED' },
    { name: 'PAN Card', status: 'VERIFIED' },
    { name: 'Salary Slips (3 months)', status: 'VERIFIED' },
    { name: 'Bank Statements (6 months)', status: 'VERIFIED' },
  ],
  timeline: [
    { status: 'Application Submitted', timestamp: '2024-11-10 10:30 AM', description: 'Loan application submitted online', updatedBy: 'System' },
    { status: 'Under Review', timestamp: '2024-11-10 02:15 PM', description: 'Application assigned for review', updatedBy: 'Priya Singh' },
    { status: 'Documents Verified', timestamp: '2024-11-11 11:00 AM', description: 'All documents verified successfully', updatedBy: 'Priya Singh' },
    { status: 'Referred to Partner', timestamp: '2024-11-11 03:30 PM', description: 'Application sent to HDFC Bank', updatedBy: 'Priya Singh' },
    { status: 'Approved', timestamp: '2024-11-12 05:45 PM', description: 'Loan approved by HDFC Bank', updatedBy: 'HDFC Bank' },
  ],
  notes: [
    'Customer has excellent credit score (780)',
    'Stable employment at TCS for 5 years',
    'All documents verified without issues',
  ],
  submittedDate: '2024-11-10',
};

export default function LoanApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<LoanApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setApplication(mockLoanDetail);
      setLoading(false);
    }, 300);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading application details...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-muted-foreground mb-4">Application not found</div>
        <Button onClick={() => router.push('/admin/loan-applications')}>Back to Applications</Button>
      </div>
    );
  }

  const getStatusBadge = (status: LoanStatus) => {
    const config: Record<LoanStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      SUBMITTED: { variant: 'secondary' },
      UNDER_REVIEW: { variant: 'secondary' },
      DOCUMENTS_PENDING: { variant: 'outline' },
      DOCUMENTS_VERIFIED: { variant: 'secondary' },
      REFERRED_TO_PARTNER: { variant: 'secondary' },
      PARTNER_DECISION_PENDING: { variant: 'secondary' },
      APPROVED: { variant: 'default' },
      REJECTED: { variant: 'destructive' },
      WITHDRAWN: { variant: 'outline' },
      DISBURSED: { variant: 'default' },
    };

    return <Badge variant={config[status].variant}>{status.replace(/_/g, ' ')}</Badge>;
  };

  const getDocumentStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      VERIFIED: 'default',
      PENDING: 'secondary',
      REJECTED: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/loan-applications">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Loan Application Details</h1>
          <p className="text-muted-foreground mt-1">{application.applicationNumber}</p>
        </div>
        {getStatusBadge(application.status)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{application.customer.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{application.customer.phone}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{application.customer.email}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div className="font-medium">{application.customer.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product & Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Product</div>
                <div className="font-semibold text-lg">{application.product.name}</div>
                <div className="text-sm text-muted-foreground">Variant: {application.product.variant}</div>
              </div>
              <Separator />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Product Price</div>
                  <div className="font-semibold">₹{application.product.price.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Down Payment</div>
                  <div className="font-semibold">₹{application.loanDetails.downPayment.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Loan Amount</div>
                  <div className="font-semibold text-primary text-xl">
                    ₹{application.loanDetails.loanAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tenure</div>
                  <div className="font-semibold">{application.loanDetails.tenure} months</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Estimated EMI</div>
                  <div className="font-semibold text-lg">
                    ₹{application.loanDetails.estimatedEMI.toLocaleString('en-IN')}/month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    {getDocumentStatusBadge(doc.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      {index < application.timeline.length - 1 && (
                        <div className="absolute left-4 top-8 h-full w-0.5 bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="font-semibold">{event.status}</div>
                      <div className="text-sm text-muted-foreground">{event.timestamp}</div>
                      <div className="text-sm mt-1">{event.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">Updated by: {event.updatedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Finance Partner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Finance Partner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Partner</div>
                <div className="font-semibold">{application.financePartner.name}</div>
              </div>
              {application.financePartner.referenceNumber && (
                <div>
                  <div className="text-sm text-muted-foreground">Reference Number</div>
                  <div className="font-mono text-sm">{application.financePartner.referenceNumber}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Assigned To</div>
                <div className="font-medium">{application.assignedTo}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Submitted Date</div>
                <div className="font-medium">{application.submittedDate}</div>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select defaultValue={application.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="DOCUMENTS_PENDING">Documents Pending</SelectItem>
                  <SelectItem value="DOCUMENTS_VERIFIED">Documents Verified</SelectItem>
                  <SelectItem value="REFERRED_TO_PARTNER">Referred to Partner</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">Update Status</Button>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {application.notes.map((note, index) => (
                  <div key={index} className="text-sm p-2 rounded bg-slate-50">
                    {note}
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
