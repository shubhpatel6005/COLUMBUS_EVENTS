import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import { NewsletterBar } from "@/components/newsletter/newsletter-bar";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Columbus Indian Community Events",
  description:
    "Free, inclusive Indian cultural events in Columbus, Georgia — Navratri, Uttrayan, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <NewsletterBar />
      </body>
    </html>
  );
}
