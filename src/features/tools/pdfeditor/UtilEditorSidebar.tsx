


// import React from 'react';
// import {
//   Plus,
//   House,
//   FolderOpen,
//   CloudUpload,
//   Type,
//   Shapes,
//   PanelLeftClose,
//   PanelLeftOpen,
// } from 'lucide-react';

// export type SidebarItem =
//   | 'create'
//   | 'home'
//   | 'projects'
//   | 'uploads'
//   | 'text'
//   | 'elements';

// type Props = {
//   open: boolean;
//   active: SidebarItem;
//   onToggle: () => void;
//   onSelect: (item: SidebarItem) => void;
// };

// const ICON = 'h-[22px] w-[22px]';

// const NAV_ITEMS: { id: Exclude<SidebarItem, 'create'>; label: string; icon: React.ReactNode }[] = [
//   { id: 'home', label: 'Home', icon: <House className={ICON} strokeWidth={1.75} /> },
//   { id: 'projects', label: 'Projects', icon: <FolderOpen className={ICON} strokeWidth={1.75} /> },
//   { id: 'uploads', label: 'Uploads', icon: <CloudUpload className={ICON} strokeWidth={1.75} /> },
//   { id: 'text', label: 'Text', icon: <Type className={ICON} strokeWidth={1.75} /> },
//   { id: 'elements', label: 'Elements', icon: <Shapes className={ICON} strokeWidth={1.75} /> },
// ];

// export default function UtilAiEditorSidebar({ open, active, onToggle, onSelect }: Props) {
//   // Collapsed: the whole rail disappears and only a small round button stays,
//   // exactly like Canva. The parent container must be `position: relative`.
//   if (!open) {
//     return (
//       <button
//         onClick={onToggle}
//         title="Show side panel"
//         aria-label="Show side panel"
//         className="absolute left-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg ring-1 ring-blue-100 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
//       >
//         <PanelLeftOpen className="h-5 w-5" />
//       </button>
//     );
//   }

//   return (
//     <aside
//       aria-label="Editor navigation"
//       className="pdf-editor-sidebar z-10 flex w-20 shrink-0 flex-col items-center gap-1 overflow-y-auto bg-gradient-to-b from-[#0b1f3f] via-[#0f2747] to-[#0a1a33] py-3 shadow-xl"
//     >
//       {/* Open / close toggle */}
//       <button
//         onClick={onToggle}
//         title="Hide side panel"
//         aria-label="Hide side panel"
//         className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-blue-200/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
//       >
//         <PanelLeftClose className="h-5 w-5" />
//       </button>

//       {/* Create -> blank document (the one bold element of the rail) */}
//       <button
//         onClick={() => onSelect('create')}
//         title="Create a blank document"
//         aria-label="Create a blank document"
//         className="group mb-1 flex flex-col items-center gap-1.5 text-[11px] font-semibold text-blue-100 transition hover:text-white focus:outline-none"
//       >
//         <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50 ring-1 ring-white/20 transition group-hover:scale-105 group-hover:shadow-blue-500/40 group-focus-visible:ring-2 group-focus-visible:ring-blue-300">
//           <Plus className="h-6 w-6" strokeWidth={2.25} />
//         </span>
//         Create
//       </button>

//       <div className="my-2 h-px w-10 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

//       <nav className="flex w-full flex-col items-center gap-1">
//         {NAV_ITEMS.map((item) => {
//           const isActive = active === item.id;
//           return (
//             <button
//               key={item.id}
//               onClick={() => onSelect(item.id)}
//               title={item.label}
//               aria-label={item.label}
//               aria-current={isActive ? 'page' : undefined}
//               className={`group relative flex w-full flex-col items-center gap-1 py-2 text-[11px] font-semibold transition focus:outline-none ${
//                 isActive ? 'text-white' : 'text-blue-200/60 hover:text-white'
//               }`}
//             >
//               {/* Active marker on the rail edge */}
//               <span
//                 aria-hidden
//                 className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-sky-400 transition-opacity ${
//                   isActive ? 'opacity-100' : 'opacity-0'
//                 }`}
//               />
//               <span
//                 className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-focus-visible:ring-2 group-focus-visible:ring-blue-400 ${
//                   isActive
//                     ? 'bg-blue-500/20 text-sky-300 ring-1 ring-sky-400/40'
//                     : 'group-hover:bg-white/10'
//                 }`}
//               >
//                 {item.icon}
//               </span>
//               {item.label}
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }



import React from 'react';
import {
  Plus,
  House,
  FolderOpen,
  CloudUpload,
  Type,
  Shapes,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export type SidebarItem =
  | 'create'
  | 'home'
  | 'projects'
  | 'uploads'
  | 'text'
  | 'elements';

type Props = {
  open: boolean;
  active: SidebarItem;
  onToggle: () => void;
  onSelect: (item: SidebarItem) => void;
};

const ICON = 'h-[20px] w-[20px] md:h-[22px] md:w-[22px]';

const NAV_ITEMS: { id: Exclude<SidebarItem, 'create'>; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <House className={ICON} strokeWidth={1.75} /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className={ICON} strokeWidth={1.75} /> },
  { id: 'uploads', label: 'Uploads', icon: <CloudUpload className={ICON} strokeWidth={1.75} /> },
  { id: 'text', label: 'Text', icon: <Type className={ICON} strokeWidth={1.75} /> },
  { id: 'elements', label: 'Elements', icon: <Shapes className={ICON} strokeWidth={1.75} /> },
];

export default function UtilAiEditorSidebar({ open, active, onToggle, onSelect }: Props) {
  // Collapsed View (Desktop only floating toggle)
  if (!open) {
    return (
      <button
        onClick={onToggle}
        title="Show side panel"
        aria-label="Show side panel"
        className="hidden md:flex absolute left-3 top-3 z-30 h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-blue-400 shadow-lg ring-1 ring-slate-800 transition hover:bg-slate-800 focus:outline-none"
      >
        <PanelLeftOpen className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside
      aria-label="Editor navigation"
      className="pdf-editor-sidebar z-30 flex w-full shrink-0 flex-row items-center justify-between border-t border-slate-800 bg-slate-950 px-2 py-2 shadow-2xl md:h-full md:w-20 md:flex-col md:justify-start md:border-r md:border-t-0 md:bg-gradient-to-b md:from-slate-950 md:via-slate-900 md:to-slate-950 md:px-0 md:py-3"
    >
      {/* Desktop Close toggle */}
      <button
        onClick={onToggle}
        title="Hide side panel"
        aria-label="Hide side panel"
        className="hidden md:flex mb-2 h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none"
      >
        <PanelLeftClose className="h-5 w-5" />
      </button>

      {/* Create Button */}
      <button
        onClick={() => onSelect('create')}
        title="Create a blank document"
        aria-label="Create a blank document"
        className="group flex flex-col md:flex-col items-center gap-1 text-[10px] md:text-[11px] font-semibold text-slate-300 transition hover:text-white focus:outline-none shrink-0"
      >
        <span className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-white/10 transition group-hover:scale-105 group-hover:bg-blue-500">
          <Plus className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
        </span>
        <span className="hidden sm:inline-block md:inline-block">Create</span>
      </button>

      {/* Separator Divider */}
      <div className="hidden md:block my-2 h-px w-10 bg-slate-800" />
      <div className="md:hidden h-6 w-px bg-slate-800 mx-1" />

      {/* Navigation List */}
      <nav className="flex w-full flex-row md:flex-col items-center justify-around md:justify-start gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex flex-col items-center gap-0.5 md:gap-1 px-2 py-1 md:py-2 text-[10px] md:text-[11px] font-medium transition focus:outline-none ${
                isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Marker Line (Side on Desktop, Bottom on Mobile) */}
              <span
                aria-hidden
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-t-full bg-blue-500 transition-opacity md:bottom-auto md:left-0 md:top-1/2 md:h-7 md:w-[3px] md:-translate-y-1/2 md:translate-x-0 md:rounded-r-full ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span
                className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30'
                    : 'group-hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
              </span>
              <span className="truncate max-w-[50px] md:max-w-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}