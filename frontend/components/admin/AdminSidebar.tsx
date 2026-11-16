'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Warehouse,
  ShoppingCart,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
  UserCog,
  Shield,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { title: 'Back to Site', href: '/', icon: Home },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { title: 'Products', href: '/admin/products', icon: Package },
      { title: 'Categories', href: '/admin/categories', icon: Layers },
      { title: 'Brands', href: '/admin/brands', icon: Tag },
    ],
  },
  {
    title: 'Operations',
    items: [
      { title: 'Inventory', href: '/admin/inventory', icon: Warehouse },
      { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { title: 'Bookings', href: '/admin/bookings', icon: Calendar },
    ],
  },
  {
    title: 'Customers & CRM',
    items: [
      { title: 'Customers', href: '/admin/customers', icon: Users },
      { title: 'Enquiries', href: '/admin/crm', icon: ClipboardList },
    ],
  },
  {
    title: 'Finance',
    items: [
      { title: 'Loan Applications', href: '/admin/loan-applications', icon: FileText },
      { title: 'Finance Partners', href: '/admin/finance-partners', icon: Building2 },
      { title: 'Invoices', href: '/admin/invoices', icon: CreditCard },
      { title: 'Payments', href: '/admin/payments', icon: Wallet },
      { title: 'Expenses', href: '/admin/expenses', icon: DollarSign },
    ],
  },
  {
    title: 'Reports & Analytics',
    items: [
      { title: 'Reports', href: '/admin/reports', icon: TrendingUp },
    ],
  },
  {
    title: 'Administration',
    items: [
      { title: 'Employees', href: '/admin/employees', icon: UserCog },
      { title: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
      { title: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-slate-gray/20 bg-space-cadet transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-gray/30 px-4">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tan">
                <span className="text-sm font-bold text-space-cadet">AE</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-tan">ABHA Enterprise</span>
                <span className="text-xs text-slate-gray">Admin Panel</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tan">
              <span className="text-sm font-bold text-space-cadet">AE</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {navigationSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                {!isCollapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-gray">
                    {section.title}
                  </h3>
                )}
                {isCollapsed && sectionIdx > 0 && (
                  <Separator className="my-2 bg-slate-gray/30" />
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-slate-gray/20',
                          active
                            ? 'bg-tan text-space-cadet hover:bg-tan/90'
                            : 'text-slate-gray hover:text-tan',
                          isCollapsed && 'justify-center'
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-white">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Toggle Button */}
        <div className="border-t border-slate-gray/30 p-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full text-slate-gray hover:bg-slate-gray/20 hover:text-tan',
              isCollapsed && 'justify-center'
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
