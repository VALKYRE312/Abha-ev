import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { config } from "@/config";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${config.site.name} - Electric Vehicle Commerce Platform`,
    template: `%s | ${config.site.name}`,
  },
  description: "Browse, finance, and purchase electric vehicles with ease. India's trusted EV dealership platform.",
  keywords: ["electric vehicles", "EV", "electric scooters", "electric bikes", "EV financing", "green mobility"],
  authors: [{ name: config.site.name }],
  creator: config.site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: config.site.url,
    title: config.site.name,
    description: "Browse, finance, and purchase electric vehicles with ease.",
    siteName: config.site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.name,
    description: "Browse, finance, and purchase electric vehicles with ease.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
