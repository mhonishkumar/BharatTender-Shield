import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ScrollProgress } from "@/components/ScrollProgress";
import { UtmTracker } from "@/components/UtmTracker";
import { Banner } from "@/components/Banner";
import { BackToTop } from "@/components/BackToTop";
import { FloatingContact } from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "BharatTender Shield — Every Bid Verified. Every Decision Defensible.",
  description: "SIH 2026 Problem Statement 26100: AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.jpg" />
        <meta name="theme-color" content="#0B1B3D" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
        {/* Skip to Content for Screen Readers (Item 12) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-[100] px-4 py-2 bg-[#0B1B3D] text-white text-xs font-semibold rounded-md shadow-xl border border-blue-400 focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Global Scroll Progress Bar (Item 8) */}
        <ScrollProgress />

        {/* UTM Parameter Tracking (Item 14) */}
        <UtmTracker />

        <Providers>
          {/* Prototype Environment Notice (Item 2) */}
          <Banner />

          {children}

          {/* Floating Back to Top Button (Item 4) */}
          <BackToTop />

          {/* Floating Help & Support Desk (Item 20) */}
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
