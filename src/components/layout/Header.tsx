// import Link from "next/link";
// import { AuthStatus } from "@/components/auth/AuthStatus";
// // import { LanguageSelector } from "@/components/language/LanguageSelector";
// import { MobileNav } from "@/components/layout/MobileNav";
// import { NavigationMenu } from "@/components/layout/NavigationMenu";
// import { fetchCategories } from "@/lib/api";
// import { btn } from "@/lib/utils";

// const NAV_ITEMS = [
// { label: "Home", href: "/" },
// { label: "Tools", href: "/tools" },
// { label: "Categories", href: "/tools" },
// { label: "Pricing", href: "/pricing" },
// { label: "About", href: "/about" },
// { label: "Contact", href: "/contact" },
// ];

// const CATEGORY_ITEMS = [
// {
// slug: "pdf",
// label: "PDF",
// icon: "PDF",
// description: "Merge, convert, and optimize files.",
// },
// {
// slug: "image",
// label: "Image",
// icon: "IMG",
// description: "Resize, convert, and transform visuals.",
// },
// {
// slug: "ai",
// label: "AI",
// icon: "AI",
// description: "Summaries, detection, and text helpers.",
// },
// {
// slug: "internet",
// label: "Internet",
// icon: "NET",
// description: "Check URLs, DNS, and network tools.",
// },
// {
// slug: "developer",
// label: "Developer",
// icon: "DEV",
// description: "Utility tools for faster workflows.",
// },
// {
// slug: "text",
// label: "Text",
// icon: "TXT",
// description: "Format, clean, and analyze content.",
// },
// ];

// export async function Header() {
// const categories = await fetchCategories().catch(() => []);

// const toolsByCategory = categories as Array<{
// slug: string;
// tools?: Array<{
// slug: string;
// name: string;
// category_slug?: string;
// }>;
// }>;

// const categoryData = CATEGORY_ITEMS.map((category) => ({
// ...category,
// tools:
// toolsByCategory.find(
// (item) => item.slug === category.slug
// )?.tools || [],
// }));

// return ( <header className="group/header sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)]/90 backdrop-blur-2xl"> <div className="section-shell grid h-[5.9rem] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">


//     {/* Left side */}
//     <div className="hidden items-center justify-start gap-3 sm:flex">
//       <Link
//         href="/pricing"
//         className={
//           btn("ghost") +
//           " !rounded-full !px-3 !py-2 text-[10px] uppercase tracking-[0.18em]"
//         }
//       >
//         Plans
//       </Link>

//       <Link
//         href="/tools"
//         className={
//           btn("secondary") +
//           " !rounded-full !px-3 !py-2 text-[10px] uppercase tracking-[0.18em]"
//         }
//       >
//         Explore
//       </Link>
//     </div>

//     {/* Logo */}
//     <Link
//       href="/"
//       className="group/logo flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
//     >
//       <span className="brand-mark !h-10 !w-10 !rounded-xl !text-lg sm:!h-[3.2rem] sm:!w-[3.2rem] sm:!rounded-[0.9rem] sm:!text-[1.55rem]">
//         T
//       </span>

//       <span className="flex items-center gap-1.5 text-[1.35rem] font-black tracking-[-0.08em] text-[var(--foreground)] sm:gap-2 sm:text-[1.7rem] md:text-[2.15rem]">
//         UtilAI

//         <span className="inline-flex items-center rounded-full border border-[var(--brand-primary)]/50 bg-[var(--brand-primary)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-primary)]">
//           AI
//         </span>
//       </span>
//     </Link>

//     {/* Right side */}
//     <div className="flex items-center justify-end gap-1.5 sm:gap-3">

//       {/* Desktop Navigation */}
//       <NavigationMenu
//         navItems={NAV_ITEMS}
//         categories={categoryData}
//       />

//       {/* Language */}
//       {/* <LanguageSelector /> */}

//       {/* Authentication */}
//       <AuthStatus />

//       {/* Mobile Navigation */}
//       <MobileNav
//         navItems={NAV_ITEMS}
//         categories={categoryData.map((category) => ({
//           slug: category.slug,
//           label: category.label,
//           tools: category.tools,
//         }))}
//       />
//     </div>
//   </div>
// </header>


// );
// }





import Link from "next/link";

import { AuthStatus } from "@/components/auth/AuthStatus";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { fetchCategories } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CATEGORY_ITEMS = [
  {
    slug: "pdf",
    label: "PDF",
    icon: "PDF",
    description: "Merge, convert, and optimize files.",
  },
  {
    slug: "image",
    label: "Image",
    icon: "IMG",
    description: "Resize, convert, and transform visuals.",
  },
  {
    slug: "ai",
    label: "AI",
    icon: "AI",
    description: "Summaries, detection, and text helpers.",
  },
  {
    slug: "internet",
    label: "Internet",
    icon: "NET",
    description: "Check URLs, DNS, and network tools.",
  },
  {
    slug: "developer",
    label: "Developer",
    icon: "DEV",
    description: "Utility tools for faster workflows.",
  },
  {
    slug: "text",
    label: "Text",
    icon: "TXT",
    description: "Format, clean, and analyze content.",
  },
];

export async function Header() {
  const categories = await fetchCategories().catch(() => []);

  const toolsByCategory = categories as Array<{
    slug: string;
    tools?: Array<{
      slug: string;
      name: string;
      category_slug?: string;
    }>;
  }>;

  const categoryData = CATEGORY_ITEMS.map((category) => ({
    ...category,
    tools:
      toolsByCategory.find(
        (item) => item.slug === category.slug
      )?.tools || [],
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)]/90 backdrop-blur-2xl">
      <div className="section-shell grid h-[5.9rem] grid-cols-[1fr_auto_1fr] items-center gap-4">
        
        {/* Logo - Left */}
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className="group/logo flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="brand-mark !h-10 !w-10 !rounded-xl !text-lg sm:!h-[3.2rem] sm:!w-[3.2rem] sm:!rounded-[0.9rem] sm:!text-[1.55rem]">
              T
            </span>

            <span className="flex items-center gap-1.5 text-[1.35rem] font-black tracking-[-0.08em] text-[var(--foreground)] sm:gap-2 sm:text-[1.7rem] md:text-[2.15rem]">
              UtilAI

              <span className="inline-flex items-center rounded-full border border-[var(--brand-primary)]/50 bg-[var(--brand-primary)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                AI
              </span>
            </span>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center justify-center">
          <NavigationMenu
            navItems={NAV_ITEMS}
            categories={categoryData}
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <AuthStatus />

          <MobileNav
            navItems={NAV_ITEMS}
            categories={categoryData.map((category) => ({
              slug: category.slug,
              label: category.label,
              tools: category.tools,
            }))}
          />
        </div>
      </div>
    </header>
  );
}

