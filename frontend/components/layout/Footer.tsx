import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-space-cadet text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-tan to-coffee flex items-center justify-center shadow-tan">
                <Zap className="h-7 w-7 text-space-cadet" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-xl text-tan tracking-tight">ABHA Enterprise</span>
                <span className="text-xs text-slate-gray-300 mt-1">EV Commerce Platform</span>
              </div>
            </div>
            <p className="text-sm text-slate-gray-300 mb-6 leading-relaxed">
              Your trusted partner for electric vehicles. Browse, finance, and drive the future with India's most comprehensive EV platform.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-tan/20 hover:text-tan text-slate-gray-300"
                asChild
              >
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-tan/20 hover:text-tan text-slate-gray-300"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-tan/20 hover:text-tan text-slate-gray-300"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-tan/20 hover:text-tan text-slate-gray-300"
                asChild
              >
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-tan mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/catalogue" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Browse Catalogue
                </Link>
              </li>
              <li>
                <Link href="/catalogue/scooters" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Electric Scooters
                </Link>
              </li>
              <li>
                <Link href="/catalogue/bikes" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Electric Bikes
                </Link>
              </li>
              <li>
                <Link href="/catalogue/three-wheelers" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Three-Wheelers
                </Link>
              </li>
              <li>
                <Link href="/finance" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Finance Options
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-bold text-tan mb-4 text-lg">Customer Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/account" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Warranty Policy
                </Link>
              </li>
              <li>
                <Link href="/service-centers" className="text-slate-gray-300 hover:text-tan transition-colors hover:translate-x-1 inline-block">
                  Service Centers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-bold text-tan mb-4 text-lg">Get in Touch</h3>
            <ul className="space-y-4 text-sm text-slate-gray-300 mb-6">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-tan" />
                <span className="group-hover:text-tan transition-colors">
                  123 EV Street, Andheri East,<br />Mumbai, Maharashtra 400069
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-tan" />
                <a href="tel:+919876543210" className="hover:text-tan transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-tan" />
                <a href="mailto:info@abhaenterprise.com" className="hover:text-tan transition-colors">
                  info@abhaenterprise.com
                </a>
              </li>
            </ul>

            <div>
              <p className="text-sm font-semibold mb-3 text-tan">Subscribe to Newsletter</p>
              <p className="text-xs text-slate-gray-300 mb-3">Get the latest EV news and offers</p>
              <form className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email"
                  className="text-sm bg-space-cadet-700 border-slate-gray-600 text-white placeholder:text-slate-gray-400 focus:border-tan"
                />
                <Button type="submit" variant="primary" size="sm" className="shrink-0">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <p className="text-slate-gray-400">
              © 2026 ABHA Enterprise. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-slate-gray-400">
              <Link href="/privacy" className="hover:text-tan transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-tan transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-tan transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="hover:text-tan transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
