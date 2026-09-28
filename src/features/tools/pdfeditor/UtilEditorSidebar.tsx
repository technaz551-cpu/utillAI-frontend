// import React from 'react';
// import {
//   Plus,
//   Home,
//   Folder,
//   Upload,
//   Type,
//   Square,
//   Sparkles,
//   PanelLeftClose,
//   PanelLeftOpen,
// } from 'lucide-react';

// export type SidebarItem =
//   | 'create'
//   | 'home'
//   | 'projects'
//   | 'uploads'
//   | 'text'
//   | 'elements'
//   | 'chat';

// type Props = {
//   open: boolean;
//   active: SidebarItem;
//   onToggle: () => void;
//   onSelect: (item: SidebarItem) => void;
// };

// const NAV_ITEMS: { id: SidebarItem; label: string; icon: React.ReactNode }[] = [
//   { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
//   { id: 'projects', label: 'Projects', icon: <Folder className="w-5 h-5" /> },
//   { id: 'uploads', label: 'Uploads', icon: <Upload className="w-5 h-5" /> },
//   { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
//   { id: 'elements', label: 'Elements', icon: <Square className="w-5 h-5" /> },
//   // { id: 'chat', label: 'UtilAI', icon: <Sparkles className="w-5 h-5" /> },
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
//         className="absolute left-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-blue-100 transition hover:bg-blue-50"
//       >
//         <PanelLeftOpen className="h-5 w-5" />
//       </button>
//     );
//   }

//   return (
//     <aside className="pdf-editor-sidebar w-20 shrink-0 bg-[#0f2747] flex flex-col items-center py-3 gap-4 text-blue-100/70 z-10 shadow-xl overflow-y-auto">
//       {/* Open / close toggle */}
//       <button
//         onClick={onToggle}
//         title="Hide side panel"
//         aria-label="Hide side panel"
//         className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-100/80 transition hover:bg-white/10 hover:text-white"
//       >
//         <PanelLeftClose className="h-5 w-5" />
//       </button>

//       {/* Create -> blank document */}
//       <button
//         onClick={() => onSelect('create')}
//         className="flex flex-col items-center gap-1 text-[11px] font-semibold text-blue-100 transition hover:text-white"
//       >
//         <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-900/40">
//           <Plus className="h-5 w-5" />
//         </span>
//         Create
//       </button>

//       <div className="h-px w-10 bg-white/10" />

//       {NAV_ITEMS.map((item) => (
//         <button
//           key={item.id}
//           onClick={() => onSelect(item.id)}
//           className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition hover:text-white ${
//             active === item.id ? 'text-[#93c5fd]' : ''
//           }`}
//         >
//           <span
//             className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
//               active === item.id ? 'bg-white/10' : ''
//             }`}
//           >
//             {item.icon}
//           </span>
//           {item.label}
//         </button>
//       ))}
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

const ICON = 'h-[22px] w-[22px]';

const NAV_ITEMS: { id: Exclude<SidebarItem, 'create'>; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <House className={ICON} strokeWidth={1.75} /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className={ICON} strokeWidth={1.75} /> },
  { id: 'uploads', label: 'Uploads', icon: <CloudUpload className={ICON} strokeWidth={1.75} /> },
  { id: 'text', label: 'Text', icon: <Type className={ICON} strokeWidth={1.75} /> },
  { id: 'elements', label: 'Elements', icon: <Shapes className={ICON} strokeWidth={1.75} /> },
];

export default function UtilAiEditorSidebar({ open, active, onToggle, onSelect }: Props) {
  // Collapsed: the whole rail disappears and only a small round button stays,
  // exactly like Canva. The parent container must be `position: relative`.
  if (!open) {
    return (
      <button
        onClick={onToggle}
        title="Show side panel"
        aria-label="Show side panel"
        className="absolute left-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg ring-1 ring-blue-100 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <PanelLeftOpen className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside
      aria-label="Editor navigation"
      className="pdf-editor-sidebar z-10 flex w-20 shrink-0 flex-col items-center gap-1 overflow-y-auto bg-gradient-to-b from-[#0b1f3f] via-[#0f2747] to-[#0a1a33] py-3 shadow-xl"
    >
      {/* Open / close toggle */}
      <button
        onClick={onToggle}
        title="Hide side panel"
        aria-label="Hide side panel"
        className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-blue-200/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <PanelLeftClose className="h-5 w-5" />
      </button>

      {/* Create -> blank document (the one bold element of the rail) */}
      <button
        onClick={() => onSelect('create')}
        title="Create a blank document"
        aria-label="Create a blank document"
        className="group mb-1 flex flex-col items-center gap-1.5 text-[11px] font-semibold text-blue-100 transition hover:text-white focus:outline-none"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50 ring-1 ring-white/20 transition group-hover:scale-105 group-hover:shadow-blue-500/40 group-focus-visible:ring-2 group-focus-visible:ring-blue-300">
          <Plus className="h-6 w-6" strokeWidth={2.25} />
        </span>
        Create
      </button>

      <div className="my-2 h-px w-10 bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <nav className="flex w-full flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex w-full flex-col items-center gap-1 py-2 text-[11px] font-semibold transition focus:outline-none ${
                isActive ? 'text-white' : 'text-blue-200/60 hover:text-white'
              }`}
            >
              {/* Active marker on the rail edge */}
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-sky-400 transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-focus-visible:ring-2 group-focus-visible:ring-blue-400 ${
                  isActive
                    ? 'bg-blue-500/20 text-sky-300 ring-1 ring-sky-400/40'
                    : 'group-hover:bg-white/10'
                }`}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}