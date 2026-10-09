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
import { Download, FileOutput, Upload } from "lucide-react";
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
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      const response = await fetch(
        `${API_BASE}/tools/${tool.category_slug}/${tool.slug}/process`,
        { method: "POST", body: form },
      );
      const json = await response.json();

      if (!response.ok || !json.success || !json.data?.job_id) {
        throw new Error(json.message || "The files could not be submitted.");
      }

      const nextJobId: string = json.data.job_id;
      setJobId(nextJobId);
      setStatus("processing");

      const deadline = Date.now() + 2 * 60 * 1000;
      pollRef.current = setInterval(async () => {
        try {
          const jobResponse = await fetch(
            `${API_BASE}/tools/jobs/${nextJobId}`,
          );
          const jobResult = await jobResponse.json();

          if (!jobResponse.ok || !jobResult.success || !jobResult.data) {
            stopPolling();
            setError(jobResult.message || "Could not read job status.");
            setStatus("error");
            return;
          }

          if (jobResult.data.status === "completed") {
            stopPolling();
            setStatus("completed");
            return;
          }

          if (jobResult.data.status === "failed") {
            stopPolling();
            setError(jobResult.data.error || "Processing failed.");
            setStatus("error");
            return;
          }

          if (Date.now() > deadline) {
            stopPolling();
            setError("Timed out waiting for processing to finish.");
            setStatus("error");
          }
        } catch {
          stopPolling();
          setError("Lost connection to the server.");
          setStatus("error");
        }
      }, 1500);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the selected files.",
      );
      setStatus("error");
    }
  };

  return (
    <div className={`${card()} overflow-hidden !p-0`}>
      <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-5 py-6 sm:px-7">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {tool.name}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {tool.short_description}
        </p>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-3">
          <p className="text-sm font-semibold text-slate-800">Input files</p>
          <p className="mt-1 text-xs text-slate-500">
            Files are processed securely and automatically deleted per our retention policy.
          </p>
        </div>
        <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/60">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm ring-1 ring-slate-200">
            <Upload className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-slate-800">
            Drop files here or browse
          </span>
          <span className="mt-1 text-xs text-slate-500">
            {tool.accepted_formats?.join(", ").toUpperCase() || "Supported files"}
          </span>
          <input
            type="file"
            multiple={tool.slug === "merge-pdf" || tool.slug === "jpg-to-pdf"}
            accept={tool.accepted_formats?.map((format) => `.${format}`).join(",")}
            className="hidden"
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
          />
        </label>
        {files.length > 0 && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">
                Selected input
              </p>
              <span className="text-xs text-slate-500">
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                >
                  <Upload className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={upload}
            disabled={!files.length || status === "uploading" || status === "processing"}
            className={`${btn("primary")} !h-11 flex-1 justify-center !rounded-xl`}
          >
            {status === "processing" || status === "uploading"
              ? "Processing…"
              : "Process files"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setStatus("");
              setError("");
            }}
            disabled={!files.length || status === "processing"}
            className={`${btn("secondary")} !h-11 justify-center !rounded-xl`}
          >
            Clear
          </button>
        </div>
      <section className={`mt-5 rounded-2xl border p-4 sm:p-5 ${
        error
          ? "border-red-200 bg-red-50/60"
          : status === "completed"
            ? "border-emerald-200 bg-emerald-50/60"
            : "border-slate-200 bg-slate-50/70"
      }`}>
        <div className="mb-4 flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            error ? "bg-red-100 text-red-700" : status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
          }`}><FileOutput className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Output</p>
            <p className="text-xs text-slate-500">
              {error ? "Processing needs attention" : status === "completed" ? "Your result is ready to download" : status === "processing" || status === "uploading" ? "Your files are being processed" : "Your processed files will appear here"}
            </p>
          </div>
        </div>
        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-white/70 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : status === "processing" || status === "uploading" ? (
          <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-medium text-blue-700">
            Processing your files. This section will update when the result is ready.
          </div>
        ) : status === "completed" && jobId ? (
          <a
            href={`${API_BASE}/tools/jobs/${jobId}/download`}
            className={btn("primary") + " inline-flex !rounded-xl"}
          >
            <Download className="mr-2 h-4 w-4" /> Download result
          </a>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
            <FileOutput className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">No output yet</p>
            <p className="mt-1 text-xs text-slate-400">Select your files and start processing</p>
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
