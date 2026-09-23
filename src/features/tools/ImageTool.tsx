

"use client";

import {
  CheckCircle2,
  Download,
  FileImage,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ToolMeta } from "@/features/tools/client-processors";

type Props = {
  tool: ToolMeta;
};

type OutputFormat = "jpeg" | "png" | "webp";

type CropRatio =
  | "free"
  | "1:1"
  | "4:3"
  | "3:4"
  | "16:9"
  | "9:16";

type Status = "idle" | "processing" | "done" | "error";

function formatSize(bytes: number) {
  if (!bytes) return "0 KB";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

function formatLabel(format: OutputFormat) {
  if (format === "jpeg") return "JPG";
  return format.toUpperCase();
}

function mimeFor(format: OutputFormat) {
  if (format === "jpeg") return "image/jpeg";
  if (format === "png") return "image/png";
  return "image/webp";
}

function extFor(format: OutputFormat) {
  if (format === "jpeg") return "jpg";
  return format;
}

function defaultFormat(slug: string): OutputFormat {
  if (slug === "jpg-to-png") return "png";
  if (slug === "png-to-jpg") return "jpeg";
  if (slug === "webp-converter") return "webp";

  return "webp";
}

function isFormatLocked(slug: string) {
  return slug === "jpg-to-png" || slug === "png-to-jpg";
}

function getToolMode(slug: string) {
  if (slug === "compress-image") return "compress";
  if (slug === "resize-image") return "resize";
  if (slug === "crop-image") return "crop";
  if (slug === "rotate-image") return "rotate";
  if (slug === "flip-image") return "flip";
  if (slug === "jpg-to-png" || slug === "png-to-jpg" || slug === "webp-converter") {
    return "convert";
  }

  return "image";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image."));

    image.src = src;
  });
}

function getCropRect(
  width: number,
  height: number,
  ratio: CropRatio
) {
  if (ratio === "free") {
    return {
      x: 0,
      y: 0,
      width,
      height,
    };
  }

  const [rw, rh] = ratio.split(":").map(Number);
  const targetRatio = rw / rh;
  const sourceRatio = width / height;

  if (sourceRatio > targetRatio) {
    const cropWidth = height * targetRatio;

    return {
      x: (width - cropWidth) / 2,
      y: 0,
      width: cropWidth,
      height,
    };
  }

  const cropHeight = width / targetRatio;

  return {
    x: 0,
    y: (height - cropHeight) / 2,
    width,
    height: cropHeight,
  };
}

export function ImageTool({ tool }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [resultWidth, setResultWidth] = useState(0);
  const [resultHeight, setResultHeight] = useState(0);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [format, setFormat] = useState<OutputFormat>(
    defaultFormat(tool.slug)
  );

  const [quality, setQuality] = useState(82);
  const [width, setWidth] = useState("");
  const [cropRatio, setCropRatio] = useState<CropRatio>("free");

  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const mode = useMemo(() => getToolMode(tool.slug), [tool.slug]);

  const acceptedFormats = useMemo(() => {
    if (!tool.accepted_formats?.length) {
      return "image/jpeg,image/png,image/webp";
    }

    return tool.accepted_formats.join(",");
  }, [tool.accepted_formats]);

  const formatLocked = isFormatLocked(tool.slug);

  const showQuality =
    format === "jpeg" ||
    format === "webp";

  const showResize =
    mode === "resize" ||
    mode === "compress" ||
    mode === "convert" ||
    mode === "image";

  const showCrop = mode === "crop";

  const showRotation = mode === "rotate";
  const showFlip = mode === "flip";

  const chooseFile = useCallback((selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      setStatus("error");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
    }

    const url = URL.createObjectURL(selectedFile);

    previewUrlRef.current = url;
    resultUrlRef.current = null;

    setFile(selectedFile);
    setPreviewUrl(url);
    setResultUrl(null);
    setResultSize(0);
    setResultWidth(0);
    setResultHeight(0);

    setStatus("idle");
    setError("");

    setWidth("");
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    chooseFile(event.dataTransfer.files?.[0] ?? null);
  };

  const clearFile = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }

    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultSize(0);
    setResultWidth(0);
    setResultHeight(0);
    setStatus("idle");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const processImage = async () => {
    if (!file || !previewUrl) {
      setError("Please upload an image first.");
      setStatus("error");
      return;
    }

    try {
      setStatus("processing");
      setError("");

      const image = await loadImage(previewUrl);

      let sourceWidth = image.naturalWidth;
      let sourceHeight = image.naturalHeight;

      const crop = getCropRect(
        sourceWidth,
        sourceHeight,
        showCrop ? cropRatio : "free"
      );

      const cropWidth = crop.width;
      const cropHeight = crop.height;

      let targetWidth = cropWidth;
      let targetHeight = cropHeight;

      if (showResize && width.trim()) {
        const requestedWidth = Number(width);

        if (
          Number.isFinite(requestedWidth) &&
          requestedWidth > 0
        ) {
          const scale = requestedWidth / cropWidth;

          targetWidth = requestedWidth;
          targetHeight = Math.round(cropHeight * scale);
        }
      }

      const normalizedRotation =
        ((rotation % 360) + 360) % 360;

      const isSideways =
        normalizedRotation === 90 ||
        normalizedRotation === 270;

      const canvas = document.createElement("canvas");

      if (isSideways) {
        canvas.width = Math.max(1, Math.round(targetHeight));
        canvas.height = Math.max(1, Math.round(targetWidth));
      } else {
        canvas.width = Math.max(1, Math.round(targetWidth));
        canvas.height = Math.max(1, Math.round(targetHeight));
      }

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported by this browser.");
      }

      context.save();

      context.translate(
        canvas.width / 2,
        canvas.height / 2
      );

      context.rotate(
        (normalizedRotation * Math.PI) / 180
      );

      context.scale(
        flipH ? -1 : 1,
        flipV ? -1 : 1
      );

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(
        image,
        crop.x,
        crop.y,
        cropWidth,
        cropHeight,
        -targetWidth / 2,
        -targetHeight / 2,
        targetWidth,
        targetHeight
      );

      context.restore();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          mimeFor(format),
          format === "png" ? undefined : quality / 100
        );
      });

      if (!blob) {
        throw new Error("Could not generate the processed image.");
      }

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }

      const url = URL.createObjectURL(blob);

      resultUrlRef.current = url;

      setResultUrl(url);
      setResultSize(blob.size);
      setResultWidth(canvas.width);
      setResultHeight(canvas.height);
      setStatus("done");
    } catch (err) {
      console.error(err);

      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing the image."
      );
    }
  };

  const downloadResult = () => {
    if (!resultUrl || !file) return;

    const originalName = file.name.replace(/\.[^/.]+$/, "");

    const link = document.createElement("a");

    link.href = resultUrl;
    link.download = `${originalName}-toolmerge.${extFor(format)}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const rotateLeft = () => {
    setRotation((value) => (value - 90 + 360) % 360);
    setResultUrl(null);
    setStatus("idle");
  };

  const rotateRight = () => {
    setRotation((value) => (value + 90) % 360);
    setResultUrl(null);
    setStatus("idle");
  };

  const toggleFlipH = () => {
    setFlipH((value) => !value);
    setResultUrl(null);
    setStatus("idle");
  };

  const toggleFlipV = () => {
    setFlipV((value) => !value);
    setResultUrl(null);
    setStatus("idle");
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
              <ImageIcon className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {tool.name}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                {tool.short_description ||
                  "Process your image directly in your browser."}
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Private & browser-based
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <div className="p-4 sm:p-6">
        {!file ? (
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={[
              "group cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-200 sm:p-12",
              dragActive
                ? "border-blue-500 bg-blue-500 text-white shadow-xl shadow-blue-500/20"
                : "border-blue-200 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-500 hover:text-white hover:shadow-xl hover:shadow-blue-500/20",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept={acceptedFormats}
              onChange={handleInputChange}
              className="hidden"
            />

            <div
              className={[
                "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition",
                dragActive
                  ? "bg-white/20"
                  : "bg-white shadow-md group-hover:bg-white/20",
              ].join(" ")}
            >
              <Upload className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Drop your image here
            </h3>

            <p
              className={[
                "mt-2 text-sm",
                dragActive
                  ? "text-white/80"
                  : "text-slate-500 group-hover:text-white/80",
              ].join(" ")}
            >
              or click anywhere to browse from your device
            </p>

            <div
              className={[
                "mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                dragActive
                  ? "bg-white/15 text-white"
                  : "bg-white text-slate-500 group-hover:bg-white/15 group-hover:text-white",
              ].join(" ")}
            >
              <FileImage className="h-4 w-4" />
              JPG · PNG · WEBP
            </div>
          </div>
        ) : (
          <>
            {/* =====================================================
                FILE BAR
            ===================================================== */}
            <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FileImage className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFile}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>

            {/* =====================================================
                PREVIEW + CONTROLS
            ===================================================== */}
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Preview */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Image preview
                    </p>

                    <p className="text-xs text-slate-500">
                      Original image
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                    {file.type.replace("image/", "").toUpperCase()}
                  </span>
                </div>

                <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] p-5 sm:min-h-[390px]">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Uploaded image preview"
                      className="max-h-[440px] max-w-full rounded-xl object-contain shadow-lg"
                    />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="mb-5">
                  <p className="text-base font-bold text-slate-900">
                    Edit & optimize
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Adjust the settings below and process your image.
                  </p>
                </div>

                {/* Format */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Output format
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {(["jpeg", "png", "webp"] as OutputFormat[]).map(
                      (item) => {
                        const active = format === item;
                        const disabled =
                          formatLocked &&
                          item !== defaultFormat(tool.slug);

                        return (
                          <button
                            key={item}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              setFormat(item);
                              setResultUrl(null);
                              setStatus("idle");
                            }}
                            className={[
                              "rounded-xl border px-3 py-2.5 text-sm font-bold transition",
                              disabled
                                ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                : active
                                ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
                            ].join(" ")}
                          >
                            {formatLabel(item)}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Quality */}
                {showQuality && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Quality
                      </label>

                      <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                        {quality}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(event) =>
                        setQuality(Number(event.target.value))
                      }
                      className="w-full accent-blue-500"
                    />

                    <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                      <span>Smaller file</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                )}

                {/* Resize */}
                {showResize && (
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                      Resize width
                    </label>

                    <div className="relative">
                      <Maximize2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="number"
                        min="1"
                        value={width}
                        onChange={(event) => {
                          setWidth(event.target.value);
                          setResultUrl(null);
                          setStatus("idle");
                        }}
                        placeholder="Original width"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-16 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        px
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Leave empty to keep the original width.
                    </p>
                  </div>
                )}

                {/* Crop */}
                {showCrop && (
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                      Crop ratio
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          "free",
                          "1:1",
                          "4:3",
                          "3:4",
                          "16:9",
                          "9:16",
                        ] as CropRatio[]
                      ).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => {
                            setCropRatio(ratio);
                            setResultUrl(null);
                            setStatus("idle");
                          }}
                          className={[
                            "rounded-xl border px-2 py-2 text-xs font-bold transition",
                            cropRatio === ratio
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
                          ].join(" ")}
                        >
                          {ratio === "free" ? "Free" : ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rotate */}
                {showRotation && (
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                      Rotate
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={rotateLeft}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Left
                      </button>

                      <button
                        type="button"
                        onClick={rotateRight}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <RotateCw className="h-4 w-4" />
                        Right
                      </button>
                    </div>

                    {rotation !== 0 && (
                      <p className="mt-2 text-xs font-semibold text-blue-600">
                        Rotation: {rotation}°
                      </p>
                    )}
                  </div>
                )}

                {/* Flip */}
                {showFlip && (
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                      Flip
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={toggleFlipH}
                        className={[
                          "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition",
                          flipH
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
                        ].join(" ")}
                      >
                        <FlipHorizontal className="h-4 w-4" />
                        Horizontal
                      </button>

                      <button
                        type="button"
                        onClick={toggleFlipV}
                        className={[
                          "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition",
                          flipV
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
                        ].join(" ")}
                      >
                        <FlipVertical className="h-4 w-4" />
                        Vertical
                      </button>
                    </div>
                  </div>
                )}

                {/* Process */}
                <button
                  type="button"
                  disabled={status === "processing"}
                  onClick={processImage}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4" />
                      Process Image
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-medium leading-5 text-red-600">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* =====================================================
                RESULT
            ===================================================== */}
            {status === "done" && resultUrl && (
              <div className="mt-5 overflow-hidden rounded-3xl border border-blue-200 bg-blue-50/50">
                <div className="flex flex-col gap-3 border-b border-blue-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Your image is ready
                      </p>

                      <p className="text-xs text-slate-500">
                        {resultWidth} × {resultHeight}px ·{" "}
                        {formatSize(resultSize)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={downloadResult}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    Download {formatLabel(format)}
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white p-5">
                    <img
                      src={resultUrl}
                      alt="Processed image preview"
                      className="max-h-[420px] max-w-full rounded-xl object-contain shadow-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================================================
          FOOTER TRUST ROW
      ========================================================= */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Files stay in your browser
          </span>

          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            No installation required
          </span>

          <span className="inline-flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-blue-500" />
            JPG · PNG · WEBP
          </span>
        </div>
      </div>
    </div>
  );
}