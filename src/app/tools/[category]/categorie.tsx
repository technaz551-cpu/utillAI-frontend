// import Link from "next/link";

// import { fetchCategories } from "@/lib/api";

// export default async function CategoriesPage() {
//   const categories = await fetchCategories();

//   return (
//     <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
        
//         {/* Header */}
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
//             Tool Categories
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
//             Explore all available tools by category.
//           </p>
//         </div>

//         {/* Categories */}
//         {categories.length === 0 ? (
//           <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
//             <p className="text-[var(--muted)]">
//               No categories available.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {categories.map((category) => (
//               <Link
//                 key={category.slug}
//                 href={`/tools/${category.slug}`}
//                 className="
//                   group
//                   relative
//                   overflow-hidden
//                   rounded-2xl
//                   border
//                   border-[var(--border)]
//                   bg-[var(--surface)]
//                   p-6
//                   transition-all
//                   duration-200
//                   hover:-translate-y-1
//                   hover:border-blue-500
//                   hover:shadow-lg
//                 "
//               >
//                 {/* Blue fill/hover indicator */}
//                 <div
//                   className="
//                     absolute
//                     inset-x-0
//                     bottom-0
//                     h-1
//                     bg-blue-500
//                     transition-all
//                     duration-300
//                     group-hover:h-full
//                     group-hover:opacity-5
//                   "
//                 />

//                 <div className="relative z-10">
//                   <h2 className="text-lg font-semibold capitalize text-[var(--foreground)]">
//                     {category.slug.replace(/-/g, " ")}
//                   </h2>

//                   <p className="mt-2 text-sm text-[var(--muted)]">
//                     Explore {category.slug.replace(/-/g, " ")} tools
//                   </p>

//                   <div className="mt-5 text-sm font-medium text-blue-500">
//                     View tools →
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }