import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeManager } from "@/components/settings/ThemeManager";
import { Inter } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UtilAI — AI-powered creative tools",
    template: "%s | UtilAI",
  },
  description:
    "Modern online tools for PDFs, AI workflows, image editing, developer utilities, and everyday productivity.",
};

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={inter.className}
    >
      <body
        className="min-h-screen antialiased"
        suppressHydrationWarning
      >
        <ThemeManager />

        <Header />

        <main className="w-full">
          <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}