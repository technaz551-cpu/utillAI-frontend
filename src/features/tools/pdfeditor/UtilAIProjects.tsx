import React from 'react';
import { FilePlus, Pencil, Trash2 } from 'lucide-react';
import { formatEdited, type ProjectMeta } from './UtilProjectStore';

type Props = {
  projects: ProjectMeta[];
  onOpen: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

// "Projects" page: every document the user created or updated (saved automatically).
export default function UtilAiProjects({ projects, onOpen, onCreate, onRename, onDelete }: Props) {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto bg-[#f1f7ff] p-6 select-text">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Projects</h1>
          <p className="text-xs text-slate-500">
            Your documents are saved automatically in this browser.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
        >
          <FilePlus className="h-4 w-4" /> New document
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-white/70 p-10 text-center text-sm text-slate-500">
          No projects yet. Create a blank document or upload a PDF and it will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <button
                onClick={() => onOpen(project.id)}
                className="block w-full text-left"
                aria-label={`Open ${project.title}`}
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-slate-100">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover object-top" />
                  ) : (
                    <FilePlus className="h-8 w-8 text-slate-300" />
                  )}
                </div>
              </button>

              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-800">{project.title}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {formatEdited(project.updatedAt)} · {project.pageCount} page{project.pageCount === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    title="Rename"
                    onClick={() => {
                      const next = window.prompt('Rename project', project.title);
                      if (next && next.trim()) onRename(project.id, next.trim());
                    }}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => {
                      if (window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
                        onDelete(project.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}