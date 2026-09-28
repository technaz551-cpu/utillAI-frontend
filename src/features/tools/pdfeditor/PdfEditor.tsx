


// import React, { useEffect, useRef, useState } from 'react';
// import * as fabric from 'fabric';
// import * as pdfjsLib from 'pdfjs-dist';
// import { jsPDF } from 'jspdf';
// import {
//   Type,
//   Image as ImageIcon,
//   Square,
//   Layout,
//   Upload,
//   Download,
//   Bold,
//   Italic,
//   Underline,
//   Plus,
//   Trash2,
//   Copy,
//   Lock,
//   Unlock,
//   RotateCw,
//   Move,
//   Palette,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   Circle,
//   ArrowRight,
//   ArrowRightCircle,
//   Star,
//   Layers,
//   FilePlus,
//   Eye,
//   Sliders,
//   Highlighter
// } from 'lucide-react';
// import './pdfeditor.css';

// type PdfTextItemLike = {
//   str: string;
//   transform: number[];
//   width?: number;
// };

// // Setting up pdfjs worker using CDN fallback to fix render issues
// // pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;


// // 1. Updated Import

// // 2. Updated Worker setup
// if (typeof window !== "undefined") {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
// }

// export default function UtilAiPdfEditor({ tool }: { tool?: { slug?: string } }) {
//   void tool;
//   const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'export'>('uploads');
//   const [pages, setPages] = useState<{ id: string; width: number; height: number }[]>([]);
//   const [hasDocument, setHasDocument] = useState<boolean>(false);
  
//   const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
//   const fabricCanvases = useRef<{ [key: string]: fabric.Canvas }>({});
//   const [activeCanvas, setActiveCanvas] = useState<fabric.Canvas | null>(null);
//   const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
//   const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] = useState(false);
//   const [isExportOpen, setIsExportOpen] = useState(false);
//   const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'jpg'>('pdf');
//   const [exportAction, setExportAction] = useState<'download' | 'print' | 'share' | 'preview'>('download');
//   const [isExportConfirmed, setIsExportConfirmed] = useState(false);

//   useEffect(() => {
//     document.body.classList.add('pdf-editor-open');
//     return () => document.body.classList.remove('pdf-editor-open');
//   }, []);

//   // Floating Context Menu Position
//   const [floatingMenuPos, setFloatingMenuPos] = useState<{ top: number; left: number } | null>(null);

//   // Text & Object Formatting States
//   const [fontFamily, setFontFamily] = useState<string>('Helvetica');
//   const [fontSize, setFontSize] = useState<number>(20);
//   const [isBold, setIsBold] = useState<boolean>(false);
//   const [isItalic, setIsItalic] = useState<boolean>(false);
//   const [isUnderline, setIsUnderline] = useState<boolean>(false);
//   const [textColor, setTextColor] = useState<string>('#1e293b');
//   const [bgColor, setBgColor] = useState<string>('#ffffff');
//   const [opacity, setOpacity] = useState<number>(1);
//   // ------------------------------------------------------------
//   // Existing PDF text editing support
//   // ------------------------------------------------------------
//   // PDF pages are rendered into a background image. That means the
//   // original PDF text is physically part of the background pixels.
//   // We therefore need a separate "erase" layer before drawing the
//   // edited text. The old implementation used one mask that moved
//   // with the text and sampled only one pixel, which caused:
//   //   1. old text to reappear when the edited text became empty;
//   //   2. white/incorrect backgrounds over colored PDF areas;
//   //   3. the mask to move away from the original text when the text
//   //      object was moved.
//   // ------------------------------------------------------------
//   const pdfTextMasks = useRef(new Map<fabric.Object, fabric.Rect[]>());
//   const pdfTextMaskColors = useRef(new Map<fabric.Object, string>());
//   const pdfTextBounds = useRef(new Map<fabric.Object, {
//     left: number;
//     top: number;
//     width: number;
//     height: number;
//     angle: number;
//   }>());

//   // When a PDF text object is deleted, its erase mask must stay on the
//   // canvas. Otherwise the original PDF text becomes visible again because
//   // the original text is part of the background image.
//   const preservePdfMaskOnDelete = useRef(new Set<fabric.Object>());

//   const clamp = (value: number, min: number, max: number) =>
//     Math.max(min, Math.min(max, value));

//   const getBackgroundPixel = (
//     canvas: fabric.Canvas,
//     x: number,
//     y: number,
//   ): [number, number, number] | null => {
//     const background = canvas.backgroundImage as fabric.Image | undefined;
//     const element = background?.getElement() as HTMLImageElement | HTMLCanvasElement | undefined;
//     if (!background || !element) return null;

//     const sourceX = clamp(
//       (x - (background.left || 0)) / (background.scaleX || 1),
//       0,
//       Math.max(0, element.width - 1),
//     );
//     const sourceY = clamp(
//       (y - (background.top || 0)) / (background.scaleY || 1),
//       0,
//       Math.max(0, element.height - 1),
//     );

//     const sampleCanvas = document.createElement('canvas');
//     sampleCanvas.width = 1;
//     sampleCanvas.height = 1;
//     const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
//     if (!ctx) return null;

//     try {
//       ctx.drawImage(element, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
//       const pixel = ctx.getImageData(0, 0, 1, 1).data;
//       return [pixel[0], pixel[1], pixel[2]];
//     } catch {
//       return null;
//     }
//   };

//   const estimateBackgroundColor = (
//     canvas: fabric.Canvas,
//     bounds: { left: number; top: number; width: number; height: number },
//   ) => {
//     // The background can be white, dark gray, green, highlighted, etc.
//     // Sampling only outside the text fails for highlighted PDF text because
//     // the highlight often exists exactly underneath the glyphs. Instead,
//     // sample the complete text rectangle and choose the dominant color.
//     // Glyphs normally occupy far fewer pixels than their background.
//     const background = canvas.backgroundImage as fabric.Image | undefined;
//     const element = background?.getElement() as HTMLImageElement | HTMLCanvasElement | undefined;
//     if (!background || !element) return '#ffffff';

//     const sourceX = clamp(
//       (bounds.left - (background.left || 0)) / (background.scaleX || 1),
//       0,
//       Math.max(0, element.width - 1),
//     );
//     const sourceY = clamp(
//       (bounds.top - (background.top || 0)) / (background.scaleY || 1),
//       0,
//       Math.max(0, element.height - 1),
//     );
//     const sourceW = Math.max(1, Math.min(
//       element.width - sourceX,
//       bounds.width / (background.scaleX || 1),
//     ));
//     const sourceH = Math.max(1, Math.min(
//       element.height - sourceY,
//       (bounds.height * 1.25) / (background.scaleY || 1),
//     ));

//     const sampleCanvas = document.createElement('canvas');
//     sampleCanvas.width = 40;
//     sampleCanvas.height = 20;
//     const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
//     if (!ctx) return '#ffffff';

//     try {
//       ctx.drawImage(element, sourceX, sourceY, sourceW, sourceH, 0, 0, 40, 20);
//       const pixels = ctx.getImageData(0, 0, 40, 20).data;
//       const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();

//       // Quantize colors so antialiasing/compression does not create hundreds
//       // of almost-identical colors.
//       for (let i = 0; i < pixels.length; i += 4) {
//         const r = pixels[i];
//         const g = pixels[i + 1];
//         const b = pixels[i + 2];
//         const qr = Math.round(r / 12) * 12;
//         const qg = Math.round(g / 12) * 12;
//         const qb = Math.round(b / 12) * 12;
//         const key = `${qr},${qg},${qb}`;
//         const current = buckets.get(key);
//         if (current) current.count += 1;
//         else buckets.set(key, { r: qr, g: qg, b: qb, count: 1 });
//       }

//       const ranked = [...buckets.values()].sort((x, y) => y.count - x.count);
//       const dominant = ranked[0];
//       if (!dominant) return '#ffffff';

//       return `rgb(${clamp(dominant.r, 0, 255)}, ${clamp(dominant.g, 0, 255)}, ${clamp(dominant.b, 0, 255)})`;
//     } catch {
//       return '#ffffff';
//     }
//   };

//   const estimateTextColor = (
//     canvas: fabric.Canvas,
//     bounds: { left: number; top: number; width: number; height: number },
//   ) => {
//     // Estimate the foreground/text color from pixels INSIDE the text area.
//     // We compare them with the background color sampled around the text.
//     // This avoids forcing every selected PDF text object to black.
//     const background = estimateBackgroundColor(canvas, bounds);
//     const bgMatch = background.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
//     const bg: [number, number, number] = bgMatch
//       ? [Number(bgMatch[1]), Number(bgMatch[2]), Number(bgMatch[3])]
//       : [255, 255, 255];

//     const backgroundImage = canvas.backgroundImage as fabric.Image | undefined;
//     const element = backgroundImage?.getElement() as HTMLImageElement | HTMLCanvasElement | undefined;
//     if (!backgroundImage || !element) return '#1e293b';

//     const sourceX = clamp(
//       (bounds.left - (backgroundImage.left || 0)) / (backgroundImage.scaleX || 1),
//       0,
//       Math.max(0, element.width - 1),
//     );
//     const sourceY = clamp(
//       (bounds.top - (backgroundImage.top || 0)) / (backgroundImage.scaleY || 1),
//       0,
//       Math.max(0, element.height - 1),
//     );
//     const sourceW = Math.max(1, Math.min(
//       element.width - sourceX,
//       bounds.width / (backgroundImage.scaleX || 1),
//     ));
//     const sourceH = Math.max(1, Math.min(
//       element.height - sourceY,
//       bounds.height / (backgroundImage.scaleY || 1),
//     ));

//     const sampleCanvas = document.createElement('canvas');
//     sampleCanvas.width = 24;
//     sampleCanvas.height = 12;
//     const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
//     if (!ctx) return '#1e293b';

//     try {
//       ctx.drawImage(element, sourceX, sourceY, sourceW, sourceH, 0, 0, 24, 12);
//       const pixels = ctx.getImageData(0, 0, 24, 12).data;
//       let best: [number, number, number] | null = null;
//       let bestDistance = 0;

//       for (let i = 0; i < pixels.length; i += 4) {
//         const r = pixels[i];
//         const g = pixels[i + 1];
//         const b = pixels[i + 2];
//         const distance = Math.sqrt(
//           (r - bg[0]) ** 2 +
//           (g - bg[1]) ** 2 +
//           (b - bg[2]) ** 2,
//         );

//         if (distance > bestDistance) {
//           bestDistance = distance;
//           best = [r, g, b];
//         }
//       }

//       if (!best) return '#1e293b';

//       // Snap near-black/near-white values to stable text colors.
//       const [r, g, b] = best;
//       if (r < 55 && g < 55 && b < 55) return '#111111';
//       if (r > 220 && g > 220 && b > 220) return '#ffffff';
//       return `rgb(${r}, ${g}, ${b})`;
//     } catch {
//       return '#1e293b';
//     }
//   };

//   const getObjectBounds = (object: fabric.Object) => {
//     const bounds = object.getBoundingRect();
//     return {
//       left: bounds.left,
//       top: bounds.top,
//       width: Math.max(1, bounds.width),
//       height: Math.max(1, bounds.height),
//     };
//   };

//   const createPdfMask = (
//     canvas: fabric.Canvas,
//     object: fabric.Object,
//     bounds: { left: number; top: number; width: number; height: number },
//     color: string,
//     angle = 0,
//   ) => {
//     const mask = new fabric.Rect({
//       left: bounds.left + bounds.width / 2,
//       top: bounds.top + bounds.height / 2,
//       width: bounds.width + 2,
//       height: bounds.height + 2,
//       originX: 'center',
//       originY: 'center',
//       angle,
//       fill: color,
//       selectable: false,
//       evented: false,
//       excludeFromExport: false,
//     });

//     canvas.add(mask);
//     canvas.sendObjectToBack(mask);

//     const masks = pdfTextMasks.current.get(object) || [];
//     masks.push(mask);
//     pdfTextMasks.current.set(object, masks);
//     return mask;
//   };

//   const removePdfTextMasks = (canvas: fabric.Canvas, object: fabric.Object) => {
//     const masks = pdfTextMasks.current.get(object) || [];
//     masks.forEach((mask) => canvas.remove(mask));
//     pdfTextMasks.current.delete(object);
//     pdfTextMaskColors.current.delete(object);
//     pdfTextBounds.current.delete(object);
//   };

//   const updatePdfTextMasks = (canvas: fabric.Canvas, object: fabric.Object) => {
//     const original = pdfTextBounds.current.get(object);
//     if (!original) return;

//     const masks = pdfTextMasks.current.get(object) || [];
//     if (!masks.length) return;

//     // IMPORTANT:
//     // Only the ORIGINAL PDF text area is masked.
//     // We do NOT create/move a second mask around the edited text.
//     // The edited text should sit directly on the real PDF background,
//     // otherwise Fabric creates a visible colored rectangle behind it.
//     const originalMask = masks[0];
//     const color = pdfTextMaskColors.current.get(object) || '#ffffff';

//     originalMask.set({
//       left: original.left + original.width / 2,
//       top: original.top + original.height / 2,
//       width: original.width + 3,
//       height: original.height + 3,
//       angle: original.angle,
//       fill: color,
//     });

//     // Never create another mask for the current edited text position.
//     // Keep the original erase mask below all objects.
//     canvas.sendObjectToBack(originalMask);
//     canvas.bringObjectToFront(object);
//     canvas.requestRenderAll();
//   };

//   const revealPdfText = (canvas: fabric.Canvas, object: fabric.Object) => {
//     if (object.type !== 'i-text' && object.type !== 'textbox') return;

//     const textObject = object as fabric.IText;
//     const storedBounds = pdfTextBounds.current.get(object);

//     if (!storedBounds) return;

//     // The imported PDF text starts transparent so the original PDF pixels
//     // remain visible until the user edits the text. On selection we need a
//     // visible editable text color, but it must NOT be hard-coded to black.
//     // Estimate the original foreground color from the rendered PDF.
//     if ((textObject.fill as string) === 'rgba(0, 0, 0, 0)' || !textObject.fill) {
//       const foreground = estimateTextColor(canvas, storedBounds);
//       textObject.set({
//         fill: foreground,
//         opacity: 1,
//       });
//     } else {
//       textObject.set({ opacity: 1 });
//     }

//     if (pdfTextMasks.current.has(object)) {
//       updatePdfTextMasks(canvas, object);
//       return;
//     }

//     const color = pdfTextMaskColors.current.get(object)
//       || estimateBackgroundColor(canvas, storedBounds);

//     pdfTextMaskColors.current.set(object, color);

//     // One mask only: erase the ORIGINAL PDF text area.
//     // It stays fixed even if the user moves/resizes the edited text.
//     createPdfMask(
//       canvas,
//       object,
//       storedBounds,
//       color,
//       storedBounds.angle || 0,
//     );

//     canvas.bringObjectToFront(object);
//     canvas.requestRenderAll();
//   };

//   const updateFloatingMenuPosition = (canvas: fabric.Canvas, obj: fabric.Object | null | undefined) => {
//     if (!obj || !canvas.upperCanvasEl) return;
//     const bound = obj.getBoundingRect();
//     const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

//     setFloatingMenuPos({
//       top: Math.max(72, canvasRect.top + bound.top - 58),
//       left: Math.min(window.innerWidth - 24, Math.max(24, canvasRect.left + bound.left + bound.width / 2)),
//     });
//   };

//   // Initialize fabric canvas instance per page
//   const initCanvas = (id: string, width: number, height: number) => {
//     const el = canvasRefs.current[id];
//     if (!el || fabricCanvases.current[id]) return;

//     const canvas = new fabric.Canvas(el, {
//       width,
//       height,
//       backgroundColor: '#ffffff',
//       selectionColor: 'rgba(59, 130, 246, 0.15)',
//       selectionBorderColor: '#3b82f6',
//       selectionLineWidth: 2,
//     });

//     let hoveredObject: fabric.Object | null = null;

//     canvas.on('mouse:move', (e) => {
//       if (e.target) {
//         setActiveCanvas(canvas);
//         setSelectedObject(e.target);
//         setIsFloatingToolbarVisible(true);
//         updateFloatingMenuPosition(canvas, e.target);

//         if (e.target !== canvas.getActiveObject() && hoveredObject !== e.target) {
//           hoveredObject = e.target;
//           hoveredObject.set({
//             stroke: '#3b82f6',
//             strokeWidth: 2,
//             strokeDashArray: [4, 4],
//           });
//           canvas.renderAll();
//         }
//       } else {
//         setIsFloatingToolbarVisible(false);
//         if (hoveredObject) {
//           hoveredObject.set({ stroke: undefined, strokeDashArray: undefined });
//           hoveredObject = null;
//           canvas.renderAll();
//         }
//       }
//     });

//     canvas.on('mouse:out', () => {
//       setIsFloatingToolbarVisible(false);
//       if (hoveredObject) {
//         hoveredObject.set({ stroke: undefined, strokeDashArray: undefined });
//         hoveredObject = null;
//         canvas.renderAll();
//       }
//     });

//     const handleSelection = () => {
//       const activeObj = canvas.getActiveObject();
//       if (activeObj) {
//         setActiveCanvas(canvas);
//         setSelectedObject(activeObj);
//         setIsFloatingToolbarVisible(true);
//         revealPdfText(canvas, activeObj);
//         updateFloatingMenuPosition(canvas, activeObj);

//         setOpacity(activeObj.opacity || 1);

//         if (activeObj.type === 'i-text' || activeObj.type === 'textbox') {
//           const textObj = activeObj as fabric.IText;
//           setFontFamily(textObj.fontFamily || 'Helvetica');
//           setFontSize(Math.round(textObj.fontSize || 20));
//           setIsBold(textObj.fontWeight === 'bold');
//           setIsItalic(textObj.fontStyle === 'italic');
//           setIsUnderline(!!textObj.underline);
//           setTextColor((textObj.fill as string) || '#1e293b');
//           setBgColor((textObj.textBackgroundColor as string) || 'transparent');
//         }
//       } else {
//         setSelectedObject(null);
//         setIsFloatingToolbarVisible(false);
//         setFloatingMenuPos(null);
//       }
//     };

//     canvas.on('selection:created', handleSelection);
//     canvas.on('selection:updated', handleSelection);
//     canvas.on('selection:cleared', () => {
//       setSelectedObject(null);
//       setIsFloatingToolbarVisible(false);
//       setFloatingMenuPos(null);
//     });

//     canvas.on('object:moving', () => {
//       const object = canvas.getActiveObject();
//       updateFloatingMenuPosition(canvas, object);
//       if (object && pdfTextMasks.current.has(object)) {
//         updatePdfTextMasks(canvas, object);
//       }
//     });

//     canvas.on('object:scaling', () => {
//       const object = canvas.getActiveObject();
//       updateFloatingMenuPosition(canvas, object);
//       if (object && pdfTextMasks.current.has(object)) {
//         updatePdfTextMasks(canvas, object);
//       }
//     });

//     canvas.on('object:modified', (event) => {
//       const object = event.target;
//       if (!object) return;

//       updateFloatingMenuPosition(canvas, object);
//       if (pdfTextMasks.current.has(object)) {
//         updatePdfTextMasks(canvas, object);
//       }
//     });

//     canvas.on('text:changed', (event) => {
//       const object = event.target;
//       if (!object || (object.type !== 'i-text' && object.type !== 'textbox')) return;

//       // IMPORTANT: never remove the original-PDF mask when the user
//       // deletes all characters. The mask is what hides the old PDF text.
//       // It must remain until the whole text object is deleted.
//       if (pdfTextMasks.current.has(object)) {
//         updatePdfTextMasks(canvas, object);
//       }
//     });

//     canvas.on('object:removed', (event) => {
//       const object = event.target;
//       if (!object) return;

//       // For imported PDF text, deletion means: remove the editable text
//       // but KEEP its original erase mask so the old PDF text stays hidden.
//       if (preservePdfMaskOnDelete.current.has(object)) {
//         preservePdfMaskOnDelete.current.delete(object);
//         pdfTextMasks.current.delete(object);
//         pdfTextMaskColors.current.delete(object);
//         pdfTextBounds.current.delete(object);
//         canvas.requestRenderAll();
//         return;
//       }

//       removePdfTextMasks(canvas, object);
//       canvas.requestRenderAll();
//     });

//     fabricCanvases.current[id] = canvas;
//     if (!activeCanvas) setActiveCanvas(canvas);
//   };

//   useEffect(() => {
//     pages.forEach((page) => initCanvas(page.id, page.width, page.height));
//   }, [pages]);

//   // Create Blank Canvas Project
//   const startBlankProject = () => {
//     setPages([{ id: 'page-1', width: 595.28, height: 841.89 }]);
//     setHasDocument(true);
//   };

//   // Add Page dynamically
//   const addNewPage = () => {
//     const newId = `page-${pages.length + 1}`;
//     setPages([...pages, { id: newId, width: 595.28, height: 841.89 }]);
//   };

//   // PDF File Importer & Text Extractor
//   const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
//       const pdf = await loadingTask.promise;

//       const pageList = [];
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const viewport = page.getViewport({ scale: 1 });
//         pageList.push({
//           id: `page-${i}`,
//           width: viewport.width,
//           height: viewport.height,
//         });
//       }

//       setPages(pageList);
//       setHasDocument(true);

//       setTimeout(async () => {
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const renderScale = 4;
//           const viewport = page.getViewport({ scale: renderScale });
//           const pageViewport = page.getViewport({ scale: 1 });

//           const tempCanvas = document.createElement('canvas');
//           const context = tempCanvas.getContext('2d', { willReadFrequently: true })!;
//           context.imageSmoothingEnabled = true;
//           context.imageSmoothingQuality = 'high';
//           tempCanvas.height = viewport.height;
//           tempCanvas.width = viewport.width;

//           await page.render({ canvasContext: context, viewport }).promise;

//           const imgData = tempCanvas.toDataURL('image/png');
//           const fCanvas = fabricCanvases.current[`page-${i}`];

//           if (fCanvas) {
//             const img = await fabric.Image.fromURL(imgData);
//             img.set({
//               scaleX: fCanvas.width! / img.width!,
//               scaleY: fCanvas.height! / img.height!,
//               originX: 'left',
//               originY: 'top',
//             });
//             fCanvas.backgroundImage = img;
//             fCanvas.requestRenderAll();

//             const textContent = await page.getTextContent();
//             const pdfStyles = (textContent as any).styles || {};

//             textContent.items.forEach((item: any) => {
//               if (!('str' in item) || !('transform' in item)) return;
//               const textItem = item as PdfTextItemLike & { fontName?: string; height?: number };
//               if (!textItem.str.trim()) return;

//               const [textX, textY] = pageViewport.convertToViewportPoint(
//                 textItem.transform[4],
//                 textItem.transform[5],
//               );
//               const fontSize = Math.max(
//                 6,
//                 Math.hypot(textItem.transform[2], textItem.transform[3]) || textItem.height || 14,
//               );
//               const textTop = textY - fontSize * 0.82;
//               const textWidth = Math.max(
//                 fontSize,
//                 textItem.width || textItem.str.length * fontSize * 0.55,
//               );
//               const angle = Math.atan2(textItem.transform[1], textItem.transform[0]) * (180 / Math.PI);

//               // Preserve the PDF's font information instead of creating every
//               // imported text as normal Helvetica. The old implementation did
//               // this, so selecting a bold PDF heading made it visually change
//               // to a normal font.
//               const rawFontName = String(textItem.fontName || '');
//               const fontInfo = rawFontName ? pdfStyles[rawFontName] : undefined;
//               const rawFontFamily = String(
//                 fontInfo?.fontFamily || fontInfo?.family || rawFontName || 'Helvetica',
//               );
//               const fontNameLower = `${rawFontName} ${rawFontFamily} ${String(fontInfo?.fontWeight || '')}`.toLowerCase();

//               // Embedded PDF font names are frequently internal names such as
//               // "AAAAAA+Arial-BoldMT". Passing those directly to Fabric makes
//               // the browser fall back to Helvetica and changes the appearance.
//               // Map them to a real browser font family while preserving weight
//               // and italic information.
//               let fontFamily = 'Helvetica';
//               if (/times|serif|roman|cambria|georgia/i.test(rawFontFamily)) {
//                 fontFamily = 'Times New Roman';
//               } else if (/courier|mono|consolas|monaco/i.test(rawFontFamily)) {
//                 fontFamily = 'Courier New';
//               } else if (/arial|helvetica|roboto|calibri|verdana|tahoma|sans/i.test(rawFontFamily)) {
//                 fontFamily = 'Arial';
//               }

//               const fontWeight = /bold|black|heavy|semibold|demibold|700|800|900/.test(fontNameLower)
//                 ? 'bold'
//                 : 'normal';
//               const fontStyle = /italic|oblique/.test(fontNameLower)
//                 ? 'italic'
//                 : 'normal';

//               // Do NOT sample the center of the text. That pixel is often a
//               // glyph and therefore becomes black. Sample the surrounding PDF
//               // background instead.
//               const maskColor = estimateBackgroundColor(fCanvas, {
//                 left: textX,
//                 top: textTop,
//                 width: textWidth,
//                 height: fontSize * 1.15,
//               });

//               const text = new fabric.IText(textItem.str, {
//                 left: textX,
//                 top: textTop,
//                 originX: 'left',
//                 originY: 'top',
//                 fontSize,
//                 fontFamily,
//                 fontWeight,
//                 fontStyle,
//                 fill: 'rgba(0, 0, 0, 0)',
//                 opacity: 1,
//                 padding: 0,
//                 angle,
//               });

//               // Keep imported PDF text visually stable when it becomes
//               // editable. Fabric's font metrics can differ slightly from the
//               // PDF renderer, so match the original extracted text width.
//               text.initDimensions();
//               if (text.width && text.width > 0) {
//                 text.set({ scaleX: textWidth / text.width });
//               }

//               pdfTextMaskColors.current.set(text, maskColor);
//               pdfTextBounds.current.set(text, {
//                 left: textX,
//                 top: textTop,
//                 width: textWidth,
//                 height: fontSize * 1.15,
//                 angle,
//               });
//               fCanvas.add(text);
//             });
//             fCanvas.requestRenderAll();

//           }
//         }
//       }, 300);
//     } catch (err) {
//       console.error('PDF parsing error:', err);
//       alert('Failed to parse PDF file. Please try another file.');
//     }
//   };

//   // Image File Importer
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !activeCanvas) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const imgObj = new Image();
//       imgObj.src = event.target?.result as string;
//       imgObj.onload = () => {
//         const image = new fabric.Image(imgObj, {
//           left: 150,
//           top: 150,
//           cornerColor: '#8b5cf6',
//           cornerStyle: 'circle',
//         });
//         image.scaleToWidth(250);
//         activeCanvas.add(image);
//         activeCanvas.setActiveObject(image);
//         activeCanvas.renderAll();
//       };
//     };
//     reader.readAsDataURL(file);
//   };

//   // Toolbar Element Insertion Methods
//   const addTextBox = () => {
//     if (!activeCanvas) return;
//     const text = new fabric.IText('Your Text Here', {
//       left: 150,
//       top: 150,
//       fontSize: 24,
//       fontFamily: 'Helvetica',
//       fill: '#1e293b',
//       // New text is transparent by default so it does not create an
//       // artificial white rectangle over the original PDF.
//       textBackgroundColor: 'transparent',
//       padding: 0,
//       cornerColor: '#8b5cf6',
//       cornerStyle: 'circle',
//       cornerSize: 10,
//       transparentCorners: false,
//     });
//     activeCanvas.add(text);
//     activeCanvas.setActiveObject(text);
//     activeCanvas.renderAll();
//   };

//   const addShape = (shapeType: 'rect' | 'circle' | 'line') => {
//     if (!activeCanvas) return;
//     let shape: fabric.Object;

//     if (shapeType === 'rect') {
//       shape = new fabric.Rect({
//         left: 150,
//         top: 150,
//         fill: '#8b5cf6',
//         width: 120,
//         height: 120,
//         rx: 8,
//         ry: 8,
//         cornerColor: '#8b5cf6',
//       });
//     } else if (shapeType === 'circle') {
//       shape = new fabric.Circle({
//         left: 150,
//         top: 150,
//         fill: '#ec4899',
//         radius: 60,
//         cornerColor: '#8b5cf6',
//       });
//     } else {
//       shape = new fabric.Line([50, 100, 250, 100], {
//         stroke: '#3b82f6',
//         strokeWidth: 4,
//         cornerColor: '#8b5cf6',
//       });
//     }

//     activeCanvas.add(shape);
//     activeCanvas.setActiveObject(shape);
//     activeCanvas.renderAll();
//   };

//   // Canvas Action Functions
//   const duplicateObject = async () => {
//     if (!activeCanvas || !selectedObject) return;
//     const cloned = await selectedObject.clone();
//     activeCanvas.discardActiveObject();
//     cloned.set({
//       left: (cloned.left || 0) + 20,
//       top: (cloned.top || 0) + 20,
//       evented: true,
//     });
//     activeCanvas.add(cloned);
//     activeCanvas.setActiveObject(cloned);
//     activeCanvas.requestRenderAll();
//   };

//   const deleteObject = () => {
//     if (!activeCanvas || !selectedObject) return;

//     const pdfMasks = pdfTextMasks.current.get(selectedObject);

//     if (pdfMasks?.length) {
//       // IMPORTANT: deleting an imported PDF text object must NOT delete its
//       // erase mask. The mask is what hides the original text baked into the
//       // background PDF image.
//       preservePdfMaskOnDelete.current.add(selectedObject);
//       pdfMasks.forEach((mask) => {
//         mask.set({ selectable: false, evented: false });
//         activeCanvas.sendObjectToBack(mask);
//       });
//     }

//     activeCanvas.remove(selectedObject);
//     activeCanvas.discardActiveObject();
//     setSelectedObject(null);
//     setIsFloatingToolbarVisible(false);
//     activeCanvas.requestRenderAll();
//   };

//   const toggleLock = () => {
//     if (!selectedObject || !activeCanvas) return;
//     const isLocked = !selectedObject.lockMovementX;
//     selectedObject.set({
//       lockMovementX: isLocked,
//       lockMovementY: isLocked,
//       lockRotation: isLocked,
//       lockScalingX: isLocked,
//       lockScalingY: isLocked,
//       hasControls: !isLocked,
//     });
//     activeCanvas.renderAll();
//     setSelectedObject(selectedObject);
//   };

//   const rotateObject = () => {
//     if (!selectedObject || !activeCanvas) return;
//     selectedObject.rotate((selectedObject.angle || 0) + 45);
//     activeCanvas.renderAll();
//   };

//   const applyTextStyle = (key: string, value: string | number | boolean) => {
//     if (!activeCanvas || !selectedObject) return;

//     selectedObject.set(key as keyof fabric.Object, value);

//     // Changing font size, family, weight, etc. changes the rendered bounds.
//     // Keep the original PDF area masked and resize the current-text mask.
//     if (pdfTextMasks.current.has(selectedObject)) {
//       updatePdfTextMasks(activeCanvas, selectedObject);
//     }

//     activeCanvas.requestRenderAll();
//   };

//   const createPdfBlob = () => {
//     if (!pages.length) return null;

//     const firstPage = pages[0];
//     const doc = new jsPDF({
//       orientation: firstPage.width > firstPage.height ? 'landscape' : 'portrait',
//       unit: 'pt',
//       format: [firstPage.width, firstPage.height],
//     });

//     pages.forEach((page, index) => {
//       const canvas = fabricCanvases.current[page.id];
//       if (!canvas) return;

//       const imgData = canvas.toDataURL({ format: 'png', multiplier: 4 });
//       const orientation = page.width > page.height ? 'landscape' : 'portrait';
//       if (index > 0) doc.addPage([page.width, page.height], orientation);
//       doc.addImage(imgData, 'PNG', 0, 0, page.width, page.height);
//     });

//     return doc.output('blob');
//   };

//   const runExport = async () => {
//     const firstCanvas = pages[0] && fabricCanvases.current[pages[0].id];
//     if (!firstCanvas) return;

//     const isPdf = exportFormat === 'pdf';
//     const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
//     const extension = exportFormat;
//     const blob = isPdf
//       ? createPdfBlob()
//       : await new Promise<Blob | null>((resolve) => firstCanvas.lowerCanvasEl.toBlob(resolve, mime, 0.98));
//     if (!blob) return;

//     const url = URL.createObjectURL(blob);
//     const filename = `utilai-edited-document.${extension}`;

//     if (exportAction === 'download') {
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = filename;
//       link.click();
//     } else if (exportAction === 'preview') {
//       window.open(url, '_blank', 'noopener,noreferrer');
//     } else if (exportAction === 'print') {
//       const printWindow = window.open(url, '_blank', 'noopener,noreferrer');
//       if (printWindow) printWindow.addEventListener('load', () => printWindow.print());
//     } else if (navigator.share) {
//       await navigator.share({
//         title: 'Edited PDF document',
//         files: [new File([blob], filename, { type: blob.type })],
//       });
//     }

//     window.setTimeout(() => URL.revokeObjectURL(url), 1000);
//     setIsExportOpen(false);
//     setIsExportConfirmed(false);
//   };

//   return (
//     <div className="utilai-pdf-editor flex flex-col h-screen w-full bg-[#f8fbff] font-sans overflow-hidden select-none">
//       {/* TOP UTILAI PDF TOOLBAR */}
//       <header className="pdf-editor-topbar h-14 bg-white border-b border-blue-100 flex items-center justify-between px-4 z-20 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wide shadow-md shadow-blue-100">
//             UtilAI PDF
//           </div>
//           <span className="text-xs font-semibold text-blue-700/70 border-l pl-3 border-blue-100">
//             Studio Editor
//           </span>
//         </div>

//         {/* Dynamic Context Control Bar */}
//         {hasDocument && (
//           <div className="pdf-editor-context-tools flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 shadow-inner">
//             <select
//               value={fontFamily}
//               onChange={(e) => {
//                 setFontFamily(e.target.value);
//                 applyTextStyle('fontFamily', e.target.value);
//               }}
//               className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
//             >
//               <option value="Helvetica">Helvetica</option>
//               <option value="Arial">Arial</option>
//               <option value="Times New Roman">Times New Roman</option>
//               <option value="Courier">Courier</option>
//               <option value="Impact">Impact</option>
//             </select>

//             <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => {
//                   const newSize = Math.max(8, fontSize - 2);
//                   setFontSize(newSize);
//                   applyTextStyle('fontSize', newSize);
//                 }}
//                 className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-bold text-xs"
//               >
//                 -
//               </button>
//               <span className="text-xs font-bold w-6 text-center text-slate-700">{fontSize}</span>
//               <button
//                 onClick={() => {
//                   const newSize = fontSize + 2;
//                   setFontSize(newSize);
//                   applyTextStyle('fontSize', newSize);
//                 }}
//                 className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-bold text-xs"
//               >
//                 +
//               </button>
//             </div>

//             <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//             {/* Text Color Picker */}
//             <label className="cursor-pointer relative p-1 hover:bg-slate-200 rounded" title="Text Color">
//               <Palette className="w-4 h-4 text-slate-700" />
//               <input
//                 type="color"
//                 value={textColor}
//                 onChange={(e) => {
//                   setTextColor(e.target.value);
//                   applyTextStyle('fill', e.target.value);
//                 }}
//                 className="opacity-0 absolute inset-0 cursor-pointer"
//               />
//             </label>

//             {/* Background Color Picker */}
//             <label className="cursor-pointer relative p-1 hover:bg-slate-200 rounded" title="Highlight Color">
//               <Highlighter className="w-4 h-4 text-slate-700" />
//               <input
//                 type="color"
//                 value={bgColor}
//                 onChange={(e) => {
//                   setBgColor(e.target.value);
//                   applyTextStyle('textBackgroundColor', e.target.value);
//                 }}
//                 className="opacity-0 absolute inset-0 cursor-pointer"
//               />
//             </label>

//             <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//             {/* Text Alignments */}
//             <button onClick={() => applyTextStyle('textAlign', 'left')} className="p-1 hover:bg-slate-200 rounded text-slate-700">
//               <AlignLeft className="w-4 h-4" />
//             </button>
//             <button onClick={() => applyTextStyle('textAlign', 'center')} className="p-1 hover:bg-slate-200 rounded text-slate-700">
//               <AlignCenter className="w-4 h-4" />
//             </button>
//             <button onClick={() => applyTextStyle('textAlign', 'right')} className="p-1 hover:bg-slate-200 rounded text-slate-700">
//               <AlignRight className="w-4 h-4" />
//             </button>

//             <div className="h-4 w-[1px] bg-slate-300 mx-1" />

//             {/* Font Weight Toggles */}
//             <button
//               onClick={() => {
//                 setIsBold(!isBold);
//                 applyTextStyle('fontWeight', !isBold ? 'bold' : 'normal');
//               }}
//               className={`p-1 rounded ${isBold ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-slate-700'}`}
//             >
//               <Bold className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 setIsItalic(!isItalic);
//                 applyTextStyle('fontStyle', !isItalic ? 'italic' : 'normal');
//               }}
//               className={`p-1 rounded ${isItalic ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-slate-700'}`}
//             >
//               <Italic className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 setIsUnderline(!isUnderline);
//                 applyTextStyle('underline', !isUnderline);
//               }}
//               className={`p-1 rounded ${isUnderline ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-slate-700'}`}
//             >
//               <Underline className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {/* PDF Export Button */}
//         {hasDocument && (
//           <button
//             onClick={() => {
//               setIsExportConfirmed(false);
//               setIsExportOpen(true);
//             }}
//             className="pdf-editor-export flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-100 transition"
//           >
//             <Download className="w-4 h-4" /> Export
//           </button>
//         )}
//       </header>

//       {/* BODY CONTENT */}
//       <div className="pdf-editor-body flex flex-1 overflow-hidden relative flex-col md:flex-row">
//         {/* SIDEBAR NAVIGATION */}
//         <aside className="pdf-editor-sidebar w-20 shrink-0 bg-[#0f2747] flex flex-col items-center py-5 gap-6 text-blue-100/70 z-10 shadow-xl">
//           <button
//             onClick={() => setActiveTab('uploads')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'uploads' ? 'text-[#93c5fd]' : ''}`}
//           >
//             <Upload className="w-5 h-5" /> Uploads
//           </button>
//           <button
//             onClick={() => setActiveTab('text')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'text' ? 'text-[#93c5fd]' : ''}`}
//           >
//             <Type className="w-5 h-5" /> Text
//           </button>
//           <button
//             onClick={() => setActiveTab('elements')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'elements' ? 'text-[#93c5fd]' : ''}`}
//           >
//             <Square className="w-5 h-5" /> Elements
//           </button>
//         </aside>

//         {/* SIDEBAR EXTENDED PANELS */}
//         <div className="pdf-editor-panel w-72 shrink-0 bg-white border-r border-blue-100 p-5 overflow-y-auto z-10 shadow-sm">
//           {activeTab === 'uploads' && (
//             <div className="flex flex-col gap-4">
//               <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Import Document</h3>

//               {/* PDF Import Card */}
//               <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/60 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center shadow-sm">
//                 <Upload className="w-8 h-8 text-blue-600 mb-2 animate-bounce" />
//                 <span className="text-xs font-bold text-blue-900">Upload PDF File</span>
//                 <span className="text-[10px] text-blue-600 mt-1">Extract text & make pages canvas-ready</span>
//                 <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
//               </label>

//               <button
//                 onClick={startBlankProject}
//                 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
//               >
//                 <FilePlus className="w-4 h-4 text-slate-500" /> Start Blank Canvas
//               </button>

//               <div className="h-[1px] bg-slate-100 my-1" />

//               {/* Image Import Card */}
//               <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Add Media</h3>
//               <label className="border border-slate-200 hover:border-slate-300 bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center">
//                 <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
//                 <span className="text-xs font-semibold text-slate-700">Upload Image</span>
//                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//               </label>
//             </div>
//           )}

//           {activeTab === 'text' && (
//             <div className="flex flex-col gap-3">
//               <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Add Text Boxes</h3>
//               <button
//                 onClick={addTextBox}
//                 className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-sm"
//               >
//                 <Plus className="w-4 h-4" /> Add Text Layer
//               </button>
//             </div>
//           )}

//           {activeTab === 'elements' && (
//             <div className="flex flex-col gap-3">
//               <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Insert Shapes</h3>
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   onClick={() => addShape('rect')}
//                   className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium"
//                 >
//                   <Square className="w-5 h-5 text-blue-600" /> Rectangle
//                 </button>
//                 <button
//                   onClick={() => addShape('circle')}
//                   className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium"
//                 >
//                   <Circle className="w-5 h-5 text-blue-500" /> Circle
//                 </button>
//                 <button
//                   onClick={() => addShape('line')}
//                   className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium col-span-2"
//                 >
//                   <ArrowRight className="w-5 h-5 text-blue-500" /> Line / Divider
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* WORKSPACE ENGINE AREA */}
//         <main className="pdf-editor-workspace min-w-0 min-h-0 flex-1 w-full bg-[#f1f7ff] overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
//           {!hasDocument ? (
//             <div className="my-auto flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
//               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
//                 <Upload className="w-8 h-8" />
//               </div>
//               <h2 className="text-xl font-bold text-slate-800 mb-2">No Document Loaded</h2>
//               <p className="text-xs text-slate-500 mb-6">
//                 Please upload a PDF document from the left panel or start with a blank template canvas to begin editing.
//               </p>
//               <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-blue-200 transition">
//                 Upload PDF Document
//                 <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
//               </label>
//             </div>
//           ) : (
//             <>
//               {pages.map((page, index) => (
//                 <div key={page.id} className="flex max-w-full flex-col items-center gap-2">
//                   <div className="text-xs font-bold text-slate-400 self-start mb-1">
//                     Page {index + 1}
//                   </div>
//                   <div className="canvas-container bg-white shadow-2xl rounded-sm overflow-hidden relative border border-slate-300">
//                     <canvas ref={(el) => {
//                       canvasRefs.current[page.id] = el;
//                     }} />
//                   </div>
//                 </div>
//               ))}

//               {/* CANVA ADD PAGE CONTROL */}
//               <button
//                 onClick={addNewPage}
//                 className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-full shadow-lg transition my-4 text-xs"
//               >
//                 <Plus className="w-4 h-4 text-blue-600" /> Add Page
//               </button>
//             </>
//           )}
//         </main>

//         {/* CANVA PURPLE FLOATING CONTEXT MENU (Shown on selecting objects) */}
//         {selectedObject && floatingMenuPos && isFloatingToolbarVisible && (
//           <div
//             onMouseEnter={() => setIsFloatingToolbarVisible(true)}
//             onMouseLeave={() => setIsFloatingToolbarVisible(false)}
//             style={{
//               position: 'fixed',
//               top: `${floatingMenuPos.top}px`,
//               left: `${floatingMenuPos.left}px`,
//               transform: 'translateX(-50%)',
//             }}
//             className="bg-blue-600 text-white rounded-full shadow-2xl flex items-center px-3 py-1.5 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 border border-blue-400"
//           >
//             {/* Move Control Indicator */}
//               <button className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Move Object">
//               <Move className="w-4 h-4" />
//             </button>

//             {/* Duplicate Button */}
//             <button onClick={duplicateObject} className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Duplicate">
//               <Copy className="w-4 h-4" />
//             </button>

//             {/* Rotate Button */}
//             <button onClick={rotateObject} className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Rotate 45°">
//               <RotateCw className="w-4 h-4" />
//             </button>

//             {/* Lock / Unlock */}
//             <button onClick={toggleLock} className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Lock Position">
//               {selectedObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4" />}
//             </button>

//             <div className="h-4 w-[1px] bg-blue-400 my-auto mx-1" />

//             {/* Delete Button */}
//             <button onClick={deleteObject} className="p-1.5 hover:bg-blue-800 rounded-full text-red-200 hover:text-red-100" title="Delete">
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {isExportOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
//           <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
//             <div className="mb-5 flex items-start justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">Export document</h2>
//                 <p className="mt-1 text-xs text-slate-500">Choose a format and operation before processing.</p>
//               </div>
//               <button onClick={() => setIsExportOpen(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Close export dialog">&times;</button>
//             </div>

//             <div className="grid grid-cols-3 gap-2">
//               {(['pdf', 'png', 'jpg'] as const).map((format) => (
//                 <button
//                   key={format}
//                   onClick={() => setExportFormat(format)}
//                   className={`rounded-lg border px-3 py-2 text-sm font-semibold uppercase ${exportFormat === format ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
//                 >
//                   {format}
//                 </button>
//               ))}
//             </div>

//             <div className="mt-5 grid grid-cols-2 gap-2">
//               {(['download', 'print', 'share', 'preview'] as const).map((action) => (
//                 <button
//                   key={action}
//                   onClick={() => setExportAction(action)}
//                   className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${exportAction === action ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
//                 >
//                   {action}
//                 </button>
//               ))}
//             </div>

//             <div className="mt-6 rounded-xl bg-slate-50 p-4">
//               <label htmlFor="export-confirm" className="mb-2 block text-sm font-semibold text-slate-800">Slide to process this file</label>
//               <input
//                 id="export-confirm"
//                 type="range"
//                 min="0"
//                 max="100"
//                 defaultValue="0"
//                 onChange={(event) => setIsExportConfirmed(Number(event.target.value) === 100)}
//                 className="w-full accent-blue-500"
//               />
//               <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
//                 <ArrowRightCircle className="h-4 w-4 text-blue-600" /> Slide the arrow fully right to continue
//               </div>
//             </div>

//             <button
//               onClick={runExport}
//               disabled={!isExportConfirmed}
//               className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <Download className="h-4 w-4" /> Process {exportAction} as {exportFormat.toUpperCase()}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import {
  Type,
  Image as ImageIcon,
  Square,
  Layout,
  Upload,
  Download,
  Bold,
  Italic,
  Underline,
  Plus,
  Trash2,
  Copy,
  Lock,
  Unlock,
  RotateCw,
  Move,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Circle,
  ArrowRight,
  ArrowRightCircle,
  Star,
  Layers,
  FilePlus,
  Eye,
  Sliders,
  Highlighter
} from 'lucide-react';
import './pdfeditor.css';

type PdfTextItemLike = {
  str: string;
  transform: number[];
  width?: number;
};

// Setting up pdfjs worker using CDN fallback to fix render issues
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;


// 1. Updated Import

// 2. Updated Worker setup
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export default function UtilAiPdfEditor({ tool }: { tool?: { slug?: string } }) {
  void tool;
  const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'export'>('uploads');
  const [pages, setPages] = useState<{ id: string; width: number; height: number }[]>([]);
  const [hasDocument, setHasDocument] = useState<boolean>(false);
  
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const fabricCanvases = useRef<{ [key: string]: fabric.Canvas }>({});
  const [activeCanvas, setActiveCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'png' | 'jpg'>('pdf');
  const [exportAction, setExportAction] = useState<'download' | 'print' | 'share' | 'preview'>('download');
  const [isExportConfirmed, setIsExportConfirmed] = useState(false);

  useEffect(() => {
    document.body.classList.add('pdf-editor-open');
    return () => document.body.classList.remove('pdf-editor-open');
  }, []);

  // Floating Context Menu Position
  const [floatingMenuPos, setFloatingMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Text & Object Formatting States
  const [fontFamily, setFontFamily] = useState<string>('Helvetica');
  const [fontSize, setFontSize] = useState<number>(20);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>('#1e293b');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [opacity, setOpacity] = useState<number>(1);
  // ------------------------------------------------------------
  // Existing PDF text editing support
  // ------------------------------------------------------------
  // PDF pages are rendered into a background image. That means the
  // original PDF text is physically part of the background pixels.
  // We therefore need a separate "erase" layer before drawing the
  // edited text. The old implementation used one mask that moved
  // with the text and sampled only one pixel, which caused:
  //   1. old text to reappear when the edited text became empty;
  //   2. white/incorrect backgrounds over colored PDF areas;
  //   3. the mask to move away from the original text when the text
  //      object was moved.
  // ------------------------------------------------------------
  const pdfTextMasks = useRef(new Map<fabric.Object, fabric.Rect[]>());
  const pdfTextMaskColors = useRef(new Map<fabric.Object, string>());
  const pdfTextBounds = useRef(new Map<fabric.Object, {
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
  }>());

  // When a PDF text object is deleted, its erase mask must stay on the
  // canvas. Otherwise the original PDF text becomes visible again because
  // the original text is part of the background image.
  const preservePdfMaskOnDelete = useRef(new Set<fabric.Object>());

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const getBackgroundPixel = (
    canvas: fabric.Canvas,
    x: number,
    y: number,
  ): [number, number, number] | null => {
    const background = canvas.backgroundImage as fabric.Image | undefined;
    const element = background?.getElement() as HTMLImageElement | HTMLCanvasElement | undefined;
    if (!background || !element) return null;

    const sourceX = clamp(
      (x - (background.left || 0)) / (background.scaleX || 1),
      0,
      Math.max(0, element.width - 1),
    );
    const sourceY = clamp(
      (y - (background.top || 0)) / (background.scaleY || 1),
      0,
      Math.max(0, element.height - 1),
    );

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    try {
      ctx.drawImage(element, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2]];
    } catch {
      return null;
    }
  };

  const estimateBackgroundColor = (
    canvas: fabric.Canvas,
    bounds: { left: number; top: number; width: number; height: number },
  ) => {
    // The background can be white, dark gray, green, highlighted, etc.
    // Sampling only outside the text fails for highlighted PDF text because
    // the highlight often exists exactly underneath the glyphs. Instead,
    // sample the complete text rectangle and choose the dominant color.
    // Glyphs normally occupy far fewer pixels than their background.
    const background = canvas.backgroundImage as fabric.Image | undefined;
    const element = background?.getElement() as HTMLImageElement | HTMLCanvasElement | undefined;
    if (!background || !element) return '#ffffff';

    const sourceX = clamp(
      (bounds.left - (background.left || 0)) / (background.scaleX || 1),
      0,
      Math.max(0, element.width - 1),
    );
    const sourceY = clamp(
      (bounds.top - (background.top || 0)) / (background.scaleY || 1),
      0,
      Math.max(0, element.height - 1),
    );
    const sourceW = Math.max(1, Math.min(
      element.width - sourceX,
      bounds.width / (background.scaleX || 1),
    ));
    const sourceH = Math.max(1, Math.min(
      element.height - sourceY,
      (bounds.height * 1.25) / (background.scaleY || 1),
    ));

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 40;
    sampleCanvas.height = 20;
    const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '#ffffff';

    try {
      // Avoid blending glyph pixels with background pixels.
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(element, sourceX, sourceY, sourceW, sourceH, 0, 0, 40, 20);
      const pixels = ctx.getImageData(0, 0, 40, 20).data;
      const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();

      // Buckets are used ONLY for grouping similar colors. We store the REAL
      // pixel sums so the final color is the true average of the dominant
      // group, not a rounded value (rounding turned white into light grey,
      // which made the erase box visible).
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const key = `${Math.round(r / 16)},${Math.round(g / 16)},${Math.round(b / 16)}`;
        const current = buckets.get(key);
        if (current) {
          current.r += r;
          current.g += g;
          current.b += b;
          current.count += 1;
        } else {
          buckets.set(key, { r, g, b, count: 1 });
        }
      }

      const dominant = [...buckets.values()].sort((x, y) => y.count - x.count)[0];
      if (!dominant) return '#ffffff';

      return `rgb(${Math.round(dominant.r / dominant.count)}, ${Math.round(dominant.g / dominant.count)}, ${Math.round(dominant.b / dominant.count)})`;
    } catch {
      return '#ffffff';
    }
  };

  const estimateTextColor = (
    canvas: fabric.Canvas,
    bounds: { left: number; top: number; width: number; height: number },
  ) => {
    // Estimate the foreground/text color from pixels INSIDE the text area.
    // We compare them with the background color sampled around the text.
    // This avoids forcing every selected PDF text object to black.
    const background = estimateBackgroundColor(canvas, bounds);
    const bgMatch = background.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const bg: [number, number, number] = bgMatch
      ? [Number(bgMatch[1]), Number(bgMatch[2]), Number(bgMatch[3])]
      : [255, 255, 255];

    const backgroundImage = canvas.backgroundImage as fabric.Image | undefined;
    const element = backgroundImage?.getElement() as HTMLImageElement | HTMLCanvasElement | undefined;
    if (!backgroundImage || !element) return '#1e293b';

    const sourceX = clamp(
      (bounds.left - (backgroundImage.left || 0)) / (backgroundImage.scaleX || 1),
      0,
      Math.max(0, element.width - 1),
    );
    const sourceY = clamp(
      (bounds.top - (backgroundImage.top || 0)) / (backgroundImage.scaleY || 1),
      0,
      Math.max(0, element.height - 1),
    );
    const sourceW = Math.max(1, Math.min(
      element.width - sourceX,
      bounds.width / (backgroundImage.scaleX || 1),
    ));
    const sourceH = Math.max(1, Math.min(
      element.height - sourceY,
      bounds.height / (backgroundImage.scaleY || 1),
    ));

    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 24;
    sampleCanvas.height = 12;
    const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '#1e293b';

    try {
      ctx.drawImage(element, sourceX, sourceY, sourceW, sourceH, 0, 0, 24, 12);
      const pixels = ctx.getImageData(0, 0, 24, 12).data;
      let best: [number, number, number] | null = null;
      let bestDistance = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const distance = Math.sqrt(
          (r - bg[0]) ** 2 +
          (g - bg[1]) ** 2 +
          (b - bg[2]) ** 2,
        );

        if (distance > bestDistance) {
          bestDistance = distance;
          best = [r, g, b];
        }
      }

      if (!best) return '#1e293b';

      // Snap near-black/near-white values to stable text colors.
      const [r, g, b] = best;
      if (r < 55 && g < 55 && b < 55) return '#111111';
      if (r > 220 && g > 220 && b > 220) return '#ffffff';
      return `rgb(${r}, ${g}, ${b})`;
    } catch {
      return '#1e293b';
    }
  };

  const getObjectBounds = (object: fabric.Object) => {
    const bounds = object.getBoundingRect();
    return {
      left: bounds.left,
      top: bounds.top,
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
    };
  };

  const createPdfMask = (
    canvas: fabric.Canvas,
    object: fabric.Object,
    bounds: { left: number; top: number; width: number; height: number },
    color: string,
    angle = 0,
  ) => {
    const mask = new fabric.Rect({
      left: bounds.left + bounds.width / 2,
      top: bounds.top + bounds.height / 2,
      width: bounds.width + 1,
      height: bounds.height + 1,
      originX: 'center',
      originY: 'center',
      angle,
      fill: color,
      selectable: false,
      evented: false,
      excludeFromExport: false,
    });

    canvas.add(mask);
    canvas.sendObjectToBack(mask);

    const masks = pdfTextMasks.current.get(object) || [];
    masks.push(mask);
    pdfTextMasks.current.set(object, masks);
    return mask;
  };

  const removePdfTextMasks = (canvas: fabric.Canvas, object: fabric.Object) => {
    const masks = pdfTextMasks.current.get(object) || [];
    masks.forEach((mask) => canvas.remove(mask));
    pdfTextMasks.current.delete(object);
    pdfTextMaskColors.current.delete(object);
    pdfTextBounds.current.delete(object);
  };

  const updatePdfTextMasks = (canvas: fabric.Canvas, object: fabric.Object) => {
    const original = pdfTextBounds.current.get(object);
    if (!original) return;

    const masks = pdfTextMasks.current.get(object) || [];
    if (!masks.length) return;

    // IMPORTANT:
    // Only the ORIGINAL PDF text area is masked.
    // We do NOT create/move a second mask around the edited text.
    // The edited text should sit directly on the real PDF background,
    // otherwise Fabric creates a visible colored rectangle behind it.
    const originalMask = masks[0];
    const color = pdfTextMaskColors.current.get(object) || '#ffffff';

    originalMask.set({
      left: original.left + original.width / 2,
      top: original.top + original.height / 2,
      width: original.width + 1,
      height: original.height + 1,
      angle: original.angle,
      fill: color,
    });

    // Never create another mask for the current edited text position.
    // Keep the original erase mask below all objects.
    canvas.sendObjectToBack(originalMask);
    canvas.bringObjectToFront(object);
    canvas.requestRenderAll();
  };

  const revealPdfText = (canvas: fabric.Canvas, object: fabric.Object) => {
    if (object.type !== 'i-text' && object.type !== 'textbox') return;

    const textObject = object as fabric.IText;
    const storedBounds = pdfTextBounds.current.get(object);

    if (!storedBounds) return;

    // The imported PDF text starts transparent so the original PDF pixels
    // remain visible until the user edits the text. On selection we need a
    // visible editable text color, but it must NOT be hard-coded to black.
    // Estimate the original foreground color from the rendered PDF.
    if ((textObject.fill as string) === 'rgba(0, 0, 0, 0)' || !textObject.fill) {
      const foreground = estimateTextColor(canvas, storedBounds);
      textObject.set({
        fill: foreground,
        opacity: 1,
      });
    } else {
      textObject.set({ opacity: 1 });
    }

    if (pdfTextMasks.current.has(object)) {
      updatePdfTextMasks(canvas, object);
      return;
    }

    const color = pdfTextMaskColors.current.get(object)
      || estimateBackgroundColor(canvas, storedBounds);

    pdfTextMaskColors.current.set(object, color);

    // One mask only: erase the ORIGINAL PDF text area.
    // It stays fixed even if the user moves/resizes the edited text.
    createPdfMask(
      canvas,
      object,
      storedBounds,
      color,
      storedBounds.angle || 0,
    );

    canvas.bringObjectToFront(object);
    canvas.requestRenderAll();
  };

  const updateFloatingMenuPosition = (canvas: fabric.Canvas, obj: fabric.Object | null | undefined) => {
    if (!obj || !canvas.upperCanvasEl) return;
    const bound = obj.getBoundingRect();
    const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

    setFloatingMenuPos({
      top: Math.max(72, canvasRect.top + bound.top - 58),
      left: Math.min(window.innerWidth - 24, Math.max(24, canvasRect.left + bound.left + bound.width / 2)),
    });
  };

  // Initialize fabric canvas instance per page
  const initCanvas = (id: string, width: number, height: number) => {
    const el = canvasRefs.current[id];
    if (!el || fabricCanvases.current[id]) return;

    const canvas = new fabric.Canvas(el, {
      width,
      height,
      backgroundColor: '#ffffff',
      selectionColor: 'rgba(59, 130, 246, 0.15)',
      selectionBorderColor: '#3b82f6',
      selectionLineWidth: 2,
    });

    let hoveredObject: fabric.Object | null = null;

    canvas.on('mouse:move', (e) => {
      if (e.target) {
        setActiveCanvas(canvas);
        setSelectedObject(e.target);
        setIsFloatingToolbarVisible(true);
        updateFloatingMenuPosition(canvas, e.target);

        if (e.target !== canvas.getActiveObject() && hoveredObject !== e.target) {
          hoveredObject = e.target;
          hoveredObject.set({
            stroke: '#3b82f6',
            strokeWidth: 2,
            strokeDashArray: [4, 4],
          });
          canvas.renderAll();
        }
      } else {
        setIsFloatingToolbarVisible(false);
        if (hoveredObject) {
          hoveredObject.set({ stroke: undefined, strokeDashArray: undefined });
          hoveredObject = null;
          canvas.renderAll();
        }
      }
    });

    canvas.on('mouse:out', () => {
      setIsFloatingToolbarVisible(false);
      if (hoveredObject) {
        hoveredObject.set({ stroke: undefined, strokeDashArray: undefined });
        hoveredObject = null;
        canvas.renderAll();
      }
    });

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        setActiveCanvas(canvas);
        setSelectedObject(activeObj);
        setIsFloatingToolbarVisible(true);
        revealPdfText(canvas, activeObj);
        updateFloatingMenuPosition(canvas, activeObj);

        setOpacity(activeObj.opacity || 1);

        if (activeObj.type === 'i-text' || activeObj.type === 'textbox') {
          const textObj = activeObj as fabric.IText;
          setFontFamily(textObj.fontFamily || 'Helvetica');
          setFontSize(Math.round(textObj.fontSize || 20));
          setIsBold(textObj.fontWeight === 'bold');
          setIsItalic(textObj.fontStyle === 'italic');
          setIsUnderline(!!textObj.underline);
          setTextColor((textObj.fill as string) || '#1e293b');
          setBgColor((textObj.textBackgroundColor as string) || 'transparent');
        }
      } else {
        setSelectedObject(null);
        setIsFloatingToolbarVisible(false);
        setFloatingMenuPos(null);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setIsFloatingToolbarVisible(false);
      setFloatingMenuPos(null);
    });

    canvas.on('object:moving', () => {
      const object = canvas.getActiveObject();
      updateFloatingMenuPosition(canvas, object);
      if (object && pdfTextMasks.current.has(object)) {
        updatePdfTextMasks(canvas, object);
      }
    });

    canvas.on('object:scaling', () => {
      const object = canvas.getActiveObject();
      updateFloatingMenuPosition(canvas, object);
      if (object && pdfTextMasks.current.has(object)) {
        updatePdfTextMasks(canvas, object);
      }
    });

    canvas.on('object:modified', (event) => {
      const object = event.target;
      if (!object) return;

      updateFloatingMenuPosition(canvas, object);
      if (pdfTextMasks.current.has(object)) {
        updatePdfTextMasks(canvas, object);
      }
    });

    canvas.on('text:changed', (event) => {
      const object = event.target;
      if (!object || (object.type !== 'i-text' && object.type !== 'textbox')) return;

      // IMPORTANT: never remove the original-PDF mask when the user
      // deletes all characters. The mask is what hides the old PDF text.
      // It must remain until the whole text object is deleted.
      if (pdfTextMasks.current.has(object)) {
        updatePdfTextMasks(canvas, object);
      }
    });

    canvas.on('object:removed', (event) => {
      const object = event.target;
      if (!object) return;

      // For imported PDF text, deletion means: remove the editable text
      // but KEEP its original erase mask so the old PDF text stays hidden.
      if (preservePdfMaskOnDelete.current.has(object)) {
        preservePdfMaskOnDelete.current.delete(object);
        pdfTextMasks.current.delete(object);
        pdfTextMaskColors.current.delete(object);
        pdfTextBounds.current.delete(object);
        canvas.requestRenderAll();
        return;
      }

      removePdfTextMasks(canvas, object);
      canvas.requestRenderAll();
    });

    fabricCanvases.current[id] = canvas;
    if (!activeCanvas) setActiveCanvas(canvas);
  };

  useEffect(() => {
    pages.forEach((page) => initCanvas(page.id, page.width, page.height));
  }, [pages]);

  // Create Blank Canvas Project
  const startBlankProject = () => {
    setPages([{ id: 'page-1', width: 595.28, height: 841.89 }]);
    setHasDocument(true);
  };

  // Add Page dynamically
  const addNewPage = () => {
    const newId = `page-${pages.length + 1}`;
    setPages([...pages, { id: newId, width: 595.28, height: 841.89 }]);
  };

  // PDF File Importer & Text Extractor
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pageList = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        pageList.push({
          id: `page-${i}`,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(pageList);
      setHasDocument(true);

      setTimeout(async () => {
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const renderScale = 4;
          const viewport = page.getViewport({ scale: renderScale });
          const pageViewport = page.getViewport({ scale: 1 });

          const tempCanvas = document.createElement('canvas');
          const context = tempCanvas.getContext('2d', { willReadFrequently: true })!;
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          tempCanvas.height = viewport.height;
          tempCanvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;

          const imgData = tempCanvas.toDataURL('image/png');
          const fCanvas = fabricCanvases.current[`page-${i}`];

          if (fCanvas) {
            const img = await fabric.Image.fromURL(imgData);
            img.set({
              scaleX: fCanvas.width! / img.width!,
              scaleY: fCanvas.height! / img.height!,
              originX: 'left',
              originY: 'top',
            });
            fCanvas.backgroundImage = img;
            fCanvas.requestRenderAll();

            const textContent = await page.getTextContent();
            const pdfStyles = (textContent as any).styles || {};

            textContent.items.forEach((item: any) => {
              if (!('str' in item) || !('transform' in item)) return;
              const textItem = item as PdfTextItemLike & { fontName?: string; height?: number };
              if (!textItem.str.trim()) return;

              const [textX, textY] = pageViewport.convertToViewportPoint(
                textItem.transform[4],
                textItem.transform[5],
              );
              const fontSize = Math.max(
                6,
                Math.hypot(textItem.transform[2], textItem.transform[3]) || textItem.height || 14,
              );
              const textTop = textY - fontSize * 0.82;
              const textWidth = Math.max(
                fontSize,
                textItem.width || textItem.str.length * fontSize * 0.55,
              );
              const angle = Math.atan2(textItem.transform[1], textItem.transform[0]) * (180 / Math.PI);

              // Preserve the PDF's font information instead of creating every
              // imported text as normal Helvetica.
              //
              // pdf.js gives internal font ids (e.g. "g_d0_f1") in textItem.fontName
              // and often only a generic family ("sans-serif" / "serif") in styles.
              // The real embedded font name (e.g. "ABCDEF+Arial-BoldMT") lives in
              // page.commonObjs, so we read it from there.
              const rawFontName = String(textItem.fontName || '');
              const fontInfo = rawFontName ? pdfStyles[rawFontName] : undefined;

              let loadedFont: any = null;
              let realFontName = rawFontName;
              try {
                if (rawFontName && page.commonObjs.has(rawFontName)) {
                  loadedFont = page.commonObjs.get(rawFontName);
                  realFontName = String(loadedFont?.name || loadedFont?.fallbackName || rawFontName);
                }
              } catch {
                /* font not resolved, fall back to generic info below */
              }

              const fontNameLower = realFontName.toLowerCase();
              const genericFamily = String(fontInfo?.fontFamily || '').toLowerCase();

              // IMPORTANT: check "sans" BEFORE "serif". The word "sans-serif"
              // contains "serif", so checking serif first turned every font
              // into Times New Roman.
              let fontFamily = 'Arial';
              if (
                loadedFont?.isMonospace ||
                /courier|mono|consolas|monaco/.test(fontNameLower) ||
                genericFamily.includes('monospace')
              ) {
                fontFamily = 'Courier New';
              } else if (/sans|arial|helvetica|calibri|verdana|tahoma|roboto|segoe|open/.test(fontNameLower)) {
                fontFamily = 'Arial';
              } else if (
                loadedFont?.isSerifFont ||
                /times|serif|roman|cambria|georgia|garamond|palatino|book/.test(fontNameLower)
              ) {
                fontFamily = 'Times New Roman';
              } else if (genericFamily.includes('sans')) {
                fontFamily = 'Arial';
              } else if (genericFamily.includes('serif')) {
                fontFamily = 'Times New Roman';
              }

              const fontWeight = loadedFont?.bold || /bold|black|heavy|semibold|demibold/.test(fontNameLower)
                ? 'bold'
                : 'normal';
              const fontStyle = loadedFont?.italic || /italic|oblique/.test(fontNameLower)
                ? 'italic'
                : 'normal';

              // Do NOT sample the center of the text. That pixel is often a
              // glyph and therefore becomes black. Sample the surrounding PDF
              // background instead.
              const maskColor = estimateBackgroundColor(fCanvas, {
                left: textX,
                top: textTop,
                width: textWidth,
                height: fontSize * 1.15,
              });

              const text = new fabric.IText(textItem.str, {
                left: textX,
                top: textTop,
                originX: 'left',
                originY: 'top',
                fontSize,
                fontFamily,
                fontWeight,
                fontStyle,
                fill: 'rgba(0, 0, 0, 0)',
                opacity: 1,
                padding: 0,
                angle,
              });

              // Keep imported PDF text visually stable when it becomes
              // editable. Fabric's font metrics can differ slightly from the
              // PDF renderer, so match the original extracted text width.
              text.initDimensions();
              if (text.width && text.width > 0) {
                text.set({ scaleX: textWidth / text.width });
              }

              pdfTextMaskColors.current.set(text, maskColor);
              pdfTextBounds.current.set(text, {
                left: textX,
                top: textTop,
                width: textWidth,
                height: fontSize * 1.15,
                angle,
              });
              fCanvas.add(text);
            });
            fCanvas.requestRenderAll();

          }
        }
      }, 300);
    } catch (err) {
      console.error('PDF parsing error:', err);
      alert('Failed to parse PDF file. Please try another file.');
    }
  };

  // Image File Importer
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target?.result as string;
      imgObj.onload = () => {
        const image = new fabric.Image(imgObj, {
          left: 150,
          top: 150,
          cornerColor: '#8b5cf6',
          cornerStyle: 'circle',
        });
        image.scaleToWidth(250);
        activeCanvas.add(image);
        activeCanvas.setActiveObject(image);
        activeCanvas.renderAll();
      };
    };
    reader.readAsDataURL(file);
  };

  // Toolbar Element Insertion Methods
  const addTextBox = () => {
    if (!activeCanvas) return;
    const text = new fabric.IText('Your Text Here', {
      left: 150,
      top: 150,
      fontSize: 24,
      fontFamily: 'Helvetica',
      fill: '#1e293b',
      // New text is transparent by default so it does not create an
      // artificial white rectangle over the original PDF.
      textBackgroundColor: 'transparent',
      padding: 0,
      cornerColor: '#8b5cf6',
      cornerStyle: 'circle',
      cornerSize: 10,
      transparentCorners: false,
    });
    activeCanvas.add(text);
    activeCanvas.setActiveObject(text);
    activeCanvas.renderAll();
  };

  const addShape = (shapeType: 'rect' | 'circle' | 'line') => {
    if (!activeCanvas) return;
    let shape: fabric.Object;

    if (shapeType === 'rect') {
      shape = new fabric.Rect({
        left: 150,
        top: 150,
        fill: '#8b5cf6',
        width: 120,
        height: 120,
        rx: 8,
        ry: 8,
        cornerColor: '#8b5cf6',
      });
    } else if (shapeType === 'circle') {
      shape = new fabric.Circle({
        left: 150,
        top: 150,
        fill: '#ec4899',
        radius: 60,
        cornerColor: '#8b5cf6',
      });
    } else {
      shape = new fabric.Line([50, 100, 250, 100], {
        stroke: '#3b82f6',
        strokeWidth: 4,
        cornerColor: '#8b5cf6',
      });
    }

    activeCanvas.add(shape);
    activeCanvas.setActiveObject(shape);
    activeCanvas.renderAll();
  };

  // Canvas Action Functions
  const duplicateObject = async () => {
    if (!activeCanvas || !selectedObject) return;
    const cloned = await selectedObject.clone();
    activeCanvas.discardActiveObject();
    cloned.set({
      left: (cloned.left || 0) + 20,
      top: (cloned.top || 0) + 20,
      evented: true,
    });
    activeCanvas.add(cloned);
    activeCanvas.setActiveObject(cloned);
    activeCanvas.requestRenderAll();
  };

  const deleteObject = () => {
    if (!activeCanvas || !selectedObject) return;

    const pdfMasks = pdfTextMasks.current.get(selectedObject);

    if (pdfMasks?.length) {
      // IMPORTANT: deleting an imported PDF text object must NOT delete its
      // erase mask. The mask is what hides the original text baked into the
      // background PDF image.
      preservePdfMaskOnDelete.current.add(selectedObject);
      pdfMasks.forEach((mask) => {
        mask.set({ selectable: false, evented: false });
        activeCanvas.sendObjectToBack(mask);
      });
    }

    activeCanvas.remove(selectedObject);
    activeCanvas.discardActiveObject();
    setSelectedObject(null);
    setIsFloatingToolbarVisible(false);
    activeCanvas.requestRenderAll();
  };

  const toggleLock = () => {
    if (!selectedObject || !activeCanvas) return;
    const isLocked = !selectedObject.lockMovementX;
    selectedObject.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      hasControls: !isLocked,
    });
    activeCanvas.renderAll();
    setSelectedObject(selectedObject);
  };

  const rotateObject = () => {
    if (!selectedObject || !activeCanvas) return;
    selectedObject.rotate((selectedObject.angle || 0) + 45);
    activeCanvas.renderAll();
  };

  const applyTextStyle = (key: string, value: string | number | boolean) => {
    if (!activeCanvas || !selectedObject) return;

    selectedObject.set(key as keyof fabric.Object, value);

    // Changing font size, family, weight, etc. changes the rendered bounds.
    // Keep the original PDF area masked and resize the current-text mask.
    if (pdfTextMasks.current.has(selectedObject)) {
      updatePdfTextMasks(activeCanvas, selectedObject);
    }

    activeCanvas.requestRenderAll();
  };

  const createPdfBlob = () => {
    if (!pages.length) return null;

    const firstPage = pages[0];
    const doc = new jsPDF({
      orientation: firstPage.width > firstPage.height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [firstPage.width, firstPage.height],
    });

    pages.forEach((page, index) => {
      const canvas = fabricCanvases.current[page.id];
      if (!canvas) return;

      const imgData = canvas.toDataURL({ format: 'png', multiplier: 4 });
      const orientation = page.width > page.height ? 'landscape' : 'portrait';
      if (index > 0) doc.addPage([page.width, page.height], orientation);
      doc.addImage(imgData, 'PNG', 0, 0, page.width, page.height);
    });

    return doc.output('blob');
  };

  const runExport = async () => {
    const firstCanvas = pages[0] && fabricCanvases.current[pages[0].id];
    if (!firstCanvas) return;

    const isPdf = exportFormat === 'pdf';
    const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
    const extension = exportFormat;
    const blob = isPdf
      ? createPdfBlob()
      : await new Promise<Blob | null>((resolve) => firstCanvas.lowerCanvasEl.toBlob(resolve, mime, 0.98));
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const filename = `utilai-edited-document.${extension}`;

    if (exportAction === 'download') {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    } else if (exportAction === 'preview') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (exportAction === 'print') {
      const printWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (printWindow) printWindow.addEventListener('load', () => printWindow.print());
    } else if (navigator.share) {
      await navigator.share({
        title: 'Edited PDF document',
        files: [new File([blob], filename, { type: blob.type })],
      });
    }

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setIsExportOpen(false);
    setIsExportConfirmed(false);
  };

  return (
    <div className="utilai-pdf-editor flex flex-col h-screen w-full bg-[#f8fbff] font-sans overflow-hidden select-none">
      {/* TOP UTILAI PDF TOOLBAR */}
      <header className="pdf-editor-topbar h-14 bg-white border-b border-blue-100 flex items-center justify-between px-4 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wide shadow-md shadow-blue-100">
            UtilAI PDF
          </div>
          <span className="text-xs font-semibold text-blue-700/70 border-l pl-3 border-blue-100">
            Studio Editor
          </span>
        </div>

        {/* Dynamic Context Control Bar */}
        {hasDocument && (
          <div className="pdf-editor-context-tools flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 shadow-inner">
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                applyTextStyle('fontFamily', e.target.value);
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Helvetica">Helvetica</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>

            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const newSize = Math.max(8, fontSize - 2);
                  setFontSize(newSize);
                  applyTextStyle('fontSize', newSize);
                }}
                className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-bold text-xs"
              >
                -
              </button>
              <span className="text-xs font-bold w-6 text-center text-slate-700">{fontSize}</span>
              <button
                onClick={() => {
                  const newSize = fontSize + 2;
                  setFontSize(newSize);
                  applyTextStyle('fontSize', newSize);
                }}
                className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-bold text-xs"
              >
                +
              </button>
            </div>

            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

            {/* Text Color Picker */}
            <label className="cursor-pointer relative p-1 hover:bg-slate-200 rounded" title="Text Color">
              <Palette className="w-4 h-4 text-slate-700" />
              <input
                type="color"
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value);
                  applyTextStyle('fill', e.target.value);
                }}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
            </label>

            {/* Background Color Picker */}
            <label className="cursor-pointer relative p-1 hover:bg-slate-200 rounded" title="Highlight Color">
              <Highlighter className="w-4 h-4 text-slate-700" />
              <input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  applyTextStyle('textBackgroundColor', e.target.value);
                }}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
            </label>

            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

            {/* Text Alignments */}
            <button onClick={() => applyTextStyle('textAlign', 'left')} className="p-1 hover:bg-slate-200 rounded text-slate-700">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button onClick={() => applyTextStyle('textAlign', 'center')} className="p-1 hover:bg-slate-200 rounded text-slate-700">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button onClick={() => applyTextStyle('textAlign', 'right')} className="p-1 hover:bg-slate-200 rounded text-slate-700">
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

            {/* Font Weight Toggles */}
            <button
              onClick={() => {
                setIsBold(!isBold);
                applyTextStyle('fontWeight', !isBold ? 'bold' : 'normal');
              }}
              className={`p-1 rounded ${isBold ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-slate-700'}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsItalic(!isItalic);
                applyTextStyle('fontStyle', !isItalic ? 'italic' : 'normal');
              }}
              className={`p-1 rounded ${isItalic ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-slate-700'}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsUnderline(!isUnderline);
                applyTextStyle('underline', !isUnderline);
              }}
              className={`p-1 rounded ${isUnderline ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-slate-700'}`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PDF Export Button */}
        {hasDocument && (
          <button
            onClick={() => {
              setIsExportConfirmed(false);
              setIsExportOpen(true);
            }}
            className="pdf-editor-export flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-100 transition"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      </header>

      {/* BODY CONTENT */}
      <div className="pdf-editor-body flex flex-1 overflow-hidden relative flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <aside className="pdf-editor-sidebar w-20 shrink-0 bg-[#0f2747] flex flex-col items-center py-5 gap-6 text-blue-100/70 z-10 shadow-xl">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'uploads' ? 'text-[#93c5fd]' : ''}`}
          >
            <Upload className="w-5 h-5" /> Uploads
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'text' ? 'text-[#93c5fd]' : ''}`}
          >
            <Type className="w-5 h-5" /> Text
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'elements' ? 'text-[#93c5fd]' : ''}`}
          >
            <Square className="w-5 h-5" /> Elements
          </button>
        </aside>

        {/* SIDEBAR EXTENDED PANELS */}
        <div className="pdf-editor-panel w-72 shrink-0 bg-white border-r border-blue-100 p-5 overflow-y-auto z-10 shadow-sm">
          {activeTab === 'uploads' && (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Import Document</h3>

              {/* PDF Import Card */}
              <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/60 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center shadow-sm">
                <Upload className="w-8 h-8 text-blue-600 mb-2 animate-bounce" />
                <span className="text-xs font-bold text-blue-900">Upload PDF File</span>
                <span className="text-[10px] text-blue-600 mt-1">Extract text & make pages canvas-ready</span>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>

              <button
                onClick={startBlankProject}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <FilePlus className="w-4 h-4 text-slate-500" /> Start Blank Canvas
              </button>

              <div className="h-[1px] bg-slate-100 my-1" />

              {/* Image Import Card */}
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Add Media</h3>
              <label className="border border-slate-200 hover:border-slate-300 bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center">
                <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Add Text Boxes</h3>
              <button
                onClick={addTextBox}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Text Layer
              </button>
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Insert Shapes</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addShape('rect')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium"
                >
                  <Square className="w-5 h-5 text-blue-600" /> Rectangle
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium"
                >
                  <Circle className="w-5 h-5 text-blue-500" /> Circle
                </button>
                <button
                  onClick={() => addShape('line')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium col-span-2"
                >
                  <ArrowRight className="w-5 h-5 text-blue-500" /> Line / Divider
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WORKSPACE ENGINE AREA */}
        <main className="pdf-editor-workspace min-w-0 min-h-0 flex-1 w-full bg-[#f1f7ff] overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
          {!hasDocument ? (
            <div className="my-auto flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">No Document Loaded</h2>
              <p className="text-xs text-slate-500 mb-6">
                Please upload a PDF document from the left panel or start with a blank template canvas to begin editing.
              </p>
              <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-blue-200 transition">
                Upload PDF Document
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <>
              {pages.map((page, index) => (
                <div key={page.id} className="flex max-w-full flex-col items-center gap-2">
                  <div className="text-xs font-bold text-slate-400 self-start mb-1">
                    Page {index + 1}
                  </div>
                  <div className="canvas-container bg-white shadow-2xl rounded-sm overflow-hidden relative border border-slate-300">
                    <canvas ref={(el) => {
                      canvasRefs.current[page.id] = el;
                    }} />
                  </div>
                </div>
              ))}

              {/* CANVA ADD PAGE CONTROL */}
              <button
                onClick={addNewPage}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-full shadow-lg transition my-4 text-xs"
              >
                <Plus className="w-4 h-4 text-blue-600" /> Add Page
              </button>
            </>
          )}
        </main>

        {/* CANVA PURPLE FLOATING CONTEXT MENU (Shown on selecting objects) */}
        {selectedObject && floatingMenuPos && isFloatingToolbarVisible && (
          <div
            onMouseEnter={() => setIsFloatingToolbarVisible(true)}
            onMouseLeave={() => setIsFloatingToolbarVisible(false)}
            style={{
              position: 'fixed',
              top: `${floatingMenuPos.top}px`,
              left: `${floatingMenuPos.left}px`,
              transform: 'translateX(-50%)',
            }}
            className="bg-blue-600 text-white rounded-full shadow-2xl flex items-center px-3 py-1.5 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 border border-blue-400"
          >
            {/* Move Control Indicator */}
              <button className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Move Object">
              <Move className="w-4 h-4" />
            </button>

            {/* Duplicate Button */}
            <button onClick={duplicateObject} className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>

            {/* Rotate Button */}
            <button onClick={rotateObject} className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Rotate 45°">
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Lock / Unlock */}
            <button onClick={toggleLock} className="p-1.5 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white" title="Lock Position">
              {selectedObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4" />}
            </button>

            <div className="h-4 w-[1px] bg-blue-400 my-auto mx-1" />

            {/* Delete Button */}
            <button onClick={deleteObject} className="p-1.5 hover:bg-blue-800 rounded-full text-red-200 hover:text-red-100" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isExportOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Export document</h2>
                <p className="mt-1 text-xs text-slate-500">Choose a format and operation before processing.</p>
              </div>
              <button onClick={() => setIsExportOpen(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Close export dialog">&times;</button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['pdf', 'png', 'jpg'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold uppercase ${exportFormat === format ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                >
                  {format}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {(['download', 'print', 'share', 'preview'] as const).map((action) => (
                <button
                  key={action}
                  onClick={() => setExportAction(action)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${exportAction === action ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <label htmlFor="export-confirm" className="mb-2 block text-sm font-semibold text-slate-800">Slide to process this file</label>
              <input
                id="export-confirm"
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                onChange={(event) => setIsExportConfirmed(Number(event.target.value) === 100)}
                className="w-full accent-blue-500"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <ArrowRightCircle className="h-4 w-4 text-blue-600" /> Slide the arrow fully right to continue
              </div>
            </div>

            <button
              onClick={runExport}
              disabled={!isExportConfirmed}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" /> Process {exportAction} as {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}