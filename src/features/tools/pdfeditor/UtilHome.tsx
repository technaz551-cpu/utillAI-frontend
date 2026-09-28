import React, { useMemo, useState } from 'react';
import { FilePlus, Upload, Search, Folder } from 'lucide-react';
import { formatEdited, type ProjectMeta } from './UtilProjectStore';

type Props = {
  projects: ProjectMeta[];
  onCreateBlank: () => void;
  onUploadPdf: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenProject: (id: string) => void;
  onViewAllProjects: () => void;
};

// Home page of the UtilAI PDF Studio (like Canva's "What will you design today?").
export default function UtilAiHome({
  projects,
  onCreateBlank,
  onUploadPdf,
  onOpenProject,
  onViewAllProjects,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? projects.filter((p) => p.title.toLowerCase().includes(q)) : projects;
    return list.slice(0, 8);
  }, [projects, query]);

  return (
    <div className="min-w-0 flex-1 overflow-y-auto bg-[#f1f7ff] select-text">
      {/* Hero */}
      <section className="m-4 rounded-3xl bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 px-6 py-10 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-700 sm:text-4xl">
          What will you edit today?
        </h1>

        <div className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-full border border-blue-200 bg-white px-5 py-3 shadow-sm">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your projects"
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Quick actions */}
        <div className="mt-8 flex flex-wrap items-start justify-center gap-6">
          <button onClick={onCreateBlank} className="group flex w-28 flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition group-hover:scale-105">
              <FilePlus className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold text-slate-700">Blank document</span>
          </button>

          <label className="group flex w-28 cursor-pointer flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md transition group-hover:scale-105">
              <Upload className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold text-slate-700">Upload PDF</span>
            <input type="file" accept="application/pdf" onChange={onUploadPdf} className="hidden" />
          </label>

          <button onClick={onViewAllProjects} className="group flex w-28 flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-md transition group-hover:scale-105">
              <Folder className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold text-slate-700">My projects</span>
          </button>
        </div>
      </section>

      {/* Recent projects */}
      <section className="px-6 pb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Recent projects</h2>
          {projects.length > 0 && (
            <button onClick={onViewAllProjects} className="text-xs font-semibold text-blue-600 hover:underline">
              See all
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white/70 p-8 text-center text-sm text-slate-500">
            {projects.length === 0
              ? 'No projects yet. Create a blank document or upload a PDF to get started.'
              : 'No project matches your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((project) => (
              <button
                key={project.id}
                onClick={() => onOpenProject(project.id)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-lg"
              >
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-slate-100">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover object-top" />
                  ) : (
                    <FilePlus className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="p-3">
                  <div className="truncate text-sm font-bold text-slate-800">{project.title}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {formatEdited(project.updatedAt)} · {project.pageCount} page{project.pageCount === 1 ? '' : 's'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}