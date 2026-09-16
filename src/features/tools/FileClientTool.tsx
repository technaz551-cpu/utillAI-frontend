"use client";

import { useState, useRef } from "react";
import { Upload, Download } from "lucide-react";
import { btn, card } from "@/lib/utils";
import { ToolMeta } from "@/features/tools/client-processors";

export function FileClientTool({ tool }: { tool: ToolMeta }) {
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState(800);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
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
    <div className={card()}>
      <p className="mb-4 rounded-lg bg-emerald-950/50 px-3 py-2 text-xs text-emerald-400">🔒 Your file stays on your device — processed in your browser.</p>
      <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-700 px-6 py-10">
        <Upload className="mb-2 h-8 w-8 text-slate-500" />
        <span className="text-sm text-slate-400">Upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {tool.slug === "resize-image" && (
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Width (px)" />
      )}
      {(tool.slug === "compress-image" || tool.slug.includes("jpg") || tool.slug.includes("webp")) && (
        <div className="mt-3">
          <label className="text-xs text-slate-400">Quality: {quality}%</label>
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
        </div>
      )}
      {preview && <img src={preview} alt="Preview" className="mt-4 max-h-48 rounded-lg" />}
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-4 flex gap-2">
        <button onClick={process} disabled={!preview} className={btn("primary")}>Process</button>
        {result && <button onClick={download} className={btn("secondary")}><Download className="mr-2 h-4 w-4" />Download</button>}
      </div>
      {result && <img src={result} alt="Result" className="mt-4 max-h-48 rounded-lg" />}
    </div>
  );
}
