// "use client";

// import { useState, useRef } from "react";
// import { Upload, Download } from "lucide-react";
// import { btn, card } from "@/lib/utils";
// import { ToolMeta } from "@/features/tools/client-processors";

// export function FileClientTool({ tool }: { tool: ToolMeta }) {
//   const [preview, setPreview] = useState("");
//   const [result, setResult] = useState("");
//   const [quality, setQuality] = useState(80);
//   const [width, setWidth] = useState(800);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const imgRef = useRef<HTMLImageElement | null>(null);

//   const handleFile = (file: File) => {
//     const url = URL.createObjectURL(file);
//     setPreview(url);
//     const img = new Image();
//     img.onload = () => { imgRef.current = img; };
//     img.src = url;
//   };

//   const process = () => {
//     const img = imgRef.current;
//     const canvas = canvasRef.current;
//     if (!img || !canvas) return;
//     const ctx = canvas.getContext("2d")!;
//     let w = img.width, h = img.height;
//     if (tool.slug === "resize-image") { w = width; h = Math.round(img.height * (width / img.width)); }
//     canvas.width = w;
//     canvas.height = h;
//     if (tool.slug === "flip-image") { ctx.scale(-1, 1); ctx.drawImage(img, -w, 0, w, h); ctx.setTransform(1, 0, 0, 1, 0, 0); }
//     else if (tool.slug === "rotate-image") { ctx.translate(w / 2, h / 2); ctx.rotate(Math.PI / 2); ctx.drawImage(img, -h / 2, -w / 2, h, w); }
//     else ctx.drawImage(img, 0, 0, w, h);

//     const mime = tool.slug.includes("png") && !tool.slug.includes("jpg") ? "image/png"
//       : tool.slug.includes("webp") ? "image/webp" : "image/jpeg";
//     setResult(canvas.toDataURL(mime, quality / 100));
//   };

//   const download = () => {
//     const a = document.createElement("a");
//     a.href = result;
//     a.download = `${tool.slug}-output.${tool.slug.includes("png") ? "png" : "jpg"}`;
//     a.click();
//   };

//   return (
//     <div className={card()}>
//       <p className="mb-4 rounded-lg bg-emerald-950/50 px-3 py-2 text-xs text-emerald-400">🔒 Your file stays on your device — processed in your browser.</p>
//       <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-700 px-6 py-10">
//         <Upload className="mb-2 h-8 w-8 text-slate-500" />
//         <span className="text-sm text-slate-400">Upload image</span>
//         <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
//       </label>
//       {tool.slug === "resize-image" && (
//         <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Width (px)" />
//       )}
//       {(tool.slug === "compress-image" || tool.slug.includes("jpg") || tool.slug.includes("webp")) && (
//         <div className="mt-3">
//           <label className="text-xs text-slate-400">Quality: {quality}%</label>
//           <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
//         </div>
//       )}
//       {preview && <img src={preview} alt="Preview" className="mt-4 max-h-48 rounded-lg" />}
//       <canvas ref={canvasRef} className="hidden" />
//       <div className="mt-4 flex gap-2">
//         <button onClick={process} disabled={!preview} className={btn("primary")}>Process</button>
//         {result && <button onClick={download} className={btn("secondary")}><Download className="mr-2 h-4 w-4" />Download</button>}
//       </div>
//       {result && <img src={result} alt="Result" className="mt-4 max-h-48 rounded-lg" />}
//     </div>
//   );
// }
"use client";

import { useState, useRef } from "react";
import { Download, FileImage, Upload } from "lucide-react";
import { btn, card } from "@/lib/utils";
import { ToolMeta } from "@/features/tools/client-processors";

export function FileClientTool({ tool }: { tool: ToolMeta }) {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState(800);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    setResult("");
    const img = new Image();
    img.onload = () => { imgRef.current = img; };
    img.src = url;
  };

  const process = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = img.width, h = img.height;
    if (tool.slug === "resize-image") { w = width; h = Math.round(img.height * (width / img.width)); }
    canvas.width = w;
    canvas.height = h;
    if (tool.slug === "flip-image") { ctx.scale(-1, 1); ctx.drawImage(img, -w, 0, w, h); ctx.setTransform(1, 0, 0, 1, 0, 0); }
    else if (tool.slug === "rotate-image") { ctx.translate(w / 2, h / 2); ctx.rotate(Math.PI / 2); ctx.drawImage(img, -h / 2, -w / 2, h, w); }
    else ctx.drawImage(img, 0, 0, w, h);

    const mime = tool.slug.includes("png") && !tool.slug.includes("jpg") ? "image/png"
      : tool.slug.includes("webp") ? "image/webp" : "image/jpeg";
    setResult(canvas.toDataURL(mime, quality / 100));
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = result;
    a.download = `${tool.slug}-output.${tool.slug.includes("png") ? "png" : "jpg"}`;
    a.click();
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
      <p className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5 text-xs leading-relaxed text-slate-600">🔒 Your file stays on your device — processed in your browser.</p>
      <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Upload className="h-4 w-4" /></span>
        <div>
          <p className="text-sm font-semibold text-slate-800">Input</p>
          <p className="text-xs text-slate-500">Choose an image to process</p>
        </div>
      </div>
      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/60">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm ring-1 ring-slate-200">
          <Upload className="h-6 w-6" />
        </span>
        <span className="text-sm font-semibold text-slate-800">
          {fileName || "Drop an image here or browse"}
        </span>
        <span className="mt-1 text-xs text-slate-500">JPG · PNG · WEBP</span>
        <input
          type="file"
          accept={tool.accepted_formats?.map((format) => `.${format}`).join(",") || "image/*"}
          className="hidden"
          onChange={(event) =>
            event.target.files?.[0] && handleFile(event.target.files[0])
          }
        />
      </label>
      {tool.slug === "resize-image" && (
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700" placeholder="Width (px)" />
      )}
      {(tool.slug === "compress-image" || tool.slug.includes("jpg") || tool.slug.includes("webp")) && (
        <div className="mt-3">
          <label className="text-xs text-slate-500">Quality: {quality}%</label>
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
        </div>
      )}
      {preview && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <img src={preview} alt="Selected input preview" className="mx-auto max-h-48 rounded-lg object-contain" />
        </div>
      )}
      </section>
      <section className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${result ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}><FileImage className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Output</p>
            <p className="text-xs text-slate-500">{result ? "Your processed image is ready" : "The result will appear here"}</p>
          </div>
        </div>
        {result ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-emerald-100 bg-white p-3">
            <img src={result} alt="Processed output preview" className="max-h-56 rounded-lg object-contain" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
            <FileImage className="h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">No output yet</p>
            <p className="mt-1 text-xs text-slate-400">Upload an image, then process it</p>
          </div>
        )}
      </section>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={process} disabled={!preview} className={btn("primary") + " !h-11 flex-1 justify-center !rounded-xl"}>
          Process image
        </button>
        {result && (
          <button onClick={download} className={btn("secondary") + " !h-11 justify-center !rounded-xl"}>
            <Download className="mr-2 h-4 w-4" /> Download output
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
