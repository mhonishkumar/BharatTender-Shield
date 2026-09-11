import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BharatTender Shield — Every Bid Verified. Every Decision Defensible.",
  description: "SIH 2026 Problem Statement 26100: AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement",
  icons: {
    icon: "/logo.jpg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
