import type { Metadata } from "next";
import localFont from "next/font/local";

import { sharedMetadata } from "@/lib/metadata";
import ClientBody from "./ClientBody";
import "./globals.css";

const satoshi = localFont({
  src: "../public/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(sharedMetadata.url),
  title: sharedMetadata.title,
  description: sharedMetadata.description,
  keywords: [
    "screenshot generator",
    "website screenshot",
    "web capture",
    "screenshot tool",
    "website preview",
    "page screenshot",
    "online screenshot",
    "free screenshot",
    "website image",
    "web scraping",
    "puppeteer",
    "webp screenshot",
    "responsive screenshot",
  ],
  authors: [{ name: "drealdumore", url: "https://github.com/drealdumore" }],
  creator: "drealdumore",
  publisher: "drealdumore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: sharedMetadata.title,
    description: sharedMetadata.description,
    type: "website",
    url: sharedMetadata.url,
    siteName: "Screenshot Generator",
    images: [
      {
        url: sharedMetadata.image,
        width: sharedMetadata.ogImage.width,
        height: sharedMetadata.ogImage.height,
        type: sharedMetadata.ogImage.type,
        alt: "Screenshot Generator - Capture Website Screenshots",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@drealdumore",
    creator: "@drealdumore",
    title: sharedMetadata.title,
    description: sharedMetadata.description,
    images: [sharedMetadata.image],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} antialiased`}>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
