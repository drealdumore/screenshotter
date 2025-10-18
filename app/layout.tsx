import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const satoshi = localFont({
  src: "../public/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  display: "swap",
});

const bodar = localFont({
  src: "../public/bodar.otf",
  variable: "--font-bodar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Screenshot Generator",
  description: "Capture high-quality screenshots of any website instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${bodar.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
