"use client";

import Link from "next/link";
import { Search, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavigationMenu } from "./NavigationMenu";
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
    <header className="sticky top-0 z-50   bg-gradient-to-r from-white to-sky-700 backdrop-blur-xl">
      {/* <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10"> */}
      <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => setMobileMenuOpen(false)}
        >


          <svg
            width="126"
            height="44"
            viewBox="0 0 120 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-auto"
          >
            {/* Main U curve - left stroke */}
            <path
              d="M 8 8 Q 8 8 8 20 Q 8 28 16 28 Q 24 28 24 20"
              stroke="#1769E0"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Turquoise accent top-left */}
            <circle
              cx="10"
              cy="6"
              r="3"
              fill="#21C7A8"
            />

            {/* Blue accent top-right */}
            <circle
              cx="22"
              cy="6"
              r="3"
              fill="#1769E0"
            />

            {/* "Util" text */}
            {/* "UtilAI" text - combined without gap */}
            <text
              x="32"
              y="26"
              fontFamily="Inter, system-ui, -apple-system, sans-serif"
              fontSize="26"
              fontWeight="700"
              fill="#12346B"
              letterSpacing="-0.3"
            >
              Util<tspan fill="#1976F3">AI</tspan>
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation */}
        {/* Desktop Navigation */}
        {/* Desktop Navigation */}
        <NavigationMenu
          navItems={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Categories", href: "/categories" },
            { label: "Pricing", href: "/pricing" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ]}
        />
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
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${item.name === "Home"
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





