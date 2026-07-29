import type { Metadata } from "next";
import { League_Spartan, Inter } from "next/font/google";

import { NewsletterBar } from "@/components/newsletter/newsletter-bar";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Columbus Community Events",
  description:
    "Community events for Columbus, Georgia — rooted Uptown, carried by the river.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <NewsletterBar />
      </body>
    </html>
  );
}
