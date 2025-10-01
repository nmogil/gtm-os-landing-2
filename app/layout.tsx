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
  metadataBase: new URL('https://gtmos.dev'),
  title: {
    default: "GTM OS - AI-Generated Email Journeys for B2B SaaS",
    template: "%s | GTM OS"
  },
  description: "Developer-first email automation. One API call generates complete lifecycle campaigns with AI. Built for B2B SaaS teams. Skip copywriting, hosted scheduling, 10-minute integration.",
  keywords: [
    "email automation",
    "AI email campaigns",
    "B2B SaaS email",
    "lifecycle email",
    "developer email API",
    "email journey automation",
    "Resend integration",
    "email marketing API",
    "automated email sequences",
    "transactional email",
    "email API for developers",
    "SaaS email automation"
  ],
  authors: [{ name: "GTM OS" }],
  creator: "GTM OS",
  publisher: "GTM OS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gtmos.dev",
    siteName: "GTM OS",
    title: "GTM OS - AI-Generated Email Journeys for B2B SaaS",
    description: "Developer-first email automation. One API call generates complete lifecycle campaigns with AI. Built for B2B SaaS teams.",
    images: [
      {
        url: "/gtm_os_logo.svg",
        width: 1200,
        height: 630,
        alt: "GTM OS - AI Email Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GTM OS - AI-Generated Email Journeys for B2B SaaS",
    description: "Developer-first email automation. One API call generates complete lifecycle campaigns with AI. Built for B2B SaaS teams.",
    images: ["/gtm_os_logo.svg"],
    creator: "@gtmos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/gtm_os_logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/gtm_os_logo.svg',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://gtmos.dev',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GTM OS",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Developer-first email automation. One API call generates complete lifecycle campaigns with AI. Built for B2B SaaS teams.",
    "url": "https://gtmos.dev",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GTM OS",
      "url": "https://gtmos.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gtmos.dev/gtm_os_logo.svg"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
