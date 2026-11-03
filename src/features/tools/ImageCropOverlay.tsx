"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { orientedPreviewFromUrl } from "@/features/tools/image-orientation";

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Handle =
  | "move"
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w";

type Props = {
  src: string;
  crop: CropRect | null;
  onCropChange: (crop: CropRect) => void;
  onImageReady: (width: number, height: number) => void;
  maxHeight?: number;
};

const MIN_SIZE = 24;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ImageCropOverlay({
  src,
  crop,
  onCropChange,
  onImageReady,
  maxHeight = 440,
}: Props) {
  const maskId = useId().replace(/:/g, "");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewRevokeRef = useRef<(() => void) | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [display, setDisplay] = useState({ w: 0, h: 0 });
  const dragRef = useRef<{
    handle: Handle;
    startX: number;
    startY: number;
    startCrop: CropRect;
  } | null>(null);
  const onImageReadyRef = useRef(onImageReady);
  onImageReadyRef.current = onImageReady;

  useEffect(() => {
    let cancelled = false;
    setLoadingPreview(true);
    setDisplaySrc(null);
    setNatural({ w: 0, h: 0 });

    previewRevokeRef.current?.();
    previewRevokeRef.current = null;

    orientedPreviewFromUrl(src)
      .then(({ previewUrl, width, height }) => {
        if (cancelled) {
          URL.revokeObjectURL(previewUrl);
          return;
        }
        previewRevokeRef.current = () =>
          URL.revokeObjectURL(previewUrl);
        setDisplaySrc(previewUrl);
        setNatural({ w: width, h: height });
        onImageReadyRef.current(width, height);
        setLoadingPreview(false);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadingPreview(false);
        }
      });

    return () => {
      cancelled = true;
      previewRevokeRef.current?.();
      previewRevokeRef.current = null;
    };
  }, [src]);

  const syncDisplaySize = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    setDisplay({ w: rect.width, h: rect.height });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !displaySrc) return;
    const observer = new ResizeObserver(syncDisplaySize);
    observer.observe(img);
    syncDisplaySize();
    return () => observer.disconnect();
  }, [displaySrc, syncDisplaySize]);

  const scaleX =
    natural.w > 0 ? display.w / natural.w : 1;
  const scaleY =
    natural.h > 0 ? display.h / natural.h : 1;

  const toDisplay = (rect: CropRect) => ({
    x: rect.x * scaleX,
    y: rect.y * scaleY,
    width: rect.width * scaleX,
    height: rect.height * scaleY,
  });

  const pointerToNatural = (
    clientX: number,
    clientY: number,
  ): { x: number; y: number } => {
    const img = imgRef.current;
    if (!img || !natural.w || !natural.h) {
      return { x: 0, y: 0 };
    }
    const rect = img.getBoundingClientRect();
    const x =
      ((clientX - rect.left) / rect.width) *
      natural.w;
    const y =
      ((clientY - rect.top) / rect.height) *
      natural.h;
    return {
      x: clamp(x, 0, natural.w),
      y: clamp(y, 0, natural.h),
    };
  };

  const applyResize = (
    handle: Handle,
    point: { x: number; y: number },
    start: CropRect,
  ): CropRect => {
    let { x, y, width, height } = start;
    const right = start.x + start.width;
    const bottom = start.y + start.height;

    if (handle.includes("w")) {
      x = clamp(point.x, 0, right - MIN_SIZE);
      width = right - x;
    }
    if (handle.includes("e")) {
      const newRight = clamp(
        point.x,
        x + MIN_SIZE,
        natural.w,
      );
      width = newRight - x;
    }
    if (handle.includes("n")) {
      y = clamp(point.y, 0, bottom - MIN_SIZE);
      height = bottom - y;
    }
    if (handle.includes("s")) {
      const newBottom = clamp(
        point.y,
        y + MIN_SIZE,
        natural.h,
      );
      height = newBottom - y;
    }

    width = Math.max(MIN_SIZE, width);
    height = Math.max(MIN_SIZE, height);
    x = clamp(x, 0, natural.w - width);
    y = clamp(y, 0, natural.h - height);

    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    };
  };

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !crop) return;
      const point = pointerToNatural(
        event.clientX,
        event.clientY,
      );
      if (drag.handle === "move") {
        const dx = point.x - drag.startX;
        const dy = point.y - drag.startY;
        onCropChange({
          ...drag.startCrop,
          x: Math.round(
            clamp(
              drag.startCrop.x + dx,
              0,
              natural.w - drag.startCrop.width,
            ),
          ),
          y: Math.round(
            clamp(
              drag.startCrop.y + dy,
              0,
              natural.h - drag.startCrop.height,
            ),
          ),
          width: drag.startCrop.width,
          height: drag.startCrop.height,
        });
        return;
      }
      onCropChange(
        applyResize(drag.handle, point, drag.startCrop),
      );
    };

    const onUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [crop, natural.h, natural.w, onCropChange]);

  const beginDrag = (
    handle: Handle,
    event: React.PointerEvent,
  ) => {
    if (!crop) return;
    event.preventDefault();
    event.stopPropagation();
    const point = pointerToNatural(
      event.clientX,
      event.clientY,
    );
    dragRef.current = {
      handle,
      startX: point.x,
      startY: point.y,
      startCrop: { ...crop },
    };
  };

  const box = crop ? toDisplay(crop) : null;

  const handles: { id: Handle; className: string }[] = [
    { id: "nw", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize" },
    { id: "n", className: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize" },
    { id: "ne", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize" },
    { id: "e", className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize" },
    { id: "se", className: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize" },
    { id: "s", className: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize" },
    { id: "sw", className: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize" },
    { id: "w", className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize" },
  ];

  if (loadingPreview || !displaySrc) {
    return (
      <div
        className="flex min-h-[200px] min-w-[200px] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500"
        style={{ maxHeight }}
      >
        Preparing crop preview…
      </div>
    );
  }

  return (
    <div className="relative inline-block max-w-full">
      <img
        ref={imgRef}
        src={displaySrc}
        alt="Crop preview"
        draggable={false}
        onLoad={syncDisplaySize}
        className="max-w-full rounded-xl object-contain shadow-lg select-none"
        style={{ maxHeight }}
      />

      {box && natural.w > 0 && display.w > 0 && (
        <div
          className="pointer-events-none absolute left-0 top-0"
          style={{
            width: display.w,
            height: display.h,
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <mask id={maskId}>
                <rect
                  width="100%"
                  height="100%"
                  fill="white"
                />
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(15,23,42,0.55)"
              mask={`url(#${maskId})`}
            />
          </svg>

          <div
            className="pointer-events-auto absolute border-2 border-white shadow-[0_0_0_1px_rgba(37,99,235,0.9)]"
            style={{
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
              cursor: "move",
            }}
            onPointerDown={(event) =>
              beginDrag("move", event)
            }
          >
            {handles.map((handle) => (
              <span
                key={handle.id}
                className={`pointer-events-auto absolute h-3.5 w-3.5 rounded-full border-2 border-blue-600 bg-white shadow ${handle.className}`}
                onPointerDown={(event) =>
                  beginDrag(handle.id, event)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
