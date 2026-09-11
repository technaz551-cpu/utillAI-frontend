"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, RotateCcw, Shield, Upload } from "lucide-react";
import { btn, card, inputClass } from "@/lib/utils";
import type { ToolMeta } from "@/features/tools/client-processors";

type Format = "jpeg" | "png" | "webp";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function defaultFormat(slug: string): Format {
  if (slug === "jpg-to-png") return "png";
  if (slug === "png-to-jpg") return "jpeg";
  if (slug === "webp-converter") return "webp";
  if (slug === "compress-image") return "jpeg";
  return "jpeg";
}

function formatLocked(slug: string) {
  return slug === "jpg-to-png" || slug === "png-to-jpg";
}

function needsQuality(format: Format, slug: string) {
  if (format === "png" && slug !== "compress-image") return false;
  return format === "jpeg" || format === "webp" || slug === "compress-image";
}

function extFor(format: Format) {
  return format === "jpeg" ? "jpg" : format;
}

function mimeFor(format: Format) {
  return format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
}

function hintFor(slug: string) {
  const map: Record<string, string> = {
    "image-converter": "Upload an image and choose JPG, PNG or WebP as the output.",
    "jpg-to-png": "Upload a JPG to convert it to PNG.",
    "png-to-jpg": "Upload a PNG to convert it to JPG.",
    "webp-converter": "Convert to or from WebP. Choose the output format below.",
    "compress-image": "Upload an image and lower the quality to reduce file size.",
    "resize-image": "Set a target width. Height is calculated to keep the aspect ratio.",
    "crop-image": "Choose an aspect ratio. The image is cropped from the center.",
    "rotate-image": "Rotate the image 90°, 180° or 270°.",
    "flip-image": "Mirror the image horizontally or vertically.",
  };
  return map[slug] || "Drop an image or click to upload.";
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

function cropRect(width: number, height: number, aspect: string) {
  if (aspect === "original") return { x: 0, y: 0, w: width, h: height };
  const [aw, ah] = aspect.split(":").map(Number);
  const target = aw / ah;
  const current = width / height;
  if (current > target) {
    const w = height * target;
    return { x: (width - w) / 2, y: 0, w, h: height };
  }
  const h = width / target;
  return { x: 0, y: (height - h) / 2, w: width, h };
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create image."))), mime, quality);
  });
}

export function ImageTool({ tool }: { tool: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [format, setFormat] = useState<Format>(defaultFormat(tool.slug));
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState(800);
  const [rotation, setRotation] = useState(90);
  const [flip, setFlip] = useState<"horizontal" | "vertical">("horizontal");
  const [aspect, setAspect] = useState("1:1");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const accept = useMemo(
    () => (tool.accepted_formats?.length ? tool.accepted_formats.map((f) => `.${f}`).join(",") : "image/*"),
    [tool.accepted_formats],
  );
  const showFormat = tool.slug === "image-converter" || tool.slug === "webp-converter";
  const showQuality = needsQuality(format, tool.slug);

  useEffect(() => {
    setFile(null);
    setFormat(defaultFormat(tool.slug));
    setQuality(80);
    setWidth(800);
    setRotation(90);
    setFlip("horizontal");
    setAspect("1:1");
    setStatus("idle");
    setError("");
    setResultName("");
    setResultSize(0);
    imgRef.current = null;
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }, [tool.slug]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [preview, resultUrl]);

  const addFile = async (list: FileList | File[]) => {
    const allowed = new Set((tool.accepted_formats || ["jpg", "jpeg", "png", "webp"]).map((f) => f.toLowerCase()));
    const next = Array.from(list).find((item) => {
      const ext = item.name.split(".").pop()?.toLowerCase();
      return ext ? allowed.has(ext) : item.type.startsWith("image/");
    });
    if (!next) {
      setError(`Please choose ${[...allowed].join(", ").toUpperCase()} file(s).`);
      setStatus("error");
      return;
    }
    try {
      const img = await loadImage(next);
      imgRef.current = img;
      setWidth(img.width);
      const url = URL.createObjectURL(next);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setFile(next);
      setStatus("idle");
      setError("");
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const run = async () => {
    const img = imgRef.current;
    if (!img || !file) return;
    setStatus("processing");
    setError("");
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    try {
      const outFormat: Format = tool.slug === "jpg-to-png" ? "png"
        : tool.slug === "png-to-jpg" ? "jpeg"
        : tool.slug === "image-converter" || tool.slug === "webp-converter" || tool.slug === "compress-image" ? format
        : file.type.includes("png") ? "png"
        : file.type.includes("webp") ? "webp"
        : "jpeg";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not process image.");

      if (tool.slug === "rotate-image") {
        const swap = rotation === 90 || rotation === 270;
        canvas.width = swap ? img.height : img.width;
        canvas.height = swap ? img.width : img.height;
        if (outFormat === "jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else if (tool.slug === "flip-image") {
        canvas.width = img.width;
        canvas.height = img.height;
        if (outFormat === "jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        if (flip === "horizontal") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        } else {
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
        }
        ctx.drawImage(img, 0, 0);
      } else if (tool.slug === "crop-image") {
        const rect = cropRect(img.width, img.height, aspect);
        canvas.width = Math.round(rect.w);
        canvas.height = Math.round(rect.h);
        if (outFormat === "jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, canvas.width, canvas.height);
      } else {
        let w = img.width;
        let h = img.height;
        if (tool.slug === "resize-image") {
          w = Math.max(1, width);
          h = Math.round(img.height * (w / img.width));
        }
        canvas.width = w;
        canvas.height = h;
        if (outFormat === "jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
      }
      const blob = await canvasToBlob(canvas, mimeFor(outFormat), quality / 100);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      const name = `${base}-${tool.slug}.${extFor(outFormat)}`;
      setResultUrl(URL.createObjectURL(blob));
      setResultName(name);
      setResultSize(blob.size);
      setStatus("done");
    } catch (e) {
      setError((e as Error).message || "Processing failed");
      setStatus("error");
    }
  };

  const clear = () => {
    setFile(null);
    imgRef.current = null;
    setError("");
    setStatus("idle");
    setResultName("");
    setResultSize(0);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  };

  return (
    <div className={card()}>
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
        <p className="text-xs leading-relaxed text-cyan-200/80">
          Runs locally in your browser — your files are never sent to our servers.
        </p>
      </div>

      <p className="mb-4 text-sm text-[var(--muted)]">{hintFor(tool.slug)}</p>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) void addFile(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          dragOver ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[#0d121c] hover:border-[var(--accent)]"
        }`}
      >
        <Upload className="mb-3 h-10 w-10 text-[var(--muted)]" />
        <span className="text-sm text-[var(--muted)]">Drop an image or click to upload</span>
        <span className="mt-1 text-xs text-[var(--muted)]">{accept.replaceAll(".", "").toUpperCase()}</span>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void addFile(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {file && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          {file.name} · {formatSize(file.size)}
          {imgRef.current ? ` · ${imgRef.current.width}×${imgRef.current.height}` : ""}
        </p>
      )}

      {showFormat && (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Output format</label>
          <select className={inputClass} value={format} onChange={(e) => setFormat(e.target.value as Format)} disabled={formatLocked(tool.slug)}>
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      )}

      {tool.slug === "resize-image" && (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Width (px)</label>
          <input type="number" min={1} max={8000} value={width} onChange={(e) => setWidth(Number(e.target.value))} className={inputClass} />
        </div>
      )}

      {tool.slug === "rotate-image" && (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Rotation</label>
          <select className={inputClass} value={rotation} onChange={(e) => setRotation(Number(e.target.value))}>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
        </div>
      )}

      {tool.slug === "flip-image" && (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Direction</label>
          <select className={inputClass} value={flip} onChange={(e) => setFlip(e.target.value as "horizontal" | "vertical")}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
      )}

      {tool.slug === "crop-image" && (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs text-[var(--muted)]">Aspect ratio</label>
          <select className={inputClass} value={aspect} onChange={(e) => setAspect(e.target.value)}>
            <option value="1:1">1:1 Square</option>
            <option value="4:3">4:3</option>
            <option value="3:2">3:2</option>
            <option value="16:9">16:9</option>
            <option value="original">Original</option>
          </select>
        </div>
      )}

      {showQuality && (
        <div className="mt-4">
          <label className="text-xs text-[var(--muted)]">Quality: {quality}%</label>
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full accent-[var(--accent)]" />
        </div>
      )}

      {preview && <img src={preview} alt="Preview" className="mt-4 max-h-56 rounded-xl border border-[var(--border)]" />}

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => void run()} disabled={!file || status === "processing"} className={btn("primary")}>
          {status === "processing" ? "Processing…" : "Process"}
        </button>
        <button onClick={clear} className={btn("secondary")}>
          <RotateCcw className="mr-2 h-4 w-4" /> Clear
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {status === "done" && resultUrl && (
        <div className="mt-4">
          <a href={resultUrl} download={resultName} className={btn("secondary") + " inline-flex"}>
            <Download className="mr-2 h-4 w-4" /> Download {resultName} ({formatSize(resultSize)})
          </a>
          <img src={resultUrl} alt="Result" className="mt-4 max-h-56 rounded-xl border border-[var(--border)]" />
        </div>
      )}
    </div>
  );
}
