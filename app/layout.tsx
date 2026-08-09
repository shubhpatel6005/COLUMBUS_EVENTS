import type { Metadata } from "next";
import { Libertinus_Math } from "next/font/google";

import { NewsletterBar } from "@/components/newsletter/newsletter-bar";
import "./globals.css";

const libertinusMath = Libertinus_Math({
  variable: "--font-libertinus",
  subsets: ["latin"],
  weight: "400",
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
      className={`${libertinusMath.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <NewsletterBar />
      </body>
    </html>
  );
}
