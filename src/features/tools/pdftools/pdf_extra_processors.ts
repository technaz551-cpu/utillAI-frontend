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
  PDFName,
  PDFPage,
  PDFStream,
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
type MarkKind = "watermark" | "signature";

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

export type SignatureOptions = {
  dataUrl: string; // PNG/JPG (draw ya upload)
  pages: "first" | "last" | "all";
  position: "bottom-right" | "bottom-left" | "bottom-center";
  widthPct: number;
};

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

async function addSignature(doc: PDFDocument, sig: SignatureOptions) {
  const img = await embedImage(doc, sig.dataUrl);
  const pages = doc.getPages();
  const targets =
    sig.pages === "first"
      ? [pages[0]]
      : sig.pages === "last"
        ? [pages[pages.length - 1]]
        : pages;

  for (const page of targets) {
    const { width } = page.getSize();
    const w = (width * sig.widthPct) / 100;
    const h = (img.height / img.width) * w;
    const margin = 36;
    const x =
      sig.position === "bottom-left"
        ? margin
        : sig.position === "bottom-center"
          ? (width - w) / 2
          : width - w - margin;
    startMarked(page, "signature");
    page.drawImage(img, { x, y: margin, width: w, height: h });
    endMarked(page);
  }
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