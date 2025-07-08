import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import React from "react";
import NextTopLoader from "nextjs-toploader";
import {Toaster} from "sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Providers } from "@/components/providers";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyRehab Admin",
  description: "MyRehab Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${comfortaa.variable} font-sans antialiased`}
      >
      <Providers>
        <NextTopLoader showSpinner={false}/>
        <Toaster />
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </Providers>
      </body>
    </html>
  );
}
