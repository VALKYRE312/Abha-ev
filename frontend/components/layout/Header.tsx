"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Search, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-gray-100' 
        : 'bg-transparent'
    }`}>
      {/* Main Header - Clean Minimal Design */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-space-cadet to-slate-gray flex items-center justify-center shadow-sm">
              <Zap className="h-5 w-5 text-tan" fill="currentColor" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-space-cadet tracking-tight">ABHA</span>
              <span className="text-xs text-slate-gray font-medium">Enterprise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-8">
            <Link 
              href="/catalogue" 
              className="px-3 py-2 text-sm font-semibold text-space-cadet hover:text-tan transition-colors"
            >
              Vehicles
            </Link>
            <Link 
              href="/technology" 
              className="px-3 py-2 text-sm font-semibold text-space-cadet hover:text-tan transition-colors"
            >
              Technology
            </Link>
            <Link 
              href="/ownership" 
              className="px-3 py-2 text-sm font-semibold text-space-cadet hover:text-tan transition-colors"
            >
              Ownership
            </Link>
            <Link 
              href="/support" 
              className="px-3 py-2 text-sm font-semibold text-space-cadet hover:text-tan transition-colors"
            >
              Support
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Icon - Desktop */}
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link href="/search">
                <Search className="h-5 w-5 text-space-cadet" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            {/* Book Test Drive CTA */}
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:inline-flex bg-space-cadet text-white hover:bg-space-cadet-700 rounded-full px-5"
              asChild
            >
              <Link href="/test-drive">Book a test drive →</Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-gray-100 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/catalogue" 
                className="px-4 py-3 text-sm font-semibold text-space-cadet hover:bg-tan-50 hover:text-tan rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vehicles
              </Link>
              <Link 
                href="/technology" 
                className="px-4 py-3 text-sm font-semibold text-space-cadet hover:bg-tan-50 hover:text-tan rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Technology
              </Link>
              <Link 
                href="/ownership" 
                className="px-4 py-3 text-sm font-semibold text-space-cadet hover:bg-tan-50 hover:text-tan rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ownership
              </Link>
              <Link 
                href="/support" 
                className="px-4 py-3 text-sm font-semibold text-space-cadet hover:bg-tan-50 hover:text-tan rounded-md transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-gray-100">
              <Button 
                variant="default" 
                size="lg" 
                className="w-full bg-space-cadet rounded-full"
                asChild
              >
                <Link href="/test-drive" onClick={() => setMobileMenuOpen(false)}>
                  Book a test drive →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
