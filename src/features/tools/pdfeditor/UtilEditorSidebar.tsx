
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

/*
 * Brand colors (website header gradient: light grey-blue -> deep blue).
 * Change these hex values to match your exact brand colors.
 */
const BRAND = {
  top: '#0b6fa8',
  mid: '#0b4f86',
  bottom: '#0a3a66',
};

export default function UtilAiEditorSidebar({ open, active, onToggle, onSelect }: Props) {
  // Collapsed View (Desktop only floating toggle)
  if (!open) {
    return (
      <button
        onClick={onToggle}
        title="Click Here"
        aria-label="Click Here"
        className="hidden md:flex absolute left-3 top-3 z-30 h-9 w-9 items-center justify-center rounded-full bg-[#0b4f86] text-white shadow-lg ring-1 ring-white/20 transition hover:bg-[#0b6fa8] focus:outline-none"
      >
        <PanelLeftOpen className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside
      aria-label="Editor navigation"
      // inline style guarantees the gradient wins over any CSS coming from .pdf-editor-sidebar
      style={{
        backgroundImage: `linear-gradient(to bottom, ${BRAND.top}, ${BRAND.mid}, ${BRAND.bottom})`,
      }}
      className="pdf-editor-sidebar z-30 flex w-full shrink-0 flex-row items-center justify-between border-t border-white/10 px-2 py-2 shadow-2xl md:h-full md:w-20 md:flex-col md:justify-start md:border-r md:border-t-0 md:px-0 md:py-3"
    >
      {/* Desktop Close toggle */}
      <button
        onClick={onToggle}
        title="Hide side panel"
        aria-label="Hide side panel"
        className="hidden md:flex mb-2 h-8 w-8 items-center justify-center rounded-lg text-blue-100/80 transition hover:bg-white/10 hover:text-white focus:outline-none"
      >
        <PanelLeftClose className="h-5 w-5" />
      </button>

      {/* Create Button */}
      <button
        onClick={() => onSelect('create')}
        title="Create a blank document"
        aria-label="Create a blank document"
        className="group flex flex-col md:flex-col items-center gap-1 text-[10px] md:text-[11px] font-semibold text-blue-50 transition hover:text-white focus:outline-none shrink-0"
      >
        <span className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-white text-[#0b4f86] shadow-md shadow-black/20 ring-1 ring-white/30 transition group-hover:scale-105 group-hover:bg-blue-50">
          <Plus className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
        </span>
        <span className="hidden sm:inline-block md:inline-block">Create</span>
      </button>

      {/* Separator Divider */}
      <div className="hidden md:block my-2 h-px w-10 bg-white/20" />
      <div className="md:hidden h-6 w-px bg-white/20 mx-1" />

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
                isActive ? 'text-white font-semibold' : 'text-blue-100/70 hover:text-white'
              }`}
            >
              {/* Active Marker Line (Side on Desktop, Bottom on Mobile) */}
              <span
                aria-hidden
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-t-full bg-white transition-opacity md:bottom-auto md:left-0 md:top-1/2 md:h-7 md:w-[3px] md:-translate-y-1/2 md:translate-x-0 md:rounded-r-full ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span
                className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl transition ${
                  isActive
                    ? 'bg-white/15 text-white ring-1 ring-white/30'
                    : 'group-hover:bg-white/10'
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