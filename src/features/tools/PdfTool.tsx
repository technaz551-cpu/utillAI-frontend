





// "use client";

// import { useEffect, useMemo, useState } from "react";

// import {
//   ArrowDown,
//   ArrowUp,
//   CheckCircle2,
//   Combine,
//   Download,
//   FileImage,
//   FileText,
//   Image,
//   Loader2,
//   RotateCcw,
//   Scissors,
//   ShieldCheck,
//   Trash2,
//   Upload,
//   X,
// } from "lucide-react";

// import { btn, card } from "@/lib/utils";

// import type { ToolMeta } from "@/features/tools/client-processors";

// import { processPdf } from "@/features/tools/pdf-processors";

// const MULTI_FILE = new Set([
//   "merge-pdf",
//   "split-pdf",
//   "jpg-to-pdf",
//   "pdf-to-jpg",
// ]);

// const MERGE_SPLIT = new Set([
//   "merge-pdf",
//   "split-pdf",
// ]);

// const CONVERT = new Set([
//   "jpg-to-pdf",
//   "pdf-to-jpg",
// ]);

// const IMAGE_EXTS = new Set([
//   "jpg",
//   "jpeg",
//   "png",
// ]);

// type PdfAction =
//   | "merge"
//   | "split"
//   | "jpg-to-pdf"
//   | "pdf-to-jpg";

// type PdfStatus =
//   | "idle"
//   | "processing"
//   | "done"
//   | "error";

// function extOf(file: File) {
//   return (
//     file.name
//       .split(".")
//       .pop()
//       ?.toLowerCase() || ""
//   );
// }

// function isPdfFile(file: File) {
//   return extOf(file) === "pdf";
// }

// function isImageFile(file: File) {
//   return IMAGE_EXTS.has(extOf(file));
// }

// function formatSize(bytes: number) {
//   if (bytes < 1024) {
//     return `${bytes} B`;
//   }

//   if (bytes < 1024 * 1024) {
//     return `${(bytes / 1024).toFixed(1)} KB`;
//   }

//   return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
// }

// function hintFor(slug: string) {
//   const map: Record<string, string> = {
//     "merge-pdf":
//       "Upload two or more PDFs and combine them into one document.",

//     "split-pdf":
//       "Upload a PDF and split its pages into separate files.",

//     "compress-pdf":
//       "Upload a PDF to optimize its structure and reduce its size.",

//     "jpg-to-pdf":
//       "Upload JPG or PNG images and convert them into a PDF.",

//     "pdf-to-jpg":
//       "Upload a PDF and convert its pages into JPG images.",
//   };

//   return (
//     map[slug] ||
//     "Drop files here or click to browse."
//   );
// }

// function processLabel(
//   status: PdfStatus,
//   action: PdfAction | null,
// ) {
//   if (status === "processing") {
//     return "Processing...";
//   }

//   if (action === "merge") {
//     return "Merge PDFs";
//   }

//   if (action === "split") {
//     return "Split PDF";
//   }

//   if (action === "jpg-to-pdf") {
//     return "Convert to PDF";
//   }

//   if (action === "pdf-to-jpg") {
//     return "Convert to JPG";
//   }

//   return "Process";
// }

// function getFileIcon(file: File) {
//   if (isImageFile(file)) {
//     return (
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
//         <Image className="h-5 w-5 text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
//       <FileText className="h-5 w-5 text-red-500" />
//     </div>
//   );
// }

// export function PdfTool({
//   tool,
// }: {
//   tool: ToolMeta;
// }) {
//   const [files, setFiles] = useState<File[]>([]);

//   const [quality, setQuality] =
//     useState(80);

//   const [status, setStatus] =
//     useState<PdfStatus>("idle");

//   const [error, setError] =
//     useState("");

//   const [resultUrl, setResultUrl] =
//     useState("");

//   const [resultName, setResultName] =
//     useState("");

//   const [resultSize, setResultSize] =
//     useState(0);

//   const [dragOver, setDragOver] =
//     useState(false);

//   const [action, setAction] =
//     useState<PdfAction | null>(null);

//   const accept = useMemo(() => {
//     if (tool.accepted_formats?.length) {
//       return tool.accepted_formats
//         .map((format) => `.${format}`)
//         .join(",");
//     }

//     return ".pdf";
//   }, [tool.accepted_formats]);

//   const isMergeSplit =
//     MERGE_SPLIT.has(tool.slug);

//   const isConvert =
//     CONVERT.has(tool.slug);

//   const multiple =
//     MULTI_FILE.has(tool.slug);

//   const images =
//     files.filter(isImageFile);

//   const pdfs =
//     files.filter(isPdfFile);

//   const showReorder =
//     multiple &&
//     files.length > 1 &&
//     (
//       (isMergeSplit &&
//         action === "merge") ||
//       (isConvert &&
//         action === "jpg-to-pdf") ||
//       (!isMergeSplit &&
//         !isConvert)
//     );

//   const canRun = (() => {
//     if (!files.length) {
//       return false;
//     }

//     if (isMergeSplit) {
//       if (action === "split") {
//         return true;
//       }

//       if (
//         action === "merge" &&
//         files.length >= 2
//       ) {
//         return true;
//       }

//       return false;
//     }

//     if (isConvert) {
//       if (
//         action === "jpg-to-pdf"
//       ) {
//         return images.length >= 1;
//       }

//       if (
//         action === "pdf-to-jpg"
//       ) {
//         return pdfs.length >= 1;
//       }

//       return false;
//     }

//     return true;
//   })();

//   useEffect(() => {
//     setFiles([]);
//     setQuality(80);
//     setStatus("idle");
//     setError("");
//     setAction(null);
//     setResultName("");
//     setResultSize(0);

//     setResultUrl((previous) => {
//       if (previous) {
//         URL.revokeObjectURL(previous);
//       }

//       return "";
//     });
//   }, [tool.slug]);

//   useEffect(() => {
//     return () => {
//       if (resultUrl) {
//         URL.revokeObjectURL(resultUrl);
//       }
//     };
//   }, [resultUrl]);

//   const addFiles = (
//     list: FileList | File[],
//   ) => {
//     const allowed = new Set(
//       (
//         tool.accepted_formats ||
//         ["pdf"]
//       ).map((format) =>
//         format.toLowerCase(),
//       ),
//     );

//     const next = Array.from(list).filter(
//       (file) =>
//         allowed.has(extOf(file)),
//     );

//     if (!next.length) {
//       setError(
//         `Please choose ${[
//           ...allowed,
//         ]
//           .join(", ")
//           .toUpperCase()} file(s).`,
//       );

//       setStatus("error");

//       return;
//     }

//     setFiles((previous) =>
//       multiple
//         ? [...previous, ...next]
//         : next.slice(0, 1),
//     );

//     setStatus("idle");
//     setError("");
//   };

//   const removeFile = (
//     index: number,
//   ) => {
//     const next = files.filter(
//       (_, currentIndex) =>
//         currentIndex !== index,
//     );

//     setFiles(next);

//     if (!next.length) {
//       setAction(null);
//     }
//   };

//   const chooseAction = (
//     nextAction: PdfAction,
//   ) => {
//     setAction(nextAction);

//     setStatus("idle");
//     setError("");
//     setResultName("");
//     setResultSize(0);

//     setResultUrl((previous) => {
//       if (previous) {
//         URL.revokeObjectURL(previous);
//       }

//       return "";
//     });
//   };

//   const move = (
//     index: number,
//     direction: -1 | 1,
//   ) => {
//     const target =
//       index + direction;

//     if (
//       target < 0 ||
//       target >= files.length
//     ) {
//       return;
//     }

//     const copy = [...files];

//     [
//       copy[index],
//       copy[target],
//     ] = [
//       copy[target],
//       copy[index],
//     ];

//     setFiles(copy);
//   };

//   const run = async () => {
//     if (!canRun) {
//       return;
//     }

//     const slug =
//       isMergeSplit
//         ? action === "split"
//           ? "split-pdf"
//           : "merge-pdf"
//         : isConvert
//           ? action === "pdf-to-jpg"
//             ? "pdf-to-jpg"
//             : "jpg-to-pdf"
//           : tool.slug;

//     const input =
//       slug === "jpg-to-pdf"
//         ? images
//         : slug === "pdf-to-jpg"
//           ? pdfs
//           : files;

//     setStatus("processing");
//     setError("");

//     if (resultUrl) {
//       URL.revokeObjectURL(resultUrl);
//     }

//     setResultUrl("");

//     try {
//       const result =
//         await processPdf(
//           slug,
//           input,
//           {
//             quality,
//           },
//         );

//       const url =
//         URL.createObjectURL(
//           result.blob,
//         );

//       setResultUrl(url);

//       setResultName(
//         result.filename,
//       );

//       setResultSize(
//         result.blob.size,
//       );

//       setStatus("done");
//     } catch (exception) {
//       const message =
//         exception instanceof Error
//           ? exception.message
//           : "Processing failed";

//       setError(message);
//       setStatus("error");
//     }
//   };

//   const clear = () => {
//     setFiles([]);
//     setAction(null);
//     setError("");
//     setStatus("idle");
//     setResultName("");
//     setResultSize(0);

//     setResultUrl((previous) => {
//       if (previous) {
//         URL.revokeObjectURL(previous);
//       }

//       return "";
//     });
//   };

//   const choiceClass = (
//     selected: boolean,
//   ) =>
//     `group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
//       selected
//         ? "border-blue-500 bg-blue-50 shadow-sm"
//         : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
//     }`;

//   /*
//    * ============================================================
//    * RESULT SCREEN
//    * ============================================================
//    */

//   if (
//     status === "done" &&
//     resultUrl
//   ) {
//     return (
//       <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
//         {/* Success header */}
//         <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-6 py-10 text-center sm:px-10">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
//             <CheckCircle2 className="h-9 w-9 text-blue-600" />
//           </div>

//           <h2 className="text-2xl font-bold tracking-tight text-slate-900">
//             Your file is ready
//           </h2>

//           <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//             Your PDF has been processed
//             successfully and is ready to
//             download.
//           </p>
//         </div>

//         {/* Result card */}
//         <div className="p-5 sm:p-7">
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
//             <div className="flex items-center gap-4">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
//                 <FileText className="h-6 w-6 text-red-500" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-semibold text-slate-900">
//                   {resultName}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   {formatSize(resultSize)}
//                   {" • "}
//                   PDF
//                 </p>
//               </div>

//               <CheckCircle2 className="hidden h-5 w-5 shrink-0 text-emerald-500 sm:block" />
//             </div>
//           </div>

//           {/* Main download */}
//           <a
//             href={resultUrl}
//             download={resultName}
//             className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
//           >
//             <Download className="h-5 w-5" />
//             Download {resultName}
//           </a>

//           {/* Secondary action */}
//           <button
//             type="button"
//             onClick={clear}
//             className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
//           >
//             <RotateCcw className="h-4 w-4" />
//             Process another file
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /*
//    * ============================================================
//    * MAIN TOOL UI
//    * ============================================================
//    */

//   return (
//     <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

//       {/* Privacy notice */}
//       <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
//         <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

//         <div>
//           <p className="text-sm font-semibold text-slate-800">
//             Your files stay private
//           </p>

//           <p className="mt-0.5 text-xs leading-5 text-slate-500">
//             Files are processed locally in
//             your browser and are never
//             uploaded to our servers.
//           </p>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="mb-5">
//         <h3 className="text-base font-semibold text-slate-900">
//           {tool.name}
//         </h3>

//         <p className="mt-1 text-sm leading-6 text-slate-500">
//           {hintFor(tool.slug)}
//         </p>
//       </div>

//       {/* Upload area */}
//       <label
//         onDragOver={(event) => {
//           event.preventDefault();
//           setDragOver(true);
//         }}
//         onDragLeave={() =>
//           setDragOver(false)
//         }
//         onDrop={(event) => {
//           event.preventDefault();
//           setDragOver(false);

//           if (
//             event.dataTransfer.files.length
//           ) {
//             addFiles(
//               event.dataTransfer.files,
//             );
//           }
//         }}
//         className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
//           dragOver
//             ? "border-blue-500 bg-blue-50"
//             : "border-slate-200 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/40"
//         }`}
//       >
//         <div
//           className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
//             dragOver
//               ? "bg-blue-100"
//               : "bg-white shadow-sm ring-1 ring-slate-200 group-hover:bg-blue-50"
//           }`}
//         >
//           <Upload
//             className={`h-6 w-6 ${
//               dragOver
//                 ? "text-blue-600"
//                 : "text-slate-400 group-hover:text-blue-500"
//             }`}
//           />
//         </div>

//         <span className="text-sm font-semibold text-slate-800">
//           Drop your files here
//         </span>

//         <span className="mt-1 text-sm text-slate-500">
//           or click to browse from your device
//         </span>

//         <span className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
//           {accept
//             .replaceAll(".", "")
//             .toUpperCase()}
//         </span>

//         <input
//           type="file"
//           multiple={multiple}
//           accept={accept}
//           className="hidden"
//           onChange={(event) => {
//             if (
//               event.target.files?.length
//             ) {
//               addFiles(
//                 event.target.files,
//               );
//             }

//             event.target.value = "";
//           }}
//         />
//       </label>

//       {/* File list */}
//       {files.length > 0 && (
//         <div className="mt-5">
//           <div className="mb-3 flex items-center justify-between">
//             <p className="text-sm font-semibold text-slate-800">
//               Selected files
//             </p>

//             <span className="text-xs text-slate-500">
//               {files.length}{" "}
//               {files.length === 1
//                 ? "file"
//                 : "files"}
//             </span>
//           </div>

//           <ul className="space-y-2">
//             {files.map(
//               (file, index) => (
//                 <li
//                   key={`${file.name}-${index}`}
//                   className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-colors hover:border-blue-200"
//                 >
//                   {getFileIcon(file)}

//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-medium text-slate-800">
//                       {file.name}
//                     </p>

//                     <p className="mt-0.5 text-xs text-slate-500">
//                       {formatSize(
//                         file.size,
//                       )}
//                     </p>
//                   </div>

//                   {showReorder && (
//                     <div className="flex gap-1">
//                       <button
//                         type="button"
//                         className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
//                         onClick={() =>
//                           move(
//                             index,
//                             -1,
//                           )
//                         }
//                         disabled={
//                           index === 0
//                         }
//                         title="Move up"
//                       >
//                         <ArrowUp className="h-3.5 w-3.5" />
//                       </button>

//                       <button
//                         type="button"
//                         className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
//                         onClick={() =>
//                           move(
//                             index,
//                             1,
//                           )
//                         }
//                         disabled={
//                           index ===
//                           files.length -
//                             1
//                         }
//                         title="Move down"
//                       >
//                         <ArrowDown className="h-3.5 w-3.5" />
//                       </button>
//                     </div>
//                   )}

//                   <button
//                     type="button"
//                     className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
//                     onClick={() =>
//                       removeFile(index)
//                     }
//                     title="Remove"
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </button>
//                 </li>
//               ),
//             )}
//           </ul>
//         </div>
//       )}

//       {/* Merge / Split */}
//       {isMergeSplit &&
//         files.length > 0 && (
//           <div className="mt-6">
//             <p className="mb-3 text-sm font-semibold text-slate-800">
//               What would you like to do?
//             </p>

//             <div className="grid gap-3 sm:grid-cols-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   chooseAction("merge")
//                 }
//                 className={choiceClass(
//                   action === "merge",
//                 )}
//               >
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//                   <Combine className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <span>
//                   <span className="block text-sm font-semibold text-slate-800">
//                     Merge PDFs
//                   </span>

//                   <span className="mt-1 block text-xs leading-5 text-slate-500">
//                     Combine multiple PDFs into
//                     one document.
//                   </span>
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   chooseAction("split")
//                 }
//                 className={choiceClass(
//                   action === "split",
//                 )}
//               >
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//                   <Scissors className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <span>
//                   <span className="block text-sm font-semibold text-slate-800">
//                     Split PDF
//                   </span>

//                   <span className="mt-1 block text-xs leading-5 text-slate-500">
//                     Extract pages into separate
//                     PDF files.
//                   </span>
//                 </span>
//               </button>
//             </div>

//             {action === "merge" &&
//               files.length < 2 && (
//                 <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
//                   Add at least one more PDF
//                   to merge.
//                 </p>
//               )}

//             {action === "split" &&
//               files.length > 1 && (
//                 <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
//                   Split uses the first PDF.
//                   Extra files will be ignored.
//                 </p>
//               )}
//           </div>
//         )}

//       {/* Conversion */}
//       {isConvert &&
//         files.length > 0 && (
//           <div className="mt-6">
//             <p className="mb-3 text-sm font-semibold text-slate-800">
//               Choose conversion
//             </p>

//             <div className="grid gap-3 sm:grid-cols-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   chooseAction(
//                     "jpg-to-pdf",
//                   )
//                 }
//                 className={choiceClass(
//                   action ===
//                     "jpg-to-pdf",
//                 )}
//               >
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//                   <Image className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <span>
//                   <span className="block text-sm font-semibold text-slate-800">
//                     JPG to PDF
//                   </span>

//                   <span className="mt-1 block text-xs leading-5 text-slate-500">
//                     Convert images into one
//                     PDF document.
//                   </span>
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   chooseAction(
//                     "pdf-to-jpg",
//                   )
//                 }
//                 className={choiceClass(
//                   action ===
//                     "pdf-to-jpg",
//                 )}
//               >
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//                   <FileImage className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <span>
//                   <span className="block text-sm font-semibold text-slate-800">
//                     PDF to JPG
//                   </span>

//                   <span className="mt-1 block text-xs leading-5 text-slate-500">
//                     Convert PDF pages into JPG
//                     images.
//                   </span>
//                 </span>
//               </button>
//             </div>

//             {action === "jpg-to-pdf" &&
//               images.length < 1 && (
//                 <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
//                   Add at least one JPG or PNG
//                   image.
//                 </p>
//               )}

//             {action === "pdf-to-jpg" &&
//               pdfs.length < 1 && (
//                 <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
//                   Add a PDF to convert.
//                 </p>
//               )}
//           </div>
//         )}

//       {/* JPG quality */}
//       {action === "pdf-to-jpg" && (
//         <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//           <div className="flex items-center justify-between">
//             <label className="text-sm font-medium text-slate-700">
//               JPG quality
//             </label>

//             <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">
//               {quality}%
//             </span>
//           </div>

//           <input
//             type="range"
//             min={40}
//             max={100}
//             value={quality}
//             onChange={(event) =>
//               setQuality(
//                 Number(
//                   event.target.value,
//                 ),
//               )
//             }
//             className="mt-4 w-full accent-blue-600"
//           />

//           <div className="mt-1 flex justify-between text-[11px] text-slate-400">
//             <span>Smaller file</span>
//             <span>Better quality</span>
//           </div>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           <X className="mt-0.5 h-4 w-4 shrink-0" />

//           <span>{error}</span>
//         </div>
//       )}

//       {/* Processing */}
//       {status === "processing" && (
//         <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
//           <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

//           <div>
//             <p className="text-sm font-semibold text-blue-700">
//               Processing your file...
//             </p>

//             <p className="mt-0.5 text-xs text-blue-600/70">
//               Please wait while we finish
//               the conversion.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//         <button
//           type="button"
//           onClick={run}
//           disabled={
//             !canRun ||
//             status === "processing"
//           }
//           className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {status === "processing" ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             processLabel(
//               status,
//               action,
//             )
//           )}
//         </button>

//         <button
//           type="button"
//           onClick={clear}
//           className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
//         >
//           <RotateCcw className="h-4 w-4" />
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Combine,
  Download,
  FileImage,
  FileText,
  Image,
  Loader2,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type { ToolMeta } from "@/features/tools/client-processors";

import { processPdf } from "@/features/tools/pdf-processors";

const MULTI_FILE = new Set([
  "merge-pdf",
  "split-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
]);

const MERGE_SPLIT = new Set([
  "merge-pdf",
  "split-pdf",
]);

const CONVERT = new Set([
  "jpg-to-pdf",
  "pdf-to-jpg",
]);

const IMAGE_EXTS = new Set([
  "jpg",
  "jpeg",
  "png",
]);

type PdfAction =
  | "merge"
  | "split"
  | "jpg-to-pdf"
  | "pdf-to-jpg";

type PdfStatus =
  | "idle"
  | "processing"
  | "done"
  | "error";

function extOf(file: File) {
  return (
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || ""
  );
}

function isPdfFile(file: File) {
  return extOf(file) === "pdf";
}

function isImageFile(file: File) {
  return IMAGE_EXTS.has(extOf(file));
}

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function hintFor(slug: string) {
  const map: Record<string, string> = {
    "merge-pdf":
      "Upload two or more PDFs and combine them into one document.",

    "split-pdf":
      "Upload a PDF and split its pages into separate files.",

    "compress-pdf":
      "Upload a PDF to optimize its structure and reduce its size.",

    "jpg-to-pdf":
      "Upload JPG or PNG images and convert them into a PDF.",

    "pdf-to-jpg":
      "Upload a PDF and convert its pages into JPG images.",
  };

  return (
    map[slug] ||
    "Drop files here or click to browse."
  );
}

function processLabel(
  status: PdfStatus,
  action: PdfAction | null,
) {
  if (status === "processing") {
    return "Processing...";
  }

  if (action === "merge") {
    return "Merge PDFs";
  }

  if (action === "split") {
    return "Split PDF";
  }

  if (action === "jpg-to-pdf") {
    return "Convert to PDF";
  }

  if (action === "pdf-to-jpg") {
    return "Convert to JPG";
  }

  return "Process";
}

function getFileIcon(file: File) {
  if (isImageFile(file)) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Image className="h-5 w-5 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
      <FileText className="h-5 w-5 text-red-500" />
    </div>
  );
}

export function PdfTool({
  tool,
}: {
  tool: ToolMeta;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const [quality, setQuality] =
    useState(80);

  const [status, setStatus] =
    useState<PdfStatus>("idle");

  const [error, setError] =
    useState("");

  const [resultUrl, setResultUrl] =
    useState("");

  const [resultName, setResultName] =
    useState("");

  const [resultSize, setResultSize] =
    useState(0);

  const [dragOver, setDragOver] =
    useState(false);

  const [action, setAction] =
    useState<PdfAction | null>(null);

  const accept = useMemo(() => {
    if (tool.accepted_formats?.length) {
      return tool.accepted_formats
        .map((format) => `.${format}`)
        .join(",");
    }

    return ".pdf";
  }, [tool.accepted_formats]);

  const isMergeSplit =
    MERGE_SPLIT.has(tool.slug);

  const isConvert =
    CONVERT.has(tool.slug);

  const multiple =
    MULTI_FILE.has(tool.slug);

  const images =
    files.filter(isImageFile);

  const pdfs =
    files.filter(isPdfFile);

  const showReorder =
    multiple &&
    files.length > 1 &&
    (
      (isMergeSplit &&
        action === "merge") ||
      (isConvert &&
        action === "jpg-to-pdf") ||
      (!isMergeSplit &&
        !isConvert)
    );

  const canRun = (() => {
    if (!files.length) {
      return false;
    }

    if (isMergeSplit) {
      if (action === "split") {
        return true;
      }

      if (
        action === "merge" &&
        files.length >= 2
      ) {
        return true;
      }

      return false;
    }

    if (isConvert) {
      if (
        action === "jpg-to-pdf"
      ) {
        return images.length >= 1;
      }

      if (
        action === "pdf-to-jpg"
      ) {
        return pdfs.length >= 1;
      }

      return false;
    }

    return true;
  })();

  useEffect(() => {
    setFiles([]);
    setQuality(80);
    setStatus("idle");
    setError("");
    setAction(null);
    setResultName("");
    setResultSize(0);
    setDragOver(false);

    setResultUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return "";
    });
  }, [tool.slug]);

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const addFiles = (
    list: FileList | File[],
  ) => {
    const allowed = new Set(
      (
        tool.accepted_formats ||
        ["pdf"]
      ).map((format) =>
        format.toLowerCase(),
      ),
    );

    const next = Array.from(list).filter(
      (file) =>
        allowed.has(extOf(file)),
    );

    if (!next.length) {
      setError(
        `Please choose ${[
          ...allowed,
        ]
          .join(", ")
          .toUpperCase()} file(s).`,
      );

      setStatus("error");

      return;
    }

    setFiles((previous) =>
      multiple
        ? [...previous, ...next]
        : next.slice(0, 1),
    );

    setStatus("idle");
    setError("");
  };

  const removeFile = (
    index: number,
  ) => {
    const next = files.filter(
      (_, currentIndex) =>
        currentIndex !== index,
    );

    setFiles(next);

    if (!next.length) {
      setAction(null);
    }
  };

  const chooseAction = (
    nextAction: PdfAction,
  ) => {
    setAction(nextAction);

    setStatus("idle");
    setError("");
    setResultName("");
    setResultSize(0);

    setResultUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return "";
    });
  };

  const move = (
    index: number,
    direction: -1 | 1,
  ) => {
    const target =
      index + direction;

    if (
      target < 0 ||
      target >= files.length
    ) {
      return;
    }

    const copy = [...files];

    [
      copy[index],
      copy[target],
    ] = [
      copy[target],
      copy[index],
    ];

    setFiles(copy);
  };

  const run = async () => {
    if (!canRun) {
      return;
    }

    const slug =
      isMergeSplit
        ? action === "split"
          ? "split-pdf"
          : "merge-pdf"
        : isConvert
          ? action === "pdf-to-jpg"
            ? "pdf-to-jpg"
            : "jpg-to-pdf"
          : tool.slug;

    const input =
      slug === "jpg-to-pdf"
        ? images
        : slug === "pdf-to-jpg"
          ? pdfs
          : files;

    setStatus("processing");
    setError("");

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setResultUrl("");

    try {
      const result =
        await processPdf(
          slug,
          input,
          {
            quality,
          },
        );

      const url =
        URL.createObjectURL(
          result.blob,
        );

      setResultUrl(url);

      setResultName(
        result.filename,
      );

      setResultSize(
        result.blob.size,
      );

      setStatus("done");
    } catch (exception) {
      const message =
        exception instanceof Error
          ? exception.message
          : "Processing failed";

      setError(message);
      setStatus("error");
    }
  };

  const clear = () => {
    setFiles([]);
    setAction(null);
    setError("");
    setStatus("idle");
    setResultName("");
    setResultSize(0);
    setDragOver(false);

    setResultUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return "";
    });
  };

  const choiceClass = (
    selected: boolean,
  ) =>
    `group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
      selected
        ? "border-blue-500 bg-blue-50 shadow-sm"
        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
    }`;

  /*
   * ============================================================
   * RESULT SCREEN
   * ============================================================
   */

  if (
    status === "done" &&
    resultUrl
  ) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <CheckCircle2 className="h-9 w-9 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Your file is ready
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your PDF has been processed
            successfully and is ready to
            download.
          </p>
        </div>

        <div className="p-5 sm:p-7">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <FileText className="h-6 w-6 text-red-500" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {resultName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatSize(resultSize)}
                  {" • "}
                  PDF
                </p>
              </div>

              <CheckCircle2 className="hidden h-5 w-5 shrink-0 text-emerald-500 sm:block" />
            </div>
          </div>

          <a
            href={resultUrl}
            download={resultName}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            <Download className="h-5 w-5" />
            Download {resultName}
          </a>

          <button
            type="button"
            onClick={clear}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <RotateCcw className="h-4 w-4" />
            Process another file
          </button>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * MAIN TOOL UI
   * ============================================================
   */

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

      {/* Privacy notice */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Your files stay private
          </p>

          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            Files are processed locally in
            your browser and are never
            uploaded to our servers.
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          {tool.name}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {hintFor(tool.slug)}
        </p>
      </div>

      {/* ======================================================
          UPLOAD AREA
          Full blue hover effect
         ====================================================== */}
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => {
          setDragOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);

          if (
            event.dataTransfer.files.length
          ) {
            addFiles(
              event.dataTransfer.files,
            );
          }
        }}
        className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
          dragOver
            ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/20"
            : "border-slate-200 bg-slate-50/70 hover:border-blue-500 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
        }`}
      >
        {/* Full-card hover layer */}
        <div
          className={`pointer-events-none absolute inset-0 bg-blue-500 transition-opacity duration-300 ${
            dragOver
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        />

        {/* Upload content */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
              dragOver
                ? "bg-white/20"
                : "bg-white shadow-sm ring-1 ring-slate-200 group-hover:bg-white/20 group-hover:ring-white/30"
            }`}
          >
            <Upload
              className={`h-6 w-6 transition-colors duration-300 ${
                dragOver
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
          </div>

          <span
            className={`text-sm font-semibold transition-colors duration-300 ${
              dragOver
                ? "text-white"
                : "text-slate-800 group-hover:text-white"
            }`}
          >
            Drop your files here
          </span>

          <span
            className={`mt-1 text-sm transition-colors duration-300 ${
              dragOver
                ? "text-blue-100"
                : "text-slate-500 group-hover:text-blue-50"
            }`}
          >
            or click to browse from your device
          </span>

          <span
            className={`mt-3 rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-300 ${
              dragOver
                ? "bg-white/20 text-white ring-1 ring-white/30"
                : "bg-white text-slate-500 ring-1 ring-slate-200 group-hover:bg-white/20 group-hover:text-white group-hover:ring-white/30"
            }`}
          >
            {accept
              .replaceAll(".", "")
              .toUpperCase()}
          </span>
        </div>

        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(event) => {
            if (
              event.target.files?.length
            ) {
              addFiles(
                event.target.files,
              );
            }

            event.target.value = "";
          }}
        />
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Selected files
            </p>

            <span className="text-xs text-slate-500">
              {files.length}{" "}
              {files.length === 1
                ? "file"
                : "files"}
            </span>
          </div>

          <ul className="space-y-2">
            {files.map(
              (file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-colors hover:border-blue-200"
                >
                  {getFileIcon(file)}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatSize(
                        file.size,
                      )}
                    </p>
                  </div>

                  {showReorder && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() =>
                          move(
                            index,
                            -1,
                          )
                        }
                        disabled={
                          index === 0
                        }
                        title="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() =>
                          move(
                            index,
                            1,
                          )
                        }
                        disabled={
                          index ===
                          files.length - 1
                        }
                        title="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    onClick={() =>
                      removeFile(index)
                    }
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {/* Merge / Split */}
      {isMergeSplit &&
        files.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-800">
              What would you like to do?
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  chooseAction("merge")
                }
                className={choiceClass(
                  action === "merge",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <Combine className="h-5 w-5 text-blue-600" />
                </div>

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Merge PDFs
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Combine multiple PDFs into
                    one document.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  chooseAction("split")
                }
                className={choiceClass(
                  action === "split",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <Scissors className="h-5 w-5 text-blue-600" />
                </div>

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Split PDF
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Extract pages into separate
                    PDF files.
                  </span>
                </span>
              </button>
            </div>

            {action === "merge" &&
              files.length < 2 && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add at least one more PDF
                  to merge.
                </p>
              )}

            {action === "split" &&
              files.length > 1 && (
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Split uses the first PDF.
                  Extra files will be ignored.
                </p>
              )}
          </div>
        )}

      {/* Conversion */}
      {isConvert &&
        files.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-800">
              Choose conversion
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  chooseAction(
                    "jpg-to-pdf",
                  )
                }
                className={choiceClass(
                  action ===
                    "jpg-to-pdf",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <Image className="h-5 w-5 text-blue-600" />
                </div>

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    JPG to PDF
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Convert images into one
                    PDF document.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  chooseAction(
                    "pdf-to-jpg",
                  )
                }
                className={choiceClass(
                  action ===
                    "pdf-to-jpg",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <FileImage className="h-5 w-5 text-blue-600" />
                </div>

                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    PDF to JPG
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Convert PDF pages into JPG
                    images.
                  </span>
                </span>
              </button>
            </div>

            {action === "jpg-to-pdf" &&
              images.length < 1 && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add at least one JPG or PNG
                  image.
                </p>
              )}

            {action === "pdf-to-jpg" &&
              pdfs.length < 1 && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add a PDF to convert.
                </p>
              )}
          </div>
        )}

      {/* JPG quality */}
      {action === "pdf-to-jpg" && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              JPG quality
            </label>

            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600">
              {quality}%
            </span>
          </div>

          <input
            type="range"
            min={40}
            max={100}
            value={quality}
            onChange={(event) =>
              setQuality(
                Number(
                  event.target.value,
                ),
              )
            }
            className="mt-4 w-full accent-blue-600"
          />

          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <X className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-700">
              Processing your file...
            </p>

            <p className="mt-0.5 text-xs text-blue-600/70">
              Please wait while we finish
              the conversion.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={run}
          disabled={
            !canRun ||
            status === "processing"
          }
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "processing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            processLabel(
              status,
              action,
            )
          )}
        </button>

        <button
          type="button"
          onClick={clear}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}