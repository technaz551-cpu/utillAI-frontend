import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeManager } from "@/components/settings/ThemeManager";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UtilAI — AI-powered creative tools",
    template: "%s | UtilAI",
  },
  description:
    "Modern online tools for PDFs, AI workflows, image editing, developer utilities, and everyday productivity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeManager />

        <Header />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}