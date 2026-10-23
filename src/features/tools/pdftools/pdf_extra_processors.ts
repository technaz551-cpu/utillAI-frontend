// /**
//  * pdf-extra-processors.ts
//  * Naye tools: organize (reorder+numbering), rotate+crop, watermark+signature,
//  * protect (password), metadata.
//  *
//  * Install:  npm i pdf-lib pdfjs-dist
//  * Protect:  npm i @neslinesli93/qpdf-wasm  (+ qpdf.wasm ko /public mein copy karo)
//  */
// import {
//     PDFArray,
//     PDFDocument,
//     PDFName,
//     PDFPage,
//     PDFStream,
//     StandardFonts,
//     degrees,
//     rgb,
//   } from "pdf-lib";
  
//   export type ProcessResult = { blob: Blob; filename: string; note?: string };
  
//   const pdfBlob = (bytes: Uint8Array) =>
//     new Blob([bytes as BlobPart], { type: "application/pdf" });
//   const baseName = (f: File) => f.name.replace(/\.pdf$/i, "");
//   const load = async (f: File) =>
//     PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
  
//   /* ------------------------------------------------------------------ */
//   /* Thumbnails (pdfjs-dist)                                             */
//   /* ------------------------------------------------------------------ */
  
//   export async function renderThumbs(
//     file: File,
//     width = 180,
//     limit = 300,
//   ): Promise<string[]> {
//     const pdfjs: any = await import("pdfjs-dist");
//     // pdf-processors.ts pehle se "/pdf.worker.min.mjs" set karta hai; yahan sirf fallback.
//     if (!pdfjs.GlobalWorkerOptions.workerSrc) {
//       pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
//     }
  
//     const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
//       .promise;
//     const out: string[] = [];
//     const total = Math.min(doc.numPages, limit);
  
//     for (let i = 1; i <= total; i++) {
//       const page = await doc.getPage(i);
//       const base = page.getViewport({ scale: 1 });
//       const viewport = page.getViewport({ scale: width / base.width });
//       const canvas = document.createElement("canvas");
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       await page.render({ canvasContext: canvas.getContext("2d")!, viewport })
//         .promise;
//       out.push(canvas.toDataURL("image/jpeg", 0.6));
//     }
//     return out;
//   }
  
//   /* ------------------------------------------------------------------ */
//   /* 1. Organize: reorder + delete + rotate + page numbers               */
//   /* ------------------------------------------------------------------ */
  
//   export type PageItem = { index: number; rotation: number }; // index = original page
  
//   export type NumberingOptions = {
//     enabled: boolean;
//     position:
//       | "bottom-center"
//       | "bottom-left"
//       | "bottom-right"
//       | "top-center"
//       | "top-left"
//       | "top-right";
//     format: "n" | "n-of-total" | "page-n";
//     start: number;
//     fontSize: number;
//   };
  
//   export async function organizePdf(
//     file: File,
//     items: PageItem[],
//     numbering: NumberingOptions,
//   ): Promise<ProcessResult> {
//     if (!items.length) throw new Error("Kam az kam ek page rakhna zaroori hai.");
  
//     const src = await load(file);
//     const out = await PDFDocument.create();
//     const copied = await out.copyPages(
//       src,
//       items.map((i) => i.index),
//     );
//     const font = await out.embedFont(StandardFonts.Helvetica);
//     const total = copied.length;
  
//     copied.forEach((page, i) => {
//       out.addPage(page);
  
//       if (numbering.enabled) {
//         const n = numbering.start + i;
//         const label =
//           numbering.format === "n-of-total"
//             ? `${n} / ${numbering.start + total - 1}`
//             : numbering.format === "page-n"
//               ? `Page ${n}`
//               : `${n}`;
//         const { width, height } = page.getSize();
//         const tw = font.widthOfTextAtSize(label, numbering.fontSize);
//         const margin = 28;
//         const [v, h] = numbering.position.split("-") as [
//           "top" | "bottom",
//           "left" | "center" | "right",
//         ];
//         const x =
//           h === "left" ? margin : h === "right" ? width - margin - tw : (width - tw) / 2;
//         const y = v === "bottom" ? margin : height - margin - numbering.fontSize;
//         page.drawText(label, {
//           x,
//           y,
//           size: numbering.fontSize,
//           font,
//           color: rgb(0.2, 0.2, 0.2),
//         });
//       }
  
//       const extra = items[i].rotation % 360;
//       if (extra) {
//         page.setRotation(degrees((page.getRotation().angle + extra) % 360));
//       }
//     });
  
//     return {
//       blob: pdfBlob(await out.save()),
//       filename: `${baseName(file)}-organized.pdf`,
//     };
//   }
  
//   /* ------------------------------------------------------------------ */
//   /* 2. Rotate + Crop                                                    */
//   /* ------------------------------------------------------------------ */
  
//   export type CropMargins = { top: number; right: number; bottom: number; left: number }; // percent
  
//   export async function rotateCropPdf(
//     file: File,
//     rotations: Record<number, number>, // pageIndex -> extra degrees
//     crop: CropMargins,
//   ): Promise<ProcessResult> {
//     const doc = await load(file);
//     const hasCrop = crop.top || crop.right || crop.bottom || crop.left;
  
//     doc.getPages().forEach((page, i) => {
//       const extra = (rotations[i] || 0) % 360;
//       if (extra) {
//         page.setRotation(degrees((page.getRotation().angle + extra + 360) % 360));
//       }
//       if (hasCrop) {
//         const mb = page.getMediaBox();
//         const x = mb.x + (mb.width * crop.left) / 100;
//         const y = mb.y + (mb.height * crop.bottom) / 100;
//         const w = mb.width * (1 - (crop.left + crop.right) / 100);
//         const h = mb.height * (1 - (crop.top + crop.bottom) / 100);
//         page.setCropBox(x, y, w, h);
//       }
//     });
  
//     return {
//       blob: pdfBlob(await doc.save()),
//       filename: `${baseName(file)}-edited.pdf`,
//     };
//   }
  
//   /* ------------------------------------------------------------------ */
//   /* 3. Watermark + Signature (add / remove / replace)                   */
//   /*    Sirf apne tool ke lagaye hue items remove ho sakte hain, kyunki  */
//   /*    hum har item ko alag content stream mein marker ke saath likhte. */
//   /* ------------------------------------------------------------------ */
  
//   const MARK = PDFName.of("PdfToolMark");
//   type MarkKind = "watermark" | "signature";
  
//   export type WatermarkOptions =
//     | {
//         kind: "text";
//         text: string;
//         fontSize: number;
//         opacity: number; // 0..1
//         rotation: number; // degrees
//         color: string; // #rrggbb
//       }
//     | {
//         kind: "image";
//         dataUrl: string;
//         widthPct: number; // % of page width
//         opacity: number;
//         rotation: number;
//       };
  
//   export type SignatureOptions = {
//     dataUrl: string; // PNG/JPG (draw ya upload)
//     pages: "first" | "last" | "all";
//     position: "bottom-right" | "bottom-left" | "bottom-center";
//     widthPct: number;
//   };
  
//   export type WatermarkJob = {
//     watermark: { action: "none" | "add" | "remove"; options?: WatermarkOptions };
//     signature: {
//       action: "none" | "add" | "replace" | "remove";
//       options?: SignatureOptions;
//     };
//   };
  
//   function startMarked(page: PDFPage, kind: MarkKind) {
//     const cs = page.getContentStream(false); // naya stream, aage ki drawing isi mein jayegi
//     cs.dict.set(MARK, PDFName.of(kind));
//   }
//   function endMarked(page: PDFPage) {
//     page.getContentStream(false); // baad ki drawing unmarked stream mein
//   }
  
//   function stripMarked(doc: PDFDocument, kind: MarkKind): number {
//     let removed = 0;
//     for (const page of doc.getPages()) {
//       const contents = page.node.Contents();
//       if (!(contents instanceof PDFArray)) continue;
//       const keep = PDFArray.withContext(doc.context);
//       for (let i = 0; i < contents.size(); i++) {
//         const ref = contents.get(i);
//         const obj = doc.context.lookup(ref);
//         if (obj instanceof PDFStream) {
//           const m = obj.dict.get(MARK);
//           if (m instanceof PDFName && m.decodeText() === kind) {
//             removed++;
//             continue;
//           }
//         }
//         keep.push(ref);
//       }
//       page.node.set(PDFName.of("Contents"), keep);
//     }
//     return removed;
//   }
  
//   async function embedImage(doc: PDFDocument, dataUrl: string) {
//     const buf = await (await fetch(dataUrl)).arrayBuffer();
//     const head = new Uint8Array(buf.slice(0, 4));
//     const isPng = head[0] === 0x89 && head[1] === 0x50;
//     return isPng ? doc.embedPng(buf) : doc.embedJpg(buf);
//   }
  
//   const hexToRgb = (hex: string) => {
//     const n = parseInt(hex.replace("#", ""), 16);
//     return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
//   };
  
//   async function addWatermark(doc: PDFDocument, wm: WatermarkOptions) {
//     const font = await doc.embedFont(StandardFonts.HelveticaBold);
//     const img = wm.kind === "image" ? await embedImage(doc, wm.dataUrl) : null;
//     const rad = (wm.rotation * Math.PI) / 180;
  
//     for (const page of doc.getPages()) {
//       const { width, height } = page.getSize();
//       const cx = width / 2;
//       const cy = height / 2;
//       startMarked(page, "watermark");
  
//       if (wm.kind === "text") {
//         const tw = font.widthOfTextAtSize(wm.text, wm.fontSize);
//         const a = tw / 2;
//         const b = wm.fontSize / 3;
//         page.drawText(wm.text, {
//           x: cx - (a * Math.cos(rad) - b * Math.sin(rad)),
//           y: cy - (a * Math.sin(rad) + b * Math.cos(rad)),
//           size: wm.fontSize,
//           font,
//           color: hexToRgb(wm.color),
//           opacity: wm.opacity,
//           rotate: degrees(wm.rotation),
//         });
//       } else if (img) {
//         const w = (width * wm.widthPct) / 100;
//         const h = (img.height / img.width) * w;
//         const a = w / 2;
//         const b = h / 2;
//         page.drawImage(img, {
//           x: cx - (a * Math.cos(rad) - b * Math.sin(rad)),
//           y: cy - (a * Math.sin(rad) + b * Math.cos(rad)),
//           width: w,
//           height: h,
//           opacity: wm.opacity,
//           rotate: degrees(wm.rotation),
//         });
//       }
//       endMarked(page);
//     }
//   }
  
//   async function addSignature(doc: PDFDocument, sig: SignatureOptions) {
//     const img = await embedImage(doc, sig.dataUrl);
//     const pages = doc.getPages();
//     const targets =
//       sig.pages === "first"
//         ? [pages[0]]
//         : sig.pages === "last"
//           ? [pages[pages.length - 1]]
//           : pages;
  
//     for (const page of targets) {
//       const { width } = page.getSize();
//       const w = (width * sig.widthPct) / 100;
//       const h = (img.height / img.width) * w;
//       const margin = 36;
//       const x =
//         sig.position === "bottom-left"
//           ? margin
//           : sig.position === "bottom-center"
//             ? (width - w) / 2
//             : width - w - margin;
//       startMarked(page, "signature");
//       page.drawImage(img, { x, y: margin, width: w, height: h });
//       endMarked(page);
//     }
//   }
  
//   export async function watermarkPdf(
//     file: File,
//     job: WatermarkJob,
//   ): Promise<ProcessResult> {
//     const doc = await load(file);
//     const notes: string[] = [];
  
//     if (job.watermark.action === "remove") {
//       const n = stripMarked(doc, "watermark");
//       notes.push(
//         n
//           ? `${n} watermark layer(s) remove hui.`
//           : "Is tool ka lagaya hua watermark nahi mila (dusre software ka watermark remove nahi ho sakta).",
//       );
//     }
//     if (job.signature.action === "remove" || job.signature.action === "replace") {
//       const n = stripMarked(doc, "signature");
//       notes.push(
//         n
//           ? `${n} signature layer(s) remove hui.`
//           : "Is tool ka lagaya hua signature nahi mila.",
//       );
//     }
  
//     if (job.watermark.action === "add" && job.watermark.options) {
//       await addWatermark(doc, job.watermark.options);
//     }
//     if (
//       (job.signature.action === "add" || job.signature.action === "replace") &&
//       job.signature.options
//     ) {
//       await addSignature(doc, job.signature.options);
//     }
  
//     return {
//       blob: pdfBlob(await doc.save()),
//       filename: `${baseName(file)}-marked.pdf`,
//       note: notes.join(" "),
//     };
//   }
  
//   /* ------------------------------------------------------------------ */
//   /* 4. Protect (password) - client side, qpdf-wasm                      */
//   /* ------------------------------------------------------------------ */
  
//   export type ProtectOptions = {
//     userPassword: string; // ye password dene wala hi PDF khol sakega
//     ownerPassword?: string;
//     allowPrint: boolean;
//     allowCopy: boolean;
//     allowModify: boolean;
//   };
  
//   export async function protectPdf(
//     file: File,
//     opts: ProtectOptions,
//   ): Promise<ProcessResult> {
//     if (!opts.userPassword) throw new Error("Password likhna zaroori hai.");
  
//     // @ts-ignore - package install karne ke baad types aa jayenge
//     const mod: any = await import("@neslinesli93/qpdf-wasm");
//     const createModule = mod.default ?? mod;
//     const qpdf = await createModule({ locateFile: () => "/qpdf.wasm" });
  
//     qpdf.FS.writeFile("/in.pdf", new Uint8Array(await file.arrayBuffer()));
//     const owner = opts.ownerPassword || opts.userPassword + "-owner";
//     qpdf.callMain([
//       "--encrypt",
//       opts.userPassword,
//       owner,
//       "256",
//       `--print=${opts.allowPrint ? "full" : "none"}`,
//       `--extract=${opts.allowCopy ? "y" : "n"}`,
//       `--modify=${opts.allowModify ? "all" : "none"}`,
//       "--",
//       "/in.pdf",
//       "/out.pdf",
//     ]);
//     const bytes: Uint8Array = qpdf.FS.readFile("/out.pdf");
  
//     return { blob: pdfBlob(bytes), filename: `${baseName(file)}-protected.pdf` };
//   }
  
//   /* ------------------------------------------------------------------ */
//   /* 5. Metadata viewer / editor                                         */
//   /* ------------------------------------------------------------------ */
  
//   export type PdfMetadata = {
//     title: string;
//     author: string;
//     subject: string;
//     keywords: string;
//     creator: string;
//     producer: string;
//     creationDate: string;
//     modificationDate: string;
//     pageCount: number;
//     encrypted: boolean;
//   };
  
//   export async function readMetadata(file: File): Promise<PdfMetadata> {
//     const doc = await load(file);
//     return {
//       title: doc.getTitle() ?? "",
//       author: doc.getAuthor() ?? "",
//       subject: doc.getSubject() ?? "",
//       keywords: doc.getKeywords() ?? "",
//       creator: doc.getCreator() ?? "",
//       producer: doc.getProducer() ?? "",
//       creationDate: doc.getCreationDate()?.toLocaleString() ?? "",
//       modificationDate: doc.getModificationDate()?.toLocaleString() ?? "",
//       pageCount: doc.getPageCount(),
//       encrypted: doc.isEncrypted,
//     };
//   }
  
//   export async function writeMetadata(
//     file: File,
//     m: Pick<
//       PdfMetadata,
//       "title" | "author" | "subject" | "keywords" | "creator" | "producer"
//     >,
//   ): Promise<ProcessResult> {
//     const doc = await load(file);
//     doc.setTitle(m.title);
//     doc.setAuthor(m.author);
//     doc.setSubject(m.subject);
//     doc.setKeywords(
//       m.keywords
//         .split(",")
//         .map((k) => k.trim())
//         .filter(Boolean),
//     );
//     doc.setCreator(m.creator);
//     doc.setProducer(m.producer);
//     doc.setModificationDate(new Date());
//     return {
//       blob: pdfBlob(await doc.save({ updateMetadata: false })),
//       filename: `${baseName(file)}-metadata.pdf`,
//     };
//   }



/**
 * pdf-extra-processors.ts
 * Naye tools: organize (reorder+numbering), rotate+crop, watermark+signature,
 * protect (password), metadata.
 *
 * Install:  npm i pdf-lib pdfjs-dist
 * Protect:  npm i @neslinesli93/qpdf-wasm  (+ qpdf.wasm ko /public mein copy karo)
 */
import {
  PDFArray,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFPage,
  PDFStream,
  PDFString,
  StandardFonts,
  degrees,
  rgb,
} from "pdf-lib";

export type ProcessResult = { blob: Blob; filename: string; note?: string };

const pdfBlob = (bytes: Uint8Array) =>
  new Blob([bytes as BlobPart], { type: "application/pdf" });
const baseName = (f: File) => f.name.replace(/\.pdf$/i, "");

// updateMetadata = false dene se pdf-lib apna Producer/ModDate overwrite nahi karta
const load = async (f: File, updateMetadata = true) =>
  PDFDocument.load(await f.arrayBuffer(), {
    ignoreEncryption: true,
    updateMetadata,
  });

/* ------------------------------------------------------------------ */
/* Thumbnails (pdfjs-dist)                                             */
/* ------------------------------------------------------------------ */

export async function renderThumbs(
  file: File,
  width = 180,
  limit = 300,
): Promise<string[]> {
  const pdfjs: any = await import("pdfjs-dist");
  // pdf-processors.ts pehle se "/pdf.worker.min.mjs" set karta hai; yahan sirf fallback.
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.js",
      import.meta.url,
    ).toString();
  }

  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() })
    .promise;
  const out: string[] = [];
  const total = Math.min(doc.numPages, limit);

  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: width / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport })
      .promise;
    out.push(canvas.toDataURL("image/jpeg", 0.6));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 1. Organize: reorder + delete + rotate + page numbers               */
/* ------------------------------------------------------------------ */

export type PageItem = { index: number; rotation: number }; // index = original page

export type NumberingOptions = {
  enabled: boolean;
  position:
    | "bottom-center"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "top-left"
    | "top-right";
  format: "n" | "n-of-total" | "page-n";
  start: number;
  fontSize: number;
};

export async function organizePdf(
  file: File,
  items: PageItem[],
  numbering: NumberingOptions,
): Promise<ProcessResult> {
  if (!items.length) throw new Error("Kam az kam ek page rakhna zaroori hai.");

  const src = await load(file);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    src,
    items.map((i) => i.index),
  );
  const font = await out.embedFont(StandardFonts.Helvetica);
  const total = copied.length;

  copied.forEach((page, i) => {
    out.addPage(page);

    if (numbering.enabled) {
      const n = numbering.start + i;
      const label =
        numbering.format === "n-of-total"
          ? `${n} / ${numbering.start + total - 1}`
          : numbering.format === "page-n"
            ? `Page ${n}`
            : `${n}`;
      const { width, height } = page.getSize();
      const tw = font.widthOfTextAtSize(label, numbering.fontSize);
      const margin = 28;
      const [v, h] = numbering.position.split("-") as [
        "top" | "bottom",
        "left" | "center" | "right",
      ];
      const x =
        h === "left" ? margin : h === "right" ? width - margin - tw : (width - tw) / 2;
      const y = v === "bottom" ? margin : height - margin - numbering.fontSize;
      page.drawText(label, {
        x,
        y,
        size: numbering.fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    const extra = items[i].rotation % 360;
    if (extra) {
      page.setRotation(
        degrees((page.getRotation().angle + extra + 360) % 360),
      );
    }
  });

  return {
    blob: pdfBlob(await out.save()),
    filename: `${baseName(file)}-organized.pdf`,
  };
}

/* ------------------------------------------------------------------ */
/* 2. Rotate + Crop                                                    */
/* ------------------------------------------------------------------ */

export type CropMargins = { top: number; right: number; bottom: number; left: number }; // percent

export async function rotateCropPdf(
  file: File,
  rotations: Record<number, number>, // pageIndex -> extra degrees
  crop: CropMargins,
): Promise<ProcessResult> {
  const doc = await load(file);
  const hasCrop = crop.top || crop.right || crop.bottom || crop.left;

  doc.getPages().forEach((page, i) => {
    const extra = (rotations[i] || 0) % 360;
    if (extra) {
      page.setRotation(degrees((page.getRotation().angle + extra + 360) % 360));
    }
    if (hasCrop) {
      const mb = page.getMediaBox();
      const x = mb.x + (mb.width * crop.left) / 100;
      const y = mb.y + (mb.height * crop.bottom) / 100;
      const w = mb.width * (1 - (crop.left + crop.right) / 100);
      const h = mb.height * (1 - (crop.top + crop.bottom) / 100);
      page.setCropBox(x, y, w, h);
    }
  });

  return {
    blob: pdfBlob(await doc.save()),
    filename: `${baseName(file)}-edited.pdf`,
  };
}

/* ------------------------------------------------------------------ */
/* 3. Watermark + Signature (add / remove / replace)                   */
/*    Sirf apne tool ke lagaye hue items remove ho sakte hain, kyunki  */
/*    hum har item ko alag content stream mein marker ke saath likhte. */
/* ------------------------------------------------------------------ */

const MARK = PDFName.of("PdfToolMark");
const UTILAI_SIG_META = PDFName.of("UtilAISigMeta");
type MarkKind = "watermark" | "signature";

export type ExistingToolSignature = {
  page: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct?: number;
};

function readSigMeta(doc: PDFDocument): ExistingToolSignature[] {
  const ref = doc.catalog.get(UTILAI_SIG_META);
  if (!ref) return [];
  const value = doc.context.lookup(ref);
  const raw =
    value instanceof PDFString || value instanceof PDFHexString
      ? value.decodeText()
      : null;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ExistingToolSignature[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSigMeta(doc: PDFDocument, items: ExistingToolSignature[]) {
  doc.catalog.set(UTILAI_SIG_META, PDFString.of(JSON.stringify(items)));
}

function decodeStreamContents(stream: PDFStream): string {
  return new TextDecoder("latin1").decode(stream.getContents());
}

function parseSignatureRectFromStream(
  text: string,
  pageWidth: number,
  pageHeight: number,
): Omit<ExistingToolSignature, "page"> | null {
  const cm = text.match(
    /([\d.+-]+)\s+0\s+0\s+([\d.+-]+)\s+([\d.+-]+)\s+([\d.+-]+)\s+cm[\s\S]{0,160}?Do/i,
  );
  if (!cm) return null;
  const w = Math.abs(parseFloat(cm[1]));
  const h = Math.abs(parseFloat(cm[2]));
  const x = parseFloat(cm[3]);
  const y = parseFloat(cm[4]);
  if (![w, h, x, y].every(Number.isFinite)) return null;
  return {
    xPct: (x / pageWidth) * 100,
    yPct: (y / pageHeight) * 100,
    widthPct: (w / pageWidth) * 100,
    heightPct: (h / pageHeight) * 100,
  };
}

function scanMarkedSignatureFallback(doc: PDFDocument): ExistingToolSignature[] {
  const out: ExistingToolSignature[] = [];
  const pages = doc.getPages();
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex];
    const { width, height } = page.getSize();
    const contents = page.node.Contents();
    if (!(contents instanceof PDFArray)) continue;
    for (let i = 0; i < contents.size(); i++) {
      const obj = doc.context.lookup(contents.get(i));
      if (!(obj instanceof PDFStream)) continue;
      const m = obj.dict.get(MARK);
      if (!(m instanceof PDFName) || m.decodeText() !== "signature") continue;
      const parsed = parseSignatureRectFromStream(
        decodeStreamContents(obj),
        width,
        height,
      );
      out.push(
        parsed
          ? { page: pageIndex, ...parsed }
          : {
              page: pageIndex,
              xPct: 69,
              yPct: 5,
              widthPct: 25,
              heightPct: 8,
            },
      );
    }
  }
  return out;
}

/** Tool-tagged signatures on a PDF (for click-to-edit in the UI). */
export async function scanExistingToolSignatures(
  file: File,
): Promise<ExistingToolSignature[]> {
  const doc = await load(file, false);
  const fromMeta = readSigMeta(doc);
  if (fromMeta.length) return fromMeta;
  return scanMarkedSignatureFallback(doc);
}

export type WatermarkOptions =
  | {
      kind: "text";
      text: string;
      fontSize: number;
      opacity: number; // 0..1
      rotation: number; // degrees
      color: string; // #rrggbb
    }
  | {
      kind: "image";
      dataUrl: string;
      widthPct: number; // % of page width
      opacity: number;
      rotation: number;
    };

export type SignaturePresetPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type SignatureOptions = {
  dataUrl: string; // PNG/JPG (draw ya upload)
  pages: "first" | "last" | "all";
  /** @deprecated Presets — prefer xPct/yPct from the UI */
  position?: SignaturePresetPosition;
  /** Bottom-left corner: % from page left edge */
  xPct: number;
  /** Bottom-left corner: % from page bottom edge */
  yPct: number;
  widthPct: number;
};

const SIG_MARGIN_PCT = 6;

export function signaturePresetCoords(
  position: SignaturePresetPosition,
  widthPct: number,
): { xPct: number; yPct: number } {
  const yPct = 5;
  switch (position) {
    case "bottom-left":
      return { xPct: SIG_MARGIN_PCT, yPct };
    case "bottom-center":
      return { xPct: (100 - widthPct) / 2, yPct };
    default:
      return { xPct: 100 - widthPct - SIG_MARGIN_PCT, yPct };
  }
}

export type SignatureStyleOptions = {
  /** Ink color (#rrggbb). Uploads and existing strokes are recolored. */
  inkColor?: string;
  /** 1 = thin, 10 = bold (stroke dilation for all signature sources) */
  lineWeight?: number;
};

const parseHexColor = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  if (!Number.isFinite(n)) return { r: 15, g: 26, b: 46 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const isInkPixel = (r: number, g: number, b: number, a: number) =>
  a >= 8 && !(r >= 245 && g >= 245 && b >= 245);

/** Canvas pen width when drawing on the signature pad */
export function signaturePadLineWidth(lineWeight: number) {
  return Math.max(2, Math.min(14, 1 + lineWeight * 1.25));
}

function thickenInk(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
  ink: { r: number; g: number; b: number },
) {
  if (radius <= 0) return;
  const size = width * height;
  const alpha = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    const o = i * 4;
    alpha[i] = isInkPixel(data[o], data[o + 1], data[o + 2], data[o + 3])
      ? data[o + 3]
      : 0;
  }
  let current = alpha;
  for (let pass = 0; pass < radius; pass++) {
    const next = new Uint8Array(current);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (current[i] === 0) continue;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const ni = ny * width + nx;
            if (current[i] > next[ni]) next[ni] = current[i];
          }
        }
      }
    }
    current = next;
  }
  for (let i = 0; i < size; i++) {
    const o = i * 4;
    if (current[i] > 0) {
      data[o] = ink.r;
      data[o + 1] = ink.g;
      data[o + 2] = ink.b;
      data[o + 3] = current[i];
    } else if (isInkPixel(data[o], data[o + 1], data[o + 2], data[o + 3])) {
      data[o + 3] = 0;
    }
  }
}

/** White knock-out, optional recolor, optional stroke thickening */
export async function prepareSignatureDataUrl(
  dataUrl: string,
  style?: SignatureStyleOptions,
): Promise<string> {
  if (!dataUrl) return dataUrl;
  const ink = parseHexColor(style?.inkColor ?? "#0f1a2e");
  const lineWeight = Math.max(1, Math.min(10, style?.lineWeight ?? 1));
  const radius = Math.max(0, Math.round(lineWeight - 1));

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Couldn't read signature image."));
    el.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a > 0 && r >= 245 && g >= 245 && b >= 245) {
      data[i + 3] = 0;
      continue;
    }
    if (isInkPixel(r, g, b, a)) {
      data[i] = ink.r;
      data[i + 1] = ink.g;
      data[i + 2] = ink.b;
    }
  }
  thickenInk(data, width, height, radius, ink);
  ctx.putImageData(new ImageData(data, width, height), 0, 0);
  return canvas.toDataURL("image/png");
}

export type WatermarkJob = {
  watermark: { action: "none" | "add" | "remove"; options?: WatermarkOptions };
  signature: {
    action: "none" | "add" | "replace" | "remove";
    options?: SignatureOptions;
  };
};

// getContentStream pdf-lib mein type-level par private hai, lekin runtime par maujood hai.
function startMarked(page: PDFPage, kind: MarkKind) {
  const cs = (page as any).getContentStream(false); // naya stream, aage ki drawing isi mein jayegi
  cs.dict.set(MARK, PDFName.of(kind));
}
function endMarked(page: PDFPage) {
  (page as any).getContentStream(false); // baad ki drawing unmarked stream mein
}

function stripMarked(doc: PDFDocument, kind: MarkKind): number {
  let removed = 0;
  for (const page of doc.getPages()) {
    const contents = page.node.Contents();
    if (!(contents instanceof PDFArray)) continue;
    const keep = PDFArray.withContext(doc.context);
    for (let i = 0; i < contents.size(); i++) {
      const ref = contents.get(i);
      const obj = doc.context.lookup(ref);
      if (obj instanceof PDFStream) {
        const m = obj.dict.get(MARK);
        if (m instanceof PDFName && m.decodeText() === kind) {
          removed++;
          continue;
        }
      }
      keep.push(ref);
    }
    page.node.set(PDFName.of("Contents"), keep);
  }
  return removed;
}

async function embedImage(doc: PDFDocument, dataUrl: string) {
  const buf = await (await fetch(dataUrl)).arrayBuffer();
  const head = new Uint8Array(buf.slice(0, 4));
  const isPng = head[0] === 0x89 && head[1] === 0x50;
  return isPng ? doc.embedPng(buf) : doc.embedJpg(buf);
}

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

async function addWatermark(doc: PDFDocument, wm: WatermarkOptions) {
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const img = wm.kind === "image" ? await embedImage(doc, wm.dataUrl) : null;
  const rad = (wm.rotation * Math.PI) / 180;

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const cx = width / 2;
    const cy = height / 2;
    startMarked(page, "watermark");

    if (wm.kind === "text") {
      const tw = font.widthOfTextAtSize(wm.text, wm.fontSize);
      const a = tw / 2;
      const b = wm.fontSize / 3;
      page.drawText(wm.text, {
        x: cx - (a * Math.cos(rad) - b * Math.sin(rad)),
        y: cy - (a * Math.sin(rad) + b * Math.cos(rad)),
        size: wm.fontSize,
        font,
        color: hexToRgb(wm.color),
        opacity: wm.opacity,
        rotate: degrees(wm.rotation),
      });
    } else if (img) {
      const w = (width * wm.widthPct) / 100;
      const h = (img.height / img.width) * w;
      const a = w / 2;
      const b = h / 2;
      page.drawImage(img, {
        x: cx - (a * Math.cos(rad) - b * Math.sin(rad)),
        y: cy - (a * Math.sin(rad) + b * Math.cos(rad)),
        width: w,
        height: h,
        opacity: wm.opacity,
        rotate: degrees(wm.rotation),
      });
    }
    endMarked(page);
  }
}

function resolveSignaturePlacement(
  sig: SignatureOptions,
  pageWidth: number,
  pageHeight: number,
  sigWidth: number,
  sigHeight: number,
) {
  const wPct = (sigWidth / pageWidth) * 100;
  const hPct = (sigHeight / pageHeight) * 100;
  const xPct = Math.max(0, Math.min(sig.xPct, 100 - wPct));
  const yPct = Math.max(0, Math.min(sig.yPct, 100 - hPct));
  return {
    x: (pageWidth * xPct) / 100,
    y: (pageHeight * yPct) / 100,
  };
}

async function addSignature(doc: PDFDocument, sig: SignatureOptions) {
  const dataUrl = await prepareSignatureDataUrl(sig.dataUrl);
  const img = await embedImage(doc, dataUrl);
  const pages = doc.getPages();
  const targets =
    sig.pages === "first"
      ? [pages[0]]
      : sig.pages === "last"
        ? [pages[pages.length - 1]]
        : pages;

  const metaEntries: ExistingToolSignature[] = [];
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const page = pages[pageIndex];
    if (!targets.includes(page)) continue;
    const { width, height } = page.getSize();
    const w = (width * sig.widthPct) / 100;
    const h = (img.height / img.width) * w;
    const { x, y } = resolveSignaturePlacement(sig, width, height, w, h);
    startMarked(page, "signature");
    page.drawImage(img, { x, y, width: w, height: h });
    endMarked(page);
    metaEntries.push({
      page: pageIndex,
      xPct: (x / width) * 100,
      yPct: (y / height) * 100,
      widthPct: (w / width) * 100,
      heightPct: (h / height) * 100,
    });
  }
  const prior = readSigMeta(doc);
  const targetPages = new Set(metaEntries.map((entry) => entry.page));
  writeSigMeta(doc, [
    ...prior.filter((entry) => !targetPages.has(entry.page)),
    ...metaEntries,
  ]);
}

export async function watermarkPdf(
  file: File,
  job: WatermarkJob,
): Promise<ProcessResult> {
  const doc = await load(file);
  const notes: string[] = [];

  if (job.watermark.action === "remove") {
    const n = stripMarked(doc, "watermark");
    notes.push(
      n
        ? `${n} watermark layer(s) remove hui.`
        : "Is tool ka lagaya hua watermark nahi mila (dusre software ka watermark remove nahi ho sakta).",
    );
  }
  if (job.signature.action === "remove" || job.signature.action === "replace") {
    const n = stripMarked(doc, "signature");
    writeSigMeta(doc, []);
    notes.push(
      n
        ? `${n} signature layer(s) remove hui.`
        : "Is tool ka lagaya hua signature nahi mila.",
    );
  }

  if (job.watermark.action === "add" && job.watermark.options) {
    await addWatermark(doc, job.watermark.options);
  }
  if (
    (job.signature.action === "add" || job.signature.action === "replace") &&
    job.signature.options
  ) {
    await addSignature(doc, job.signature.options);
  }

  return {
    blob: pdfBlob(await doc.save()),
    filename: `${baseName(file)}-marked.pdf`,
    note: notes.join(" "),
  };
}

/* ------------------------------------------------------------------ */
/* 4. Protect (password) - client side, qpdf-wasm                      */
/* ------------------------------------------------------------------ */

export type ProtectOptions = {
  userPassword: string; // ye password dene wala hi PDF khol sakega
  ownerPassword?: string;
  allowPrint: boolean;
  allowCopy: boolean;
  allowModify: boolean;
};

export async function protectPdf(
  file: File,
  opts: ProtectOptions,
): Promise<ProcessResult> {
  if (!opts.userPassword) throw new Error("Password likhna zaroori hai.");

  // @ts-ignore - package ke types nahi hain
  const mod: any = await import("@neslinesli93/qpdf-wasm");
  const createModule = mod.default ?? mod;
  const qpdf = await createModule({ locateFile: () => "/qpdf.wasm" });

  qpdf.FS.writeFile("/in.pdf", new Uint8Array(await file.arrayBuffer()));
  const owner = opts.ownerPassword || opts.userPassword + "-owner";
  qpdf.callMain([
    "--encrypt",
    opts.userPassword,
    owner,
    "256",
    `--print=${opts.allowPrint ? "full" : "none"}`,
    `--extract=${opts.allowCopy ? "y" : "n"}`,
    `--modify=${opts.allowModify ? "all" : "none"}`,
    "--",
    "/in.pdf",
    "/out.pdf",
  ]);
  const bytes: Uint8Array = qpdf.FS.readFile("/out.pdf");

  return { blob: pdfBlob(bytes), filename: `${baseName(file)}-protected.pdf` };
}

/* ------------------------------------------------------------------ */
/* 5. Metadata viewer / editor                                         */
/* ------------------------------------------------------------------ */

export type PdfMetadata = {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pageCount: number;
  encrypted: boolean;
};

export async function readMetadata(file: File): Promise<PdfMetadata> {
  // updateMetadata=false: sirf padh rahe hain, kuch change nahi karna
  const doc = await load(file, false);
  return {
    title: doc.getTitle() ?? "",
    author: doc.getAuthor() ?? "",
    subject: doc.getSubject() ?? "",
    keywords: doc.getKeywords() ?? "",
    creator: doc.getCreator() ?? "",
    producer: doc.getProducer() ?? "",
    creationDate: doc.getCreationDate()?.toLocaleString() ?? "",
    modificationDate: doc.getModificationDate()?.toLocaleString() ?? "",
    pageCount: doc.getPageCount(),
    encrypted: doc.isEncrypted,
  };
}

export async function writeMetadata(
  file: File,
  m: Pick<
    PdfMetadata,
    "title" | "author" | "subject" | "keywords" | "creator" | "producer"
  >,
): Promise<ProcessResult> {
  // updateMetadata load ka option hai (save ka nahi): pdf-lib apna Producer/dates overwrite na kare
  const doc = await load(file, false);
  doc.setTitle(m.title);
  doc.setAuthor(m.author);
  doc.setSubject(m.subject);
  doc.setKeywords(
    m.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  );
  doc.setCreator(m.creator);
  doc.setProducer(m.producer);
  doc.setModificationDate(new Date());
  return {
    blob: pdfBlob(await doc.save()),
    filename: `${baseName(file)}-metadata.pdf`,
  };
}