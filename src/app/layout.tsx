// import type { Metadata } from "next";

// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
// // import { ThemeManager } from "@/components/settings/ThemeManager";
// import { Inter } from "next/font/google";

// import "./globals.css";

// export const metadata: Metadata = {
//   title: {
//     default: "UtilAI — AI-powered creative tools",
//     template: "%s | UtilAI",
//   },
//   description:
//     "Modern online tools for PDFs, AI workflows, image editing, developer utilities, and everyday productivity.",
// };

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       data-scroll-behavior="smooth"
//       suppressHydrationWarning
//       className={inter.className}
//     >
//       <body
//         className="min-h-screen w-full overflow-x-hidden antialiased"
//         suppressHydrationWarning
//       >
//         {/* <ThemeManager /> */}

//         <Header />
//         <head>
//           <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6747330355821722"
//             crossorigin="anonymous"></script>
//         </head>
//         {/* Extra div aur px/max-w padding yahan se hata di gayi hai */}
//         <main className="w-full min-h-screen">
//           {children}
//         </main>

//         <Footer />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
// import { ThemeManager } from "@/components/settings/ThemeManager";
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6747330355821722"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className="min-h-screen w-full overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
        {/* <ThemeManager /> */}

        <Header />
        <main className="w-full min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}