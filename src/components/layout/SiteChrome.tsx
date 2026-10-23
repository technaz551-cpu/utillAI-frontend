"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

function isSeoPlatformRoute(pathname: string | null): boolean {
  return Boolean(pathname?.startsWith("/tools/seo/platform"));
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isSeoPlatformRoute(pathname)) return null;
  return <Header />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isSeoPlatformRoute(pathname)) return null;
  return <Footer />;
}
