// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Upload, Download } from "lucide-react";
// import { btn, card } from "@/lib/utils";
// import { ToolMeta } from "@/features/tools/client-processors";
// import { API_BASE } from "@/lib/api";

// export function ServerFileTool({ tool }: { tool: ToolMeta }) {
//   const [files, setFiles] = useState<File[]>([]);
//   const [jobId, setJobId] = useState("");
//   const [status, setStatus] = useState("");
//   const [error, setError] = useState("");
//   const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

//   useEffect(() => () => clearInterval(pollRef.current), []);

//   const stopPolling = () => {
//     clearInterval(pollRef.current);
//     pollRef.current = undefined;
//   };

//   const upload = async () => {
//     if (!files.length) return;
//     setStatus("uploading");
//     setError("");
//     const form = new FormData();
//     files.forEach((f) => form.append("files", f));
//     const res = await fetch(`${API_BASE}/tools/${tool.category_slug}/${tool.slug}/process`, { method: "POST", body: form });
//     const json = await res.json();
//     if (!json.success) { setError(json.message); setStatus("error"); return; }
//     setJobId(json.data.job_id);
//     setStatus("processing");

//     // Give up rather than polling forever if the job never reaches a terminal state.
//     const deadline = Date.now() + 2 * 60 * 1000;
//     pollRef.current = setInterval(async () => {
//       try {
//         const jr = await fetch(`${API_BASE}/tools/jobs/${json.data.job_id}`);
//         const jd = await jr.json();
//         if (!jd.success || !jd.data) {
//           stopPolling();
//           setError(jd.message || "Could not read job status");
//           setStatus("error");
//           return;
//         }
//         if (jd.data.status === "completed") { stopPolling(); setStatus("completed"); return; }
//         if (jd.data.status === "failed") { stopPolling(); setError(jd.data.error || "Processing failed"); setStatus("error"); return; }
//         if (Date.now() > deadline) { stopPolling(); setError("Timed out waiting for processing to finish"); setStatus("error"); }
//       } catch {
//         stopPolling();
//         setError("Lost connection to the server");
//         setStatus("error");
//       }
//     }, 1500);
//   };

//   return (
//     <div className={card()}>
//       <p className="mb-4 text-xs text-[var(--muted)]">Files are processed securely and automatically deleted per our retention policy.</p>
//       <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[#0d121c] px-6 py-12 transition-colors hover:border-[var(--accent)]">
//         <Upload className="mb-3 h-10 w-10 text-[var(--muted)]" />
//         <span className="text-sm text-[var(--muted)]">Drop files or click to upload</span>
//         <input type="file" multiple={tool.slug === "merge-pdf" || tool.slug === "jpg-to-pdf"} accept={tool.accepted_formats?.map((f) => `.${f}`).join(",")} className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
//       </label>
//       {files.length > 0 && <p className="mt-2 text-sm text-[var(--muted)]">{files.length} file(s) selected</p>}
//       <button onClick={upload} disabled={!files.length || status === "processing"} className={btn("primary") + " mt-4"}>
//         {status === "processing" ? "Processing…" : "Process"}
//       </button>
//       {error && <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>}
//       {status === "completed" && jobId && (
//         <a href={`${API_BASE}/tools/jobs/${jobId}/download`} className={btn("secondary") + " mt-4 inline-flex"}>
//           <Download className="mr-2 h-4 w-4" /> Download Result
//         </a>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download } from "lucide-react";
import { btn, card } from "@/lib/utils";
import { ToolMeta } from "@/features/tools/client-processors";
import { API_BASE } from "@/lib/api";

export function ServerFileTool({ tool }: { tool: ToolMeta }) {
  const [files, setFiles] = useState<File[]>([]);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => () => clearInterval(pollRef.current), []);

  const stopPolling = () => {
    clearInterval(pollRef.current);
    pollRef.current = undefined;
  };

  const upload = async () => {
    if (!files.length) return;
    setStatus("uploading");
    setError("");
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await fetch(`${API_BASE}/tools/${tool.category_slug}/${tool.slug}/process`, { method: "POST", body: form });
    const json = await res.json();
    if (!json.success) { setError(json.message); setStatus("error"); return; }
    setJobId(json.data.job_id);
    setStatus("processing");

    // Give up rather than polling forever if the job never reaches a terminal state.
    const deadline = Date.now() + 2 * 60 * 1000;
    pollRef.current = setInterval(async () => {
      try {
        const jr = await fetch(`${API_BASE}/tools/jobs/${json.data.job_id}`);
        const jd = await jr.json();
        if (!jd.success || !jd.data) {
          stopPolling();
          setError(jd.message || "Could not read job status");
          setStatus("error");
          return;
        }
        if (jd.data.status === "completed") { stopPolling(); setStatus("completed"); return; }
        if (jd.data.status === "failed") { stopPolling(); setError(jd.data.error || "Processing failed"); setStatus("error"); return; }
        if (Date.now() > deadline) { stopPolling(); setError("Timed out waiting for processing to finish"); setStatus("error"); }
      } catch {
        stopPolling();
        setError("Lost connection to the server");
        setStatus("error");
      }
    }, 1500);
  };

  return (
    <div className={card()}>
      <p className="mb-4 text-xs text-slate-500">Files are processed securely and automatically deleted per our retention policy.</p>
      <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 transition-colors hover:border-blue-400">
        <Upload className="mb-3 h-10 w-10 text-slate-400" />
        <span className="text-sm text-slate-500">Drop files or click to upload</span>
        <input type="file" multiple={tool.slug === "merge-pdf" || tool.slug === "jpg-to-pdf"} accept={tool.accepted_formats?.map((f) => `.${f}`).join(",")} className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      </label>
      {files.length > 0 && <p className="mt-2 text-sm text-slate-500">{files.length} file(s) selected</p>}
      <button onClick={upload} disabled={!files.length || status === "processing"} className={btn("primary") + " mt-4"}>
        {status === "processing" ? "Processing…" : "Process"}
      </button>
      {error && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {status === "completed" && jobId && (
        <a href={`${API_BASE}/tools/jobs/${jobId}/download`} className={btn("secondary") + " mt-4 inline-flex"}>
          <Download className="mr-2 h-4 w-4" /> Download Result
        </a>
      )}
    </div>
  );
}
