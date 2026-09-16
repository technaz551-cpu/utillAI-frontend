"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  Combine,
  Download,
  FileImage,
  FileText,
  Image,
  RotateCcw,
  Scissors,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";

import { btn, card } from "@/lib/utils";

import type { ToolMeta } from "@/features/tools/client-processors";

import { processPdf } from "@/features/tools/pdf-processors";
// import { exportEditedPdf, downloadPdf } from '@/features/tools/pdfeditor/pdf_processors';

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
    "Drop files or click to upload."
  );
}

function processLabel(
  status: PdfStatus,
  action: PdfAction | null,
) {
  if (status === "processing") {
    return "Processing…";
  }

  if (action === "merge") {
    return "Merge";
  }

  if (action === "split") {
    return "Split";
  }

  if (action === "jpg-to-pdf") {
    return "Convert to PDF";
  }

  if (action === "pdf-to-jpg") {
    return "Convert to JPG";
  }

  return "Process";
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
        URL.revokeObjectURL(
          resultUrl,
        );
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

    const next = Array.from(
      list,
    ).filter((file) =>
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
        URL.revokeObjectURL(
          previous,
        );
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
          ? action ===
            "pdf-to-jpg"
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
      URL.revokeObjectURL(
        resultUrl,
      );
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

    setResultUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(
          previous,
        );
      }

      return "";
    });
  };

  const choiceClass = (
    selected: boolean,
  ) =>
    `flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
      selected
        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
        : "border-[var(--border)] bg-[#0d121c] hover:border-[var(--accent)]"
    }`;

  return (
    <div className={card()}>
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

        <p className="text-xs leading-relaxed text-cyan-200/80">
          Runs locally in your browser —
          your files are never sent to
          our servers.
        </p>
      </div>

      <p className="mb-4 text-sm text-[var(--muted)]">
        {hintFor(tool.slug)}
      </p>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() =>
          setDragOver(false)
        }
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);

          if (
            event.dataTransfer.files
              .length
          ) {
            addFiles(
              event.dataTransfer.files,
            );
          }
        }}
        className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
          dragOver
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--border)] bg-[#0d121c] hover:border-[var(--accent)]"
        }`}
      >
        <Upload className="mb-3 h-10 w-10 text-[var(--muted)]" />

        <span className="text-sm text-[var(--muted)]">
          Drop files or click to upload
        </span>

        <span className="mt-1 text-xs text-[var(--muted)]">
          {accept
            .replaceAll(".", "")
            .toUpperCase()}
        </span>

        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={(event) => {
            if (
              event.target.files
                ?.length
            ) {
              addFiles(
                event.target.files,
              );
            }

            event.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[#0d121c] px-3 py-2.5"
            >
              <FileText className="h-4 w-4 shrink-0 text-rose-300" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {file.name}
                </p>

                <p className="text-xs text-[var(--muted)]">
                  {formatSize(file.size)}
                </p>
              </div>

              {showReorder && (
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={
                      btn("ghost") +
                      " !px-2 !py-1"
                    }
                    onClick={() =>
                      move(index, -1)
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
                    className={
                      btn("ghost") +
                      " !px-2 !py-1"
                    }
                    onClick={() =>
                      move(index, 1)
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
                className={
                  btn("ghost") +
                  " !px-2 !py-1"
                }
                onClick={() =>
                  removeFile(index)
                }
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {isMergeSplit &&
        files.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium">
              Do you want to merge or
              split?
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
                <Combine className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <span>
                  <span className="block text-sm font-medium">
                    Merge PDFs
                  </span>

                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    Combine files into one
                    document.
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
                <Scissors className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <span>
                  <span className="block text-sm font-medium">
                    Split PDF
                  </span>

                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    Extract each page as
                    its own file.
                  </span>
                </span>
              </button>
            </div>

            {action === "merge" &&
              files.length < 2 && (
                <p className="mt-3 text-xs text-amber-200/80">
                  Add at least one more
                  PDF to merge.
                </p>
              )}

            {action === "split" &&
              files.length > 1 && (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Split uses the first PDF.
                  Extra files are ignored.
                </p>
              )}
          </div>
        )}

      {isConvert &&
        files.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium">
              JPG to PDF or PDF to JPG?
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
                <Image className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <span>
                  <span className="block text-sm font-medium">
                    JPG to PDF
                  </span>

                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    Turn images into a PDF
                    document.
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
                <FileImage className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <span>
                  <span className="block text-sm font-medium">
                    PDF to JPG
                  </span>

                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    Turn each PDF page into
                    a JPG.
                  </span>
                </span>
              </button>
            </div>

            {action === "jpg-to-pdf" &&
              images.length < 1 && (
                <p className="mt-3 text-xs text-amber-200/80">
                  Add at least one JPG or
                  PNG image.
                </p>
              )}

            {action === "pdf-to-jpg" &&
              pdfs.length < 1 && (
                <p className="mt-3 text-xs text-amber-200/80">
                  Add a PDF to convert.
                </p>
              )}

            {action === "pdf-to-jpg" &&
              pdfs.length >= 1 &&
              files.length > 1 && (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  PDF to JPG uses the first
                  PDF. Extra files are
                  ignored.
                </p>
              )}
          </div>
        )}

      {action === "pdf-to-jpg" && (
        <div className="mt-4">
          <label className="text-xs text-[var(--muted)]">
            JPG quality: {quality}%
          </label>

          <input
            type="range"
            min={40}
            max={100}
            value={quality}
            onChange={(event) =>
              setQuality(
                Number(event.target.value),
              )
            }
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={run}
          disabled={
            !canRun ||
            status === "processing"
          }
          className={btn("primary")}
        >
          {processLabel(
            status,
            action,
          )}
        </button>

        <button
          type="button"
          onClick={clear}
          className={btn("secondary")}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {status === "done" &&
        resultUrl && (
          <a
            href={resultUrl}
            download={resultName}
            className={
              btn("secondary") +
              " mt-4 inline-flex"
            }
          >
            <Download className="mr-2 h-4 w-4" />

            Download {resultName} (
            {formatSize(resultSize)})
          </a>
        )}
    </div>
  );
}