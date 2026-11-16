'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  
  // Convert admin path to breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { label, href };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/admin"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      
      {breadcrumbItems.length > 1 && (
        <>
          {breadcrumbItems.slice(1).map((item, index) => (
            <Fragment key={item.href}>
              <ChevronRight className="h-4 w-4" />
              {index === breadcrumbItems.length - 2 ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </Fragment>
          ))}
        </>
      )}
    </nav>
  );
}
