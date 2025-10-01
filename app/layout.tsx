import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTM OS - AI-Generated Email Journeys",
  description: "Developer-first email automation. One API call generates complete lifecycle campaigns. Built for B2B SaaS teams.",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
