"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Eraser,
  FileText,
  Loader2,
  Lock,
  RotateCcw,
  RotateCw,
  ShieldCheck,
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
/* Shared pieces                                                       */
/* ================================================================== */

type Status = "idle" | "processing" | "done" | "error";

const fmt = (b: number) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(2)} MB`;

const btnPrimary =
  "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50";
const btnGhost =
  "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600";
const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400";
const panel = "mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4";

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

function Shell({ tool, children }: { tool: ToolMeta; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Your files stay private
          </p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            Files are processed locally in your browser and are never uploaded
            to our servers.
          </p>
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900">{tool.name}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DropZone({
  onFile,
  accept = ".pdf",
  label = "Drop your PDF here",
}: {
  onFile: (f: File) => void;
  accept?: string;
  label?: string;
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
      className={`group flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
        over
          ? "border-blue-500 bg-blue-500 text-white"
          : "border-slate-200 bg-slate-50/70 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
      }`}
    >
      <Upload className="mb-3 h-7 w-7" />
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-1 text-sm opacity-70">or click to browse</span>
      <input
        type="file"
        accept={accept}
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

function ErrorBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      <X className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function Busy({ text }: { text: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
      <Loader2 className="h-5 w-5 animate-spin" />
      {text}
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
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-6 py-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <CheckCircle2 className="h-9 w-9 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Your file is ready
        </h2>
        {result.note && (
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {result.note}
          </p>
        )}
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <FileText className="h-6 w-6 text-red-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {result.filename}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {fmt(result.size)} • PDF
            </p>
          </div>
        </div>
        <a
          href={result.url}
          download={result.filename}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Download className="h-5 w-5" />
          Download {result.filename}
        </a>
        <button onClick={onReset} className={`${btnGhost} mt-3 w-full`}>
          <RotateCcw className="h-4 w-4" />
          Process another file
        </button>
      </div>
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
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onRun}
        disabled={disabled || busy}
        className={btnPrimary}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          label
        )}
      </button>
      <button type="button" onClick={onClear} className={btnGhost}>
        <RotateCcw className="h-4 w-4" /> Clear
      </button>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block text-xs font-medium text-slate-600">
    <span className="mb-1 block">{label}</span>
    {children}
  </label>
);

const iconBtn =
  "flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40";

/** File load + thumbnails, har tool mein reuse hota hai */
function usePdfFile(width = 180) {
  const [file, setFile] = useState<File | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (f: File) => {
    if (!/\.pdf$/i.test(f.name)) {
      setErr("Please choose a PDF file.");
      return;
    }
    setErr("");
    setFile(f);
    setLoading(true);
    try {
      setThumbs(await renderThumbs(f, width));
    } catch {
      setErr("PDF ke pages load nahi ho sake (file kharab ya password wali ho sakti hai).");
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

/* ================================================================== */
/* 1. Organize PDF: reorder + delete + rotate + page numbers           */
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

  if (r.status === "done" && r.result)
    return <ResultCard result={r.result} onReset={() => { r.reset(); clear(); }} />;

  return (
    <Shell tool={tool}>
      <p className="mb-4 text-sm text-slate-500">
        Pages ko drag karke reorder karein, delete/rotate karein, aur chahein to
        page numbers lagayein.
      </p>
      {!file && <DropZone onFile={pick} />}
      {loading && <Busy text="Pages load ho rahe hain..." />}
      <ErrorBox text={err || r.error} />

      {file && !loading && (
        <>
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate font-medium text-slate-700">{file.name}</span>
            <span>{items.length} / {thumbs.length} pages</span>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                className={`rounded-2xl border bg-white p-2 transition-all ${
                  drag === pos ? "border-blue-500 opacity-50" : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={thumbs[it.index]}
                    alt={`Page ${it.index + 1}`}
                    draggable={false}
                    className="max-h-full max-w-full object-contain transition-transform"
                    style={{ transform: `rotate(${it.rotation}deg)` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    {pos + 1}
                    <span className="text-slate-400"> (orig {it.index + 1})</span>
                  </span>
                </div>
                <div className="mt-1.5 flex justify-between">
                  <button className={iconBtn} disabled={pos === 0} onClick={() => move(pos, pos - 1)} title="Move left">
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className={iconBtn}
                    title="Rotate"
                    onClick={() =>
                      setItems(items.map((x, i) => i === pos ? { ...x, rotation: (x.rotation + 90) % 360 } : x))
                    }
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button className={iconBtn} title="Delete" onClick={() => setItems(items.filter((_, i) => i !== pos))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button className={iconBtn} disabled={pos === items.length - 1} onClick={() => move(pos, pos + 1)} title="Move right">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={panel}>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={num.enabled}
                onChange={(e) => setNum({ ...num, enabled: e.target.checked })}
                className="h-4 w-4 accent-blue-600"
              />
              Add page numbers
            </label>
            {num.enabled && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Position">
                  <select className={input} value={num.position} onChange={(e) => setNum({ ...num, position: e.target.value as NumberingOptions["position"] })}>
                    {["bottom-center", "bottom-left", "bottom-right", "top-center", "top-left", "top-right"].map((p) => (
                      <option key={p} value={p}>{p.replace("-", " ")}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Format">
                  <select className={input} value={num.format} onChange={(e) => setNum({ ...num, format: e.target.value as NumberingOptions["format"] })}>
                    <option value="n">1, 2, 3</option>
                    <option value="n-of-total">1 / 10</option>
                    <option value="page-n">Page 1</option>
                  </select>
                </Field>
                <Field label="Start number">
                  <input type="number" min={0} className={input} value={num.start} onChange={(e) => setNum({ ...num, start: Number(e.target.value) || 1 })} />
                </Field>
                <Field label="Font size">
                  <input type="number" min={6} max={48} className={input} value={num.fontSize} onChange={(e) => setNum({ ...num, fontSize: Number(e.target.value) || 12 })} />
                </Field>
              </div>
            )}
          </div>

          <Actions
            label="Save organized PDF"
            busy={r.status === "processing"}
            disabled={!items.length}
            onRun={() => r.run(() => organizePdf(file, items, num))}
            onClear={() => { clear(); r.reset(); }}
          />
        </>
      )}
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
  const [crop, setCrop] = useState<CropMargins>({ top: 0, right: 0, bottom: 0, left: 0 });

  const rotateAll = (d: number) =>
    setRot(Object.fromEntries(thumbs.map((_, i) => [i, (((rot[i] || 0) + d) % 360 + 360) % 360])));

  const setSide = (k: keyof CropMargins, v: number) =>
    setCrop({ ...crop, [k]: Math.max(0, Math.min(45, v || 0)) });

  const reset = () => { clear(); r.reset(); setRot({}); setCrop({ top: 0, right: 0, bottom: 0, left: 0 }); };

  if (r.status === "done" && r.result) return <ResultCard result={r.result} onReset={reset} />;

  return (
    <Shell tool={tool}>
      <p className="mb-4 text-sm text-slate-500">
        Pages rotate karein aur margins crop karein. Crop sab pages par lagta hai.
      </p>
      {!file && <DropZone onFile={pick} />}
      {loading && <Busy text="Pages load ho rahe hain..." />}
      <ErrorBox text={err || r.error} />

      {file && !loading && (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <button className={btnGhost} onClick={() => rotateAll(-90)}><RotateCcw className="h-4 w-4" /> All left</button>
            <button className={btnGhost} onClick={() => rotateAll(90)}><RotateCw className="h-4 w-4" /> All right</button>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {thumbs.map((src, i) => (
              <li key={i} className="rounded-2xl border border-slate-200 bg-white p-2">
                <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  <div
                    className="relative transition-transform"
                    style={{ transform: `rotate(${rot[i] || 0}deg)` }}
                  >
                    <img src={src} alt={`Page ${i + 1}`} className="max-h-40 object-contain" draggable={false} />
                    {/* crop preview */}
                    <div
                      className="pointer-events-none absolute border-2 border-dashed border-blue-500 bg-blue-500/10"
                      style={{
                        top: `${crop.top}%`,
                        right: `${crop.right}%`,
                        bottom: `${crop.bottom}%`,
                        left: `${crop.left}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Page {i + 1}</span>
                  <div className="flex gap-1">
                    <button className={iconBtn} onClick={() => setRot({ ...rot, [i]: (((rot[i] || 0) - 90) % 360 + 360) % 360 })}><RotateCcw className="h-3.5 w-3.5" /></button>
                    <button className={iconBtn} onClick={() => setRot({ ...rot, [i]: ((rot[i] || 0) + 90) % 360 })}><RotateCw className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className={panel}>
            <p className="mb-3 text-sm font-semibold text-slate-800">Crop margins (%)</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["top", "right", "bottom", "left"] as const).map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                  <input type="number" min={0} max={45} className={input} value={crop[k]} onChange={(e) => setSide(k, Number(e.target.value))} />
                </Field>
              ))}
            </div>
          </div>

          <Actions
            label="Apply & save"
            busy={r.status === "processing"}
            onRun={() => r.run(() => rotateCropPdf(file, rot, crop))}
            onClear={reset}
          />
        </>
      )}
    </Shell>
  );
}

/* ================================================================== */
/* 3. Watermark + Signature                                            */
/* ================================================================== */

function readAsDataUrl(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(new Error("Image read nahi ho saki"));
    fr.readAsDataURL(f);
  });
}

function SignaturePad({ onChange }: { onChange: (url: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const pos = (e: React.PointerEvent) => {
    const c = ref.current!;
    const b = c.getBoundingClientRect();
    return { x: ((e.clientX - b.left) * c.width) / b.width, y: ((e.clientY - b.top) * c.height) / b.height };
  };
  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    ref.current!.setPointerCapture(e.pointerId);
    const ctx = ref.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = "#0f172a";
    ctx.beginPath(); ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const { x, y } = pos(e);
    const ctx = ref.current!.getContext("2d")!;
    ctx.lineTo(x, y); ctx.stroke();
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
      <canvas
        ref={ref}
        width={600}
        height={200}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        className="h-32 w-full touch-none rounded-xl border border-dashed border-slate-300 bg-white"
      />
      <button type="button" onClick={clearPad} className={`${btnGhost} mt-2 min-h-9 px-3 py-1.5 text-xs`}>
        <Eraser className="h-3.5 w-3.5" /> Clear pad
      </button>
    </div>
  );
}

export function WatermarkTool({ tool }: { tool: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const r = useRunner();

  const [wmAction, setWmAction] = useState<"none" | "add" | "remove">("none");
  const [wmKind, setWmKind] = useState<"text" | "image">("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(64);
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(45);
  const [color, setColor] = useState("#64748b");
  const [wmImg, setWmImg] = useState("");
  const [wmImgW, setWmImgW] = useState(50);

  const [sigAction, setSigAction] = useState<"none" | "add" | "replace" | "remove">("none");
  const [sigSrc, setSigSrc] = useState<"draw" | "upload">("draw");
  const [sigImg, setSigImg] = useState("");
  const [sigPages, setSigPages] = useState<SignatureOptions["pages"]>("last");
  const [sigPos, setSigPos] = useState<SignatureOptions["position"]>("bottom-right");
  const [sigW, setSigW] = useState(25);

  const reset = () => { setFile(null); r.reset(); };
  if (r.status === "done" && r.result) return <ResultCard result={r.result} onReset={reset} />;

  const needsSig = sigAction === "add" || sigAction === "replace";
  const invalid =
    (wmAction === "none" && sigAction === "none") ||
    (wmAction === "add" && (wmKind === "text" ? !text.trim() : !wmImg)) ||
    (needsSig && !sigImg);

  const go = () => {
    if (!file) return;
    const wmOptions: WatermarkOptions | undefined =
      wmAction !== "add" ? undefined
      : wmKind === "text"
        ? { kind: "text", text, fontSize, opacity, rotation: angle, color }
        : { kind: "image", dataUrl: wmImg, widthPct: wmImgW, opacity, rotation: angle };
    r.run(() =>
      watermarkPdf(file, {
        watermark: { action: wmAction, options: wmOptions },
        signature: {
          action: sigAction,
          options: needsSig ? { dataUrl: sigImg, pages: sigPages, position: sigPos, widthPct: sigW } : undefined,
        },
      }),
    );
  };

  return (
    <Shell tool={tool}>
      <p className="mb-4 text-sm text-slate-500">
        Watermark aur signature add, remove ya replace karein. Remove sirf wahi cheezain hota hai
        jo isi tool ne lagayi hon.
      </p>
      {!file && <DropZone onFile={(f) => /\.pdf$/i.test(f.name) ? setFile(f) : r.setError("Please choose a PDF file.")} />}
      <ErrorBox text={r.error} />

      {file && (
        <>
          <p className="mb-2 truncate text-sm font-medium text-slate-700">{file.name}</p>

          {/* Watermark */}
          <div className={panel}>
            <Field label="Watermark">
              <select className={input} value={wmAction} onChange={(e) => setWmAction(e.target.value as typeof wmAction)}>
                <option value="none">Kuch nahi</option>
                <option value="add">Add watermark</option>
                <option value="remove">Remove (is tool ka lagaya hua)</option>
              </select>
            </Field>

            {wmAction === "add" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Type">
                  <select className={input} value={wmKind} onChange={(e) => setWmKind(e.target.value as typeof wmKind)}>
                    <option value="text">Text</option>
                    <option value="image">Image / logo</option>
                  </select>
                </Field>
                {wmKind === "text" ? (
                  <>
                    <Field label="Text"><input className={input} value={text} onChange={(e) => setText(e.target.value)} /></Field>
                    <Field label={`Font size: ${fontSize}`}><input type="range" min={16} max={160} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-blue-600" /></Field>
                    <Field label="Color"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200" /></Field>
                  </>
                ) : (
                  <>
                    <Field label="Image (PNG/JPG)">
                      <input type="file" accept=".png,.jpg,.jpeg" className={input} onChange={async (e) => { const f = e.target.files?.[0]; if (f) setWmImg(await readAsDataUrl(f)); }} />
                    </Field>
                    <Field label={`Width: ${wmImgW}% of page`}><input type="range" min={10} max={100} value={wmImgW} onChange={(e) => setWmImgW(+e.target.value)} className="w-full accent-blue-600" /></Field>
                  </>
                )}
                <Field label={`Opacity: ${Math.round(opacity * 100)}%`}><input type="range" min={5} max={100} value={opacity * 100} onChange={(e) => setOpacity(+e.target.value / 100)} className="w-full accent-blue-600" /></Field>
                <Field label={`Angle: ${angle}°`}><input type="range" min={-90} max={90} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full accent-blue-600" /></Field>
              </div>
            )}
          </div>

          {/* Signature */}
          <div className={panel}>
            <Field label="Signature (sirf aapka apna sign)">
              <select className={input} value={sigAction} onChange={(e) => setSigAction(e.target.value as typeof sigAction)}>
                <option value="none">Kuch nahi</option>
                <option value="add">Add signature</option>
                <option value="replace">Replace (purana hata kar naya lagao)</option>
                <option value="remove">Remove (is tool ka lagaya hua)</option>
              </select>
            </Field>

            {needsSig && (
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  {(["draw", "upload"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => { setSigSrc(s); setSigImg(""); }}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold ${sigSrc === s ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"}`}>
                      {s === "draw" ? "Draw" : "Upload image"}
                    </button>
                  ))}
                </div>
                {sigSrc === "draw" ? (
                  <SignaturePad onChange={setSigImg} />
                ) : (
                  <input type="file" accept=".png,.jpg,.jpeg" className={input} onChange={async (e) => { const f = e.target.files?.[0]; if (f) setSigImg(await readAsDataUrl(f)); }} />
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Pages">
                    <select className={input} value={sigPages} onChange={(e) => setSigPages(e.target.value as SignatureOptions["pages"])}>
                      <option value="first">First page</option>
                      <option value="last">Last page</option>
                      <option value="all">All pages</option>
                    </select>
                  </Field>
                  <Field label="Position">
                    <select className={input} value={sigPos} onChange={(e) => setSigPos(e.target.value as SignatureOptions["position"])}>
                      <option value="bottom-right">Bottom right</option>
                      <option value="bottom-center">Bottom center</option>
                      <option value="bottom-left">Bottom left</option>
                    </select>
                  </Field>
                  <Field label={`Size: ${sigW}%`}><input type="range" min={10} max={60} value={sigW} onChange={(e) => setSigW(+e.target.value)} className="w-full accent-blue-600" /></Field>
                </div>
              </div>
            )}
          </div>

          {r.status === "processing" && <Busy text="Processing..." />}
          <Actions label="Apply & save" busy={r.status === "processing"} disabled={invalid} onRun={go} onClear={reset} />
        </>
      )}
    </Shell>
  );
}

/* ================================================================== */
/* 4. Protect PDF (password)                                           */
/* ================================================================== */

export function ProtectTool({ tool }: { tool: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [allowPrint, setPrint] = useState(true);
  const [allowCopy, setCopy] = useState(false);
  const [allowModify, setModify] = useState(false);
  const r = useRunner();

  const reset = () => { setFile(null); setPw(""); setPw2(""); r.reset(); };
  if (r.status === "done" && r.result) return <ResultCard result={r.result} onReset={reset} />;

  const mismatch = pw2.length > 0 && pw !== pw2;

  return (
    <Shell tool={tool}>
      <p className="mb-4 text-sm text-slate-500">
        PDF par password lagayein. Sirf password jaanne wala hi file khol sakega.
      </p>
      {!file && <DropZone onFile={(f) => /\.pdf$/i.test(f.name) ? setFile(f) : r.setError("Please choose a PDF file.")} />}
      <ErrorBox text={r.error} />

      {file && (
        <>
          <p className="mb-2 truncate text-sm font-medium text-slate-700">{file.name}</p>
          <div className={panel}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Password"><input type="password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
              <Field label="Confirm password"><input type="password" className={input} value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
            </div>
            {mismatch && <p className="mt-2 text-xs text-red-600">Passwords match nahi karte.</p>}
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              {([["Printing allow", allowPrint, setPrint], ["Copy text allow", allowCopy, setCopy], ["Editing allow", allowModify, setModify]] as const).map(([l, v, set]) => (
                <label key={l} className="flex items-center gap-2">
                  <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-blue-600" /> {l}
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-slate-500">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Password bhool gaye to file recover nahi hogi. AES-256 encryption use hoti hai.
            </p>
          </div>

          {r.status === "processing" && <Busy text="Encrypting..." />}
          <Actions
            label="Protect PDF"
            busy={r.status === "processing"}
            disabled={!pw || mismatch || pw !== pw2}
            onRun={() => r.run(() => protectPdf(file, { userPassword: pw, allowPrint, allowCopy, allowModify }))}
            onClear={reset}
          />
        </>
      )}
    </Shell>
  );
}

/* ================================================================== */
/* 5. Metadata viewer / editor                                         */
/* ================================================================== */

type Editable = "title" | "author" | "subject" | "keywords" | "creator" | "producer";

export function MetadataTool({ tool }: { tool: ToolMeta }) {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<PdfMetadata | null>(null);
  const [form, setForm] = useState<Record<Editable, string>>({
    title: "", author: "", subject: "", keywords: "", creator: "", producer: "",
  });
  const [err, setErr] = useState("");
  const r = useRunner();

  const pick = async (f: File) => {
    if (!/\.pdf$/i.test(f.name)) return setErr("Please choose a PDF file.");
    try {
      const m = await readMetadata(f);
      setFile(f);
      setMeta(m);
      setErr("");
      setForm({ title: m.title, author: m.author, subject: m.subject, keywords: m.keywords, creator: m.creator, producer: m.producer });
    } catch {
      setErr("Metadata read nahi ho saka.");
    }
  };
  const reset = () => { setFile(null); setMeta(null); setErr(""); r.reset(); };
  if (r.status === "done" && r.result) return <ResultCard result={r.result} onReset={reset} />;

  const rows: [string, string][] = meta
    ? [
        ["Pages", String(meta.pageCount)],
        ["File size", file ? fmt(file.size) : ""],
        ["Encrypted", meta.encrypted ? "Yes" : "No"],
        ["Created", meta.creationDate || "—"],
        ["Modified", meta.modificationDate || "—"],
      ]
    : [];

  return (
    <Shell tool={tool}>
      <p className="mb-4 text-sm text-slate-500">
        PDF ka metadata dekhein, edit karein ya saaf kar dein.
      </p>
      {!file && <DropZone onFile={pick} />}
      <ErrorBox text={err || r.error} />

      {file && meta && (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {rows.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <dt className="text-[11px] text-slate-500">{k}</dt>
                <dd className="mt-0.5 truncate text-sm font-semibold text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>

          <div className={panel}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(form) as Editable[]).map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                  <input className={input} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                </Field>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm({ title: "", author: "", subject: "", keywords: "", creator: "", producer: "" })}
              className={`${btnGhost} mt-4 min-h-9 px-3 py-1.5 text-xs`}
            >
              <Eraser className="h-3.5 w-3.5" /> Sab fields khali karein
            </button>
          </div>

          {r.status === "processing" && <Busy text="Saving..." />}
          <Actions label="Save metadata" busy={r.status === "processing"} onRun={() => r.run(() => writeMetadata(file, form))} onClear={reset} />
        </>
      )}
    </Shell>
  );
}