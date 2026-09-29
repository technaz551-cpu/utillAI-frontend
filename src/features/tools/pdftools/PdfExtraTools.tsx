


// "use client";

// /**
//  * PdfExtraTools.tsx  (redesign)
//  * Design idea: a print-shop "proofing table".
//  *  - Left: the light table (dotted grid + crop marks) where pages / previews live.
//  *  - Right: a sticky inspector with all settings and the main action.
//  * Logic and exports are unchanged from the previous version.
//  */

// import { useEffect, useRef, useState, type ReactNode } from "react";

// import {
//   ArrowLeft,
//   ArrowRight,
//   Check,
//   Download,
//   Eraser,
//   FileText,
//   Loader2,
//   Lock,
//   RotateCcw,
//   RotateCw,
//   Trash2,
//   Upload,
//   X,
// } from "lucide-react";

// import type { ToolMeta } from "@/features/tools/client-processors";

// import {
//   organizePdf,
//   protectPdf,
//   readMetadata,
//   renderThumbs,
//   rotateCropPdf,
//   watermarkPdf,
//   writeMetadata,
//   type CropMargins,
//   type NumberingOptions,
//   type PageItem,
//   type PdfMetadata,
//   type ProcessResult,
//   type SignatureOptions,
//   type WatermarkOptions,
// } from "./pdf_extra_processors";

// /* ================================================================== */
// /* Tokens + shared pieces                                              */
// /* ================================================================== */

// // ink #0f1a2e | cobalt #2547f0 | wash #eaf0ff | spot magenta #e11d74 | table #f3f6fb
// type Status = "idle" | "processing" | "done" | "error";

// const fmt = (b: number) =>
//   b < 1024
//     ? `${b} B`
//     : b < 1048576
//       ? `${(b / 1024).toFixed(1)} KB`
//       : `${(b / 1048576).toFixed(2)} MB`;

// const table =
//   "relative rounded-2xl border border-slate-200 bg-[#f3f6fb] bg-[radial-gradient(#c9d3e4_1px,transparent_1px)] [background-size:16px_16px] p-5";
// const field =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-[#2547f0] focus:ring-2 focus:ring-[#2547f0]/15";
// const primary =
//   "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f1a2e] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2547f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2547f0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#0f1a2e]";
// const ghost =
//   "flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#2547f0] hover:text-[#2547f0]";
// const tiny =
//   "flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[#eaf0ff] hover:text-[#2547f0] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500";

// function useRunner() {
//   const [status, setStatus] = useState<Status>("idle");
//   const [error, setError] = useState("");
//   const [result, setResult] = useState<
//     (ProcessResult & { url: string; size: number }) | null
//   >(null);

//   useEffect(
//     () => () => {
//       if (result) URL.revokeObjectURL(result.url);
//     },
//     [result],
//   );

//   const run = async (fn: () => Promise<ProcessResult>) => {
//     setStatus("processing");
//     setError("");
//     try {
//       const r = await fn();
//       setResult({ ...r, url: URL.createObjectURL(r.blob), size: r.blob.size });
//       setStatus("done");
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Processing failed");
//       setStatus("error");
//     }
//   };
//   const reset = () => {
//     setResult(null);
//     setStatus("idle");
//     setError("");
//   };
//   return { status, error, result, run, reset, setError };
// }

// /** Prepress crop marks in the four corners of a positioned parent */
// function Marks() {
//   const c = "absolute h-3 w-3 border-slate-400";
//   return (
//     <span aria-hidden className="pointer-events-none absolute inset-2">
//       <span className={`${c} left-0 top-0 border-l border-t`} />
//       <span className={`${c} right-0 top-0 border-r border-t`} />
//       <span className={`${c} bottom-0 left-0 border-b border-l`} />
//       <span className={`${c} bottom-0 right-0 border-b border-r`} />
//     </span>
//   );
// }

// function Shell({
//   tool,
//   sub,
//   children,
// }: {
//   tool: ToolMeta;
//   sub: string;
//   children: ReactNode;
// }) {
//   return (
//     <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6">
//       <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
//         <div>
//           <h3 className="text-xl font-bold tracking-tight text-[#0f1a2e]">
//             {tool.name}
//           </h3>
//           <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{sub}</p>
//         </div>
//         <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
//           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//           Runs in your browser. Nothing is uploaded.
//         </span>
//       </div>
//       {children}
//     </div>
//   );
// }

// /** Light table (left) + inspector (right) */
// function Bench({ left, side }: { left: ReactNode; side: ReactNode }) {
//   return (
//     <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
//       <div className={table}>
//         <Marks />
//         <div className="relative">{left}</div>
//       </div>
//       <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6">
//         {side}
//       </aside>
//     </div>
//   );
// }

// function Group({ title, children }: { title: string; children: ReactNode }) {
//   return (
//     <section className="border-b border-slate-100 pb-4 pt-4 first:pt-0 last:border-0">
//       <h4 className="mb-3 text-sm font-semibold text-[#0f1a2e]">{title}</h4>
//       <div className="space-y-3">{children}</div>
//     </section>
//   );
// }

// const Field = ({ label, children }: { label: string; children: ReactNode }) => (
//   <label className="block text-xs font-medium text-slate-600">
//     <span className="mb-1 block">{label}</span>
//     {children}
//   </label>
// );

// function Seg<T extends string>({
//   value,
//   onChange,
//   options,
// }: {
//   value: T;
//   onChange: (v: T) => void;
//   options: [T, string][];
// }) {
//   return (
//     <div
//       className="grid rounded-xl bg-slate-100 p-1"
//       style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
//     >
//       {options.map(([v, l]) => (
//         <button
//           key={v}
//           type="button"
//           onClick={() => onChange(v)}
//           className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
//             value === v
//               ? "bg-white text-[#2547f0] shadow-sm"
//               : "text-slate-500 hover:text-slate-800"
//           }`}
//         >
//           {l}
//         </button>
//       ))}
//     </div>
//   );
// }

// function Switch({
//   checked,
//   onChange,
//   label,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   label: string;
// }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className="flex w-full items-center justify-between gap-3 py-0.5 text-sm text-slate-700"
//     >
//       <span>{label}</span>
//       <span
//         className={`h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
//           checked ? "bg-[#2547f0]" : "bg-slate-300"
//         }`}
//       >
//         <span
//           className={`block h-4 w-4 rounded-full bg-white transition-transform ${
//             checked ? "translate-x-4" : ""
//           }`}
//         />
//       </span>
//     </button>
//   );
// }

// function DropZone({
//   onFile,
//   label,
//   hint = "PDF files only",
// }: {
//   onFile: (f: File) => void;
//   label: string;
//   hint?: string;
// }) {
//   const [over, setOver] = useState(false);
//   return (
//     <label
//       onDragOver={(e) => {
//         e.preventDefault();
//         setOver(true);
//       }}
//       onDragLeave={() => setOver(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setOver(false);
//         const f = e.dataTransfer.files[0];
//         if (f) onFile(f);
//       }}
//       className={`${table} flex min-h-[320px] cursor-pointer flex-col items-center justify-center text-center transition-colors ${
//         over ? "border-[#2547f0] bg-[#eaf0ff]" : "hover:border-[#2547f0]"
//       }`}
//     >
//       <Marks />
//       <span className="flex h-16 w-12 items-center justify-center rounded-md border border-slate-300 bg-white shadow-sm">
//         <Upload className="h-5 w-5 text-[#2547f0]" />
//       </span>
//       <span className="mt-5 text-base font-semibold text-[#0f1a2e]">{label}</span>
//       <span className="mt-1 text-sm text-slate-500">
//         or <span className="font-medium text-[#2547f0] underline">browse</span>{" "}
//         from your device
//       </span>
//       <span className="mt-4 text-xs text-slate-400">{hint}</span>
//       <input
//         type="file"
//         accept=".pdf"
//         className="hidden"
//         onChange={(e) => {
//           const f = e.target.files?.[0];
//           if (f) onFile(f);
//           e.target.value = "";
//         }}
//       />
//     </label>
//   );
// }

// function Notice({
//   kind,
//   children,
// }: {
//   kind: "busy" | "error";
//   children: ReactNode;
// }) {
//   if (!children) return null;
//   const busy = kind === "busy";
//   return (
//     <div
//       className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
//         busy
//           ? "border-[#2547f0]/20 bg-[#eaf0ff] text-[#2547f0]"
//           : "border-[#e11d74]/25 bg-[#fff0f6] text-[#b0135a]"
//       }`}
//     >
//       {busy ? (
//         <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
//       ) : (
//         <X className="mt-0.5 h-4 w-4 shrink-0" />
//       )}
//       <span>{children}</span>
//     </div>
//   );
// }

// function Actions({
//   onRun,
//   onClear,
//   disabled,
//   busy,
//   label,
// }: {
//   onRun: () => void;
//   onClear: () => void;
//   disabled?: boolean;
//   busy: boolean;
//   label: string;
// }) {
//   return (
//     <div className="mt-5 space-y-2">
//       <button
//         type="button"
//         onClick={onRun}
//         disabled={disabled || busy}
//         className={primary}
//       >
//         {busy ? (
//           <>
//             <Loader2 className="h-4 w-4 animate-spin" /> Working...
//           </>
//         ) : (
//           label
//         )}
//       </button>
//       <button
//         type="button"
//         onClick={onClear}
//         className="flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-[#e11d74]"
//       >
//         <RotateCcw className="h-3.5 w-3.5" /> Start over with another file
//       </button>
//     </div>
//   );
// }

// function ResultCard({
//   result,
//   onReset,
// }: {
//   result: ProcessResult & { url: string; size: number };
//   onReset: () => void;
// }) {
//   return (
//     <div className="mx-auto max-w-xl overflow-hidden rounded-3xl bg-[#0f1a2e] p-6 text-white sm:p-8">
//       <div className="flex items-center gap-3">
//         <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-[#0f1a2e]">
//           <Check className="h-5 w-5" strokeWidth={3} />
//         </span>
//         <h2 className="text-xl font-bold tracking-tight">Your PDF is ready</h2>
//       </div>
//       {result.note && (
//         <p className="mt-3 text-sm leading-6 text-slate-300">{result.note}</p>
//       )}
//       <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/10 p-4">
//         <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md bg-white">
//           <FileText className="h-5 w-5 text-[#e11d74]" />
//         </span>
//         <div className="min-w-0">
//           <p className="truncate text-sm font-semibold">{result.filename}</p>
//           <p className="mt-0.5 text-xs text-slate-300">{fmt(result.size)}</p>
//         </div>
//       </div>
//       <a
//         href={result.url}
//         download={result.filename}
//         className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#0f1a2e] transition-colors hover:bg-[#eaf0ff]"
//       >
//         <Download className="h-5 w-5" /> Download PDF
//       </a>
//       <button
//         onClick={onReset}
//         className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-slate-300 hover:text-white"
//       >
//         <RotateCcw className="h-4 w-4" /> Process another file
//       </button>
//     </div>
//   );
// }

// /** File load + thumbnails, reused by page-based tools */
// function usePdfFile(width = 180) {
//   const [file, setFile] = useState<File | null>(null);
//   const [thumbs, setThumbs] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   const pick = async (f: File) => {
//     if (!/\.pdf$/i.test(f.name)) {
//       setErr("That isn't a PDF. Choose a file ending in .pdf.");
//       return;
//     }
//     setErr("");
//     setFile(f);
//     setLoading(true);
//     try {
//       setThumbs(await renderThumbs(f, width));
//     } catch {
//       setErr(
//         "Couldn't read the pages. The file may be damaged or password-protected.",
//       );
//       setFile(null);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const clear = () => {
//     setFile(null);
//     setThumbs([]);
//     setErr("");
//   };
//   return { file, thumbs, loading, err, pick, clear };
// }

// const isPdf = (f: File) => /\.pdf$/i.test(f.name);
// const NOT_PDF = "That isn't a PDF. Choose a file ending in .pdf.";

// /* ================================================================== */
// /* 1. Organize PDF                                                     */
// /* ================================================================== */

// export function OrganizeTool({ tool }: { tool: ToolMeta }) {
//   const { file, thumbs, loading, err, pick, clear } = usePdfFile();
//   const r = useRunner();
//   const [items, setItems] = useState<PageItem[]>([]);
//   const [drag, setDrag] = useState<number | null>(null);
//   const [num, setNum] = useState<NumberingOptions>({
//     enabled: false,
//     position: "bottom-center",
//     format: "n",
//     start: 1,
//     fontSize: 12,
//   });

//   useEffect(() => {
//     setItems(thumbs.map((_, i) => ({ index: i, rotation: 0 })));
//   }, [thumbs]);

//   const move = (from: number, to: number) => {
//     if (to < 0 || to >= items.length || from === to) return;
//     const copy = [...items];
//     const [it] = copy.splice(from, 1);
//     copy.splice(to, 0, it);
//     setItems(copy);
//   };
//   const reset = () => {
//     r.reset();
//     clear();
//   };

//   if (r.status === "done" && r.result)
//     return <ResultCard result={r.result} onReset={reset} />;

//   const sub =
//     "Drag pages into a new order, rotate or remove them, and add page numbers.";

//   if (!file || loading)
//     return (
//       <Shell tool={tool} sub={sub}>
//         <Notice kind="error">{err || r.error}</Notice>
//         {loading ? (
//           <div className={`${table} flex min-h-[320px] items-center justify-center`}>
//             <Notice kind="busy">Loading page previews...</Notice>
//           </div>
//         ) : (
//           <DropZone onFile={pick} label="Drop a PDF onto the table" />
//         )}
//       </Shell>
//     );

//   return (
//     <Shell tool={tool} sub={sub}>
//       <Notice kind="error">{r.error}</Notice>
//       <Bench
//         left={
//           <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
//             {items.map((it, pos) => (
//               <li
//                 key={it.index}
//                 draggable
//                 onDragStart={() => setDrag(pos)}
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={() => {
//                   if (drag !== null) move(drag, pos);
//                   setDrag(null);
//                 }}
//                 className={`relative cursor-grab rounded-lg bg-white p-2 shadow-[0_1px_3px_rgba(15,26,46,.14)] ring-1 transition-shadow active:cursor-grabbing ${
//                   drag === pos
//                     ? "opacity-40 ring-[#2547f0]"
//                     : "ring-slate-200 hover:shadow-[0_6px_18px_rgba(15,26,46,.14)]"
//                 }`}
//               >
//                 <span className="absolute -left-2 -top-2 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0f1a2e] px-1.5 text-xs font-bold text-white">
//                   {pos + 1}
//                 </span>
//                 <div className="flex h-36 items-center justify-center overflow-hidden rounded bg-slate-50">
//                   <img
//                     src={thumbs[it.index]}
//                     alt={`Original page ${it.index + 1}`}
//                     draggable={false}
//                     className="max-h-full max-w-full object-contain transition-transform"
//                     style={{ transform: `rotate(${it.rotation}deg)` }}
//                   />
//                 </div>
//                 <div className="mt-1.5 flex items-center justify-between">
//                   <button
//                     className={tiny}
//                     disabled={pos === 0}
//                     onClick={() => move(pos, pos - 1)}
//                     title="Move earlier"
//                   >
//                     <ArrowLeft className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     className={tiny}
//                     title="Rotate 90°"
//                     onClick={() =>
//                       setItems(
//                         items.map((x, i) =>
//                           i === pos
//                             ? { ...x, rotation: (x.rotation + 90) % 360 }
//                             : x,
//                         ),
//                       )
//                     }
//                   >
//                     <RotateCw className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     className={`${tiny} hover:!bg-[#fff0f6] hover:!text-[#e11d74]`}
//                     title="Remove page"
//                     onClick={() => setItems(items.filter((_, i) => i !== pos))}
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </button>
//                   <button
//                     className={tiny}
//                     disabled={pos === items.length - 1}
//                     onClick={() => move(pos, pos + 1)}
//                     title="Move later"
//                   >
//                     <ArrowRight className="h-3.5 w-3.5" />
//                   </button>
//                 </div>
//                 {it.index !== pos && (
//                   <p className="mt-1 text-center text-[11px] text-slate-400">
//                     was page {it.index + 1}
//                   </p>
//                 )}
//               </li>
//             ))}
//             {!items.length && (
//               <li className="col-span-full py-10 text-center text-sm text-slate-500">
//                 Every page was removed. Clear and reload the file to start again.
//               </li>
//             )}
//           </ul>
//         }
//         side={
//           <>
//             <Group title="Document">
//               <p className="truncate text-sm text-slate-700">{file.name}</p>
//               <p className="text-xs text-slate-500">
//                 Keeping {items.length} of {thumbs.length} pages
//               </p>
//             </Group>
//             <Group title="Page numbers">
//               <Switch
//                 checked={num.enabled}
//                 onChange={(v) => setNum({ ...num, enabled: v })}
//                 label="Stamp a number on each page"
//               />
//               {num.enabled && (
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field label="Position">
//                     <select
//                       className={field}
//                       value={num.position}
//                       onChange={(e) =>
//                         setNum({
//                           ...num,
//                           position: e.target.value as NumberingOptions["position"],
//                         })
//                       }
//                     >
//                       {[
//                         "bottom-center",
//                         "bottom-left",
//                         "bottom-right",
//                         "top-center",
//                         "top-left",
//                         "top-right",
//                       ].map((p) => (
//                         <option key={p} value={p}>
//                           {p.replace("-", " ")}
//                         </option>
//                       ))}
//                     </select>
//                   </Field>
//                   <Field label="Style">
//                     <select
//                       className={field}
//                       value={num.format}
//                       onChange={(e) =>
//                         setNum({
//                           ...num,
//                           format: e.target.value as NumberingOptions["format"],
//                         })
//                       }
//                     >
//                       <option value="n">1, 2, 3</option>
//                       <option value="n-of-total">1 / 10</option>
//                       <option value="page-n">Page 1</option>
//                     </select>
//                   </Field>
//                   <Field label="Start at">
//                     <input
//                       type="number"
//                       min={0}
//                       className={field}
//                       value={num.start}
//                       onChange={(e) =>
//                         setNum({ ...num, start: Number(e.target.value) || 1 })
//                       }
//                     />
//                   </Field>
//                   <Field label="Size (pt)">
//                     <input
//                       type="number"
//                       min={6}
//                       max={48}
//                       className={field}
//                       value={num.fontSize}
//                       onChange={(e) =>
//                         setNum({ ...num, fontSize: Number(e.target.value) || 12 })
//                       }
//                     />
//                   </Field>
//                 </div>
//               )}
//             </Group>
//             <Actions
//               label="Save organized PDF"
//               busy={r.status === "processing"}
//               disabled={!items.length}
//               onRun={() => r.run(() => organizePdf(file, items, num))}
//               onClear={reset}
//             />
//           </>
//         }
//       />
//     </Shell>
//   );
// }

// /* ================================================================== */
// /* 2. Rotate + Crop                                                    */
// /* ================================================================== */

// export function RotateCropTool({ tool }: { tool: ToolMeta }) {
//   const { file, thumbs, loading, err, pick, clear } = usePdfFile(220);
//   const r = useRunner();
//   const [rot, setRot] = useState<Record<number, number>>({});
//   const [crop, setCrop] = useState<CropMargins>({
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0,
//   });

//   const norm = (n: number) => ((n % 360) + 360) % 360;
//   const rotateAll = (d: number) =>
//     setRot(Object.fromEntries(thumbs.map((_, i) => [i, norm((rot[i] || 0) + d)])));
//   const setSide = (k: keyof CropMargins, v: number) =>
//     setCrop({ ...crop, [k]: Math.max(0, Math.min(45, v || 0)) });
//   const reset = () => {
//     clear();
//     r.reset();
//     setRot({});
//     setCrop({ top: 0, right: 0, bottom: 0, left: 0 });
//   };

//   if (r.status === "done" && r.result)
//     return <ResultCard result={r.result} onReset={reset} />;

//   const sub =
//     "Turn pages the right way up and trim the margins. The trim applies to every page.";

//   if (!file || loading)
//     return (
//       <Shell tool={tool} sub={sub}>
//         <Notice kind="error">{err || r.error}</Notice>
//         {loading ? (
//           <div className={`${table} flex min-h-[320px] items-center justify-center`}>
//             <Notice kind="busy">Loading page previews...</Notice>
//           </div>
//         ) : (
//           <DropZone onFile={pick} label="Drop a PDF onto the table" />
//         )}
//       </Shell>
//     );

//   const Side = ({ k }: { k: keyof CropMargins }) => (
//     <div className="relative">
//       <input
//         type="number"
//         min={0}
//         max={45}
//         aria-label={`Trim ${k}`}
//         className={`${field} px-2 pr-6 text-center`}
//         value={crop[k]}
//         onChange={(e) => setSide(k, Number(e.target.value))}
//       />
//       <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
//         %
//       </span>
//     </div>
//   );

//   return (
//     <Shell tool={tool} sub={sub}>
//       <Notice kind="error">{r.error}</Notice>
//       <Bench
//         left={
//           <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
//             {thumbs.map((src, i) => (
//               <li
//                 key={i}
//                 className="rounded-lg bg-white p-2 shadow-[0_1px_3px_rgba(15,26,46,.14)] ring-1 ring-slate-200"
//               >
//                 <div className="flex h-36 items-center justify-center overflow-hidden rounded bg-slate-50">
//                   <div
//                     className="relative overflow-hidden transition-transform"
//                     style={{ transform: `rotate(${rot[i] || 0}deg)` }}
//                   >
//                     <img
//                       src={src}
//                       alt={`Page ${i + 1}`}
//                       className="block max-h-36 object-contain"
//                       draggable={false}
//                     />
//                     {/* everything outside the kept area is dimmed */}
//                     <div
//                       className="pointer-events-none absolute border border-dashed border-[#2547f0] shadow-[0_0_0_999px_rgba(15,26,46,.45)]"
//                       style={{
//                         top: `${crop.top}%`,
//                         right: `${crop.right}%`,
//                         bottom: `${crop.bottom}%`,
//                         left: `${crop.left}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-1.5 flex items-center justify-between">
//                   <span className="pl-1 text-xs font-medium text-slate-600">
//                     Page {i + 1}
//                   </span>
//                   <div className="flex">
//                     <button
//                       className={tiny}
//                       title="Rotate left"
//                       onClick={() => setRot({ ...rot, [i]: norm((rot[i] || 0) - 90) })}
//                     >
//                       <RotateCcw className="h-3.5 w-3.5" />
//                     </button>
//                     <button
//                       className={tiny}
//                       title="Rotate right"
//                       onClick={() => setRot({ ...rot, [i]: norm((rot[i] || 0) + 90) })}
//                     >
//                       <RotateCw className="h-3.5 w-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         }
//         side={
//           <>
//             <Group title="Rotate every page">
//               <div className="grid grid-cols-2 gap-2">
//                 <button className={ghost} onClick={() => rotateAll(-90)}>
//                   <RotateCcw className="h-4 w-4" /> Left
//                 </button>
//                 <button className={ghost} onClick={() => rotateAll(90)}>
//                   <RotateCw className="h-4 w-4" /> Right
//                 </button>
//               </div>
//               <p className="text-xs text-slate-500">
//                 Or use the arrows under a single page.
//               </p>
//             </Group>
//             <Group title="Trim margins">
//               <div className="grid grid-cols-[1fr_1.4fr_1fr] items-center gap-2">
//                 <span />
//                 <Side k="top" />
//                 <span />
//                 <Side k="left" />
//                 <div className="relative aspect-[3/4] rounded-md border border-slate-300 bg-slate-100">
//                   <div
//                     className="absolute border border-dashed border-[#2547f0] bg-[#eaf0ff]"
//                     style={{
//                       top: `${crop.top}%`,
//                       right: `${crop.right}%`,
//                       bottom: `${crop.bottom}%`,
//                       left: `${crop.left}%`,
//                     }}
//                   />
//                 </div>
//                 <Side k="right" />
//                 <span />
//                 <Side k="bottom" />
//                 <span />
//               </div>
//               <p className="text-xs text-slate-500">
//                 Percent of the page removed from each side (max 45).
//               </p>
//             </Group>
//             <Actions
//               label="Apply and save"
//               busy={r.status === "processing"}
//               onRun={() => r.run(() => rotateCropPdf(file, rot, crop))}
//               onClear={reset}
//             />
//           </>
//         }
//       />
//     </Shell>
//   );
// }

// /* ================================================================== */
// /* 3. Watermark + Signature                                            */
// /* ================================================================== */

// function readAsDataUrl(f: File): Promise<string> {
//   return new Promise((res, rej) => {
//     const fr = new FileReader();
//     fr.onload = () => res(String(fr.result));
//     fr.onerror = () => rej(new Error("Couldn't read that image."));
//     fr.readAsDataURL(f);
//   });
// }

// function SignaturePad({ onChange }: { onChange: (url: string) => void }) {
//   const ref = useRef<HTMLCanvasElement>(null);
//   const drawing = useRef(false);

//   const pos = (e: React.PointerEvent) => {
//     const c = ref.current!;
//     const b = c.getBoundingClientRect();
//     return {
//       x: ((e.clientX - b.left) * c.width) / b.width,
//       y: ((e.clientY - b.top) * c.height) / b.height,
//     };
//   };
//   const down = (e: React.PointerEvent) => {
//     drawing.current = true;
//     ref.current!.setPointerCapture(e.pointerId);
//     const ctx = ref.current!.getContext("2d")!;
//     const { x, y } = pos(e);
//     ctx.lineWidth = 3;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = "#0f1a2e";
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//   };
//   const move = (e: React.PointerEvent) => {
//     if (!drawing.current) return;
//     const { x, y } = pos(e);
//     const ctx = ref.current!.getContext("2d")!;
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };
//   const up = () => {
//     if (!drawing.current) return;
//     drawing.current = false;
//     onChange(ref.current!.toDataURL("image/png")); // transparent background
//   };
//   const clearPad = () => {
//     ref.current!.getContext("2d")!.clearRect(0, 0, 600, 200);
//     onChange("");
//   };

//   return (
//     <div>
//       <div className="relative">
//         <canvas
//           ref={ref}
//           width={600}
//           height={200}
//           onPointerDown={down}
//           onPointerMove={move}
//           onPointerUp={up}
//           className="h-28 w-full touch-none rounded-lg border border-slate-200 bg-white"
//         />
//         <span className="pointer-events-none absolute bottom-6 left-4 right-4 border-b border-slate-200" />
//       </div>
//       <button
//         type="button"
//         onClick={clearPad}
//         className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#e11d74]"
//       >
//         <Eraser className="h-3.5 w-3.5" /> Clear pad
//       </button>
//     </div>
//   );
// }

// export function WatermarkTool({ tool }: { tool: ToolMeta }) {
//   const [file, setFile] = useState<File | null>(null);
//   const r = useRunner();

//   const [wmAction, setWmAction] = useState<"none" | "add" | "remove">("none");
//   const [wmKind, setWmKind] = useState<"text" | "image">("text");
//   const [text, setText] = useState("CONFIDENTIAL");
//   const [fontSize, setFontSize] = useState(64);
//   const [opacity, setOpacity] = useState(0.25);
//   const [angle, setAngle] = useState(45);
//   const [color, setColor] = useState("#64748b");
//   const [wmImg, setWmImg] = useState("");
//   const [wmImgW, setWmImgW] = useState(50);

//   const [sigAction, setSigAction] = useState<
//     "none" | "add" | "replace" | "remove"
//   >("none");
//   const [sigSrc, setSigSrc] = useState<"draw" | "upload">("draw");
//   const [sigImg, setSigImg] = useState("");
//   const [sigPages, setSigPages] = useState<SignatureOptions["pages"]>("last");
//   const [sigPos, setSigPos] = useState<SignatureOptions["position"]>("bottom-right");
//   const [sigW, setSigW] = useState(25);

//   const reset = () => {
//     setFile(null);
//     r.reset();
//   };
//   if (r.status === "done" && r.result)
//     return <ResultCard result={r.result} onReset={reset} />;

//   const sub =
//     "Add, remove or replace a watermark and your signature. Removal only works on marks this tool added.";

//   if (!file)
//     return (
//       <Shell tool={tool} sub={sub}>
//         <Notice kind="error">{r.error}</Notice>
//         <DropZone
//           label="Drop a PDF onto the table"
//           onFile={(f) => (isPdf(f) ? setFile(f) : r.setError(NOT_PDF))}
//         />
//       </Shell>
//     );

//   const needsSig = sigAction === "add" || sigAction === "replace";
//   const invalid =
//     (wmAction === "none" && sigAction === "none") ||
//     (wmAction === "add" && (wmKind === "text" ? !text.trim() : !wmImg)) ||
//     (needsSig && !sigImg);

//   const go = () => {
//     const wmOptions: WatermarkOptions | undefined =
//       wmAction !== "add"
//         ? undefined
//         : wmKind === "text"
//           ? { kind: "text", text, fontSize, opacity, rotation: angle, color }
//           : { kind: "image", dataUrl: wmImg, widthPct: wmImgW, opacity, rotation: angle };
//     r.run(() =>
//       watermarkPdf(file, {
//         watermark: { action: wmAction, options: wmOptions },
//         signature: {
//           action: sigAction,
//           options: needsSig
//             ? { dataUrl: sigImg, pages: sigPages, position: sigPos, widthPct: sigW }
//             : undefined,
//         },
//       }),
//     );
//   };

//   const sigAlign =
//     sigPos === "bottom-left"
//       ? "left-[6%]"
//       : sigPos === "bottom-center"
//         ? "left-1/2 -translate-x-1/2"
//         : "right-[6%]";

//   return (
//     <Shell tool={tool} sub={sub}>
//       <Notice kind="error">{r.error}</Notice>
//       <Bench
//         left={
//           <div>
//             {/* live preview sheet (PDF rotation is counter-clockwise, CSS is clockwise) */}
//             <div className="relative mx-auto aspect-[1/1.414] w-full max-w-[360px] overflow-hidden rounded bg-white shadow-[0_10px_30px_rgba(15,26,46,.18)] ring-1 ring-slate-200">
//               <div className="space-y-2.5 p-7">
//                 <div className="h-3 w-2/5 rounded-sm bg-slate-200" />
//                 {[92, 100, 86, 97, 60, 100, 94, 78].map((w, i) => (
//                   <div
//                     key={i}
//                     className="h-1.5 rounded-sm bg-slate-100"
//                     style={{ width: `${w}%` }}
//                   />
//                 ))}
//               </div>
//               {wmAction === "add" && (
//                 <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                   {wmKind === "text" ? (
//                     <span
//                       className="whitespace-nowrap font-bold"
//                       style={{
//                         fontSize: fontSize * 0.6,
//                         color,
//                         opacity,
//                         transform: `rotate(${-angle}deg)`,
//                       }}
//                     >
//                       {text}
//                     </span>
//                   ) : (
//                     wmImg && (
//                       <img
//                         src={wmImg}
//                         alt=""
//                         style={{
//                           width: `${wmImgW}%`,
//                           opacity,
//                           transform: `rotate(${-angle}deg)`,
//                         }}
//                       />
//                     )
//                   )}
//                 </div>
//               )}
//               {needsSig && sigImg && (
//                 <img
//                   src={sigImg}
//                   alt=""
//                   className={`pointer-events-none absolute bottom-[5%] ${sigAlign}`}
//                   style={{ width: `${sigW}%` }}
//                 />
//               )}
//             </div>
//             <p className="mt-4 truncate text-center text-xs text-slate-500">
//               {file.name} - preview is approximate
//             </p>
//           </div>
//         }
//         side={
//           <>
//             <Group title="Watermark">
//               <Seg
//                 value={wmAction}
//                 onChange={setWmAction}
//                 options={[
//                   ["none", "Leave"],
//                   ["add", "Add"],
//                   ["remove", "Remove"],
//                 ]}
//               />
//               {wmAction === "add" && (
//                 <>
//                   <Seg
//                     value={wmKind}
//                     onChange={setWmKind}
//                     options={[
//                       ["text", "Text"],
//                       ["image", "Logo"],
//                     ]}
//                   />
//                   {wmKind === "text" ? (
//                     <>
//                       <Field label="Text">
//                         <input
//                           className={field}
//                           value={text}
//                           onChange={(e) => setText(e.target.value)}
//                         />
//                       </Field>
//                       <div className="grid grid-cols-[1fr_auto] items-end gap-3">
//                         <Field label={`Size: ${fontSize}`}>
//                           <input
//                             type="range"
//                             min={16}
//                             max={160}
//                             value={fontSize}
//                             onChange={(e) => setFontSize(+e.target.value)}
//                             className="w-full accent-[#2547f0]"
//                           />
//                         </Field>
//                         <input
//                           type="color"
//                           aria-label="Watermark color"
//                           value={color}
//                           onChange={(e) => setColor(e.target.value)}
//                           className="h-9 w-10 rounded-lg border border-slate-200"
//                         />
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <Field label="Image (PNG or JPG)">
//                         <input
//                           type="file"
//                           accept=".png,.jpg,.jpeg"
//                           className={field}
//                           onChange={async (e) => {
//                             const f = e.target.files?.[0];
//                             if (f) setWmImg(await readAsDataUrl(f));
//                           }}
//                         />
//                       </Field>
//                       <Field label={`Width: ${wmImgW}% of page`}>
//                         <input
//                           type="range"
//                           min={10}
//                           max={100}
//                           value={wmImgW}
//                           onChange={(e) => setWmImgW(+e.target.value)}
//                           className="w-full accent-[#2547f0]"
//                         />
//                       </Field>
//                     </>
//                   )}
//                   <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
//                     <input
//                       type="range"
//                       min={5}
//                       max={100}
//                       value={opacity * 100}
//                       onChange={(e) => setOpacity(+e.target.value / 100)}
//                       className="w-full accent-[#2547f0]"
//                     />
//                   </Field>
//                   <Field label={`Angle: ${angle}°`}>
//                     <input
//                       type="range"
//                       min={-90}
//                       max={90}
//                       value={angle}
//                       onChange={(e) => setAngle(+e.target.value)}
//                       className="w-full accent-[#2547f0]"
//                     />
//                   </Field>
//                 </>
//               )}
//             </Group>

//             <Group title="Signature">
//               <Seg
//                 value={sigAction}
//                 onChange={setSigAction}
//                 options={[
//                   ["none", "Leave"],
//                   ["add", "Add"],
//                   ["replace", "Replace"],
//                   ["remove", "Remove"],
//                 ]}
//               />
//               {needsSig && (
//                 <>
//                   <Seg
//                     value={sigSrc}
//                     onChange={(s) => {
//                       setSigSrc(s);
//                       setSigImg("");
//                     }}
//                     options={[
//                       ["draw", "Draw it"],
//                       ["upload", "Upload image"],
//                     ]}
//                   />
//                   {sigSrc === "draw" ? (
//                     <SignaturePad onChange={setSigImg} />
//                   ) : (
//                     <input
//                       type="file"
//                       accept=".png,.jpg,.jpeg"
//                       className={field}
//                       onChange={async (e) => {
//                         const f = e.target.files?.[0];
//                         if (f) setSigImg(await readAsDataUrl(f));
//                       }}
//                     />
//                   )}
//                   <div className="grid grid-cols-2 gap-3">
//                     <Field label="Pages">
//                       <select
//                         className={field}
//                         value={sigPages}
//                         onChange={(e) =>
//                           setSigPages(e.target.value as SignatureOptions["pages"])
//                         }
//                       >
//                         <option value="first">First page</option>
//                         <option value="last">Last page</option>
//                         <option value="all">All pages</option>
//                       </select>
//                     </Field>
//                     <Field label="Position">
//                       <select
//                         className={field}
//                         value={sigPos}
//                         onChange={(e) =>
//                           setSigPos(e.target.value as SignatureOptions["position"])
//                         }
//                       >
//                         <option value="bottom-right">Bottom right</option>
//                         <option value="bottom-center">Bottom center</option>
//                         <option value="bottom-left">Bottom left</option>
//                       </select>
//                     </Field>
//                   </div>
//                   <Field label={`Size: ${sigW}% of page width`}>
//                     <input
//                       type="range"
//                       min={10}
//                       max={60}
//                       value={sigW}
//                       onChange={(e) => setSigW(+e.target.value)}
//                       className="w-full accent-[#2547f0]"
//                     />
//                   </Field>
//                 </>
//               )}
//             </Group>

//             <Actions
//               label="Apply and save"
//               busy={r.status === "processing"}
//               disabled={invalid}
//               onRun={go}
//               onClear={reset}
//             />
//           </>
//         }
//       />
//     </Shell>
//   );
// }

// /* ================================================================== */
// /* 4. Protect PDF                                                      */
// /* ================================================================== */

// export function ProtectTool({ tool }: { tool: ToolMeta }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [pw, setPw] = useState("");
//   const [pw2, setPw2] = useState("");
//   const [allowPrint, setPrint] = useState(true);
//   const [allowCopy, setCopy] = useState(false);
//   const [allowModify, setModify] = useState(false);
//   const r = useRunner();

//   const reset = () => {
//     setFile(null);
//     setPw("");
//     setPw2("");
//     r.reset();
//   };
//   if (r.status === "done" && r.result)
//     return <ResultCard result={r.result} onReset={reset} />;

//   const sub =
//     "Lock a PDF with a password. Only people who know it can open the file.";

//   if (!file)
//     return (
//       <Shell tool={tool} sub={sub}>
//         <Notice kind="error">{r.error}</Notice>
//         <DropZone
//           label="Drop the PDF you want to lock"
//           onFile={(f) => (isPdf(f) ? setFile(f) : r.setError(NOT_PDF))}
//         />
//       </Shell>
//     );

//   const mismatch = pw2.length > 0 && pw !== pw2;
//   const score = Math.min(
//     4,
//     (pw.length >= 8 ? 1 : 0) +
//       (pw.length >= 12 ? 1 : 0) +
//       (/[A-Z]/.test(pw) && /[a-z]/.test(pw) ? 1 : 0) +
//       (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw) ? 1 : 0),
//   );
//   const strength = ["Too short", "Weak", "Fair", "Good", "Strong"][pw ? score : 0];

//   const perms: [string, boolean][] = [
//     ["Printing", allowPrint],
//     ["Copying text", allowCopy],
//     ["Editing", allowModify],
//   ];

//   return (
//     <Shell tool={tool} sub={sub}>
//       <Notice kind="error">{r.error}</Notice>
//       <Bench
//         left={
//           <div className="mx-auto flex max-w-sm flex-col items-center py-6 text-center">
//             <span className="flex h-24 w-20 items-center justify-center rounded-md bg-white shadow-[0_10px_30px_rgba(15,26,46,.18)] ring-1 ring-slate-200">
//               <Lock className="h-8 w-8 text-[#2547f0]" />
//             </span>
//             <p className="mt-5 max-w-full truncate text-sm font-semibold text-[#0f1a2e]">
//               {file.name}
//             </p>
//             <p className="mt-0.5 text-xs text-slate-500">{fmt(file.size)}</p>
//             <ul className="mt-6 flex flex-wrap justify-center gap-2">
//               {perms.map(([l, on]) => (
//                 <li
//                   key={l}
//                   className={`rounded-full px-3 py-1 text-xs font-medium ${
//                     on
//                       ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
//                       : "bg-white text-slate-500 ring-1 ring-slate-200 line-through"
//                   }`}
//                 >
//                   {l}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         }
//         side={
//           <>
//             <Group title="Password">
//               <Field label="Password">
//                 <input
//                   type="password"
//                   autoComplete="new-password"
//                   className={field}
//                   value={pw}
//                   onChange={(e) => setPw(e.target.value)}
//                 />
//               </Field>
//               <div>
//                 <div className="flex gap-1">
//                   {[1, 2, 3, 4].map((n) => (
//                     <span
//                       key={n}
//                       className={`h-1 flex-1 rounded-full ${
//                         pw && score >= n
//                           ? score >= 3
//                             ? "bg-emerald-500"
//                             : "bg-amber-400"
//                           : "bg-slate-200"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <p className="mt-1 text-xs text-slate-500">{strength}</p>
//               </div>
//               <Field label="Confirm password">
//                 <input
//                   type="password"
//                   autoComplete="new-password"
//                   className={field}
//                   value={pw2}
//                   onChange={(e) => setPw2(e.target.value)}
//                 />
//               </Field>
//               {mismatch && (
//                 <p className="text-xs text-[#e11d74]">The passwords don't match.</p>
//               )}
//             </Group>
//             <Group title="What others can do after opening">
//               <Switch checked={allowPrint} onChange={setPrint} label="Print" />
//               <Switch checked={allowCopy} onChange={setCopy} label="Copy text" />
//               <Switch checked={allowModify} onChange={setModify} label="Edit" />
//               <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
//                 <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
//                 AES-256 encryption. If you forget the password, the file can't be
//                 recovered.
//               </p>
//             </Group>
//             {r.status === "processing" && <Notice kind="busy">Encrypting...</Notice>}
//             <Actions
//               label="Lock PDF"
//               busy={r.status === "processing"}
//               disabled={!pw || mismatch || pw !== pw2}
//               onRun={() =>
//                 r.run(() =>
//                   protectPdf(file, { userPassword: pw, allowPrint, allowCopy, allowModify }),
//                 )
//               }
//               onClear={reset}
//             />
//           </>
//         }
//       />
//     </Shell>
//   );
// }

// /* ================================================================== */
// /* 5. Metadata viewer / editor                                         */
// /* ================================================================== */

// type Editable = "title" | "author" | "subject" | "keywords" | "creator" | "producer";
// const EMPTY_FORM: Record<Editable, string> = {
//   title: "",
//   author: "",
//   subject: "",
//   keywords: "",
//   creator: "",
//   producer: "",
// };

// export function MetadataTool({ tool }: { tool: ToolMeta }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [meta, setMeta] = useState<PdfMetadata | null>(null);
//   const [form, setForm] = useState<Record<Editable, string>>(EMPTY_FORM);
//   const [err, setErr] = useState("");
//   const r = useRunner();

//   const pick = async (f: File) => {
//     if (!isPdf(f)) return setErr(NOT_PDF);
//     try {
//       const m = await readMetadata(f);
//       setFile(f);
//       setMeta(m);
//       setErr("");
//       setForm({
//         title: m.title,
//         author: m.author,
//         subject: m.subject,
//         keywords: m.keywords,
//         creator: m.creator,
//         producer: m.producer,
//       });
//     } catch {
//       setErr("Couldn't read this file's metadata. It may be damaged.");
//     }
//   };
//   const reset = () => {
//     setFile(null);
//     setMeta(null);
//     setErr("");
//     r.reset();
//   };
//   if (r.status === "done" && r.result)
//     return <ResultCard result={r.result} onReset={reset} />;

//   const sub =
//     "See what's hidden inside a PDF, then edit it or wipe it before you share the file.";

//   if (!file || !meta)
//     return (
//       <Shell tool={tool} sub={sub}>
//         <Notice kind="error">{err || r.error}</Notice>
//         <DropZone onFile={pick} label="Drop a PDF to inspect it" />
//       </Shell>
//     );

//   const rows: [string, string][] = [
//     ["File", file.name],
//     ["Size", fmt(file.size)],
//     ["Pages", String(meta.pageCount)],
//     ["Encrypted", meta.encrypted ? "Yes" : "No"],
//     ["Created", meta.creationDate || "Not set"],
//     ["Last modified", meta.modificationDate || "Not set"],
//   ];

//   return (
//     <Shell tool={tool} sub={sub}>
//       <Notice kind="error">{r.error}</Notice>
//       <Bench
//         left={
//           <div className="mx-auto max-w-md rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(15,26,46,.14)] ring-1 ring-slate-200">
//             <dl className="divide-y divide-slate-100">
//               {rows.map(([k, v]) => (
//                 <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
//                   <dt className="text-xs text-slate-500">{k}</dt>
//                   <dd className="min-w-0 truncate text-right text-sm font-medium text-[#0f1a2e]">
//                     {v}
//                   </dd>
//                 </div>
//               ))}
//             </dl>
//           </div>
//         }
//         side={
//           <>
//             <Group title="Edit fields">
//               {(Object.keys(form) as Editable[]).map((k) => (
//                 <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
//                   <input
//                     className={field}
//                     value={form[k]}
//                     onChange={(e) => setForm({ ...form, [k]: e.target.value })}
//                   />
//                 </Field>
//               ))}
//               <button
//                 type="button"
//                 onClick={() => setForm(EMPTY_FORM)}
//                 className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#e11d74]"
//               >
//                 <Eraser className="h-3.5 w-3.5" /> Empty all fields
//               </button>
//             </Group>
//             {r.status === "processing" && <Notice kind="busy">Saving...</Notice>}
//             <Actions
//               label="Save metadata"
//               busy={r.status === "processing"}
//               onRun={() => r.run(() => writeMetadata(file, form))}
//               onClear={reset}
//             />
//           </>
//         }
//       />
//     </Shell>
//   );
// }







"use client";

/**
 * PdfExtraTools.tsx  (redesign)
 * Design idea: a print-shop "proofing table".
 *  - Left: the light table (dotted grid + crop marks) where pages / previews live.
 *  - Right: a sticky inspector with all settings and the main action.
 * Logic and exports are unchanged from the previous version, except
 * WatermarkTool which now shows a live preview of the real PDF page.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Eraser,
  FileText,
  Loader2,
  Lock,
  RotateCcw,
  RotateCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type { ToolMeta } from "@/features/tools/client-processors";

import {
  organizePdf,
  protectPdf,
  readMetadata,
  renderThumbs,
  rotateCropPdf,
  watermarkPdf,
  writeMetadata,
  type CropMargins,
  type NumberingOptions,
  type PageItem,
  type PdfMetadata,
  type ProcessResult,
  type SignatureOptions,
  type WatermarkOptions,
} from "./pdf_extra_processors";

/* ================================================================== */
/* Tokens + shared pieces                                              */
/* ================================================================== */

// ink #0f1a2e | cobalt #2547f0 | wash #eaf0ff | spot magenta #e11d74 | table #f3f6fb
type Status = "idle" | "processing" | "done" | "error";

const fmt = (b: number) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(2)} MB`;

const table =
  "relative rounded-2xl border border-slate-200 bg-[#f3f6fb] bg-[radial-gradient(#c9d3e4_1px,transparent_1px)] [background-size:16px_16px] p-5";
const field =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-[#2547f0] focus:ring-2 focus:ring-[#2547f0]/15";
const primary =
  "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f1a2e] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2547f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2547f0] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#0f1a2e]";
const ghost =
  "flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#2547f0] hover:text-[#2547f0]";
const tiny =
  "flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[#eaf0ff] hover:text-[#2547f0] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500";

function useRunner() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<
    (ProcessResult & { url: string; size: number }) | null
  >(null);

  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result],
  );

  const run = async (fn: () => Promise<ProcessResult>) => {
    setStatus("processing");
    setError("");
    try {
      const r = await fn();
      setResult({ ...r, url: URL.createObjectURL(r.blob), size: r.blob.size });
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed");
      setStatus("error");
    }
  };
  const reset = () => {
    setResult(null);
    setStatus("idle");
    setError("");
  };
  return { status, error, result, run, reset, setError };
}

/** Prepress crop marks in the four corners of a positioned parent */
function Marks() {
  const c = "absolute h-3 w-3 border-slate-400";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-2">
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}

function Shell({
  tool,
  sub,
  children,
}: {
  tool: ToolMeta;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#0f1a2e]">
            {tool.name}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{sub}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Runs in your browser. Nothing is uploaded.
        </span>
      </div>
      {children}
    </div>
  );
}

/** Light table (left) + inspector (right) */
function Bench({ left, side }: { left: ReactNode; side: ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className={table}>
        <Marks />
        <div className="relative">{left}</div>
      </div>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6">
        {side}
      </aside>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-slate-100 pb-4 pt-4 first:pt-0 last:border-0">
      <h4 className="mb-3 text-sm font-semibold text-[#0f1a2e]">{title}</h4>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block text-xs font-medium text-slate-600">
    <span className="mb-1 block">{label}</span>
    {children}
  </label>
);

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div
      className="grid rounded-xl bg-slate-100 p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
            value === v
              ? "bg-white text-[#2547f0] shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-0.5 text-sm text-slate-700"
    >
      <span>{label}</span>
      <span
        className={`h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${
          checked ? "bg-[#2547f0]" : "bg-slate-300"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
    </button>
  );
}

function DropZone({
  onFile,
  label,
  hint = "PDF files only",
}: {
  onFile: (f: File) => void;
  label: string;
  hint?: string;
}) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={`${table} flex min-h-[320px] cursor-pointer flex-col items-center justify-center text-center transition-colors ${
        over ? "border-[#2547f0] bg-[#eaf0ff]" : "hover:border-[#2547f0]"
      }`}
    >
      <Marks />
      <span className="flex h-16 w-12 items-center justify-center rounded-md border border-slate-300 bg-white shadow-sm">
        <Upload className="h-5 w-5 text-[#2547f0]" />
      </span>
      <span className="mt-5 text-base font-semibold text-[#0f1a2e]">{label}</span>
      <span className="mt-1 text-sm text-slate-500">
        or <span className="font-medium text-[#2547f0] underline">browse</span>{" "}
        from your device
      </span>
      <span className="mt-4 text-xs text-slate-400">{hint}</span>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function Notice({
  kind,
  children,
}: {
  kind: "busy" | "error";
  children: ReactNode;
}) {
  if (!children) return null;
  const busy = kind === "busy";
  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        busy
          ? "border-[#2547f0]/20 bg-[#eaf0ff] text-[#2547f0]"
          : "border-[#e11d74]/25 bg-[#fff0f6] text-[#b0135a]"
      }`}
    >
      {busy ? (
        <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <X className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}

function Actions({
  onRun,
  onClear,
  disabled,
  busy,
  label,
}: {
  onRun: () => void;
  onClear: () => void;
  disabled?: boolean;
  busy: boolean;
  label: string;
}) {
  return (
    <div className="mt-5 space-y-2">
      <button
        type="button"
        onClick={onRun}
        disabled={disabled || busy}
        className={primary}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Working...
          </>
        ) : (
          label
        )}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-[#e11d74]"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Start over with another file
      </button>
    </div>
  );
}

function ResultCard({
  result,
  onReset,
}: {
  result: ProcessResult & { url: string; size: number };
  onReset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-3xl bg-[#0f1a2e] p-6 text-white sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-[#0f1a2e]">
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
        <h2 className="text-xl font-bold tracking-tight">Your PDF is ready</h2>
      </div>
      {result.note && (
        <p className="mt-3 text-sm leading-6 text-slate-300">{result.note}</p>
      )}
      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/10 p-4">
        <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md bg-white">
          <FileText className="h-5 w-5 text-[#e11d74]" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{result.filename}</p>
          <p className="mt-0.5 text-xs text-slate-300">{fmt(result.size)}</p>
        </div>
      </div>
      <a
        href={result.url}
        download={result.filename}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#0f1a2e] transition-colors hover:bg-[#eaf0ff]"
      >
        <Download className="h-5 w-5" /> Download PDF
      </a>
      <button
        onClick={onReset}
        className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-slate-300 hover:text-white"
      >
        <RotateCcw className="h-4 w-4" /> Process another file
      </button>
    </div>
  );
}

/** File load + thumbnails, reused by page-based tools */
function usePdfFile(width = 180) {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (f: File) => {
    if (!/\.pdf$/i.test(f.name)) {
      setErr("That isn't a PDF. Choose a file ending in .pdf.");
      return;
    }
    setErr("");
    setFile(f);
    setLoading(true);
    try {
      setThumbs(await renderThumbs(f, width));
    } catch {
      setErr(
        "Couldn't read the pages. The file may be damaged or password-protected.",
      );
      setFile(null);
    } finally {
      setLoading(false);
    }
  };
  const clear = () => {
    setFile(null);
    setThumbs([]);
    setErr("");
  };
  return { file, thumbs, loading, err, pick, clear };
}

const isPdf = (f: File) => /\.pdf$/i.test(f.name);
const NOT_PDF = "That isn't a PDF. Choose a file ending in .pdf.";

/* ================================================================== */
/* 1. Organize PDF                                                     */
/* ================================================================== */

export function OrganizeTool({ tool }: { tool: ToolMeta }) {
  const { file, thumbs, loading, err, pick, clear } = usePdfFile();
  const r = useRunner();
  const [items, setItems] = useState<PageItem[]>([]);
  const [drag, setDrag] = useState<number | null>(null);
  const [num, setNum] = useState<NumberingOptions>({
    enabled: false,
    position: "bottom-center",
    format: "n",
    start: 1,
    fontSize: 12,
  });

  useEffect(() => {
    setItems(thumbs.map((_, i) => ({ index: i, rotation: 0 })));
  }, [thumbs]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const copy = [...items];
    const [it] = copy.splice(from, 1);
    copy.splice(to, 0, it);
    setItems(copy);
  };
  const reset = () => {
    r.reset();
    clear();
  };

  if (r.status === "done" && r.result)
    return <ResultCard result={r.result} onReset={reset} />;

  const sub =
    "Drag pages into a new order, rotate or remove them, and add page numbers.";

  if (!file || loading)
    return (
      <Shell tool={tool} sub={sub}>
        <Notice kind="error">{err || r.error}</Notice>
        {loading ? (
          <div className={`${table} flex min-h-[320px] items-center justify-center`}>
            <Notice kind="busy">Loading page previews...</Notice>
          </div>
        ) : (
          <DropZone onFile={pick} label="Drop a PDF onto the table" />
        )}
      </Shell>
    );

  return (
    <Shell tool={tool} sub={sub}>
      <Notice kind="error">{r.error}</Notice>
      <Bench
        left={
          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((it, pos) => (
              <li
                key={it.index}
                draggable
                onDragStart={() => setDrag(pos)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (drag !== null) move(drag, pos);
                  setDrag(null);
                }}
                className={`relative cursor-grab rounded-lg bg-white p-2 shadow-[0_1px_3px_rgba(15,26,46,.14)] ring-1 transition-shadow active:cursor-grabbing ${
                  drag === pos
                    ? "opacity-40 ring-[#2547f0]"
                    : "ring-slate-200 hover:shadow-[0_6px_18px_rgba(15,26,46,.14)]"
                }`}
              >
                <span className="absolute -left-2 -top-2 z-10 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0f1a2e] px-1.5 text-xs font-bold text-white">
                  {pos + 1}
                </span>
                <div className="flex h-36 items-center justify-center overflow-hidden rounded bg-slate-50">
                  <img
                    src={thumbs[it.index]}
                    alt={`Original page ${it.index + 1}`}
                    draggable={false}
                    className="max-h-full max-w-full object-contain transition-transform"
                    style={{ transform: `rotate(${it.rotation}deg)` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <button
                    className={tiny}
                    disabled={pos === 0}
                    onClick={() => move(pos, pos - 1)}
                    title="Move earlier"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className={tiny}
                    title="Rotate 90°"
                    onClick={() =>
                      setItems(
                        items.map((x, i) =>
                          i === pos
                            ? { ...x, rotation: (x.rotation + 90) % 360 }
                            : x,
                        ),
                      )
                    }
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className={`${tiny} hover:!bg-[#fff0f6] hover:!text-[#e11d74]`}
                    title="Remove page"
                    onClick={() => setItems(items.filter((_, i) => i !== pos))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className={tiny}
                    disabled={pos === items.length - 1}
                    onClick={() => move(pos, pos + 1)}
                    title="Move later"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {it.index !== pos && (
                  <p className="mt-1 text-center text-[11px] text-slate-400">
                    was page {it.index + 1}
                  </p>
                )}
              </li>
            ))}
            {!items.length && (
              <li className="col-span-full py-10 text-center text-sm text-slate-500">
                Every page was removed. Clear and reload the file to start again.
              </li>
            )}
          </ul>
        }
        side={
          <>
            <Group title="Document">
              <p className="truncate text-sm text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-500">
                Keeping {items.length} of {thumbs.length} pages
              </p>
            </Group>
            <Group title="Page numbers">
              <Switch
                checked={num.enabled}
                onChange={(v) => setNum({ ...num, enabled: v })}
                label="Stamp a number on each page"
              />
              {num.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Position">
                    <select
                      className={field}
                      value={num.position}
                      onChange={(e) =>
                        setNum({
                          ...num,
                          position: e.target.value as NumberingOptions["position"],
                        })
                      }
                    >
                      {[
                        "bottom-center",
                        "bottom-left",
                        "bottom-right",
                        "top-center",
                        "top-left",
                        "top-right",
                      ].map((p) => (
                        <option key={p} value={p}>
                          {p.replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Style">
                    <select
                      className={field}
                      value={num.format}
                      onChange={(e) =>
                        setNum({
                          ...num,
                          format: e.target.value as NumberingOptions["format"],
                        })
                      }
                    >
                      <option value="n">1, 2, 3</option>
                      <option value="n-of-total">1 / 10</option>
                      <option value="page-n">Page 1</option>
                    </select>
                  </Field>
                  <Field label="Start at">
                    <input
                      type="number"
                      min={0}
                      className={field}
                      value={num.start}
                      onChange={(e) =>
                        setNum({ ...num, start: Number(e.target.value) || 1 })
                      }
                    />
                  </Field>
                  <Field label="Size (pt)">
                    <input
                      type="number"
                      min={6}
                      max={48}
                      className={field}
                      value={num.fontSize}
                      onChange={(e) =>
                        setNum({ ...num, fontSize: Number(e.target.value) || 12 })
                      }
                    />
                  </Field>
                </div>
              )}
            </Group>
            <Actions
              label="Save organized PDF"
              busy={r.status === "processing"}
              disabled={!items.length}
              onRun={() => r.run(() => organizePdf(file, items, num))}
              onClear={reset}
            />
          </>
        }
      />
    </Shell>
  );
}

/* ================================================================== */
/* 2. Rotate + Crop                                                    */
/* ================================================================== */

export function RotateCropTool({ tool }: { tool: ToolMeta }) {
  const { file, thumbs, loading, err, pick, clear } = usePdfFile(220);
  const r = useRunner();
  const [rot, setRot] = useState<Record<number, number>>({});
  const [crop, setCrop] = useState<CropMargins>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const norm = (n: number) => ((n % 360) + 360) % 360;
  const rotateAll = (d: number) =>
    setRot(Object.fromEntries(thumbs.map((_, i) => [i, norm((rot[i] || 0) + d)])));
  const setSide = (k: keyof CropMargins, v: number) =>
    setCrop({ ...crop, [k]: Math.max(0, Math.min(45, v || 0)) });
  const reset = () => {
    clear();
    r.reset();
    setRot({});
    setCrop({ top: 0, right: 0, bottom: 0, left: 0 });
  };

  if (r.status === "done" && r.result)
    return <ResultCard result={r.result} onReset={reset} />;

  const sub =
    "Turn pages the right way up and trim the margins. The trim applies to every page.";

  if (!file || loading)
    return (
      <Shell tool={tool} sub={sub}>
        <Notice kind="error">{err || r.error}</Notice>
        {loading ? (
          <div className={`${table} flex min-h-[320px] items-center justify-center`}>
            <Notice kind="busy">Loading page previews...</Notice>
          </div>
        ) : (
          <DropZone onFile={pick} label="Drop a PDF onto the table" />
        )}
      </Shell>
    );

  const Side = ({ k }: { k: keyof CropMargins }) => (
    <div className="relative">
      <input
        type="number"
        min={0}
        max={45}
        aria-label={`Trim ${k}`}
        className={`${field} px-2 pr-6 text-center`}
        value={crop[k]}
        onChange={(e) => setSide(k, Number(e.target.value))}
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
        %
      </span>
    </div>
  );

  return (
    <Shell tool={tool} sub={sub}>
      <Notice kind="error">{r.error}</Notice>
      <Bench
        left={
          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
            {thumbs.map((src, i) => (
              <li
                key={i}
                className="rounded-lg bg-white p-2 shadow-[0_1px_3px_rgba(15,26,46,.14)] ring-1 ring-slate-200"
              >
                <div className="flex h-36 items-center justify-center overflow-hidden rounded bg-slate-50">
                  <div
                    className="relative overflow-hidden transition-transform"
                    style={{ transform: `rotate(${rot[i] || 0}deg)` }}
                  >
                    <img
                      src={src}
                      alt={`Page ${i + 1}`}
                      className="block max-h-36 object-contain"
                      draggable={false}
                    />
                    {/* everything outside the kept area is dimmed */}
                    <div
                      className="pointer-events-none absolute border border-dashed border-[#2547f0] shadow-[0_0_0_999px_rgba(15,26,46,.45)]"
                      style={{
                        top: `${crop.top}%`,
                        right: `${crop.right}%`,
                        bottom: `${crop.bottom}%`,
                        left: `${crop.left}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="pl-1 text-xs font-medium text-slate-600">
                    Page {i + 1}
                  </span>
                  <div className="flex">
                    <button
                      className={tiny}
                      title="Rotate left"
                      onClick={() => setRot({ ...rot, [i]: norm((rot[i] || 0) - 90) })}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className={tiny}
                      title="Rotate right"
                      onClick={() => setRot({ ...rot, [i]: norm((rot[i] || 0) + 90) })}
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        }
        side={
          <>
            <Group title="Rotate every page">
              <div className="grid grid-cols-2 gap-2">
                <button className={ghost} onClick={() => rotateAll(-90)}>
                  <RotateCcw className="h-4 w-4" /> Left
                </button>
                <button className={ghost} onClick={() => rotateAll(90)}>
                  <RotateCw className="h-4 w-4" /> Right
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Or use the arrows under a single page.
              </p>
            </Group>
            <Group title="Trim margins">
              <div className="grid grid-cols-[1fr_1.4fr_1fr] items-center gap-2">
                <span />
                <Side k="top" />
                <span />
                <Side k="left" />
                <div className="relative aspect-[3/4] rounded-md border border-slate-300 bg-slate-100">
                  <div
                    className="absolute border border-dashed border-[#2547f0] bg-[#eaf0ff]"
                    style={{
                      top: `${crop.top}%`,
                      right: `${crop.right}%`,
                      bottom: `${crop.bottom}%`,
                      left: `${crop.left}%`,
                    }}
                  />
                </div>
                <Side k="right" />
                <span />
                <Side k="bottom" />
                <span />
              </div>
              <p className="text-xs text-slate-500">
                Percent of the page removed from each side (max 45).
              </p>
            </Group>
            <Actions
              label="Apply and save"
              busy={r.status === "processing"}
              onRun={() => r.run(() => rotateCropPdf(file, rot, crop))}
              onClear={reset}
            />
          </>
        }
      />
    </Shell>
  );
}

/* ================================================================== */
/* 3. Watermark + Signature  (live preview of the real PDF page)       */
/* ================================================================== */

function readAsDataUrl(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(new Error("Couldn't read that image."));
    fr.readAsDataURL(f);
  });
}

function SignaturePad({ onChange }: { onChange: (url: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const pos = (e: React.PointerEvent) => {
    const c = ref.current!;
    const b = c.getBoundingClientRect();
    return {
      x: ((e.clientX - b.left) * c.width) / b.width,
      y: ((e.clientY - b.top) * c.height) / b.height,
    };
  };
  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    ref.current!.setPointerCapture(e.pointerId);
    const ctx = ref.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f1a2e";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const { x, y } = pos(e);
    const ctx = ref.current!.getContext("2d")!;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(ref.current!.toDataURL("image/png")); // transparent background
  };
  const clearPad = () => {
    ref.current!.getContext("2d")!.clearRect(0, 0, 600, 200);
    onChange("");
  };

  return (
    <div>
      <div className="relative">
        <canvas
          ref={ref}
          width={600}
          height={200}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          className="h-28 w-full touch-none rounded-lg border border-slate-200 bg-white"
        />
        <span className="pointer-events-none absolute bottom-6 left-4 right-4 border-b border-slate-200" />
      </div>
      <button
        type="button"
        onClick={clearPad}
        className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#e11d74]"
      >
        <Eraser className="h-3.5 w-3.5" /> Clear pad
      </button>
    </div>
  );
}

export function WatermarkTool({ tool }: { tool: ToolMeta }) {
  // 700px wide page images: preview ke liye kaafi sharp, memory bhi theek
  const { file, thumbs, loading, err, pick, clear } = usePdfFile(700);
  const r = useRunner();
  const [page, setPage] = useState(0);

  const [wmAction, setWmAction] = useState<"none" | "add" | "remove">("none");
  const [wmKind, setWmKind] = useState<"text" | "image">("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(64);
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(45);
  const [color, setColor] = useState("#64748b");
  const [wmImg, setWmImg] = useState("");
  const [wmImgW, setWmImgW] = useState(50);

  const [sigAction, setSigAction] = useState<
    "none" | "add" | "replace" | "remove"
  >("none");
  const [sigSrc, setSigSrc] = useState<"draw" | "upload">("draw");
  const [sigImg, setSigImg] = useState("");
  const [sigPages, setSigPages] = useState<SignatureOptions["pages"]>("last");
  const [sigPos, setSigPos] = useState<SignatureOptions["position"]>("bottom-right");
  const [sigW, setSigW] = useState(25);

  // nayi file aaye to page 1 se shuru
  useEffect(() => {
    setPage(0);
  }, [file]);

  const reset = () => {
    clear();
    r.reset();
    setPage(0);
  };
  if (r.status === "done" && r.result)
    return <ResultCard result={r.result} onReset={reset} />;

  const sub =
    "Add, remove or replace a watermark and your signature. Removal only works on marks this tool added.";

  if (!file || loading)
    return (
      <Shell tool={tool} sub={sub}>
        <Notice kind="error">{err || r.error}</Notice>
        {loading ? (
          <div className={`${table} flex min-h-[320px] items-center justify-center`}>
            <Notice kind="busy">Loading page previews...</Notice>
          </div>
        ) : (
          <DropZone onFile={pick} label="Drop a PDF onto the table" />
        )}
      </Shell>
    );

  const needsSig = sigAction === "add" || sigAction === "replace";
  const invalid =
    (wmAction === "none" && sigAction === "none") ||
    (wmAction === "add" && (wmKind === "text" ? !text.trim() : !wmImg)) ||
    (needsSig && !sigImg);

  const go = () => {
    const wmOptions: WatermarkOptions | undefined =
      wmAction !== "add"
        ? undefined
        : wmKind === "text"
          ? { kind: "text", text, fontSize, opacity, rotation: angle, color }
          : { kind: "image", dataUrl: wmImg, widthPct: wmImgW, opacity, rotation: angle };
    r.run(() =>
      watermarkPdf(file, {
        watermark: { action: wmAction, options: wmOptions },
        signature: {
          action: sigAction,
          options: needsSig
            ? { dataUrl: sigImg, pages: sigPages, position: sigPos, widthPct: sigW }
            : undefined,
        },
      }),
    );
  };

  const total = thumbs.length;
  const sigOnThisPage =
    sigPages === "all" ||
    (sigPages === "first" && page === 0) ||
    (sigPages === "last" && page === total - 1);

  const sigAlign =
    sigPos === "bottom-left"
      ? "left-[6%]"
      : sigPos === "bottom-center"
        ? "left-1/2 -translate-x-1/2"
        : "right-[6%]";

  // PDF points ko preview ke barabar scale karne ke liye: A4 width ~595pt ko 100% maan kar
  // `cqw` (container width unit) use hota hai, isliye preview kisi bhi size par same dikhta hai.
  const PAGE_PT = 595;

  return (
    <Shell tool={tool} sub={sub}>
      <Notice kind="error">{r.error}</Notice>
      <Bench
        left={
          <div>
            {/* ---- live preview of the real page ---- */}
            <div
              className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded bg-white shadow-[0_10px_30px_rgba(15,26,46,.18)] ring-1 ring-slate-200"
              style={{ containerType: "inline-size" }}
            >
              <img
                src={thumbs[page]}
                alt={`Page ${page + 1} of ${file.name}`}
                draggable={false}
                className="block w-full select-none"
              />

              {wmAction === "add" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {wmKind === "text" ? (
                    <span
                      className="whitespace-nowrap font-bold"
                      style={{
                        fontSize: `${(fontSize / PAGE_PT) * 100}cqw`,
                        lineHeight: 1,
                        color,
                        opacity,
                        // PDF rotation counter-clockwise hoti hai, CSS clockwise
                        transform: `rotate(${-angle}deg)`,
                      }}
                    >
                      {text}
                    </span>
                  ) : (
                    wmImg && (
                      <img
                        src={wmImg}
                        alt=""
                        style={{
                          width: `${wmImgW}%`,
                          opacity,
                          transform: `rotate(${-angle}deg)`,
                        }}
                      />
                    )
                  )}
                </div>
              )}

              {needsSig && sigImg && sigOnThisPage && (
                <img
                  src={sigImg}
                  alt=""
                  className={`pointer-events-none absolute bottom-[5%] ${sigAlign}`}
                  style={{ width: `${sigW}%` }}
                />
              )}
            </div>

            {/* ---- notes for remove / replace ---- */}
            <div className="mx-auto mt-3 flex max-w-[420px] flex-wrap justify-center gap-2">
              {wmAction === "remove" && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#b0135a] ring-1 ring-[#e11d74]/25">
                  Watermark added by this tool will be removed on save
                </span>
              )}
              {(sigAction === "remove" || sigAction === "replace") && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#b0135a] ring-1 ring-[#e11d74]/25">
                  {sigAction === "remove"
                    ? "Signature added by this tool will be removed on save"
                    : "Old signature from this tool is replaced on save"}
                </span>
              )}
              {needsSig && sigImg && !sigOnThisPage && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  Signature is not on this page
                </span>
              )}
            </div>

            {/* ---- page switcher ---- */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                className={tiny}
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                title="Previous page"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-slate-600">
                Page {page + 1} of {total}
              </span>
              <button
                type="button"
                className={tiny}
                disabled={page >= total - 1}
                onClick={() => setPage(page + 1)}
                title="Next page"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 truncate text-center text-xs text-slate-500">
              {file.name} - font size and position may differ slightly from the saved file
            </p>
          </div>
        }
        side={
          <>
            <Group title="Watermark">
              <Seg
                value={wmAction}
                onChange={setWmAction}
                options={[
                  ["none", "Leave"],
                  ["add", "Add"],
                  ["remove", "Remove"],
                ]}
              />
              {wmAction === "add" && (
                <>
                  <Seg
                    value={wmKind}
                    onChange={setWmKind}
                    options={[
                      ["text", "Text"],
                      ["image", "Logo"],
                    ]}
                  />
                  {wmKind === "text" ? (
                    <>
                      <Field label="Text">
                        <input
                          className={field}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </Field>
                      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                        <Field label={`Size: ${fontSize}`}>
                          <input
                            type="range"
                            min={16}
                            max={160}
                            value={fontSize}
                            onChange={(e) => setFontSize(+e.target.value)}
                            className="w-full accent-[#2547f0]"
                          />
                        </Field>
                        <input
                          type="color"
                          aria-label="Watermark color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="h-9 w-10 rounded-lg border border-slate-200"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Field label="Image (PNG or JPG)">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className={field}
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) setWmImg(await readAsDataUrl(f));
                          }}
                        />
                      </Field>
                      <Field label={`Width: ${wmImgW}% of page`}>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={wmImgW}
                          onChange={(e) => setWmImgW(+e.target.value)}
                          className="w-full accent-[#2547f0]"
                        />
                      </Field>
                    </>
                  )}
                  <Field label={`Opacity: ${Math.round(opacity * 100)}%`}>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={opacity * 100}
                      onChange={(e) => setOpacity(+e.target.value / 100)}
                      className="w-full accent-[#2547f0]"
                    />
                  </Field>
                  <Field label={`Angle: ${angle}°`}>
                    <input
                      type="range"
                      min={-90}
                      max={90}
                      value={angle}
                      onChange={(e) => setAngle(+e.target.value)}
                      className="w-full accent-[#2547f0]"
                    />
                  </Field>
                </>
              )}
            </Group>

            <Group title="Signature">
              <Seg
                value={sigAction}
                onChange={setSigAction}
                options={[
                  ["none", "Leave"],
                  ["add", "Add"],
                  ["replace", "Replace"],
                  ["remove", "Remove"],
                ]}
              />
              {needsSig && (
                <>
                  <Seg
                    value={sigSrc}
                    onChange={(s) => {
                      setSigSrc(s);
                      setSigImg("");
                    }}
                    options={[
                      ["draw", "Draw it"],
                      ["upload", "Upload image"],
                    ]}
                  />
                  {sigSrc === "draw" ? (
                    <SignaturePad onChange={setSigImg} />
                  ) : (
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className={field}
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) setSigImg(await readAsDataUrl(f));
                      }}
                    />
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pages">
                      <select
                        className={field}
                        value={sigPages}
                        onChange={(e) =>
                          setSigPages(e.target.value as SignatureOptions["pages"])
                        }
                      >
                        <option value="first">First page</option>
                        <option value="last">Last page</option>
                        <option value="all">All pages</option>
                      </select>
                    </Field>
                    <Field label="Position">
                      <select
                        className={field}
                        value={sigPos}
                        onChange={(e) =>
                          setSigPos(e.target.value as SignatureOptions["position"])
                        }
                      >
                        <option value="bottom-right">Bottom right</option>
                        <option value="bottom-center">Bottom center</option>
                        <option value="bottom-left">Bottom left</option>
                      </select>
                    </Field>
                  </div>
                  <Field label={`Size: ${sigW}% of page width`}>
                    <input
                      type="range"
                      min={10}
                      max={60}
                      value={sigW}
                      onChange={(e) => setSigW(+e.target.value)}
                      className="w-full accent-[#2547f0]"
                    />
                  </Field>
                </>
              )}
            </Group>

            <Actions
              label="Apply and save"
              busy={r.status === "processing"}
              disabled={invalid}
              onRun={go}
              onClear={reset}
            />
          </>
        }
      />
    </Shell>
  );
}

/* ================================================================== */
/* 4. Protect PDF                                                      */
/* ================================================================== */

export function ProtectTool({ tool }: { tool: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [allowPrint, setPrint] = useState(true);
  const [allowCopy, setCopy] = useState(false);
  const [allowModify, setModify] = useState(false);
  const r = useRunner();

  const reset = () => {
    setFile(null);
    setPw("");
    setPw2("");
    r.reset();
  };
  if (r.status === "done" && r.result)
    return <ResultCard result={r.result} onReset={reset} />;

  const sub =
    "Lock a PDF with a password. Only people who know it can open the file.";

  if (!file)
    return (
      <Shell tool={tool} sub={sub}>
        <Notice kind="error">{r.error}</Notice>
        <DropZone
          label="Drop the PDF you want to lock"
          onFile={(f) => (isPdf(f) ? setFile(f) : r.setError(NOT_PDF))}
        />
      </Shell>
    );

  const mismatch = pw2.length > 0 && pw !== pw2;
  const score = Math.min(
    4,
    (pw.length >= 8 ? 1 : 0) +
      (pw.length >= 12 ? 1 : 0) +
      (/[A-Z]/.test(pw) && /[a-z]/.test(pw) ? 1 : 0) +
      (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw) ? 1 : 0),
  );
  const strength = ["Too short", "Weak", "Fair", "Good", "Strong"][pw ? score : 0];

  const perms: [string, boolean][] = [
    ["Printing", allowPrint],
    ["Copying text", allowCopy],
    ["Editing", allowModify],
  ];

  return (
    <Shell tool={tool} sub={sub}>
      <Notice kind="error">{r.error}</Notice>
      <Bench
        left={
          <div className="mx-auto flex max-w-sm flex-col items-center py-6 text-center">
            <span className="flex h-24 w-20 items-center justify-center rounded-md bg-white shadow-[0_10px_30px_rgba(15,26,46,.18)] ring-1 ring-slate-200">
              <Lock className="h-8 w-8 text-[#2547f0]" />
            </span>
            <p className="mt-5 max-w-full truncate text-sm font-semibold text-[#0f1a2e]">
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{fmt(file.size)}</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {perms.map(([l, on]) => (
                <li
                  key={l}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    on
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 line-through"
                  }`}
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>
        }
        side={
          <>
            <Group title="Password">
              <Field label="Password">
                <input
                  type="password"
                  autoComplete="new-password"
                  className={field}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
              </Field>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className={`h-1 flex-1 rounded-full ${
                        pw && score >= n
                          ? score >= 3
                            ? "bg-emerald-500"
                            : "bg-amber-400"
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">{strength}</p>
              </div>
              <Field label="Confirm password">
                <input
                  type="password"
                  autoComplete="new-password"
                  className={field}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                />
              </Field>
              {mismatch && (
                <p className="text-xs text-[#e11d74]">The passwords don't match.</p>
              )}
            </Group>
            <Group title="What others can do after opening">
              <Switch checked={allowPrint} onChange={setPrint} label="Print" />
              <Switch checked={allowCopy} onChange={setCopy} label="Copy text" />
              <Switch checked={allowModify} onChange={setModify} label="Edit" />
              <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                AES-256 encryption. If you forget the password, the file can't be
                recovered.
              </p>
            </Group>
            {r.status === "processing" && <Notice kind="busy">Encrypting...</Notice>}
            <Actions
              label="Lock PDF"
              busy={r.status === "processing"}
              disabled={!pw || mismatch || pw !== pw2}
              onRun={() =>
                r.run(() =>
                  protectPdf(file, { userPassword: pw, allowPrint, allowCopy, allowModify }),
                )
              }
              onClear={reset}
            />
          </>
        }
      />
    </Shell>
  );
}

/* ================================================================== */
/* 5. Metadata viewer / editor                                         */
/* ================================================================== */

type Editable = "title" | "author" | "subject" | "keywords" | "creator" | "producer";
const EMPTY_FORM: Record<Editable, string> = {
  title: "",
  author: "",
  subject: "",
  keywords: "",
  creator: "",
  producer: "",
};

export function MetadataTool({ tool }: { tool: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<PdfMetadata | null>(null);
  const [form, setForm] = useState<Record<Editable, string>>(EMPTY_FORM);
  const [err, setErr] = useState("");
  const r = useRunner();

  const pick = async (f: File) => {
    if (!isPdf(f)) return setErr(NOT_PDF);
    try {
      const m = await readMetadata(f);
      setFile(f);
      setMeta(m);
      setErr("");
      setForm({
        title: m.title,
        author: m.author,
        subject: m.subject,
        keywords: m.keywords,
        creator: m.creator,
        producer: m.producer,
      });
    } catch {
      setErr("Couldn't read this file's metadata. It may be damaged.");
    }
  };
  const reset = () => {
    setFile(null);
    setMeta(null);
    setErr("");
    r.reset();
  };
  if (r.status === "done" && r.result)
    return <ResultCard result={r.result} onReset={reset} />;

  const sub =
    "See what's hidden inside a PDF, then edit it or wipe it before you share the file.";

  if (!file || !meta)
    return (
      <Shell tool={tool} sub={sub}>
        <Notice kind="error">{err || r.error}</Notice>
        <DropZone onFile={pick} label="Drop a PDF to inspect it" />
      </Shell>
    );

  const rows: [string, string][] = [
    ["File", file.name],
    ["Size", fmt(file.size)],
    ["Pages", String(meta.pageCount)],
    ["Encrypted", meta.encrypted ? "Yes" : "No"],
    ["Created", meta.creationDate || "Not set"],
    ["Last modified", meta.modificationDate || "Not set"],
  ];

  return (
    <Shell tool={tool} sub={sub}>
      <Notice kind="error">{r.error}</Notice>
      <Bench
        left={
          <div className="mx-auto max-w-md rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(15,26,46,.14)] ring-1 ring-slate-200">
            <dl className="divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="min-w-0 truncate text-right text-sm font-medium text-[#0f1a2e]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        }
        side={
          <>
            <Group title="Edit fields">
              {(Object.keys(form) as Editable[]).map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                  <input
                    className={field}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  />
                </Field>
              ))}
              <button
                type="button"
                onClick={() => setForm(EMPTY_FORM)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#e11d74]"
              >
                <Eraser className="h-3.5 w-3.5" /> Empty all fields
              </button>
            </Group>
            {r.status === "processing" && <Notice kind="busy">Saving...</Notice>}
            <Actions
              label="Save metadata"
              busy={r.status === "processing"}
              onRun={() => r.run(() => writeMetadata(file, form))}
              onClear={reset}
            />
          </>
        }
      />
    </Shell>
  );
}