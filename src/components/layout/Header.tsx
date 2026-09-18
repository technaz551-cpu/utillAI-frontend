"use client";

import Link from "next/link";
import { Search, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Tools",
      href: "/tools",
    },
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm">
            <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/20" />

            <span className="relative text-[23px] font-black leading-none text-white">
              U
            </span>
          </div>

          <span className="text-[22px] font-bold tracking-tight text-[#12346B]">
            Util<span className="text-[#1976F3]">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                item.name === "Home"
                  ? "bg-[#E7F0FF] text-[#1769E0]"
                  : "text-[#52627A] hover:bg-[#F2F6FC] hover:text-[#1769E0]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-[#174B91] shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
          >
            <Search size={17} strokeWidth={2.2} />
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className="flex h-10 items-center rounded-full border border-blue-100 bg-white px-5 text-[13px] font-semibold text-[#35506F] shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1769E0]"
          >
            Sign In
          </Link>

          {/* Get Started */}
          <Link
            href="/register"
            className="group flex h-10 items-center gap-2 rounded-full bg-[#1769E0] px-5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(23,105,224,0.22)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#0F5ED0] hover:shadow-[0_9px_24px_rgba(23,105,224,0.28)]"
          >
            Get Started

            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#174B91] lg:hidden"
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-blue-100/60 bg-white px-5 py-5 shadow-lg lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  item.name === "Home"
                    ? "bg-[#E7F0FF] text-[#1769E0]"
                    : "text-[#52627A] hover:bg-[#F3F7FC] hover:text-[#1769E0]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-3 flex gap-2 border-t border-blue-100 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-1 items-center justify-center rounded-xl border border-blue-100 px-4 py-3 text-sm font-semibold text-[#35506F]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1769E0] px-4 py-3 text-sm font-semibold text-white"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}