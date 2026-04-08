import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { MobileNav } from "@/components/layout/MobileNav";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "UrbanPulse — Hyper-local Neighborhood Connectivity",
  description: "Transforming neighbors into an active, resilient support network.",
};

export const viewport: Viewport = {
  themeColor: "#050B14", // Matches the Tidal background tone
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { getLocale } from "next-intl/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark h-full overflow-x-hidden" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-full font-sans bg-background text-foreground antialiased selection:bg-primary/20",
          figtree.variable,
          geistSans.variable,
          geistMono.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="relative flex min-h-screen flex-col bg-pulse-gradient">
            {children}
            <MobileNav />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
