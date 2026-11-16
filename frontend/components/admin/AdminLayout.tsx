'use client';

import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { AdminBreadcrumb } from './AdminBreadcrumb';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden pl-64">
        {/* Top Navigation */}
        <AdminTopbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
              <AdminBreadcrumb />
            </div>

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
