// import * as pdfjsLib from "pdfjs-dist";
// import { PDFDocument } from "pdf-lib";

// // ✅ Use local .mjs file instead of CDN
// if (typeof window !== "undefined") {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
// }

// export async function processPdf(
//   slug: string,
//   files: File[],
//   options: { quality?: number } = {}
// ) {
//   switch (slug) {
//     case "merge-pdf":
//       return await mergePdfs(files);
//     case "split-pdf":
//       return await splitPdf(files[0]);
//     case "jpg-to-pdf":
//       return await jpgToPdf(files);
//     case "pdf-to-jpg":
//       return await pdfToJpg(files[0], options.quality || 80);
//     default:
//       throw new Error(`Unknown operation: ${slug}`);
//   }
// }

// async function pdfToJpg(file: File, quality: number) {
//   try {
//     const bytes = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
//     const pageCount = pdf.numPages;

//     if (pageCount > 1) {
//       const { default: JSZip } = await import("jszip");
//       const zip = new JSZip();

//       for (let i = 1; i <= pageCount; i++) {
//         const jpgBlob = await renderPageToJpg(pdf, i, quality);
//         zip.file(`page-${String(i).padStart(3, "0")}.jpg`, jpgBlob);
//       }

//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       return {
//         blob: zipBlob,
//         filename: `${file.name.replace(".pdf", "")}-pages.zip`,
//       };
//     }

//     const jpgBlob = await renderPageToJpg(pdf, 1, quality);
//     return {
//       blob: jpgBlob,
//       filename: `${file.name.replace(".pdf", "")}.jpg`,
//     };
//   } catch (error) {
//     throw new Error(
//       `Failed to convert PDF: ${error instanceof Error ? error.message : "Unknown error"}`
//     );
//   }
// }

// async function renderPageToJpg(
//   pdf: pdfjsLib.PDFDocumentProxy,
//   pageNum: number,
//   quality: number
// ): Promise<Blob> {
//   const page = await pdf.getPage(pageNum);
//   const scale = 2;
//   const viewport = page.getViewport({ scale });

//   const canvas = document.createElement("canvas");
//   canvas.width = viewport.width;
//   canvas.height = viewport.height;

//   const context = canvas.getContext("2d");
//   if (!context) throw new Error("Failed to get canvas context");

//   const renderTask = page.render({
//     canvasContext: context,
//     viewport: viewport,
//   });

//   await renderTask.promise;

//   return new Promise((resolve, reject) => {
//     canvas.toBlob(
//       (blob) => {
//         if (blob) resolve(blob);
//         else reject(new Error("Failed to convert canvas to blob"));
//       },
//       "image/jpeg",
//       quality / 100
//     );
//   });
// }

// async function mergePdfs(files: File[]) {
//   try {
//     const mergedPdf = await PDFDocument.create();
//     for (const file of files) {
//       const bytes = await file.arrayBuffer();
//       const pdf = await PDFDocument.load(bytes);
//       const copiedPages = await mergedPdf.copyPages(
//         pdf,
//         pdf.getPages().map((_, i) => i)
//       );
//       copiedPages.forEach((page) => mergedPdf.addPage(page));
//     }
//     const pdfBytes = await mergedPdf.save();
//     return {
//       blob: new Blob([pdfBytes], { type: "application/pdf" }),
//       filename: "merged.pdf",
//     };
//   } catch (error) {
//     throw new Error(
//       `Failed to merge PDFs: ${error instanceof Error ? error.message : "Unknown error"}`
//     );
//   }
// }

// async function splitPdf(file: File) {
//   try {
//     const bytes = await file.arrayBuffer();
//     const pdf = await PDFDocument.load(bytes);
//     const { default: JSZip } = await import("jszip");
//     const zip = new JSZip();

//     for (let i = 0; i < pdf.getPageCount(); i++) {
//       const singlePagePdf = await PDFDocument.create();
//       const [copiedPage] = await singlePagePdf.copyPages(pdf, [i]);
//       singlePagePdf.addPage(copiedPage);
//       const pdfBytes = await singlePagePdf.save();
//       zip.file(`page-${String(i + 1).padStart(3, "0")}.pdf`, new Blob([pdfBytes]));
//     }

//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     return {
//       blob: zipBlob,
//       filename: `${file.name.replace(".pdf", "")}-pages.zip`,
//     };
//   } catch (error) {
//     throw new Error(
//       `Failed to split PDF: ${error instanceof Error ? error.message : "Unknown error"}`
//     );
//   }
// }

// async function jpgToPdf(files: File[]) {
//   try {
//     const pdf = await PDFDocument.create();

//     for (const file of files) {
//       // Read file as data URL instead of arrayBuffer
//       const dataUrl = await new Promise<string>(
//         (resolve, reject) => {
//           const reader =
//             new FileReader();

//           reader.onload = () => {
//             resolve(
//               reader.result as string
//             );
//           };

//           reader.onerror = () => {
//             reject(
//               new Error(
//                 `Failed to read ${file.name}`
//               )
//             );
//           };

//           reader.readAsDataURL(file);
//         }
//       );

//       let image;
//       try {
//         const ext =
//           file.name
//             .split(".")
//             .pop()
//             ?.toLowerCase();

//         if (ext === "png") {
//           image =
//             await pdf.embedPng(
//               dataUrl
//             );
//         } else {
//           image =
//             await pdf.embedJpg(
//               dataUrl
//             );
//         }
//       } catch (error) {
//         console.error(
//           "Embed error:",
//           error
//         );
//         throw error;
//       }

//       if (!image) {
//         throw new Error(
//           `Image embedding failed for ${file.name}`
//         );
//       }

//       // Get actual image dimensions
//       const imgWidth =
//         image.width || 600;
//       const imgHeight =
//         image.height || 800;

//       // Create page with image dimensions
//       const page = pdf.addPage([
//         imgWidth,
//         imgHeight,
//       ]);

//       // Draw image filling entire page
//       page.drawImage(image, {
//         x: 0,
//         y: 0,
//         width: imgWidth,
//         height: imgHeight,
//       });
//     }

//     const pdfBytes =
//       await pdf.save();

//     return {
//       blob: new Blob([pdfBytes], {
//         type: "application/pdf",
//       }),
//       filename: "converted.pdf",
//     };
//   } catch (error) {
//     console.error(
//       "PDF conversion error:",
//       error
//     );
//     throw new Error(
//       `Failed to convert JPG to PDF: ${error instanceof Error ? error.message : "Unknown error"}`
//     );
//   }
// }



// /** Trigger a browser download of the exported PDF bytes. */
// export function downloadPdf(bytes: Uint8Array, filename: string): void {
//   const blob = new Blob([bytes], { type: "application/pdf" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   URL.revokeObjectURL(url);
// }



import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import type { ExportPageInput } from "./pdfeditor/pdf-shapes";

if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

/* ------------------------------------------------------------------ */
/* Existing multi-tool operations (merge / split / convert)            */
/* ------------------------------------------------------------------ */

export async function processPdf(
    slug: string,
    files: File[],
    options: { quality?: number } = {}
) {
    switch (slug) {
        case "merge-pdf":
            return await mergePdfs(files);
        case "split-pdf":
            return await splitPdf(files[0]);
        case "jpg-to-pdf":
            return await jpgToPdf(files);
        case "pdf-to-jpg":
            return await pdfToJpg(files[0], options.quality || 80);
        default:
            throw new Error(`Unknown operation: ${slug}`);
    }
}

async function pdfToJpg(file: File, quality: number) {
    const bytes = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const pageCount = pdf.numPages;

    if (pageCount > 1) {
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();

        for (let i = 1; i <= pageCount; i++) {
            const jpgBlob = await renderPageToJpg(pdf, i, quality);
            zip.file(`page-${String(i).padStart(3, "0")}.jpg`, jpgBlob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        return {
            blob: zipBlob,
            filename: `${file.name.replace(".pdf", "")}-pages.zip`,
        };
    }

    const jpgBlob = await renderPageToJpg(pdf, 1, quality);
    return {
        blob: jpgBlob,
        filename: `${file.name.replace(".pdf", "")}.jpg`,
    };
}

async function renderPageToJpg(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNum: number,
    quality: number
): Promise<Blob> {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get canvas context");

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
            "image/jpeg",
            quality / 100
        );
    });
}

async function mergePdfs(files: File[]) {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPages().map((_, i) => i)
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    return {
        blob: new Blob([pdfBytes], { type: "application/pdf" }),
        filename: "merged.pdf",
    };
}

async function splitPdf(file: File) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();

    for (let i = 0; i < pdf.getPageCount(); i++) {
        const singlePagePdf = await PDFDocument.create();
        const [copiedPage] = await singlePagePdf.copyPages(pdf, [i]);
        singlePagePdf.addPage(copiedPage);
        const pdfBytes = await singlePagePdf.save();
        zip.file(
            `page-${String(i + 1).padStart(3, "0")}.pdf`,
            new Blob([pdfBytes])
        );
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    return {
        blob: zipBlob,
        filename: `${file.name.replace(".pdf", "")}-pages.zip`,
    };
}

async function jpgToPdf(files: File[]) {
    const pdf = await PDFDocument.create();

    for (const file of files) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () =>
                reject(new Error(`Failed to read ${file.name}`));
            reader.readAsDataURL(file);
        });

        const ext = file.name.split(".").pop()?.toLowerCase();
        const image =
            ext === "png"
                ? await pdf.embedPng(dataUrl)
                : await pdf.embedJpg(dataUrl);

        const imgWidth = image.width || 600;
        const imgHeight = image.height || 800;

        const page = pdf.addPage([imgWidth, imgHeight]);
        page.drawImage(image, { x: 0, y: 0, width: imgWidth, height: imgHeight });
    }

    const pdfBytes = await pdf.save();
    return {
        blob: new Blob([pdfBytes], { type: "application/pdf" }),
        filename: "converted.pdf",
    };
}

/* ------------------------------------------------------------------ */
/* NEW: export the annotated canvas (text/shapes/images) back to PDF   */
/* ------------------------------------------------------------------ */

function hexToRgb01(hex: string | undefined | null) {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
        return rgb(0, 0, 0);
    }
    const clean = hex.replace("#", "");
    const full =
        clean.length === 3
            ? clean
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : clean;
    const r = parseInt(full.substring(0, 2), 16) / 255;
    const g = parseInt(full.substring(2, 4), 16) / 255;
    const b = parseInt(full.substring(4, 6), 16) / 255;
    return rgb(
        Number.isFinite(r) ? r : 0,
        Number.isFinite(g) ? g : 0,
        Number.isFinite(b) ? b : 0
    );
}

function pickFont(
    fonts: Record<string, any>,
    bold: boolean,
    italic: boolean
) {
    if (bold && italic) return fonts.boldItalic;
    if (bold) return fonts.bold;
    if (italic) return fonts.italic;
    return fonts.regular;
}

/**
 * Takes the ORIGINAL pdf bytes plus, per page, the live Fabric.js objects
 * drawn on top of the rasterized background, and bakes them into a real
 * (still-editable-by-other-tools) PDF using pdf-lib.
 *
 * `pages[i].width` / `height` MUST be the pixel size of the rasterized
 * background image that was shown on the canvas for that page (i.e. what
 * renderPdfPage() returned), so we can compute the scale factor back to
 * PDF point units.
 */
export async function exportprocesspdf(
    originalBytes: ArrayBuffer,
    pages: ExportPageInput[]
): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(originalBytes);

    const fonts = {
        regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
        bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
        italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
        boldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
    };

    for (const pageInput of pages) {
        const { pageNumber, width: canvasWidth, height: canvasHeight, objects } =
            pageInput;

        if (!objects || objects.length === 0) continue;

        const pdfPage = pdfDoc.getPage(pageNumber - 1);
        if (!pdfPage) continue;

        const pdfWidth = pdfPage.getWidth();
        const pdfHeight = pdfPage.getHeight();

        // Scale factor to go from rendered canvas pixels -> PDF points.
        const scaleX = canvasWidth ? pdfWidth / canvasWidth : 1;
        const scaleY = canvasHeight ? pdfHeight / canvasHeight : 1;

        for (const obj of objects) {
            const editorType: string =
                typeof obj.get === "function"
                    ? obj.get("editorType") ?? obj.type
                    : obj.type;

            const opacity =
                typeof obj.opacity === "number" ? obj.opacity : 1;

            const left = (obj.left ?? 0) * scaleX;
            const top = (obj.top ?? 0) * scaleY;

            try {
                if (editorType === "text") {
                    const text: string = obj.text ?? "";
                    const fontSize =
                        (obj.fontSize ?? 24) *
                        (obj.scaleY ?? 1) *
                        scaleY;
                    const bold = obj.fontWeight === "bold";
                    const italic = obj.fontStyle === "italic";
                    const font = pickFont(fonts, bold, italic);
                    const color = hexToRgb01(
                        typeof obj.fill === "string" ? obj.fill : "#000000"
                    );

                    const lines = text.split("\n");
                    const lineHeight = fontSize * 1.16;

                    lines.forEach((line, index) => {
                        const baselineY =
                            pdfHeight -
                            top -
                            fontSize * 0.85 -
                            index * lineHeight;

                        pdfPage.drawText(line, {
                            x: left,
                            y: baselineY,
                            size: fontSize,
                            font,
                            color,
                            opacity,
                        });

                        if (obj.underline) {
                            const textWidth = font.widthOfTextAtSize(
                                line,
                                fontSize
                            );
                            pdfPage.drawLine({
                                start: { x: left, y: baselineY - 2 },
                                end: { x: left + textWidth, y: baselineY - 2 },
                                thickness: Math.max(1, fontSize * 0.05),
                                color,
                                opacity,
                            });
                        }
                    });
                } else if (editorType === "rectangle" || editorType === "highlight") {
                    const w = (obj.width ?? 0) * (obj.scaleX ?? 1) * scaleX;
                    const h = (obj.height ?? 0) * (obj.scaleY ?? 1) * scaleY;
                    const fill =
                        typeof obj.fill === "string" ? obj.fill : "#ffffff";
                    const stroke =
                        typeof obj.stroke === "string" ? obj.stroke : undefined;

                    pdfPage.drawRectangle({
                        x: left,
                        y: pdfHeight - top - h,
                        width: w,
                        height: h,
                        color: hexToRgb01(fill),
                        opacity,
                        borderColor: stroke ? hexToRgb01(stroke) : undefined,
                        borderWidth: stroke
                            ? Math.max(0.5, (obj.strokeWidth ?? 1) * scaleX)
                            : undefined,
                    });
                } else if (editorType === "circle") {
                    const radius =
                        (obj.radius ?? 0) *
                        (obj.scaleX ?? 1) *
                        scaleX;
                    const fill =
                        typeof obj.fill === "string" ? obj.fill : "#ffffff";
                    const stroke =
                        typeof obj.stroke === "string" ? obj.stroke : undefined;

                    pdfPage.drawEllipse({
                        x: left + radius,
                        y: pdfHeight - top - radius,
                        xScale: radius,
                        yScale: radius,
                        color: hexToRgb01(fill),
                        opacity,
                        borderColor: stroke ? hexToRgb01(stroke) : undefined,
                        borderWidth: stroke
                            ? Math.max(0.5, (obj.strokeWidth ?? 1) * scaleX)
                            : undefined,
                    });
                } else if (editorType === "line") {
                    const x1 = (obj.x1 ?? 0) * scaleX;
                    const y1 = (obj.y1 ?? 0) * scaleY;
                    const x2 = (obj.x2 ?? 0) * scaleX;
                    const y2 = (obj.y2 ?? 0) * scaleY;
                    const stroke =
                        typeof obj.stroke === "string" ? obj.stroke : "#000000";

                    pdfPage.drawLine({
                        start: { x: x1, y: pdfHeight - y1 },
                        end: { x: x2, y: pdfHeight - y2 },
                        thickness: Math.max(0.5, (obj.strokeWidth ?? 2) * scaleX),
                        color: hexToRgb01(stroke),
                        opacity,
                    });
                } else if (editorType === "image") {
                    const dataUrl: string | undefined =
                        typeof obj.toDataURL === "function"
                            ? obj.toDataURL({ format: "png" })
                            : undefined;

                    if (!dataUrl) continue;

                    const w =
                        (obj.width ?? 0) * (obj.scaleX ?? 1) * scaleX;
                    const h =
                        (obj.height ?? 0) * (obj.scaleY ?? 1) * scaleY;

                    const embedded = await pdfDoc.embedPng(dataUrl);

                    pdfPage.drawImage(embedded, {
                        x: left,
                        y: pdfHeight - top - h,
                        width: w,
                        height: h,
                        opacity,
                    });
                }
            } catch (error) {
                // A single bad object shouldn't fail the whole export.
                console.error("Failed to draw object into PDF:", editorType, error);
            }
        }

        void degrees; // reserved for future rotation support
    }

    return pdfDoc.save();
}

/* ------------------------------------------------------------------ */

/** Trigger a browser download of the exported PDF bytes. */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}