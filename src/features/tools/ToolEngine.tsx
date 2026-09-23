// // "use client";

// // import { useState, useCallback, useEffect } from "react";
// // import {
// //   Copy,
// //   Download,
// //   Play,
// //   RotateCcw,
// //   Shield,
// // } from "lucide-react";

// // import { btn, card, inputClass } from "@/lib/utils";

// // import {
// //   CLIENT_PROCESSORS,
// //   CALCULATOR_TOOLS,
// //   SEO_FORM_TOOLS,
// //   INTERNET_FORM_TOOLS,
// //   NO_INPUT_TOOLS,
// //   ToolMeta,
// //   type ToolStat,
// //   type ToolSection,
// //   type ToolMeter,
// // } from "@/features/tools/client-processors";

// // import { FileClientTool } from "./FileClientTool";
// // import { ServerFileTool } from "./ServerFileTool";
// // import { SpeedTestTool } from "./SpeedTestTool";
// // import { PdfTool } from "./PdfTool";
// // import PdfEditor from "./pdfeditor/PdfEditor";
// // import { ImageTool } from "./ImageTool";
// // import { EmailOtpTool } from "./EmailOtpTool";
// // import  DeveloperTool  from "./developertools/developertools";

// // import { PDF_TOOL_SLUGS } from "./pdf-catalog";
// // import { IMAGE_TOOL_SLUGS } from "./image-catalog";
// // import { EMAIL_OTP_SLUGS } from "./internet-catalog";

// // /* =========================================================
// //    DEVELOPER TOOLS
// // ========================================================= */

// // const DEVELOPER_TOOL_SLUGS = new Set([
// //   "json-formatter",
// //   "json-validator",
// //   "base64",
// //   "url-encoder",
// //   "uuid-generator",
// // ]);

// // /* =========================================================
// //    HUMANIZER TOOLS
// // ========================================================= */

// // const HUMANIZER_SLUGS = new Set([
// //   "human-summarizer",
// //   "humanize-text",
// //   "ai-likelihood-detector",
// // ]);

// // /* =========================================================
// //    PROPS
// // ========================================================= */

// // interface Props {
// //   tool: ToolMeta;
// // }

// // /* =========================================================
// //    OUTPUT FONTS
// // ========================================================= */

// // const OUTPUT_FONTS = [
// //   {
// //     id: "mono",
// //     name: "Monospace",
// //     family:
// //       "var(--font-mono), ui-monospace, Consolas, monospace",
// //   },
// //   {
// //     id: "sans",
// //     name: "Sans Serif",
// //     family:
// //       "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
// //   },
// //   {
// //     id: "serif",
// //     name: "Serif",
// //     family:
// //       'Georgia, "Times New Roman", Times, serif',
// //   },
// //   {
// //     id: "cursive",
// //     name: "Cursive",
// //     family:
// //       '"Segoe Script", "Comic Sans MS", cursive',
// //   },
// //   {
// //     id: "display",
// //     name: "Display",
// //     family:
// //       'Impact, "Arial Black", sans-serif',
// //   },
// // ] as const;

// // /* =========================================================
// //    MAIN TOOL ENGINE
// // ========================================================= */

// // export function ToolEngine({ tool }: Props) {
// //   const [input, setInput] = useState("");
// //   const [output, setOutput] = useState("");
// //   const [stats, setStats] = useState<ToolStat[] | null>(null);
// //   const [sections, setSections] =
// //     useState<ToolSection[] | null>(null);
// //   const [meter, setMeter] =
// //     useState<ToolMeter | null>(null);

// //   const [outputFont, setOutputFont] =
// //     useState<(typeof OUTPUT_FONTS)[number]["id"]>("mono");

// //   const [error, setError] = useState("");

// //   const [options, setOptions] =
// //     useState<Record<string, unknown>>({});

// //   const [status, setStatus] = useState<
// //     "idle" | "processing" | "success" | "error"
// //   >("idle");

// //   /* =======================================================
// //      TOOL PROCESSING TYPE
// //   ======================================================= */

// //   const isServer =
// //     tool.processing_type === "server" ||
// //     tool.processing_type === "hybrid";

// //   /* =======================================================
// //      FILE CLIENT TOOLS
// //   ======================================================= */

// //   const isFileClient = [
// //     "resize-image",
// //     "jpg-to-png",
// //     "png-to-jpg",
// //     "webp-converter",
// //     "rotate-image",
// //     "flip-image",
// //     "crop-image",
// //   ].includes(tool.slug);

// //   /* =======================================================
// //      TEXTAREA REQUIREMENT
// //   ======================================================= */

// //   const needsTextarea =
// //     !CALCULATOR_TOOLS.has(tool.slug) &&
// //     !SEO_FORM_TOOLS.has(tool.slug) &&
// //     !NO_INPUT_TOOLS.has(tool.slug);

// //   /* =======================================================
// //      RESET WHEN TOOL CHANGES
// //   ======================================================= */

// //   useEffect(() => {
// //     setInput("");
// //     setOutput("");
// //     setStats(null);
// //     setSections(null);
// //     setMeter(null);
// //     setOutputFont("mono");
// //     setError("");
// //     setOptions({});
// //     setStatus("idle");
// //   }, [tool.slug]);

// //   /* =======================================================
// //      SPECIAL TOOL ROUTING
// //   ======================================================= */

// //   /*
// //    * PDF EDITOR
// //    */

// //   if (tool.slug === "pdf-editor") {
// //     return <PdfEditor tool={tool} />;
// //   }

// //   /*
// //    * PDF TOOLS
// //    */

// //   if (PDF_TOOL_SLUGS.has(tool.slug)) {
// //     return <PdfTool tool={tool} />;
// //   }

// //   /*
// //    * IMAGE TOOLS
// //    */

// //   if (IMAGE_TOOL_SLUGS.has(tool.slug)) {
// //     return <ImageTool tool={tool} />;
// //   }

// //   /*
// //    * DEVELOPER TOOLS
// //    *
// //    * These are handled by:
// //    *
// //    * developertools/DeveloperTool.tsx
// //    */

// //   if (DEVELOPER_TOOL_SLUGS.has(tool.slug)) {
// //     return <DeveloperTool slug={tool.slug} />;
// //   }

// //   /*
// //    * SERVER / HYBRID TOOLS
// //    */

// //   if (
// //     isServer &&
// //     tool.slug !== "compress-image"
// //   ) {
// //     return <ServerFileTool tool={tool} />;
// //   }

// //   /*
// //    * INTERNET SPEED TEST
// //    */

// //   if (tool.slug === "internet-speed-test") {
// //     return <SpeedTestTool />;
// //   }

// //   /*
// //    * EMAIL OTP
// //    */

// //   if (EMAIL_OTP_SLUGS.has(tool.slug)) {
// //     return <EmailOtpTool tool={tool} />;
// //   }

// //   /*
// //    * CLIENT FILE TOOLS
// //    */

// //   if (
// //     isFileClient ||
// //     tool.slug === "compress-image"
// //   ) {
// //     return <FileClientTool tool={tool} />;
// //   }

// //   /* =======================================================
// //      GENERIC CLIENT TOOL PROCESSOR
// //   ======================================================= */

// //   const run = useCallback(async () => {
// //     setStatus("processing");
// //     setError("");

// //     const processor =
// //       CLIENT_PROCESSORS[tool.slug];

// //     if (!processor) {
// //       setError("Tool processor not implemented");
// //       setStatus("error");
// //       return;
// //     }

// //     try {
// //       const result = await Promise.resolve(
// //         processor(input, options)
// //       );

// //       if (result.error) {
// //         setError(result.error);

// //         setOutput("");
// //         setStats(null);
// //         setSections(null);
// //         setMeter(null);

// //         setStatus("error");
// //       } else {
// //         setOutput(result.output);

// //         setStats(
// //           result.stats?.length
// //             ? result.stats
// //             : null
// //         );

// //         setSections(
// //           result.sections?.length
// //             ? result.sections
// //             : null
// //         );

// //         setMeter(result.meter ?? null);

// //         setStatus("success");
// //       }
// //     } catch (e) {
// //       setError(
// //         e instanceof Error
// //           ? e.message
// //           : "An unexpected error occurred."
// //       );

// //       setStatus("error");
// //     }
// //   }, [
// //     input,
// //     options,
// //     tool.slug,
// //   ]);

// //   /* =======================================================
// //      COPY
// //   ======================================================= */

// //   const copy = async () => {
// //     try {
// //       await navigator.clipboard.writeText(
// //         output
// //       );
// //     } catch {
// //       setError("Unable to copy result.");
// //     }
// //   };

// //   /* =======================================================
// //      DOWNLOAD
// //   ======================================================= */

// //   const download = () => {
// //     const blob = new Blob(
// //       [output],
// //       {
// //         type: "text/plain",
// //       }
// //     );

// //     const url =
// //       URL.createObjectURL(blob);

// //     const a =
// //       document.createElement("a");

// //     a.href = url;

// //     a.download =
// //       `${tool.slug}-result.txt`;

// //     document.body.appendChild(a);

// //     a.click();

// //     a.remove();

// //     URL.revokeObjectURL(url);
// //   };

// //   /* =======================================================
// //      CLEAR
// //   ======================================================= */

// //   const clear = () => {
// //     setInput("");
// //     setOutput("");
// //     setStats(null);
// //     setSections(null);
// //     setMeter(null);
// //     setOutputFont("mono");
// //     setError("");
// //     setOptions({});
// //     setStatus("idle");
// //   };

// //   /* =======================================================
// //      SELECTED OUTPUT FONT
// //   ======================================================= */

// //   const selectedFont =
// //     OUTPUT_FONTS.find(
// //       (font) =>
// //         font.id === outputFont
// //     ) ?? OUTPUT_FONTS[0];

// //   /* =======================================================
// //      GENERIC TOOL UI
// //   ======================================================= */

// //   return (
// //     <div className={card()}>
// //       {/* ===================================================
// //           LOCAL PROCESSING NOTICE
// //       =================================================== */}

// //       {tool.processing_type === "client" && (
// //         <div className="mb-5 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
// //           <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

// //           <p className="text-xs leading-relaxed text-cyan-200/80">
// //             Runs locally in your browser — your
// //             input is never sent to our servers.
// //           </p>
// //         </div>
// //       )}

// //       {/* ===================================================
// //           CALCULATOR FIELDS
// //       =================================================== */}

// //       {CALCULATOR_TOOLS.has(tool.slug) && (
// //         <CalculatorFields
// //           slug={tool.slug}
// //           options={options}
// //           setOptions={setOptions}
// //         />
// //       )}

// //       {/* ===================================================
// //           SEO FIELDS
// //       =================================================== */}

// //       {SEO_FORM_TOOLS.has(tool.slug) && (
// //         <SeoFields
// //           options={options}
// //           setOptions={setOptions}
// //         />
// //       )}

// //       {/* ===================================================
// //           INTERNET FIELDS
// //       =================================================== */}

// //       {INTERNET_FORM_TOOLS.has(tool.slug) && (
// //         <InternetFields
// //           slug={tool.slug}
// //           options={options}
// //           setOptions={setOptions}
// //         />
// //       )}

// //       {/* ===================================================
// //           CASE CONVERTER
// //       =================================================== */}

// //       {tool.slug === "case-converter" && (
// //         <select
// //           className={
// //             inputClass + " mb-4"
// //           }
// //           value={String(
// //             options.mode || "upper"
// //           )}
// //           onChange={(e) =>
// //             setOptions({
// //               mode: e.target.value,
// //             })
// //           }
// //         >
// //           <option value="upper">
// //             UPPERCASE
// //           </option>

// //           <option value="lower">
// //             lowercase
// //           </option>

// //           <option value="title">
// //             Title Case
// //           </option>

// //           <option value="sentence">
// //             Sentence case
// //           </option>
// //         </select>
// //       )}

// //       {/* ===================================================
// //           PASSWORD GENERATOR
// //       =================================================== */}

// //       {tool.slug ===
// //         "password-generator" && (
// //         <div className="mb-4 space-y-3">
// //           <input
// //             type="number"
// //             min={4}
// //             max={128}
// //             placeholder="Length"
// //             className={inputClass}
// //             defaultValue={16}
// //             onChange={(e) =>
// //               setOptions({
// //                 ...options,
// //                 length:
// //                   e.target.value,
// //               })
// //             }
// //           />

// //           <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
// //             <label className="inline-flex items-center gap-2">
// //               <input
// //                 type="checkbox"
// //                 checked={
// //                   options.includeNumbers !==
// //                   false
// //                 }
// //                 onChange={(e) =>
// //                   setOptions({
// //                     ...options,
// //                     includeNumbers:
// //                       e.target.checked,
// //                   })
// //                 }
// //               />

// //               Numbers
// //             </label>

// //             <label className="inline-flex items-center gap-2">
// //               <input
// //                 type="checkbox"
// //                 checked={
// //                   options.includeSymbols !==
// //                   false
// //                 }
// //                 onChange={(e) =>
// //                   setOptions({
// //                     ...options,
// //                     includeSymbols:
// //                       e.target.checked,
// //                   })
// //                 }
// //               />

// //               Symbols
// //             </label>
// //           </div>
// //         </div>
// //       )}

// //       {/* ===================================================
// //           SUMMARIZER / HUMANIZER
// //       =================================================== */}

// //       {(tool.slug ===
// //         "text-summarizer" ||
// //         HUMANIZER_SLUGS.has(
// //           tool.slug
// //         )) && (
// //         <input
// //           type="number"
// //           min={1}
// //           max={20}
// //           placeholder="Sentences"
// //           className={
// //             inputClass + " mb-4"
// //           }
// //           defaultValue={3}
// //           onChange={(e) =>
// //             setOptions({
// //               ...options,
// //               sentenceCount:
// //                 e.target.value,
// //             })
// //           }
// //         />
// //       )}

// //       {/* ===================================================
// //           KEYWORD / SENTIMENT
// //       =================================================== */}

// //       {(tool.slug ===
// //         "keyword-extractor" ||
// //         tool.slug ===
// //           "sentiment-analyzer") && (
// //         <input
// //           type="number"
// //           min={1}
// //           max={50}
// //           placeholder="Keyword count"
// //           className={
// //             inputClass + " mb-4"
// //           }
// //           defaultValue={10}
// //           onChange={(e) =>
// //             setOptions({
// //               ...options,
// //               count:
// //                 e.target.value,
// //             })
// //           }
// //         />
// //       )}

// //       {/* ===================================================
// //           TEXT CASE CONVERTER
// //       =================================================== */}

// //       {tool.slug ===
// //         "text-case-converter" && (
// //         <select
// //           className={
// //             inputClass + " mb-4"
// //           }
// //           value={String(
// //             options.case || "upper"
// //           )}
// //           onChange={(e) =>
// //             setOptions({
// //               ...options,
// //               case: e.target.value,
// //             })
// //           }
// //         >
// //           <option value="upper">
// //             UPPERCASE
// //           </option>

// //           <option value="lower">
// //             lowercase
// //           </option>

// //           <option value="title">
// //             Title Case
// //           </option>

// //           <option value="capitalize">
// //             Capitalize
// //           </option>
// //         </select>
// //       )}

// //       {/* ===================================================
// //           RANDOM TEXT
// //       =================================================== */}

// //       {tool.slug ===
// //         "random-text-generator" && (
// //         <input
// //           type="number"
// //           min={1}
// //           max={5000}
// //           placeholder="Length"
// //           className={
// //             inputClass + " mb-4"
// //           }
// //           defaultValue={100}
// //           onChange={(e) =>
// //             setOptions({
// //               ...options,
// //               length:
// //                 e.target.value,
// //             })
// //           }
// //         />
// //       )}

// //       {/* ===================================================
// //           KEYWORD DENSITY
// //       =================================================== */}

// //       {tool.slug ===
// //         "keyword-density-checker" && (
// //         <input
// //           placeholder="Keyword to analyze"
// //           className={
// //             inputClass + " mb-4"
// //           }
// //           onChange={(e) =>
// //             setOptions({
// //               ...options,
// //               keyword:
// //                 e.target.value,
// //             })
// //           }
// //         />
// //       )}

// //       {/* ===================================================
// //           MAIN TEXTAREA
// //       =================================================== */}

// //       {needsTextarea && (
// //         <textarea
// //           value={input}
// //           onChange={(e) =>
// //             setInput(e.target.value)
// //           }
// //           placeholder={placeholderFor(
// //             tool.slug
// //           )}
// //           rows={8}
// //           className={
// //             inputClass +
// //             " resize-y font-mono"
// //           }
// //         />
// //       )}

// //       {/* ===================================================
// //           NO INPUT TOOLS
// //       =================================================== */}

// //       {NO_INPUT_TOOLS.has(
// //         tool.slug
// //       ) && (
// //         <p className="mb-4 text-sm text-[var(--muted)]">
// //           {tool.slug ===
// //           "what-is-my-ip"
// //             ? "Click Process to fetch your public IP address."
// //             : "Click Process to generate a result."}
// //         </p>
// //       )}

// //       {/* ===================================================
// //           ACTION BUTTONS
// //       =================================================== */}

// //       <div className="mt-5 flex flex-wrap gap-2">
// //         <button
// //           onClick={run}
// //           disabled={
// //             status === "processing"
// //           }
// //           className={btn("primary")}
// //         >
// //           <Play className="mr-2 h-4 w-4" />

// //           {status === "processing"
// //             ? "Processing…"
// //             : "Process"}
// //         </button>

// //         <button
// //           onClick={clear}
// //           className={btn("secondary")}
// //         >
// //           <RotateCcw className="mr-2 h-4 w-4" />

// //           Clear
// //         </button>
// //       </div>

// //       {/* ===================================================
// //           ERROR
// //       =================================================== */}

// //       {error && (
// //         <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
// //           {error}
// //         </div>
// //       )}

// //       {/* ===================================================
// //           HUMANIZER RESULT
// //       =================================================== */}

// //       {output &&
// //         HUMANIZER_SLUGS.has(
// //           tool.slug
// //         ) && (
// //           <HumanizerResult
// //             meter={meter}
// //             sections={sections}
// //             stats={stats}
// //             onCopyAll={copy}
// //             onDownload={download}
// //           />
// //         )}

// //       {/* ===================================================
// //           NORMAL RESULT
// //       =================================================== */}

// //       {output &&
// //         !HUMANIZER_SLUGS.has(
// //           tool.slug
// //         ) && (
// //           <div
// //             className={`mt-6 ${
// //               stats ||
// //               tool.slug ===
// //                 "text-summarizer"
// //                 ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]"
// //                 : ""
// //             }`}
// //           >
// //             <div>
// //               <div className="mb-2 flex items-center justify-between">
// //                 <span className="text-sm font-medium">
// //                   Result
// //                 </span>

// //                 <div className="flex gap-1">
// //                   <button
// //                     onClick={copy}
// //                     className={btn(
// //                       "ghost"
// //                     )}
// //                     title="Copy"
// //                   >
// //                     <Copy className="h-4 w-4" />
// //                   </button>

// //                   <button
// //                     onClick={download}
// //                     className={btn(
// //                       "ghost"
// //                     )}
// //                     title="Download"
// //                   >
// //                     <Download className="h-4 w-4" />
// //                   </button>
// //                 </div>
// //               </div>

// //               <pre
// //                 className={`max-h-96 overflow-auto rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4 text-sm leading-relaxed text-blue-200 whitespace-pre-wrap ${
// //                   tool.slug ===
// //                   "text-summarizer"
// //                     ? ""
// //                     : "font-mono"
// //                 }`}
// //                 style={
// //                   tool.slug ===
// //                   "text-summarizer"
// //                     ? {
// //                         fontFamily:
// //                           selectedFont.family,
// //                       }
// //                     : undefined
// //                 }
// //               >
// //                 {output}
// //               </pre>
// //             </div>

// //             {(stats ||
// //               tool.slug ===
// //                 "text-summarizer") && (
// //               <aside className="rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4">
// //                 {stats && (
// //                   <>
// //                     <p className="mb-3 text-sm font-medium">
// //                       {tool.slug ===
// //                         "sentiment-analyzer" ||
// //                       tool.slug ===
// //                         "keyword-extractor"
// //                         ? "Analysis"
// //                         : "How it shortened"}
// //                     </p>

// //                     <ul className="space-y-3">
// //                       {stats.map(
// //                         (stat) => (
// //                           <li
// //                             key={
// //                               stat.label
// //                             }
// //                             className="border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0"
// //                           >
// //                             <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
// //                               {
// //                                 stat.label
// //                               }
// //                             </p>

// //                             <p className="mt-1 text-sm font-medium text-cyan-200">
// //                               {
// //                                 stat.value
// //                               }
// //                             </p>
// //                           </li>
// //                         )
// //                       )}
// //                     </ul>
// //                   </>
// //                 )}

// //                 {tool.slug ===
// //                   "text-summarizer" && (
// //                   <div
// //                     className={
// //                       stats
// //                         ? "mt-4 border-t border-[var(--border)] pt-4"
// //                         : ""
// //                     }
// //                   >
// //                     <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
// //                       Font used
// //                     </p>

// //                     <p className="mt-1 text-sm font-medium text-cyan-200">
// //                       {
// //                         selectedFont.name
// //                       }
// //                     </p>

// //                     <label className="mt-3 block text-[11px] uppercase tracking-wide text-[var(--muted)]">
// //                       Change font
// //                     </label>

// //                     <select
// //                       className={
// //                         inputClass +
// //                         " mt-1"
// //                       }
// //                       value={
// //                         outputFont
// //                       }
// //                       onChange={(e) =>
// //                         setOutputFont(
// //                           e.target
// //                             .value as (typeof OUTPUT_FONTS)[number]["id"]
// //                         )
// //                       }
// //                     >
// //                       {OUTPUT_FONTS.map(
// //                         (font) => (
// //                           <option
// //                             key={
// //                               font.id
// //                             }
// //                             value={
// //                               font.id
// //                             }
// //                           >
// //                             {
// //                               font.name
// //                             }
// //                           </option>
// //                         )
// //                       )}
// //                     </select>
// //                   </div>
// //                 )}
// //               </aside>
// //             )}
// //           </div>
// //         )}
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    HUMANIZER RESULT
// // ========================================================= */

// // function HumanizerResult({
// //   meter,
// //   sections,
// //   stats,
// //   onCopyAll,
// //   onDownload,
// // }: {
// //   meter: ToolMeter | null;
// //   sections: ToolSection[] | null;
// //   stats: ToolStat[] | null;
// //   onCopyAll: () => void;
// //   onDownload: () => void;
// // }) {
// //   const tone =
// //     meter?.label === "High"
// //       ? {
// //           text: "text-rose-300",
// //           bar: "bg-rose-400",
// //         }
// //       : meter?.label === "Medium"
// //         ? {
// //             text: "text-amber-300",
// //             bar: "bg-amber-400",
// //           }
// //         : {
// //             text: "text-emerald-300",
// //             bar: "bg-emerald-400",
// //           };

// //   const score = Math.max(
// //     0,
// //     Math.min(
// //       100,
// //       meter?.value ?? 0
// //     )
// //   );

// //   return (
// //     <div className="mt-6 space-y-4">
// //       <div className="flex items-center justify-between">
// //         <span className="text-sm font-medium">
// //           Result
// //         </span>

// //         <div className="flex gap-1">
// //           <button
// //             onClick={onCopyAll}
// //             className={btn("ghost")}
// //             title="Copy all"
// //           >
// //             <Copy className="h-4 w-4" />
// //           </button>

// //           <button
// //             onClick={onDownload}
// //             className={btn("ghost")}
// //             title="Download"
// //           >
// //             <Download className="h-4 w-4" />
// //           </button>
// //         </div>
// //       </div>

// //       {meter && (
// //         <div className="rounded-xl border border-[var(--border)] bg-[#0a0f18] p-4">
// //           <div className="flex items-end justify-between gap-4">
// //             <div>
// //               <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
// //                 AI likelihood
// //               </p>

// //               <p
// //                 className={`mt-1 text-2xl font-semibold ${tone.text}`}
// //               >
// //                 {meter.label}
// //               </p>
// //             </div>

// //             <div className="text-right">
// //               <p className="text-3xl font-semibold tabular-nums">
// //                 {score}
// //               </p>

// //               <p className="text-[11px] text-[var(--muted)]">
// //                 out of 100
// //               </p>
// //             </div>
// //           </div>

// //           <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
// //             <div
// //               className={`h-full rounded-full ${tone.bar}`}
// //               style={{
// //                 width: `${score}%`,
// //               }}
// //             />
// //           </div>

// //           <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
// //             Heuristic estimate only —
// //             not a reliable AI detector.
// //           </p>
// //         </div>
// //       )}

// //       <div className="grid gap-4 lg:grid-cols-2">
// //         {(sections || []).map(
// //           (section) => (
// //             <div
// //               key={section.id}
// //               className="flex min-h-[180px] flex-col rounded-xl border border-[var(--border)] bg-[#0a0f18]"
// //             >
// //               <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
// //                 <p className="text-sm font-medium">
// //                   {section.title}
// //                 </p>

// //                 <button
// //                   type="button"
// //                   className={
// //                     btn("ghost") +
// //                     " !px-2 !py-1"
// //                   }
// //                   title={`Copy ${section.title}`}
// //                   onClick={() =>
// //                     navigator.clipboard.writeText(
// //                       section.text
// //                     )
// //                   }
// //                 >
// //                   <Copy className="h-3.5 w-3.5" />
// //                 </button>
// //               </div>

// //               <p className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-blue-100">
// //                 {section.text}
// //               </p>
// //             </div>
// //           )
// //         )}
// //       </div>

// //       {stats && (
// //         <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
// //           {stats.map(
// //             (stat) => (
// //               <div
// //                 key={stat.label}
// //                 className="rounded-xl border border-[var(--border)] bg-[#0a0f18] px-3 py-3"
// //               >
// //                 <p className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
// //                   {stat.label}
// //                 </p>

// //                 <p className="mt-1 text-sm font-medium text-cyan-200">
// //                   {stat.value}
// //                 </p>
// //               </div>
// //             )
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    PLACEHOLDERS
// // ========================================================= */

// // function placeholderFor(
// //   slug: string
// // ) {
// //   const map: Record<
// //     string,
// //     string
// //   > = {
// //     "url-parser":
// //       "https://example.com/path?key=value",

// //     "url-encoder":
// //       "hello world",

// //     "url-decoder":
// //       "hello%20world",

// //     "url-validator":
// //       "https://example.com",

// //     "query-parser":
// //       "https://example.com/search?q=tools&page=1",

// //     "dns-lookup":
// //       "example.com",

// //     "a-record-lookup":
// //       "example.com",

// //     "redirect-checker":
// //       "https://example.com",

// //     "http-status-checker":
// //       "https://example.com",

// //     "email-extractor":
// //       "Contact us at hello@example.com and support@example.com",

// //     "user-agent-parser":
// //       "Paste a User-Agent string…",

// //     "ip-validator":
// //       "192.168.1.1 or 2001:db8::1",

// //     "cidr-calculator":
// //       "192.168.1.0/24",

// //     "email-validator":
// //       "user@example.com",

// //     "text-summarizer":
// //       "Paste an article or long text to summarize…",

// //     "human-summarizer":
// //       "Paste long or AI-sounding text to detect, humanize, and summarize…",

// //     "ai-likelihood-detector":
// //       "Paste long or AI-sounding text to detect, humanize, and summarize…",

// //     "humanize-text":
// //       "Paste long or AI-sounding text to detect, humanize, and summarize…",

// //     "text-analyzer":
// //       "Paste text to count words, characters and sentences…",

// //     "keyword-extractor":
// //       "Paste a review or article to get sentiment and keywords…",

// //     "sentiment-analyzer":
// //       "Paste a review or article to get sentiment and keywords…",

// //     "text-case-converter":
// //       "Paste text to convert case…",

// //     "text-cleaner":
// //       "Paste text with extra spaces or line breaks…",

// //     "slug-generator":
// //       "My Blog Post Title",

// //     "jwt-decoder":
// //       "Paste your JWT token here…",

// //     "http-status-lookup":
// //       "404",

// //     "mac-address-formatter":
// //       "AABBCCDDEEFF",

// //     "color-picker":
// //       "#3b82f6",
// //   };

// //   return (
// //     map[slug] ||
// //     "Enter or paste your input here…"
// //   );
// // }

// // /* =========================================================
// //    CALCULATOR FIELDS
// // ========================================================= */

// // function CalculatorFields({
// //   slug,
// //   options,
// //   setOptions,
// // }: {
// //   slug: string;
// //   options: Record<
// //     string,
// //     unknown
// //   >;
// //   setOptions: (
// //     options: Record<
// //       string,
// //       unknown
// //     >
// //   ) => void;
// // }) {
// //   const set = (
// //     key: string,
// //     value: string
// //   ) => {
// //     setOptions({
// //       ...options,
// //       [key]: value,
// //     });
// //   };

// //   if (
// //     slug === "emi-calculator" ||
// //     slug === "loan-calculator"
// //   ) {
// //     return (
// //       <div className="mb-4 grid gap-3 sm:grid-cols-3">
// //         <input
// //           placeholder="Principal (₹)"
// //           type="number"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "principal",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="Rate (% p.a.)"
// //           type="number"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "rate",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="Tenure (years)"
// //           type="number"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "tenure",
// //               e.target.value
// //             )
// //           }
// //         />
// //       </div>
// //     );
// //   }

// //   if (
// //     slug === "bmi-calculator"
// //   ) {
// //     return (
// //       <div className="mb-4 grid gap-3 sm:grid-cols-2">
// //         <input
// //           placeholder="Weight (kg)"
// //           type="number"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "weight",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="Height (cm)"
// //           type="number"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "height",
// //               e.target.value
// //             )
// //           }
// //         />
// //       </div>
// //     );
// //   }

// //   if (
// //     slug === "age-calculator"
// //   ) {
// //     return (
// //       <input
// //         type="date"
// //         className={
// //           inputClass + " mb-4"
// //         }
// //         onChange={(e) =>
// //           set(
// //             "dob",
// //             e.target.value
// //           )
// //         }
// //       />
// //     );
// //   }

// //   if (
// //     slug === "unit-converter" ||
// //     slug === "data-converter" ||
// //     slug === "currency-converter"
// //   ) {
// //     return (
// //       <div className="mb-4 grid gap-3 sm:grid-cols-3">
// //         <input
// //           placeholder="Value"
// //           type="number"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "value",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="From"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "from",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="To"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "to",
// //               e.target.value
// //             )
// //           }
// //         />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mb-4 grid gap-3 sm:grid-cols-2">
// //       <input
// //         placeholder="Value"
// //         type="number"
// //         className={inputClass}
// //         onChange={(e) =>
// //           set(
// //             "value",
// //             e.target.value
// //           )
// //         }
// //       />

// //       <input
// //         placeholder="Percent / Rate"
// //         type="number"
// //         className={inputClass}
// //         onChange={(e) =>
// //           set(
// //             "percent",
// //             e.target.value
// //           )
// //         }
// //       />
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    SEO FIELDS
// // ========================================================= */

// // function SeoFields({
// //   options,
// //   setOptions,
// // }: {
// //   options: Record<
// //     string,
// //     unknown
// //   >;
// //   setOptions: (
// //     options: Record<
// //       string,
// //       unknown
// //     >
// //   ) => void;
// // }) {
// //   const set = (
// //     key: string,
// //     value: string
// //   ) => {
// //     setOptions({
// //       ...options,
// //       [key]: value,
// //     });
// //   };

// //   return (
// //     <div className="mb-4 space-y-3">
// //       <input
// //         placeholder="Title"
// //         className={inputClass}
// //         onChange={(e) =>
// //           set(
// //             "title",
// //             e.target.value
// //           )
// //         }
// //       />

// //       <input
// //         placeholder="Description"
// //         className={inputClass}
// //         onChange={(e) =>
// //           set(
// //             "description",
// //             e.target.value
// //           )
// //         }
// //       />

// //       <input
// //         placeholder="URL"
// //         className={inputClass}
// //         onChange={(e) =>
// //           set(
// //             "url",
// //             e.target.value
// //           )
// //         }
// //       />
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    INTERNET FIELDS
// // ========================================================= */

// // function InternetFields({
// //   slug,
// //   options,
// //   setOptions,
// // }: {
// //   slug: string;
// //   options: Record<
// //     string,
// //     unknown
// //   >;
// //   setOptions: (
// //     options: Record<
// //       string,
// //       unknown
// //     >
// //   ) => void;
// // }) {
// //   const set = (
// //     key: string,
// //     value: string
// //   ) => {
// //     setOptions({
// //       ...options,
// //       [key]: value,
// //     });
// //   };

// //   if (slug === "dns-lookup") {
// //     return (
// //       <select
// //         className={
// //           inputClass + " mb-4"
// //         }
// //         value={String(
// //           options.type || "A"
// //         )}
// //         onChange={(e) =>
// //           setOptions({
// //             ...options,
// //             type: e.target.value,
// //           })
// //         }
// //       >
// //         <option value="A">
// //           A (IPv4)
// //         </option>

// //         <option value="AAAA">
// //           AAAA (IPv6)
// //         </option>

// //         <option value="CNAME">
// //           CNAME
// //         </option>

// //         <option value="MX">
// //           MX
// //         </option>

// //         <option value="TXT">
// //           TXT
// //         </option>

// //         <option value="NS">
// //           NS
// //         </option>
// //       </select>
// //     );
// //   }

// //   if (
// //     slug ===
// //     "mac-address-formatter"
// //   ) {
// //     return (
// //       <select
// //         className={
// //           inputClass + " mb-4"
// //         }
// //         value={String(
// //           options.format ||
// //             "colon"
// //         )}
// //         onChange={(e) =>
// //           setOptions({
// //             ...options,
// //             format:
// //               e.target.value,
// //           })
// //         }
// //       >
// //         <option value="colon">
// //           Colon
// //           (AA:BB:CC:DD:EE:FF)
// //         </option>

// //         <option value="dash">
// //           Dash
// //           (AA-BB-CC-DD-EE-FF)
// //         </option>

// //         <option value="dot">
// //           Dot
// //           (AABB.CCDD.EEFF)
// //         </option>
// //       </select>
// //     );
// //   }

// //   if (
// //     slug ===
// //     "generate-random-email"
// //   ) {
// //     return (
// //       <div className="mb-4 grid gap-3 sm:grid-cols-2">
// //         <input
// //           placeholder="Domain (example.com)"
// //           className={inputClass}
// //           defaultValue="example.com"
// //           onChange={(e) =>
// //             set(
// //               "domain",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="Username length (5–30)"
// //           type="number"
// //           min={5}
// //           max={30}
// //           className={inputClass}
// //           defaultValue={10}
// //           onChange={(e) =>
// //             set(
// //               "usernameLength",
// //               e.target.value
// //             )
// //           }
// //         />
// //       </div>
// //     );
// //   }

// //   if (
// //     slug === "generate-otp"
// //   ) {
// //     return (
// //       <div className="mb-4 grid gap-3 sm:grid-cols-2">
// //         <input
// //           placeholder="OTP length (4–8)"
// //           type="number"
// //           min={4}
// //           max={8}
// //           className={inputClass}
// //           defaultValue={6}
// //           onChange={(e) =>
// //             set(
// //               "otpLength",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <input
// //           placeholder="Expiry seconds"
// //           type="number"
// //           min={30}
// //           className={inputClass}
// //           defaultValue={300}
// //           onChange={(e) =>
// //             set(
// //               "expirySeconds",
// //               e.target.value
// //             )
// //           }
// //         />
// //       </div>
// //     );
// //   }

// //   if (
// //     slug === "verify-otp"
// //   ) {
// //     return (
// //       <input
// //         placeholder="Enter the OTP to verify"
// //         className={`${inputClass} mb-4`}
// //         onChange={(e) =>
// //           set(
// //             "userOtp",
// //             e.target.value
// //           )
// //         }
// //       />
// //     );
// //   }

// //   if (
// //     slug === "query-builder"
// //   ) {
// //     return (
// //       <div className="mb-4 space-y-3">
// //         <input
// //           placeholder="Base URL (https://example.com/search)"
// //           className={inputClass}
// //           onChange={(e) =>
// //             set(
// //               "baseUrl",
// //               e.target.value
// //             )
// //           }
// //         />

// //         <textarea
// //           placeholder={
// //             "Parameters, one per line:\nq=tools\npage=1"
// //           }
// //           className={`${inputClass} min-h-28`}
// //           onChange={(e) =>
// //             set(
// //               "params",
// //               e.target.value
// //             )
// //           }
// //         />
// //       </div>
// //     );
// //   }

// //   return null;
// // }


// "use client";

// import { useState, useCallback, useEffect } from "react";
// import {
//   Copy,
//   Download,
//   Play,
//   RotateCcw,
//   Shield,
// } from "lucide-react";

// import { btn, card, inputClass } from "@/lib/utils";

// import {
//   CLIENT_PROCESSORS,
//   CALCULATOR_TOOLS,
//   SEO_FORM_TOOLS,
//   INTERNET_FORM_TOOLS,
//   NO_INPUT_TOOLS,
//   ToolMeta,
//   type ToolStat,
//   type ToolSection,
//   type ToolMeter,
// } from "@/features/tools/client-processors";

// import { FileClientTool } from "./FileClientTool";
// import { ServerFileTool } from "./ServerFileTool";
// import { SpeedTestTool } from "./SpeedTestTool";
// import { PdfTool } from "./PdfTool";
// import PdfEditor from "./pdfeditor/PdfEditor";
// import { ImageTool } from "./ImageTool";
// import { EmailOtpTool } from "./EmailOtpTool";
// import  DeveloperTool  from "./developertools/developertools";

// import { PDF_TOOL_SLUGS } from "./pdf-catalog";
// import { IMAGE_TOOL_SLUGS } from "./image-catalog";
// import { EMAIL_OTP_SLUGS } from "./internet-catalog";

// /* =========================================================
//    DEVELOPER TOOLS
// ========================================================= */

// const DEVELOPER_TOOL_SLUGS = new Set([
//   "json-formatter",
//   "json-validator",
//   "base64",
//   "url-encoder",
//   "uuid-generator",
// ]);

// /* =========================================================
//    HUMANIZER TOOLS
// ========================================================= */

// const HUMANIZER_SLUGS = new Set([
//   "human-summarizer",
//   "humanize-text",
//   "ai-likelihood-detector",
// ]);

// /* =========================================================
//    PROPS
// ========================================================= */

// interface Props {
//   tool: ToolMeta;
// }

// /* =========================================================
//    OUTPUT FONTS
// ========================================================= */

// const OUTPUT_FONTS = [
//   {
//     id: "mono",
//     name: "Monospace",
//     family:
//       "var(--font-mono), ui-monospace, Consolas, monospace",
//   },
//   {
//     id: "sans",
//     name: "Sans Serif",
//     family:
//       "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
//   },
//   {
//     id: "serif",
//     name: "Serif",
//     family:
//       'Georgia, "Times New Roman", Times, serif',
//   },
//   {
//     id: "cursive",
//     name: "Cursive",
//     family:
//       '"Segoe Script", "Comic Sans MS", cursive',
//   },
//   {
//     id: "display",
//     name: "Display",
//     family:
//       'Impact, "Arial Black", sans-serif',
//   },
// ] as const;

// /* =========================================================
//    MAIN TOOL ENGINE
// ========================================================= */

// export function ToolEngine({ tool }: Props) {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [stats, setStats] = useState<ToolStat[] | null>(null);
//   const [sections, setSections] =
//     useState<ToolSection[] | null>(null);
//   const [meter, setMeter] =
//     useState<ToolMeter | null>(null);

//   const [outputFont, setOutputFont] =
//     useState<(typeof OUTPUT_FONTS)[number]["id"]>("mono");

//   const [error, setError] = useState("");

//   const [options, setOptions] =
//     useState<Record<string, unknown>>({});

//   const [status, setStatus] = useState<
//     "idle" | "processing" | "success" | "error"
//   >("idle");

//   /* =======================================================
//      TOOL PROCESSING TYPE
//   ======================================================= */

//   const isServer =
//     tool.processing_type === "server" ||
//     tool.processing_type === "hybrid";

//   /* =======================================================
//      FILE CLIENT TOOLS
//   ======================================================= */

//   const isFileClient = [
//     "resize-image",
//     "jpg-to-png",
//     "png-to-jpg",
//     "webp-converter",
//     "rotate-image",
//     "flip-image",
//     "crop-image",
//   ].includes(tool.slug);

//   /* =======================================================
//      TEXTAREA REQUIREMENT
//   ======================================================= */

//   const needsTextarea =
//     !CALCULATOR_TOOLS.has(tool.slug) &&
//     !SEO_FORM_TOOLS.has(tool.slug) &&
//     !NO_INPUT_TOOLS.has(tool.slug);

//   /* =======================================================
//      RESET WHEN TOOL CHANGES
//   ======================================================= */

//   useEffect(() => {
//     setInput("");
//     setOutput("");
//     setStats(null);
//     setSections(null);
//     setMeter(null);
//     setOutputFont("mono");
//     setError("");
//     setOptions({});
//     setStatus("idle");
//   }, [tool.slug]);

//   /* =======================================================
//      SPECIAL TOOL ROUTING
//   ======================================================= */

//   /*
//    * PDF EDITOR
//    */

//   if (tool.slug === "pdf-editor") {
//     return <PdfEditor tool={tool} />;
//   }

//   /*
//    * PDF TOOLS
//    */

//   if (PDF_TOOL_SLUGS.has(tool.slug)) {
//     return <PdfTool tool={tool} />;
//   }

//   /*
//    * IMAGE TOOLS
//    */

//   if (IMAGE_TOOL_SLUGS.has(tool.slug)) {
//     return <ImageTool tool={tool} />;
//   }

//   /*
//    * DEVELOPER TOOLS
//    *
//    * These are handled by:
//    *
//    * developertools/DeveloperTool.tsx
//    */

//   if (DEVELOPER_TOOL_SLUGS.has(tool.slug)) {
//     return <DeveloperTool slug={tool.slug} />;
//   }

//   /*
//    * SERVER / HYBRID TOOLS
//    */

//   if (
//     isServer &&
//     tool.slug !== "compress-image"
//   ) {
//     return <ServerFileTool tool={tool} />;
//   }

//   /*
//    * INTERNET SPEED TEST
//    */

//   if (tool.slug === "internet-speed-test") {
//     return <SpeedTestTool />;
//   }

//   /*
//    * EMAIL OTP
//    */

//   if (EMAIL_OTP_SLUGS.has(tool.slug)) {
//     return <EmailOtpTool tool={tool} />;
//   }

//   /*
//    * CLIENT FILE TOOLS
//    */

//   if (
//     isFileClient ||
//     tool.slug === "compress-image"
//   ) {
//     return <FileClientTool tool={tool} />;
//   }

//   /* =======================================================
//      GENERIC CLIENT TOOL PROCESSOR
//   ======================================================= */

//   const run = useCallback(async () => {
//     setStatus("processing");
//     setError("");

//     const processor =
//       CLIENT_PROCESSORS[tool.slug];

//     if (!processor) {
//       setError("Tool processor not implemented");
//       setStatus("error");
//       return;
//     }

//     try {
//       const result = await Promise.resolve(
//         processor(input, options)
//       );

//       if (result.error) {
//         setError(result.error);

//         setOutput("");
//         setStats(null);
//         setSections(null);
//         setMeter(null);

//         setStatus("error");
//       } else {
//         setOutput(result.output);

//         setStats(
//           result.stats?.length
//             ? result.stats
//             : null
//         );

//         setSections(
//           result.sections?.length
//             ? result.sections
//             : null
//         );

//         setMeter(result.meter ?? null);

//         setStatus("success");
//       }
//     } catch (e) {
//       setError(
//         e instanceof Error
//           ? e.message
//           : "An unexpected error occurred."
//       );

//       setStatus("error");
//     }
//   }, [
//     input,
//     options,
//     tool.slug,
//   ]);

//   /* =======================================================
//      COPY
//   ======================================================= */

//   const copy = async () => {
//     try {
//       await navigator.clipboard.writeText(
//         output
//       );
//     } catch {
//       setError("Unable to copy result.");
//     }
//   };

//   /* =======================================================
//      DOWNLOAD
//   ======================================================= */

//   const download = () => {
//     const blob = new Blob(
//       [output],
//       {
//         type: "text/plain",
//       }
//     );

//     const url =
//       URL.createObjectURL(blob);

//     const a =
//       document.createElement("a");

//     a.href = url;

//     a.download =
//       `${tool.slug}-result.txt`;

//     document.body.appendChild(a);

//     a.click();

//     a.remove();

//     URL.revokeObjectURL(url);
//   };

//   /* =======================================================
//      CLEAR
//   ======================================================= */

//   const clear = () => {
//     setInput("");
//     setOutput("");
//     setStats(null);
//     setSections(null);
//     setMeter(null);
//     setOutputFont("mono");
//     setError("");
//     setOptions({});
//     setStatus("idle");
//   };

//   /* =======================================================
//      SELECTED OUTPUT FONT
//   ======================================================= */

//   const selectedFont =
//     OUTPUT_FONTS.find(
//       (font) =>
//         font.id === outputFont
//     ) ?? OUTPUT_FONTS[0];

//   /* =======================================================
//      GENERIC TOOL UI
//   ======================================================= */

//   return (
//     <div className={card()}>
//       {/* ===================================================
//           LOCAL PROCESSING NOTICE
//       =================================================== */}

//       {tool.processing_type === "client" && (
//         <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
//           <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

//           <p className="text-xs leading-relaxed text-slate-600">
//             Runs locally in your browser — your
//             input is never sent to our servers.
//           </p>
//         </div>
//       )}

//       {/* ===================================================
//           CALCULATOR FIELDS
//       =================================================== */}

//       {CALCULATOR_TOOLS.has(tool.slug) && (
//         <CalculatorFields
//           slug={tool.slug}
//           options={options}
//           setOptions={setOptions}
//         />
//       )}

//       {/* ===================================================
//           SEO FIELDS
//       =================================================== */}

//       {SEO_FORM_TOOLS.has(tool.slug) && (
//         <SeoFields
//           options={options}
//           setOptions={setOptions}
//         />
//       )}

//       {/* ===================================================
//           INTERNET FIELDS
//       =================================================== */}

//       {INTERNET_FORM_TOOLS.has(tool.slug) && (
//         <InternetFields
//           slug={tool.slug}
//           options={options}
//           setOptions={setOptions}
//         />
//       )}

//       {/* ===================================================
//           CASE CONVERTER
//       =================================================== */}

//       {tool.slug === "case-converter" && (
//         <select
//           className={
//             inputClass + " mb-4"
//           }
//           value={String(
//             options.mode || "upper"
//           )}
//           onChange={(e) =>
//             setOptions({
//               mode: e.target.value,
//             })
//           }
//         >
//           <option value="upper">
//             UPPERCASE
//           </option>

//           <option value="lower">
//             lowercase
//           </option>

//           <option value="title">
//             Title Case
//           </option>

//           <option value="sentence">
//             Sentence case
//           </option>
//         </select>
//       )}

//       {/* ===================================================
//           PASSWORD GENERATOR
//       =================================================== */}

//       {tool.slug ===
//         "password-generator" && (
//         <div className="mb-4 space-y-3">
//           <input
//             type="number"
//             min={4}
//             max={128}
//             placeholder="Length"
//             className={inputClass}
//             defaultValue={16}
//             onChange={(e) =>
//               setOptions({
//                 ...options,
//                 length:
//                   e.target.value,
//               })
//             }
//           />

//           <div className="flex flex-wrap gap-4 text-sm text-slate-500">
//             <label className="inline-flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={
//                   options.includeNumbers !==
//                   false
//                 }
//                 onChange={(e) =>
//                   setOptions({
//                     ...options,
//                     includeNumbers:
//                       e.target.checked,
//                   })
//                 }
//               />

//               Numbers
//             </label>

//             <label className="inline-flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={
//                   options.includeSymbols !==
//                   false
//                 }
//                 onChange={(e) =>
//                   setOptions({
//                     ...options,
//                     includeSymbols:
//                       e.target.checked,
//                   })
//                 }
//               />

//               Symbols
//             </label>
//           </div>
//         </div>
//       )}

//       {/* ===================================================
//           SUMMARIZER / HUMANIZER
//       =================================================== */}

//       {(tool.slug ===
//         "text-summarizer" ||
//         HUMANIZER_SLUGS.has(
//           tool.slug
//         )) && (
//         <input
//           type="number"
//           min={1}
//           max={20}
//           placeholder="Sentences"
//           className={
//             inputClass + " mb-4"
//           }
//           defaultValue={3}
//           onChange={(e) =>
//             setOptions({
//               ...options,
//               sentenceCount:
//                 e.target.value,
//             })
//           }
//         />
//       )}

//       {/* ===================================================
//           KEYWORD / SENTIMENT
//       =================================================== */}

//       {(tool.slug ===
//         "keyword-extractor" ||
//         tool.slug ===
//           "sentiment-analyzer") && (
//         <input
//           type="number"
//           min={1}
//           max={50}
//           placeholder="Keyword count"
//           className={
//             inputClass + " mb-4"
//           }
//           defaultValue={10}
//           onChange={(e) =>
//             setOptions({
//               ...options,
//               count:
//                 e.target.value,
//             })
//           }
//         />
//       )}

//       {/* ===================================================
//           TEXT CASE CONVERTER
//       =================================================== */}

//       {tool.slug ===
//         "text-case-converter" && (
//         <select
//           className={
//             inputClass + " mb-4"
//           }
//           value={String(
//             options.case || "upper"
//           )}
//           onChange={(e) =>
//             setOptions({
//               ...options,
//               case: e.target.value,
//             })
//           }
//         >
//           <option value="upper">
//             UPPERCASE
//           </option>

//           <option value="lower">
//             lowercase
//           </option>

//           <option value="title">
//             Title Case
//           </option>

//           <option value="capitalize">
//             Capitalize
//           </option>
//         </select>
//       )}

//       {/* ===================================================
//           RANDOM TEXT
//       =================================================== */}

//       {tool.slug ===
//         "random-text-generator" && (
//         <input
//           type="number"
//           min={1}
//           max={5000}
//           placeholder="Length"
//           className={
//             inputClass + " mb-4"
//           }
//           defaultValue={100}
//           onChange={(e) =>
//             setOptions({
//               ...options,
//               length:
//                 e.target.value,
//             })
//           }
//         />
//       )}

//       {/* ===================================================
//           KEYWORD DENSITY
//       =================================================== */}

//       {tool.slug ===
//         "keyword-density-checker" && (
//         <input
//           placeholder="Keyword to analyze"
//           className={
//             inputClass + " mb-4"
//           }
//           onChange={(e) =>
//             setOptions({
//               ...options,
//               keyword:
//                 e.target.value,
//             })
//           }
//         />
//       )}

//       {/* ===================================================
//           MAIN TEXTAREA
//       =================================================== */}

//       {needsTextarea && (
//         <textarea
//           value={input}
//           onChange={(e) =>
//             setInput(e.target.value)
//           }
//           placeholder={placeholderFor(
//             tool.slug
//           )}
//           rows={8}
//           className={
//             inputClass +
//             " resize-y font-mono"
//           }
//         />
//       )}

//       {/* ===================================================
//           NO INPUT TOOLS
//       =================================================== */}

//       {NO_INPUT_TOOLS.has(
//         tool.slug
//       ) && (
//         <p className="mb-4 text-sm text-slate-500">
//           {tool.slug ===
//           "what-is-my-ip"
//             ? "Click Process to fetch your public IP address."
//             : "Click Process to generate a result."}
//         </p>
//       )}

//       {/* ===================================================
//           ACTION BUTTONS
//       =================================================== */}

//       <div className="mt-5 flex flex-wrap gap-2">
//         <button
//           onClick={run}
//           disabled={
//             status === "processing"
//           }
//           className={btn("primary")}
//         >
//           <Play className="mr-2 h-4 w-4" />

//           {status === "processing"
//             ? "Processing…"
//             : "Process"}
//         </button>

//         <button
//           onClick={clear}
//           className={btn("secondary")}
//         >
//           <RotateCcw className="mr-2 h-4 w-4" />

//           Clear
//         </button>
//       </div>

//       {/* ===================================================
//           ERROR
//       =================================================== */}

//       {error && (
//         <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       {/* ===================================================
//           HUMANIZER RESULT
//       =================================================== */}

//       {output &&
//         HUMANIZER_SLUGS.has(
//           tool.slug
//         ) && (
//           <HumanizerResult
//             meter={meter}
//             sections={sections}
//             stats={stats}
//             onCopyAll={copy}
//             onDownload={download}
//           />
//         )}

//       {/* ===================================================
//           NORMAL RESULT
//       =================================================== */}

//       {output &&
//         !HUMANIZER_SLUGS.has(
//           tool.slug
//         ) && (
//           <div
//             className={`mt-6 ${
//               stats ||
//               tool.slug ===
//                 "text-summarizer"
//                 ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]"
//                 : ""
//             }`}
//           >
//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <span className="text-sm font-medium">
//                   Result
//                 </span>

//                 <div className="flex gap-1">
//                   <button
//                     onClick={copy}
//                     className={btn(
//                       "ghost"
//                     )}
//                     title="Copy"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </button>

//                   <button
//                     onClick={download}
//                     className={btn(
//                       "ghost"
//                     )}
//                     title="Download"
//                   >
//                     <Download className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               <pre
//                 className={`max-h-96 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap ${
//                   tool.slug ===
//                   "text-summarizer"
//                     ? ""
//                     : "font-mono"
//                 }`}
//                 style={
//                   tool.slug ===
//                   "text-summarizer"
//                     ? {
//                         fontFamily:
//                           selectedFont.family,
//                       }
//                     : undefined
//                 }
//               >
//                 {output}
//               </pre>
//             </div>

//             {(stats ||
//               tool.slug ===
//                 "text-summarizer") && (
//               <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 {stats && (
//                   <>
//                     <p className="mb-3 text-sm font-medium">
//                       {tool.slug ===
//                         "sentiment-analyzer" ||
//                       tool.slug ===
//                         "keyword-extractor"
//                         ? "Analysis"
//                         : "How it shortened"}
//                     </p>

//                     <ul className="space-y-3">
//                       {stats.map(
//                         (stat) => (
//                           <li
//                             key={
//                               stat.label
//                             }
//                             className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
//                           >
//                             <p className="text-[11px] uppercase tracking-wide text-slate-500">
//                               {
//                                 stat.label
//                               }
//                             </p>

//                             <p className="mt-1 text-sm font-medium text-blue-600">
//                               {
//                                 stat.value
//                               }
//                             </p>
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </>
//                 )}

//                 {tool.slug ===
//                   "text-summarizer" && (
//                   <div
//                     className={
//                       stats
//                         ? "mt-4 border-t border-slate-200 pt-4"
//                         : ""
//                     }
//                   >
//                     <p className="text-[11px] uppercase tracking-wide text-slate-500">
//                       Font used
//                     </p>

//                     <p className="mt-1 text-sm font-medium text-blue-600">
//                       {
//                         selectedFont.name
//                       }
//                     </p>

//                     <label className="mt-3 block text-[11px] uppercase tracking-wide text-slate-500">
//                       Change font
//                     </label>

//                     <select
//                       className={
//                         inputClass +
//                         " mt-1"
//                       }
//                       value={
//                         outputFont
//                       }
//                       onChange={(e) =>
//                         setOutputFont(
//                           e.target
//                             .value as (typeof OUTPUT_FONTS)[number]["id"]
//                         )
//                       }
//                     >
//                       {OUTPUT_FONTS.map(
//                         (font) => (
//                           <option
//                             key={
//                               font.id
//                             }
//                             value={
//                               font.id
//                             }
//                           >
//                             {
//                               font.name
//                             }
//                           </option>
//                         )
//                       )}
//                     </select>
//                   </div>
//                 )}
//               </aside>
//             )}
//           </div>
//         )}
//     </div>
//   );
// }

// /* =========================================================
//    HUMANIZER RESULT
// ========================================================= */

// function HumanizerResult({
//   meter,
//   sections,
//   stats,
//   onCopyAll,
//   onDownload,
// }: {
//   meter: ToolMeter | null;
//   sections: ToolSection[] | null;
//   stats: ToolStat[] | null;
//   onCopyAll: () => void;
//   onDownload: () => void;
// }) {
//   const tone =
//     meter?.label === "High"
//       ? {
//           text: "text-rose-600",
//           bar: "bg-rose-500",
//         }
//       : meter?.label === "Medium"
//         ? {
//             text: "text-amber-600",
//             bar: "bg-amber-500",
//           }
//         : {
//             text: "text-emerald-600",
//             bar: "bg-emerald-500",
//           };

//   const score = Math.max(
//     0,
//     Math.min(
//       100,
//       meter?.value ?? 0
//     )
//   );

//   return (
//     <div className="mt-6 space-y-4">
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium">
//           Result
//         </span>

//         <div className="flex gap-1">
//           <button
//             onClick={onCopyAll}
//             className={btn("ghost")}
//             title="Copy all"
//           >
//             <Copy className="h-4 w-4" />
//           </button>

//           <button
//             onClick={onDownload}
//             className={btn("ghost")}
//             title="Download"
//           >
//             <Download className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {meter && (
//         <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//           <div className="flex items-end justify-between gap-4">
//             <div>
//               <p className="text-[11px] uppercase tracking-wide text-slate-500">
//                 AI likelihood
//               </p>

//               <p
//                 className={`mt-1 text-2xl font-semibold ${tone.text}`}
//               >
//                 {meter.label}
//               </p>
//             </div>

//             <div className="text-right">
//               <p className="text-3xl font-semibold tabular-nums">
//                 {score}
//               </p>

//               <p className="text-[11px] text-slate-500">
//                 out of 100
//               </p>
//             </div>
//           </div>

//           <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
//             <div
//               className={`h-full rounded-full ${tone.bar}`}
//               style={{
//                 width: `${score}%`,
//               }}
//             />
//           </div>

//           <p className="mt-3 text-xs leading-relaxed text-slate-500">
//             Heuristic estimate only —
//             not a reliable AI detector.
//           </p>
//         </div>
//       )}

//       <div className="grid gap-4 lg:grid-cols-2">
//         {(sections || []).map(
//           (section) => (
//             <div
//               key={section.id}
//               className="flex min-h-[180px] flex-col rounded-xl border border-slate-200 bg-slate-50"
//             >
//               <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
//                 <p className="text-sm font-medium">
//                   {section.title}
//                 </p>

//                 <button
//                   type="button"
//                   className={
//                     btn("ghost") +
//                     " !px-2 !py-1"
//                   }
//                   title={`Copy ${section.title}`}
//                   onClick={() =>
//                     navigator.clipboard.writeText(
//                       section.text
//                     )
//                   }
//                 >
//                   <Copy className="h-3.5 w-3.5" />
//                 </button>
//               </div>

//               <p className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-slate-600">
//                 {section.text}
//               </p>
//             </div>
//           )
//         )}
//       </div>

//       {stats && (
//         <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
//           {stats.map(
//             (stat) => (
//               <div
//                 key={stat.label}
//                 className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
//               >
//                 <p className="text-[11px] uppercase tracking-wide text-slate-500">
//                   {stat.label}
//                 </p>

//                 <p className="mt-1 text-sm font-medium text-blue-600">
//                   {stat.value}
//                 </p>
//               </div>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    PLACEHOLDERS
// ========================================================= */

// function placeholderFor(
//   slug: string
// ) {
//   const map: Record<
//     string,
//     string
//   > = {
//     "url-parser":
//       "https://example.com/path?key=value",

//     "url-encoder":
//       "hello world",

//     "url-decoder":
//       "hello%20world",

//     "url-validator":
//       "https://example.com",

//     "query-parser":
//       "https://example.com/search?q=tools&page=1",

//     "dns-lookup":
//       "example.com",

//     "a-record-lookup":
//       "example.com",

//     "redirect-checker":
//       "https://example.com",

//     "http-status-checker":
//       "https://example.com",

//     "email-extractor":
//       "Contact us at hello@example.com and support@example.com",

//     "user-agent-parser":
//       "Paste a User-Agent string…",

//     "ip-validator":
//       "192.168.1.1 or 2001:db8::1",

//     "cidr-calculator":
//       "192.168.1.0/24",

//     "email-validator":
//       "user@example.com",

//     "text-summarizer":
//       "Paste an article or long text to summarize…",

//     "human-summarizer":
//       "Paste long or AI-sounding text to detect, humanize, and summarize…",

//     "ai-likelihood-detector":
//       "Paste long or AI-sounding text to detect, humanize, and summarize…",

//     "humanize-text":
//       "Paste long or AI-sounding text to detect, humanize, and summarize…",

//     "text-analyzer":
//       "Paste text to count words, characters and sentences…",

//     "keyword-extractor":
//       "Paste a review or article to get sentiment and keywords…",

//     "sentiment-analyzer":
//       "Paste a review or article to get sentiment and keywords…",

//     "text-case-converter":
//       "Paste text to convert case…",

//     "text-cleaner":
//       "Paste text with extra spaces or line breaks…",

//     "slug-generator":
//       "My Blog Post Title",

//     "jwt-decoder":
//       "Paste your JWT token here…",

//     "http-status-lookup":
//       "404",

//     "mac-address-formatter":
//       "AABBCCDDEEFF",

//     "color-picker":
//       "#3b82f6",
//   };

//   return (
//     map[slug] ||
//     "Enter or paste your input here…"
//   );
// }

// /* =========================================================
//    CALCULATOR FIELDS
// ========================================================= */

// function CalculatorFields({
//   slug,
//   options,
//   setOptions,
// }: {
//   slug: string;
//   options: Record<
//     string,
//     unknown
//   >;
//   setOptions: (
//     options: Record<
//       string,
//       unknown
//     >
//   ) => void;
// }) {
//   const set = (
//     key: string,
//     value: string
//   ) => {
//     setOptions({
//       ...options,
//       [key]: value,
//     });
//   };

//   if (
//     slug === "emi-calculator" ||
//     slug === "loan-calculator"
//   ) {
//     return (
//       <div className="mb-4 grid gap-3 sm:grid-cols-3">
//         <input
//           placeholder="Principal (₹)"
//           type="number"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "principal",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="Rate (% p.a.)"
//           type="number"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "rate",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="Tenure (years)"
//           type="number"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "tenure",
//               e.target.value
//             )
//           }
//         />
//       </div>
//     );
//   }

//   if (
//     slug === "bmi-calculator"
//   ) {
//     return (
//       <div className="mb-4 grid gap-3 sm:grid-cols-2">
//         <input
//           placeholder="Weight (kg)"
//           type="number"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "weight",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="Height (cm)"
//           type="number"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "height",
//               e.target.value
//             )
//           }
//         />
//       </div>
//     );
//   }

//   if (
//     slug === "age-calculator"
//   ) {
//     return (
//       <input
//         type="date"
//         className={
//           inputClass + " mb-4"
//         }
//         onChange={(e) =>
//           set(
//             "dob",
//             e.target.value
//           )
//         }
//       />
//     );
//   }

//   if (
//     slug === "unit-converter" ||
//     slug === "data-converter" ||
//     slug === "currency-converter"
//   ) {
//     return (
//       <div className="mb-4 grid gap-3 sm:grid-cols-3">
//         <input
//           placeholder="Value"
//           type="number"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "value",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="From"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "from",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="To"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "to",
//               e.target.value
//             )
//           }
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="mb-4 grid gap-3 sm:grid-cols-2">
//       <input
//         placeholder="Value"
//         type="number"
//         className={inputClass}
//         onChange={(e) =>
//           set(
//             "value",
//             e.target.value
//           )
//         }
//       />

//       <input
//         placeholder="Percent / Rate"
//         type="number"
//         className={inputClass}
//         onChange={(e) =>
//           set(
//             "percent",
//             e.target.value
//           )
//         }
//       />
//     </div>
//   );
// }

// /* =========================================================
//    SEO FIELDS
// ========================================================= */

// function SeoFields({
//   options,
//   setOptions,
// }: {
//   options: Record<
//     string,
//     unknown
//   >;
//   setOptions: (
//     options: Record<
//       string,
//       unknown
//     >
//   ) => void;
// }) {
//   const set = (
//     key: string,
//     value: string
//   ) => {
//     setOptions({
//       ...options,
//       [key]: value,
//     });
//   };

//   return (
//     <div className="mb-4 space-y-3">
//       <input
//         placeholder="Title"
//         className={inputClass}
//         onChange={(e) =>
//           set(
//             "title",
//             e.target.value
//           )
//         }
//       />

//       <input
//         placeholder="Description"
//         className={inputClass}
//         onChange={(e) =>
//           set(
//             "description",
//             e.target.value
//           )
//         }
//       />

//       <input
//         placeholder="URL"
//         className={inputClass}
//         onChange={(e) =>
//           set(
//             "url",
//             e.target.value
//           )
//         }
//       />
//     </div>
//   );
// }

// /* =========================================================
//    INTERNET FIELDS
// ========================================================= */

// function InternetFields({
//   slug,
//   options,
//   setOptions,
// }: {
//   slug: string;
//   options: Record<
//     string,
//     unknown
//   >;
//   setOptions: (
//     options: Record<
//       string,
//       unknown
//     >
//   ) => void;
// }) {
//   const set = (
//     key: string,
//     value: string
//   ) => {
//     setOptions({
//       ...options,
//       [key]: value,
//     });
//   };

//   if (slug === "dns-lookup") {
//     return (
//       <select
//         className={
//           inputClass + " mb-4"
//         }
//         value={String(
//           options.type || "A"
//         )}
//         onChange={(e) =>
//           setOptions({
//             ...options,
//             type: e.target.value,
//           })
//         }
//       >
//         <option value="A">
//           A (IPv4)
//         </option>

//         <option value="AAAA">
//           AAAA (IPv6)
//         </option>

//         <option value="CNAME">
//           CNAME
//         </option>

//         <option value="MX">
//           MX
//         </option>

//         <option value="TXT">
//           TXT
//         </option>

//         <option value="NS">
//           NS
//         </option>
//       </select>
//     );
//   }

//   if (
//     slug ===
//     "mac-address-formatter"
//   ) {
//     return (
//       <select
//         className={
//           inputClass + " mb-4"
//         }
//         value={String(
//           options.format ||
//             "colon"
//         )}
//         onChange={(e) =>
//           setOptions({
//             ...options,
//             format:
//               e.target.value,
//           })
//         }
//       >
//         <option value="colon">
//           Colon
//           (AA:BB:CC:DD:EE:FF)
//         </option>

//         <option value="dash">
//           Dash
//           (AA-BB-CC-DD-EE-FF)
//         </option>

//         <option value="dot">
//           Dot
//           (AABB.CCDD.EEFF)
//         </option>
//       </select>
//     );
//   }

//   if (
//     slug ===
//     "generate-random-email"
//   ) {
//     return (
//       <div className="mb-4 grid gap-3 sm:grid-cols-2">
//         <input
//           placeholder="Domain (example.com)"
//           className={inputClass}
//           defaultValue="example.com"
//           onChange={(e) =>
//             set(
//               "domain",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="Username length (5–30)"
//           type="number"
//           min={5}
//           max={30}
//           className={inputClass}
//           defaultValue={10}
//           onChange={(e) =>
//             set(
//               "usernameLength",
//               e.target.value
//             )
//           }
//         />
//       </div>
//     );
//   }

//   if (
//     slug === "generate-otp"
//   ) {
//     return (
//       <div className="mb-4 grid gap-3 sm:grid-cols-2">
//         <input
//           placeholder="OTP length (4–8)"
//           type="number"
//           min={4}
//           max={8}
//           className={inputClass}
//           defaultValue={6}
//           onChange={(e) =>
//             set(
//               "otpLength",
//               e.target.value
//             )
//           }
//         />

//         <input
//           placeholder="Expiry seconds"
//           type="number"
//           min={30}
//           className={inputClass}
//           defaultValue={300}
//           onChange={(e) =>
//             set(
//               "expirySeconds",
//               e.target.value
//             )
//           }
//         />
//       </div>
//     );
//   }

//   if (
//     slug === "verify-otp"
//   ) {
//     return (
//       <input
//         placeholder="Enter the OTP to verify"
//         className={`${inputClass} mb-4`}
//         onChange={(e) =>
//           set(
//             "userOtp",
//             e.target.value
//           )
//         }
//       />
//     );
//   }

//   if (
//     slug === "query-builder"
//   ) {
//     return (
//       <div className="mb-4 space-y-3">
//         <input
//           placeholder="Base URL (https://example.com/search)"
//           className={inputClass}
//           onChange={(e) =>
//             set(
//               "baseUrl",
//               e.target.value
//             )
//           }
//         />

//         <textarea
//           placeholder={
//             "Parameters, one per line:\nq=tools\npage=1"
//           }
//           className={`${inputClass} min-h-28`}
//           onChange={(e) =>
//             set(
//               "params",
//               e.target.value
//             )
//           }
//         />
//       </div>
//     );
//   }

//   return null;
// }



"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Copy,
  Download,
  Play,
  RotateCcw,
  Shield,
  Globe,
  Settings2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { btn, card, inputClass } from "@/lib/utils";

import {
  CLIENT_PROCESSORS,
  CALCULATOR_TOOLS,
  SEO_FORM_TOOLS,
  INTERNET_FORM_TOOLS,
  NO_INPUT_TOOLS,
  ToolMeta,
  type ToolStat,
  type ToolSection,
  type ToolMeter,
} from "@/features/tools/client-processors";

import { FileClientTool } from "./FileClientTool";
import { ServerFileTool } from "./ServerFileTool";
import { SpeedTestTool } from "./SpeedTestTool";
import { PdfTool } from "./PdfTool";
import PdfEditor from "./pdfeditor/PdfEditor";
import { ImageTool } from "./ImageTool";
import { EmailOtpTool } from "./EmailOtpTool";
import DeveloperTool from "./developertools/developertools";

import { PDF_TOOL_SLUGS } from "./pdf-catalog";
import { IMAGE_TOOL_SLUGS } from "./image-catalog";
import { EMAIL_OTP_SLUGS } from "./internet-catalog";

/* =========================================================
   DEVELOPER TOOLS
========================================================= */

const DEVELOPER_TOOL_SLUGS = new Set([
  "json-formatter",
  "json-validator",
  "base64",
  "uuid-generator",
]);

/*
 * IMPORTANT:
 * url-encoder is intentionally NOT here.
 * It belongs to Internet Tools.
 */

/* =========================================================
   HUMANIZER TOOLS
========================================================= */

const HUMANIZER_SLUGS = new Set([
  "human-summarizer",
  "humanize-text",
  "ai-likelihood-detector",
]);

/* =========================================================
   PROPS
========================================================= */

interface Props {
  tool: ToolMeta;
}

/* =========================================================
   OUTPUT FONTS
========================================================= */

const OUTPUT_FONTS = [
  {
    id: "mono",
    name: "Monospace",
    family:
      "var(--font-mono), ui-monospace, Consolas, monospace",
  },
  {
    id: "sans",
    name: "Sans Serif",
    family:
      "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "serif",
    name: "Serif",
    family:
      'Georgia, "Times New Roman", Times, serif',
  },
  {
    id: "cursive",
    name: "Cursive",
    family:
      '"Segoe Script", "Comic Sans MS", cursive',
  },
  {
    id: "display",
    name: "Display",
    family:
      'Impact, "Arial Black", sans-serif',
  },
] as const;

/* =========================================================
   MAIN TOOL ENGINE
========================================================= */

export function ToolEngine({ tool }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [stats, setStats] =
    useState<ToolStat[] | null>(null);

  const [sections, setSections] =
    useState<ToolSection[] | null>(null);

  const [meter, setMeter] =
    useState<ToolMeter | null>(null);

  const [outputFont, setOutputFont] =
    useState<(typeof OUTPUT_FONTS)[number]["id"]>("mono");

  const [error, setError] = useState("");

  const [options, setOptions] =
    useState<Record<string, unknown>>({});

  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  /* =======================================================
     TOOL PROCESSING TYPE
  ======================================================= */

  const isServer =
    tool.processing_type === "server" ||
    tool.processing_type === "hybrid";

  /* =======================================================
     FILE CLIENT TOOLS
  ======================================================= */

  const isFileClient = [
    "resize-image",
    "jpg-to-png",
    "png-to-jpg",
    "webp-converter",
    "rotate-image",
    "flip-image",
    "crop-image",
  ].includes(tool.slug);

  /* =======================================================
     TEXTAREA REQUIREMENT
  ======================================================= */

  const needsTextarea =
    !CALCULATOR_TOOLS.has(tool.slug) &&
    !SEO_FORM_TOOLS.has(tool.slug) &&
    !NO_INPUT_TOOLS.has(tool.slug);

  /* =======================================================
     RESET WHEN TOOL CHANGES
  ======================================================= */

  useEffect(() => {
    setInput("");
    setOutput("");
    setStats(null);
    setSections(null);
    setMeter(null);
    setOutputFont("mono");
    setError("");
    setOptions({});
    setStatus("idle");
  }, [tool.slug]);

  /* =======================================================
     SPECIAL TOOL ROUTING
  ======================================================= */

  if (tool.slug === "pdf-editor") {
    return <PdfEditor tool={tool} />;
  }

  if (PDF_TOOL_SLUGS.has(tool.slug)) {
    return <PdfTool tool={tool} />;
  }

  if (IMAGE_TOOL_SLUGS.has(tool.slug)) {
    return <ImageTool tool={tool} />;
  }

  /*
   * INTERNET TOOLS
   *
   * This comes before DeveloperTool so URL Encoder
   * is treated as an Internet Tool.
   */

  if (
    tool.category_slug === "internet" &&
    !EMAIL_OTP_SLUGS.has(tool.slug) &&
    tool.slug !== "internet-speed-test" &&
    !isServer
  ) {
    // Continue into the generic Internet UI below.
  }

  if (DEVELOPER_TOOL_SLUGS.has(tool.slug)) {
    return <DeveloperTool slug={tool.slug} />;
  }

  if (
    isServer &&
    tool.slug !== "compress-image"
  ) {
    return <ServerFileTool tool={tool} />;
  }

  if (tool.slug === "internet-speed-test") {
    return <SpeedTestTool />;
  }

  if (EMAIL_OTP_SLUGS.has(tool.slug)) {
    return <EmailOtpTool tool={tool} />;
  }

  if (
    isFileClient ||
    tool.slug === "compress-image"
  ) {
    return <FileClientTool tool={tool} />;
  }

  /* =======================================================
     GENERIC CLIENT PROCESSOR
  ======================================================= */

  const run = useCallback(async () => {
    setStatus("processing");
    setError("");

    const processor =
      CLIENT_PROCESSORS[tool.slug];

    if (!processor) {
      setError("Tool processor not implemented");
      setStatus("error");
      return;
    }

    try {
      const result = await Promise.resolve(
        processor(input, options)
      );

      if (result.error) {
        setError(result.error);

        setOutput("");
        setStats(null);
        setSections(null);
        setMeter(null);

        setStatus("error");
      } else {
        setOutput(result.output);

        setStats(
          result.stats?.length
            ? result.stats
            : null
        );

        setSections(
          result.sections?.length
            ? result.sections
            : null
        );

        setMeter(result.meter ?? null);

        setStatus("success");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "An unexpected error occurred."
      );

      setStatus("error");
    }
  }, [
    input,
    options,
    tool.slug,
  ]);

  /* =======================================================
     COPY
  ======================================================= */

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Unable to copy result.");
    }
  };

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const download = () => {
    const blob = new Blob(
      [output],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      `${tool.slug}-result.txt`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clear = () => {
    setInput("");
    setOutput("");
    setStats(null);
    setSections(null);
    setMeter(null);
    setOutputFont("mono");
    setError("");
    setOptions({});
    setStatus("idle");
  };

  /* =======================================================
     SELECTED OUTPUT FONT
  ======================================================= */

  const selectedFont =
    OUTPUT_FONTS.find(
      (font) =>
        font.id === outputFont
    ) ?? OUTPUT_FONTS[0];

  /* =======================================================
     GENERIC TOOL UI
  ======================================================= */

  return (
    <div
      className={`${card()} overflow-hidden !p-0`}
    >
      {/* ===================================================
          TOOL HEADER
      =================================================== */}

      <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm shadow-blue-500/20">
            {tool.category_slug === "internet" ? (
              <Globe className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              {tool.name}
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {tool.short_description}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="p-5 sm:p-6">
        {/* =================================================
            LOCAL PROCESSING NOTICE
        ================================================= */}

        {tool.processing_type === "client" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
              <Shield className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-900">
                Private browser processing
              </p>

              <p className="mt-0.5 text-xs leading-relaxed text-blue-700/80">
                Runs locally in your browser — your
                input is never sent to our servers.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            INPUT SECTION LABEL
        ================================================= */}

        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <Settings2 className="h-3.5 w-3.5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Tool Options
            </p>

            <p className="text-xs text-slate-500">
              Configure your input before processing
            </p>
          </div>
        </div>

        {/* =================================================
            CALCULATOR FIELDS
        ================================================= */}

        {CALCULATOR_TOOLS.has(tool.slug) && (
          <CalculatorFields
            slug={tool.slug}
            options={options}
            setOptions={setOptions}
          />
        )}

        {/* =================================================
            SEO FIELDS
        ================================================= */}

        {SEO_FORM_TOOLS.has(tool.slug) && (
          <SeoFields
            options={options}
            setOptions={setOptions}
          />
        )}

        {/* =================================================
            INTERNET FIELDS
        ================================================= */}

        {INTERNET_FORM_TOOLS.has(tool.slug) && (
          <InternetFields
            slug={tool.slug}
            options={options}
            setOptions={setOptions}
          />
        )}

        {/* =================================================
            CASE CONVERTER
        ================================================= */}

        {tool.slug === "case-converter" && (
          <FieldWrapper
            label="Conversion mode"
            hint="Choose how your text should be transformed"
          >
            <select
              className={inputClass}
              value={String(
                options.mode || "upper"
              )}
              onChange={(e) =>
                setOptions({
                  ...options,
                  mode: e.target.value,
                })
              }
            >
              <option value="upper">
                UPPERCASE
              </option>

              <option value="lower">
                lowercase
              </option>

              <option value="title">
                Title Case
              </option>

              <option value="sentence">
                Sentence case
              </option>
            </select>
          </FieldWrapper>
        )}

        {/* =================================================
            PASSWORD GENERATOR
        ================================================= */}

        {tool.slug === "password-generator" && (
          <FieldWrapper
            label="Password settings"
            hint="Choose password length and character types"
          >
            <div className="space-y-3">
              <input
                type="number"
                min={4}
                max={128}
                placeholder="Length"
                className={inputClass}
                defaultValue={16}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    length: e.target.value,
                  })
                }
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50">
                  <input
                    type="checkbox"
                    checked={
                      options.includeNumbers !== false
                    }
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        includeNumbers:
                          e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-blue-500"
                  />

                  <span>Include numbers</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50">
                  <input
                    type="checkbox"
                    checked={
                      options.includeSymbols !== false
                    }
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        includeSymbols:
                          e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-blue-500"
                  />

                  <span>Include symbols</span>
                </label>
              </div>
            </div>
          </FieldWrapper>
        )}

        {/* =================================================
            SUMMARIZER / HUMANIZER
        ================================================= */}

        {(tool.slug === "text-summarizer" ||
          HUMANIZER_SLUGS.has(tool.slug)) && (
          <FieldWrapper
            label="Summary length"
            hint="Choose how many sentences you want"
          >
            <input
              type="number"
              min={1}
              max={20}
              placeholder="Number of sentences"
              className={inputClass}
              defaultValue={3}
              onChange={(e) =>
                setOptions({
                  ...options,
                  sentenceCount:
                    e.target.value,
                })
              }
            />
          </FieldWrapper>
        )}

        {/* =================================================
            KEYWORD / SENTIMENT
        ================================================= */}

        {(tool.slug === "keyword-extractor" ||
          tool.slug === "sentiment-analyzer") && (
          <FieldWrapper
            label="Analysis count"
            hint="Choose how many keywords to analyze"
          >
            <input
              type="number"
              min={1}
              max={50}
              placeholder="Keyword count"
              className={inputClass}
              defaultValue={10}
              onChange={(e) =>
                setOptions({
                  ...options,
                  count: e.target.value,
                })
              }
            />
          </FieldWrapper>
        )}

        {/* =================================================
            TEXT CASE CONVERTER
        ================================================= */}

        {tool.slug === "text-case-converter" && (
          <FieldWrapper
            label="Text case"
            hint="Select the case you want to apply"
          >
            <select
              className={inputClass}
              value={String(
                options.case || "upper"
              )}
              onChange={(e) =>
                setOptions({
                  ...options,
                  case: e.target.value,
                })
              }
            >
              <option value="upper">
                UPPERCASE
              </option>

              <option value="lower">
                lowercase
              </option>

              <option value="title">
                Title Case
              </option>

              <option value="capitalize">
                Capitalize
              </option>
            </select>
          </FieldWrapper>
        )}

        {/* =================================================
            RANDOM TEXT
        ================================================= */}

        {tool.slug === "random-text-generator" && (
          <FieldWrapper
            label="Text length"
            hint="Choose the generated text length"
          >
            <input
              type="number"
              min={1}
              max={5000}
              placeholder="Length"
              className={inputClass}
              defaultValue={100}
              onChange={(e) =>
                setOptions({
                  ...options,
                  length: e.target.value,
                })
              }
            />
          </FieldWrapper>
        )}

        {/* =================================================
            KEYWORD DENSITY
        ================================================= */}

        {tool.slug === "keyword-density-checker" && (
          <FieldWrapper
            label="Keyword"
            hint="Enter the keyword you want to analyze"
          >
            <input
              placeholder="Keyword to analyze"
              className={inputClass}
              onChange={(e) =>
                setOptions({
                  ...options,
                  keyword: e.target.value,
                })
              }
            />
          </FieldWrapper>
        )}

        {/* =================================================
            MAIN TEXTAREA
        ================================================= */}

        {needsTextarea && (
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Input
              </label>

              <span className="text-xs text-slate-400">
                {input.length} characters
              </span>
            </div>

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder={placeholderFor(
                tool.slug
              )}
              rows={8}
              className={`${inputClass} min-h-[180px] resize-y rounded-xl border-slate-200 bg-white font-mono text-sm shadow-sm transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
            />
          </div>
        )}

        {/* =================================================
            NO INPUT TOOLS
        ================================================= */}

        {NO_INPUT_TOOLS.has(tool.slug) && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
              <Play className="h-3.5 w-3.5" />
            </div>

            <p className="text-sm text-blue-800">
              {tool.slug === "what-is-my-ip"
                ? "Click Process to fetch your public IP address."
                : "Click Process to generate a result."}
            </p>
          </div>
        )}

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={run}
            disabled={status === "processing"}
            className={`${btn("primary")} !h-11 flex-1 justify-center !rounded-xl bg-blue-500 shadow-sm shadow-blue-500/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-7`}
          >
            <Play className="mr-2 h-4 w-4" />

            {status === "processing"
              ? "Processing…"
              : "Process"}
          </button>

          <button
            onClick={clear}
            className={`${btn("secondary")} !h-11 justify-center !rounded-xl border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600`}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

            <p className="text-sm leading-relaxed text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {status === "success" && output && (
          <div className="mt-6 flex items-center gap-2 text-xs text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Processing completed successfully.
          </div>
        )}

        {/* =================================================
            HUMANIZER RESULT
        ================================================= */}

        {output &&
          HUMANIZER_SLUGS.has(tool.slug) && (
            <HumanizerResult
              meter={meter}
              sections={sections}
              stats={stats}
              onCopyAll={copy}
              onDownload={download}
            />
          )}

        {/* =================================================
            NORMAL RESULT
        ================================================= */}

        {output &&
          !HUMANIZER_SLUGS.has(tool.slug) && (
            <div
              className={`mt-6 ${
                stats ||
                tool.slug === "text-summarizer"
                  ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]"
                  : ""
              }`}
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                      <FileText className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      Result
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={copy}
                      className={`${btn("ghost")} !rounded-lg !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600`}
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    <button
                      onClick={download}
                      className={`${btn("ghost")} !rounded-lg !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600`}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <pre
                  className={`max-h-96 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap ${
                    tool.slug === "text-summarizer"
                      ? ""
                      : "font-mono"
                  }`}
                  style={
                    tool.slug === "text-summarizer"
                      ? {
                          fontFamily:
                            selectedFont.family,
                        }
                      : undefined
                  }
                >
                  {output}
                </pre>
              </div>

              {(stats ||
                tool.slug === "text-summarizer") && (
                <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  {stats && (
                    <>
                      <p className="mb-4 text-sm font-semibold text-slate-800">
                        {tool.slug ===
                            "sentiment-analyzer" ||
                        tool.slug ===
                            "keyword-extractor"
                          ? "Analysis"
                          : "How it shortened"}
                      </p>

                      <ul className="space-y-3">
                        {stats.map((stat) => (
                          <li
                            key={stat.label}
                            className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                          >
                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                              {stat.label}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-blue-600">
                              {stat.value}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {tool.slug ===
                    "text-summarizer" && (
                    <div
                      className={
                        stats
                          ? "mt-4 border-t border-slate-200 pt-4"
                          : ""
                      }
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Font used
                      </p>

                      <p className="mt-1 text-sm font-semibold text-blue-600">
                        {selectedFont.name}
                      </p>

                      <label className="mt-4 block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Change font
                      </label>

                      <select
                        className={`${inputClass} mt-1`}
                        value={outputFont}
                        onChange={(e) =>
                          setOutputFont(
                            e.target
                              .value as (typeof OUTPUT_FONTS)[number]["id"]
                          )
                        }
                      >
                        {OUTPUT_FONTS.map(
                          (font) => (
                            <option
                              key={font.id}
                              value={font.id}
                            >
                              {font.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}
                </aside>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

/* =========================================================
   FIELD WRAPPER
========================================================= */

function FieldWrapper({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="mb-2">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>

        {hint && (
          <p className="mt-0.5 text-xs text-slate-400">
            {hint}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   HUMANIZER RESULT
========================================================= */

function HumanizerResult({
  meter,
  sections,
  stats,
  onCopyAll,
  onDownload,
}: {
  meter: ToolMeter | null;
  sections: ToolSection[] | null;
  stats: ToolStat[] | null;
  onCopyAll: () => void;
  onDownload: () => void;
}) {
  const tone =
    meter?.label === "High"
      ? {
          text: "text-rose-600",
          bar: "bg-rose-500",
          bg: "bg-rose-50",
          border: "border-rose-100",
        }
      : meter?.label === "Medium"
        ? {
            text: "text-amber-600",
            bar: "bg-amber-500",
            bg: "bg-amber-50",
            border: "border-amber-100",
          }
        : {
            text: "text-emerald-600",
            bar: "bg-emerald-500",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          };

  const score = Math.max(
    0,
    Math.min(
      100,
      meter?.value ?? 0
    )
  );

  return (
    <div className="mt-7 space-y-4">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <Sparkles className="h-3.5 w-3.5" />
          </div>

          <span className="text-sm font-semibold text-slate-800">
            Analysis Result
          </span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onCopyAll}
            className={`${btn("ghost")} !rounded-lg !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600`}
            title="Copy all"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            onClick={onDownload}
            className={`${btn("ghost")} !rounded-lg !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600`}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* METER */}

      {meter && (
        <div
          className={`rounded-xl border ${tone.border} ${tone.bg} p-5`}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                AI likelihood
              </p>

              <p
                className={`mt-1 text-2xl font-bold ${tone.text}`}
              >
                {meter.label}
              </p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-slate-800">
                {score}
              </p>

              <p className="text-[10px] text-slate-500">
                out of 100
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className={`h-full rounded-full ${tone.bar}`}
              style={{
                width: `${score}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Heuristic estimate only — not a reliable
            AI detector.
          </p>
        </div>
      )}

      {/* SECTIONS */}

      <div className="grid gap-4 lg:grid-cols-2">
        {(sections || []).map((section) => (
          <div
            key={section.id}
            className="flex min-h-[180px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">
                {section.title}
              </p>

              <button
                type="button"
                className={`${btn("ghost")} !rounded-lg !px-2 !py-1 !text-slate-500 hover:!bg-blue-50 hover:!text-blue-600`}
                title={`Copy ${section.title}`}
                onClick={() =>
                  navigator.clipboard.writeText(
                    section.text
                  )
                }
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="flex-1 overflow-auto p-4 text-sm leading-relaxed text-slate-600">
              {section.text}
            </p>
          </div>
        ))}
      </div>

      {/* STATS */}

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>

              <p className="mt-1 text-sm font-semibold text-blue-600">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PLACEHOLDERS
========================================================= */

function placeholderFor(slug: string) {
  const map: Record<string, string> = {
    "url-parser":
      "https://example.com/path?key=value",

    "url-encoder":
      "hello world",

    "url-decoder":
      "hello%20world",

    "url-validator":
      "https://example.com",

    "query-parser":
      "https://example.com/search?q=tools&page=1",

    "dns-lookup":
      "example.com",

    "a-record-lookup":
      "example.com",

    "aaaa-record-lookup":
      "example.com",

    "mx-record-lookup":
      "example.com",

    "txt-record-lookup":
      "example.com",

    "ns-record-lookup":
      "example.com",

    "cname-record-lookup":
      "example.com",

    "redirect-checker":
      "https://example.com",

    "http-status-checker":
      "https://example.com",

    "http-header-checker":
      "https://example.com",

    "website-response-time":
      "https://example.com",

    "website-metadata":
      "https://example.com",

    "website-text-extractor":
      "https://example.com",

    "link-extractor":
      "https://example.com",

    "robots-txt-checker":
      "https://example.com",

    "sitemap-checker":
      "https://example.com",

    "email-extractor":
      "Contact us at hello@example.com and support@example.com",

    "user-agent-parser":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",

    "ip-validator":
      "192.168.1.1 or 2001:db8::1",

    "cidr-calculator":
      "192.168.1.0/24",

    "email-validator":
      "user@example.com",

    "text-summarizer":
      "Paste an article or long text to summarize…",

    "human-summarizer":
      "Paste long or AI-sounding text to detect, humanize, and summarize…",

    "ai-likelihood-detector":
      "Paste long or AI-sounding text to detect, humanize, and summarize…",

    "humanize-text":
      "Paste long or AI-sounding text to detect, humanize, and summarize…",

    "text-analyzer":
      "Paste text to count words, characters and sentences…",

    "keyword-extractor":
      "Paste a review or article to get sentiment and keywords…",

    "sentiment-analyzer":
      "Paste a review or article to get sentiment and keywords…",

    "text-case-converter":
      "Paste text to convert case…",

    "text-cleaner":
      "Paste text with extra spaces or line breaks…",

    "slug-generator":
      "My Blog Post Title",

    "jwt-decoder":
      "Paste your JWT token here…",

    "http-status-lookup":
      "404",

    "mac-address-formatter":
      "AABBCCDDEEFF",

    "color-picker":
      "#3b82f6",
  };

  return (
    map[slug] ||
    "Enter or paste your input here…"
  );
}

/* =========================================================
   CALCULATOR FIELDS
========================================================= */

function CalculatorFields({
  slug,
  options,
  setOptions,
}: {
  slug: string;
  options: Record<string, unknown>;
  setOptions: (
    options: Record<string, unknown>
  ) => void;
}) {
  const set = (
    key: string,
    value: string
  ) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  if (
    slug === "emi-calculator" ||
    slug === "loan-calculator"
  ) {
    return (
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <FieldInput
          label="Principal"
          placeholder="Principal (₹)"
          type="number"
          onChange={(value) =>
            set("principal", value)
          }
        />

        <FieldInput
          label="Interest rate"
          placeholder="Rate (% p.a.)"
          type="number"
          onChange={(value) =>
            set("rate", value)
          }
        />

        <FieldInput
          label="Tenure"
          placeholder="Tenure (years)"
          type="number"
          onChange={(value) =>
            set("tenure", value)
          }
        />
      </div>
    );
  }

  if (slug === "bmi-calculator") {
    return (
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <FieldInput
          label="Weight"
          placeholder="Weight (kg)"
          type="number"
          onChange={(value) =>
            set("weight", value)
          }
        />

        <FieldInput
          label="Height"
          placeholder="Height (cm)"
          type="number"
          onChange={(value) =>
            set("height", value)
          }
        />
      </div>
    );
  }

  if (slug === "age-calculator") {
    return (
      <FieldWrapper
        label="Date of birth"
        hint="Select your date of birth"
      >
        <input
          type="date"
          className={inputClass}
          onChange={(e) =>
            set("dob", e.target.value)
          }
        />
      </FieldWrapper>
    );
  }

  if (
    slug === "unit-converter" ||
    slug === "data-converter" ||
    slug === "currency-converter"
  ) {
    return (
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <FieldInput
          label="Value"
          placeholder="Value"
          type="number"
          onChange={(value) =>
            set("value", value)
          }
        />

        <FieldInput
          label="From"
          placeholder="From"
          onChange={(value) =>
            set("from", value)
          }
        />

        <FieldInput
          label="To"
          placeholder="To"
          onChange={(value) =>
            set("to", value)
          }
        />
      </div>
    );
  }

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2">
      <FieldInput
        label="Value"
        placeholder="Value"
        type="number"
        onChange={(value) =>
          set("value", value)
        }
      />

      <FieldInput
        label="Percent / Rate"
        placeholder="Percent / Rate"
        type="number"
        onChange={(value) =>
          set("percent", value)
        }
      />
    </div>
  );
}

/* =========================================================
   FIELD INPUT
========================================================= */

function FieldInput({
  label,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className={inputClass}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

/* =========================================================
   SEO FIELDS
========================================================= */

function SeoFields({
  options,
  setOptions,
}: {
  options: Record<string, unknown>;
  setOptions: (
    options: Record<string, unknown>
  ) => void;
}) {
  const set = (
    key: string,
    value: string
  ) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  return (
    <div className="mb-5 space-y-4">
      <FieldInput
        label="Title"
        placeholder="Page title"
        onChange={(value) =>
          set("title", value)
        }
      />

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          Description
        </label>

        <textarea
          placeholder="Meta description"
          className={`${inputClass} min-h-28 resize-y`}
          onChange={(e) =>
            set(
              "description",
              e.target.value
            )
          }
        />
      </div>

      <FieldInput
        label="URL"
        placeholder="https://example.com/page"
        onChange={(value) =>
          set("url", value)
        }
      />
    </div>
  );
}

/* =========================================================
   INTERNET FIELDS
========================================================= */

function InternetFields({
  slug,
  options,
  setOptions,
}: {
  slug: string;
  options: Record<string, unknown>;
  setOptions: (
    options: Record<string, unknown>
  ) => void;
}) {
  const set = (
    key: string,
    value: string
  ) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  /* =======================================================
     DNS
  ======================================================= */

  if (slug === "dns-lookup") {
    return (
      <FieldWrapper
        label="DNS record type"
        hint="Choose which DNS record you want to look up"
      >
        <select
          className={inputClass}
          value={String(
            options.type || "A"
          )}
          onChange={(e) =>
            setOptions({
              ...options,
              type: e.target.value,
            })
          }
        >
          <option value="A">
            A — IPv4 address
          </option>

          <option value="AAAA">
            AAAA — IPv6 address
          </option>

          <option value="CNAME">
            CNAME — Alias
          </option>

          <option value="MX">
            MX — Mail server
          </option>

          <option value="TXT">
            TXT — Text record
          </option>

          <option value="NS">
            NS — Name server
          </option>
        </select>
      </FieldWrapper>
    );
  }

  /* =======================================================
     MAC FORMATTER
  ======================================================= */

  if (slug === "mac-address-formatter") {
    return (
      <FieldWrapper
        label="MAC address format"
        hint="Choose how the MAC address should be displayed"
      >
        <select
          className={inputClass}
          value={String(
            options.format || "colon"
          )}
          onChange={(e) =>
            setOptions({
              ...options,
              format: e.target.value,
            })
          }
        >
          <option value="colon">
            Colon — AA:BB:CC:DD:EE:FF
          </option>

          <option value="dash">
            Dash — AA-BB-CC-DD-EE-FF
          </option>

          <option value="dot">
            Dot — AABB.CCDD.EEFF
          </option>
        </select>
      </FieldWrapper>
    );
  }

  /* =======================================================
     RANDOM EMAIL
  ======================================================= */

  if (slug === "generate-random-email") {
    return (
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <FieldInput
          label="Email domain"
          placeholder="example.com"
          onChange={(value) =>
            set("domain", value)
          }
        />

        <FieldInput
          label="Username length"
          placeholder="5–30 characters"
          type="number"
          onChange={(value) =>
            set(
              "usernameLength",
              value
            )
          }
        />
      </div>
    );
  }

  /* =======================================================
     OTP
  ======================================================= */

  if (slug === "generate-otp") {
    return (
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <FieldInput
          label="OTP length"
          placeholder="4–8 digits"
          type="number"
          onChange={(value) =>
            set("otpLength", value)
          }
        />

        <FieldInput
          label="Expiry"
          placeholder="Expiry seconds"
          type="number"
          onChange={(value) =>
            set(
              "expirySeconds",
              value
            )
          }
        />
      </div>
    );
  }

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  if (slug === "verify-otp") {
    return (
      <FieldWrapper
        label="OTP"
        hint="Enter the one-time password you want to verify"
      >
        <input
          placeholder="Enter OTP"
          inputMode="numeric"
          className={inputClass}
          onChange={(e) =>
            set(
              "userOtp",
              e.target.value
            )
          }
        />
      </FieldWrapper>
    );
  }

  /* =======================================================
     QUERY BUILDER
  ======================================================= */

  if (slug === "query-builder") {
    return (
      <div className="mb-5 space-y-4">
        <FieldInput
          label="Base URL"
          placeholder="https://example.com/search"
          onChange={(value) =>
            set("baseUrl", value)
          }
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            Parameters
          </label>

          <p className="mb-2 text-xs text-slate-400">
            Add one key=value parameter per line.
          </p>

          <textarea
            placeholder={
              "q=tools\npage=1\nsort=latest"
            }
            className={`${inputClass} min-h-32 resize-y font-mono`}
            onChange={(e) =>
              set(
                "params",
                e.target.value
              )
            }
          />
        </div>
      </div>
    );
  }

  return null;
}