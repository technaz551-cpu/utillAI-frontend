

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
//   const pdfTextMasks = useRef(new Map<fabric.Object, fabric.Rect>());
//   const pdfTextMaskColors = useRef(new Map<fabric.Object, string>());
//   const pdfTextBounds = useRef(new Map<fabric.Object, {
//     left: number;
//     top: number;
//     width: number;
//     height: number;
//     angle: number;
//   }>());

//   const sampleBackgroundColor = (canvas: fabric.Canvas, object: fabric.Object) => {
//     const background = canvas.backgroundImage as fabric.Image | undefined;
//     const element = background?.getElement();
//     if (!background || !element) return;

//     const center = object.getCenterPoint();
//     const sourceX = (center.x - (background.left || 0)) / (background.scaleX || 1);
//     const sourceY = (center.y - (background.top || 0)) / (background.scaleY || 1);
//     const sampleCanvas = document.createElement('canvas');
//     sampleCanvas.width = 1;
//     sampleCanvas.height = 1;
//     const sampleContext = sampleCanvas.getContext('2d');
//     if (!sampleContext) return;

//     sampleContext.drawImage(element, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
//     const pixel = sampleContext.getImageData(0, 0, 1, 1).data;
//     pdfTextMaskColors.current.set(object, `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);

//     const mask = pdfTextMasks.current.get(object);
//     if (mask) mask.set({ fill: pdfTextMaskColors.current.get(object) });
//   };

//   const revealPdfText = (canvas: fabric.Canvas, object: fabric.Object) => {
//     if (object.type !== 'i-text' && object.type !== 'textbox') return;

//     const textObject = object as fabric.IText;
//     textObject.set({ fill: '#000000', opacity: 1 });
//     if (pdfTextMasks.current.has(object)) {
//       canvas.requestRenderAll();
//       return;
//     }

//     const bounds = pdfTextBounds.current.get(object) || {
//       left: textObject.left || 0,
//       top: textObject.top || 0,
//       width: textObject.getScaledWidth(),
//       height: textObject.getScaledHeight(),
//       angle: textObject.angle || 0,
//     };
//     const mask = new fabric.Rect({
//       left: bounds.left + bounds.width / 2,
//       top: bounds.top + bounds.height / 2,
//       width: bounds.width + 2,
//       height: bounds.height + 1,
//       originX: 'center',
//       originY: 'center',
//       angle: bounds.angle,
//       fill: pdfTextMaskColors.current.get(object) || '#ffffff',
//       selectable: false,
//       evented: false,
//     });
//     canvas.add(mask);
//     canvas.sendObjectBackwards(mask);
//     canvas.bringObjectToFront(object);
//     pdfTextMasks.current.set(object, mask);
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
//       selectionColor: 'rgba(29, 189, 120, 0.15)',
//       selectionBorderColor: '#1dbd78',
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
//             stroke: '#1dbd78',
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
//       if (object) sampleBackgroundColor(canvas, object);
//     });
//     canvas.on('object:scaling', () => {
//       const object = canvas.getActiveObject();
//       updateFloatingMenuPosition(canvas, object);
//       if (object) sampleBackgroundColor(canvas, object);
//     });
//     canvas.on('object:modified', (event) => {
//       const object = event.target;
//       if (!object) return;
//       sampleBackgroundColor(canvas, object);
//       const mask = pdfTextMasks.current.get(object);
//       if (mask) {
//         const bounds = object.getBoundingRect();
//         mask.set({
//           left: bounds.left + bounds.width / 2,
//           top: bounds.top + bounds.height / 2,
//           width: bounds.width + 2,
//           height: bounds.height + 1,
//           angle: object.angle || 0,
//         });
//         canvas.requestRenderAll();
//       }
//     });

//     canvas.on('text:changed', (event) => {
//       const object = event.target;
//       if (!object || (object.type !== 'i-text' && object.type !== 'textbox')) return;

//       const mask = pdfTextMasks.current.get(object);
//       if (!mask) return;

//       const textObject = object as fabric.IText;
//       if (!textObject.text?.trim()) {
//         canvas.remove(mask);
//         pdfTextMasks.current.delete(object);
//         pdfTextMaskColors.current.delete(object);
//         pdfTextBounds.current.delete(object);
//         canvas.requestRenderAll();
//         return;
//       }

//       const bounds = object.getBoundingRect();
//       sampleBackgroundColor(canvas, object);
//       mask.set({
//         left: bounds.left + bounds.width / 2,
//         top: bounds.top + bounds.height / 2,
//         width: bounds.width + 2,
//         height: bounds.height + 1,
//         angle: object.angle || 0,
//       });
//       canvas.requestRenderAll();
//     });

//     canvas.on('object:removed', (event) => {
//       const object = event.target;
//       if (!object) return;
//       const mask = pdfTextMasks.current.get(object);
//       if (mask) {
//         canvas.remove(mask);
//         pdfTextMasks.current.delete(object);
//         pdfTextMaskColors.current.delete(object);
//         pdfTextBounds.current.delete(object);
//         canvas.requestRenderAll();
//       }
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
//             textContent.items.forEach((item: any) => {
//               if (!('str' in item) || !('transform' in item)) return;
//               const textItem = item as PdfTextItemLike;
//               if (!textItem.str.trim()) return;

//               const [textX, textY] = pageViewport.convertToViewportPoint(
//                 textItem.transform[4],
//                 textItem.transform[5],
//               );
//               const fontSize = Math.max(
//                 6,
//                 Math.hypot(textItem.transform[2], textItem.transform[3]) || 14,
//               );
//               const textTop = textY - fontSize * 0.82;
//               const textWidth = Math.max(fontSize, textItem.width || textItem.str.length * fontSize * 0.55);
//               const sampleX = Math.max(0, Math.min(tempCanvas.width - 1, Math.round((textX + textWidth / 2) * renderScale)));
//               const sampleY = Math.max(0, Math.min(tempCanvas.height - 1, Math.round((textTop - 2) * renderScale)));
//               const angle = Math.atan2(textItem.transform[1], textItem.transform[0]) * (180 / Math.PI);
//               const pixel = context.getImageData(sampleX, sampleY, 1, 1).data;
//               const maskColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
//               const text = new fabric.IText(textItem.str, {
//                 left: textX,
//                 top: textTop,
//                 originX: 'left',
//                 originY: 'top',
//                 fontSize,
//                 fontFamily: 'Helvetica',
//                 fill: 'rgba(0, 0, 0, 0)',
//                 opacity: 1,
//                 padding: 0,
//                 angle,
//               });
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
//       padding: 6,
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
//     activeCanvas.remove(selectedObject);
//     activeCanvas.discardActiveObject();
//     activeCanvas.renderAll();
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
//     activeCanvas.renderAll();
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
//     <div className="utilai-pdf-editor flex flex-col h-screen w-full bg-[#edf5f1] font-sans overflow-hidden select-none">
//       {/* TOP UTILAI PDF TOOLBAR */}
//       <header className="pdf-editor-topbar h-14 bg-white border-b border-emerald-100 flex items-center justify-between px-4 z-20 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="bg-gradient-to-r from-[#1dbd78] to-[#0d8f60] text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wide shadow-md shadow-emerald-100">
//             UtilAI PDF
//           </div>
//           <span className="text-xs font-semibold text-emerald-700/60 border-l pl-3 border-emerald-100">
//             Studio Editor
//           </span>
//         </div>

//         {/* Dynamic Context Control Bar */}
//         {hasDocument && (
//           <div className="pdf-editor-context-tools flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 shadow-inner">
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
//               className={`p-1 rounded ${isBold ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-emerald-50 text-slate-700'}`}
//             >
//               <Bold className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 setIsItalic(!isItalic);
//                 applyTextStyle('fontStyle', !isItalic ? 'italic' : 'normal');
//               }}
//               className={`p-1 rounded ${isItalic ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-emerald-50 text-slate-700'}`}
//             >
//               <Italic className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 setIsUnderline(!isUnderline);
//                 applyTextStyle('underline', !isUnderline);
//               }}
//               className={`p-1 rounded ${isUnderline ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-emerald-50 text-slate-700'}`}
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
//             className="pdf-editor-export flex items-center gap-2 bg-[#1dbd78] hover:bg-[#0d8f60] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition"
//           >
//             <Download className="w-4 h-4" /> Export
//           </button>
//         )}
//       </header>

//       {/* BODY CONTENT */}
//       <div className="pdf-editor-body flex flex-1 overflow-hidden relative flex-col md:flex-row">
//         {/* SIDEBAR NAVIGATION */}
//         <aside className="pdf-editor-sidebar w-20 bg-[#102b22] flex flex-col items-center py-5 gap-6 text-emerald-100/60 z-10 shadow-xl">
//           <button
//             onClick={() => setActiveTab('uploads')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'uploads' ? 'text-[#77d8b2]' : ''}`}
//           >
//             <Upload className="w-5 h-5" /> Uploads
//           </button>
//           <button
//             onClick={() => setActiveTab('text')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'text' ? 'text-[#77d8b2]' : ''}`}
//           >
//             <Type className="w-5 h-5" /> Text
//           </button>
//           <button
//             onClick={() => setActiveTab('elements')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'elements' ? 'text-[#77d8b2]' : ''}`}
//           >
//             <Square className="w-5 h-5" /> Elements
//           </button>
//         </aside>

//         {/* SIDEBAR EXTENDED PANELS */}
//         <div className="pdf-editor-panel w-72 bg-white border-r border-emerald-100 p-5 overflow-y-auto z-10 shadow-sm">
//           {activeTab === 'uploads' && (
//             <div className="flex flex-col gap-4">
//               <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Import Document</h3>

//               {/* PDF Import Card */}
//               <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/60 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center shadow-sm">
//                 <Upload className="w-8 h-8 text-emerald-600 mb-2 animate-bounce" />
//                 <span className="text-xs font-bold text-emerald-900">Upload PDF File</span>
//                 <span className="text-[10px] text-emerald-600 mt-1">Extract text & make pages canvas-ready</span>
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
//                 className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-sm"
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
//                   <Square className="w-5 h-5 text-emerald-600" /> Rectangle
//                 </button>
//                 <button
//                   onClick={() => addShape('circle')}
//                   className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium"
//                 >
//                   <Circle className="w-5 h-5 text-pink-500" /> Circle
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
//         <main className="pdf-editor-workspace flex-1 bg-[#dcece4] overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
//           {!hasDocument ? (
//             <div className="my-auto flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
//               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
//                 <Upload className="w-8 h-8" />
//               </div>
//               <h2 className="text-xl font-bold text-slate-800 mb-2">No Document Loaded</h2>
//               <p className="text-xs text-slate-500 mb-6">
//                 Please upload a PDF document from the left panel or start with a blank template canvas to begin editing.
//               </p>
//               <label className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-200 transition">
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
//                 <Plus className="w-4 h-4 text-emerald-600" /> Add Page
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
//             className="bg-emerald-600 text-white rounded-full shadow-2xl flex items-center px-3 py-1.5 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 border border-emerald-400"
//           >
//             {/* Move Control Indicator */}
//               <button className="p-1.5 hover:bg-emerald-700 rounded-full text-emerald-100 hover:text-white" title="Move Object">
//               <Move className="w-4 h-4" />
//             </button>

//             {/* Duplicate Button */}
//             <button onClick={duplicateObject} className="p-1.5 hover:bg-emerald-700 rounded-full text-emerald-100 hover:text-white" title="Duplicate">
//               <Copy className="w-4 h-4" />
//             </button>

//             {/* Rotate Button */}
//             <button onClick={rotateObject} className="p-1.5 hover:bg-emerald-700 rounded-full text-emerald-100 hover:text-white" title="Rotate 45°">
//               <RotateCw className="w-4 h-4" />
//             </button>

//             {/* Lock / Unlock */}
//             <button onClick={toggleLock} className="p-1.5 hover:bg-emerald-700 rounded-full text-emerald-100 hover:text-white" title="Lock Position">
//               {selectedObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4" />}
//             </button>

//             <div className="h-4 w-[1px] bg-emerald-400 my-auto mx-1" />

//             {/* Delete Button */}
//             <button onClick={deleteObject} className="p-1.5 hover:bg-emerald-800 rounded-full text-red-200 hover:text-red-100" title="Delete">
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
//                   className={`rounded-lg border px-3 py-2 text-sm font-semibold uppercase ${exportFormat === format ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'}`}
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
//                   className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${exportAction === action ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600'}`}
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
//                 className="w-full accent-emerald-600"
//               />
//               <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
//                 <ArrowRightCircle className="h-4 w-4 text-emerald-600" /> Slide the arrow fully right to continue
//               </div>
//             </div>

//             <button
//               onClick={runExport}
//               disabled={!isExportConfirmed}
//               className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <Download className="h-4 w-4" /> Process {exportAction} as {exportFormat.toUpperCase()}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { jsPDF } from "jspdf";

import {
  Type,
  Image as ImageIcon,
  Square,
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
  FilePlus,
  Highlighter,
  X,
} from "lucide-react";

import "./pdfeditor.css";

type PdfTextItemLike = {
  str: string;
  transform: number[];
  width?: number;
};

type PdfPage = {
  id: string;
  width: number;
  height: number;
};

/*
|--------------------------------------------------------------------------
| PDF.JS WORKER
|--------------------------------------------------------------------------
*/

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.js`;
}

export default function UtilAiPdfEditor({
  tool,
}: {
  tool?: { slug?: string };
}) {
  void tool;

  /*
  |--------------------------------------------------------------------------
  | BASIC STATE
  |--------------------------------------------------------------------------
  */

  const [activeTab, setActiveTab] = useState<
    "templates" | "elements" | "text" | "uploads" | "export"
  >("uploads");

  const [pages, setPages] = useState<PdfPage[]>([]);
  const [hasDocument, setHasDocument] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CANVAS REFERENCES
  |--------------------------------------------------------------------------
  */

  const canvasRefs = useRef<{
    [key: string]: HTMLCanvasElement | null;
  }>({});

  const fabricCanvases = useRef<{
    [key: string]: fabric.Canvas;
  }>({});

  const [activeCanvas, setActiveCanvas] =
    useState<fabric.Canvas | null>(null);

  const [selectedObject, setSelectedObject] =
    useState<fabric.Object | null>(null);

  /*
  |--------------------------------------------------------------------------
  | FLOATING TOOLBAR
  |--------------------------------------------------------------------------
  */

  const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] =
    useState(false);

  const [floatingMenuPos, setFloatingMenuPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const [isExportOpen, setIsExportOpen] = useState(false);

  const [exportFormat, setExportFormat] = useState<
    "pdf" | "png" | "jpg"
  >("pdf");

  const [exportAction, setExportAction] = useState<
    "download" | "print" | "share" | "preview"
  >("download");

  const [isExportConfirmed, setIsExportConfirmed] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | TEXT SETTINGS
  |--------------------------------------------------------------------------
  */

  const [fontFamily, setFontFamily] = useState("Helvetica");
  const [fontSize, setFontSize] = useState(20);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const [textColor, setTextColor] = useState("#1e293b");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | PDF TEXT MASKS
  |--------------------------------------------------------------------------
  */

  const pdfTextMasks = useRef(
    new Map<fabric.Object, fabric.Rect>()
  );

  const pdfTextMaskColors = useRef(
    new Map<fabric.Object, string>()
  );

  const pdfTextBounds = useRef(
    new Map<
      fabric.Object,
      {
        left: number;
        top: number;
        width: number;
        height: number;
        angle: number;
      }
    >()
  );

  /*
  |--------------------------------------------------------------------------
  | BODY CLASS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    document.body.classList.add("pdf-editor-open");

    return () => {
      document.body.classList.remove("pdf-editor-open");
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SAMPLE BACKGROUND COLOR
  |--------------------------------------------------------------------------
  */

  const sampleBackgroundColor = (
    canvas: fabric.Canvas,
    object: fabric.Object
  ) => {
    const background =
      canvas.backgroundImage as fabric.Image | undefined;

    const element = background?.getElement();

    if (!background || !element) return;

    const center = object.getCenterPoint();

    const sourceX =
      (center.x - (background.left || 0)) /
      (background.scaleX || 1);

    const sourceY =
      (center.y - (background.top || 0)) /
      (background.scaleY || 1);

    const sampleCanvas = document.createElement("canvas");

    sampleCanvas.width = 1;
    sampleCanvas.height = 1;

    const sampleContext = sampleCanvas.getContext("2d");

    if (!sampleContext) return;

    sampleContext.drawImage(
      element,
      sourceX,
      sourceY,
      1,
      1,
      0,
      0,
      1,
      1
    );

    const pixel = sampleContext
      .getImageData(0, 0, 1, 1)
      .data;

    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    pdfTextMaskColors.current.set(object, color);

    const mask = pdfTextMasks.current.get(object);

    if (mask) {
      mask.set({
        fill: color,
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REVEAL PDF TEXT
  |--------------------------------------------------------------------------
  */

  const revealPdfText = (
    canvas: fabric.Canvas,
    object: fabric.Object
  ) => {
    if (
      object.type !== "i-text" &&
      object.type !== "textbox"
    ) {
      return;
    }

    const textObject = object as fabric.IText;

    textObject.set({
      fill: "#000000",
      opacity: 1,
    });

    if (pdfTextMasks.current.has(object)) {
      canvas.requestRenderAll();
      return;
    }

    const bounds =
      pdfTextBounds.current.get(object) || {
        left: textObject.left || 0,
        top: textObject.top || 0,
        width: textObject.getScaledWidth(),
        height: textObject.getScaledHeight(),
        angle: textObject.angle || 0,
      };

    const mask = new fabric.Rect({
      left: bounds.left + bounds.width / 2,
      top: bounds.top + bounds.height / 2,
      width: bounds.width + 2,
      height: bounds.height + 1,
      originX: "center",
      originY: "center",
      angle: bounds.angle,
      fill:
        pdfTextMaskColors.current.get(object) ||
        "#ffffff",
      selectable: false,
      evented: false,
    });

    canvas.add(mask);

    canvas.sendObjectBackwards(mask);
    canvas.bringObjectToFront(object);

    pdfTextMasks.current.set(object, mask);

    canvas.requestRenderAll();
  };

  /*
  |--------------------------------------------------------------------------
  | FLOATING MENU POSITION
  |--------------------------------------------------------------------------
  */

  const updateFloatingMenuPosition = (
    canvas: fabric.Canvas,
    obj: fabric.Object | null | undefined
  ) => {
    if (!obj || !canvas.upperCanvasEl) return;

    const bound = obj.getBoundingRect();

    const canvasRect =
      canvas.upperCanvasEl.getBoundingClientRect();

    setFloatingMenuPos({
      top: Math.max(
        72,
        canvasRect.top + bound.top - 62
      ),

      left: Math.min(
        window.innerWidth - 24,
        Math.max(
          24,
          canvasRect.left +
            bound.left +
            bound.width / 2
        )
      ),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE FABRIC CANVAS
  |--------------------------------------------------------------------------
  */

  const initCanvas = (
    id: string,
    width: number,
    height: number
  ) => {
    const el = canvasRefs.current[id];

    if (!el || fabricCanvases.current[id]) return;

    const canvas = new fabric.Canvas(el, {
      width,
      height,

      backgroundColor: "#ffffff",

      selectionColor:
        "rgba(37, 99, 235, 0.12)",

      selectionBorderColor: "#2563eb",

      selectionLineWidth: 2,
    });

    let hoveredObject: fabric.Object | null = null;

    /*
    |--------------------------------------------------------------------------
    | MOUSE MOVE
    |--------------------------------------------------------------------------
    */

    canvas.on("mouse:move", (event) => {
      if (event.target) {
        setActiveCanvas(canvas);

        setSelectedObject(event.target);

        setIsFloatingToolbarVisible(true);

        updateFloatingMenuPosition(
          canvas,
          event.target
        );

        if (
          event.target !== canvas.getActiveObject() &&
          hoveredObject !== event.target
        ) {
          hoveredObject = event.target;

          hoveredObject.set({
            stroke: "#2563eb",
            strokeWidth: 2,
            strokeDashArray: [5, 5],
          });

          canvas.renderAll();
        }
      } else {
        setIsFloatingToolbarVisible(false);

        if (hoveredObject) {
          hoveredObject.set({
            stroke: undefined,
            strokeDashArray: undefined,
          });

          hoveredObject = null;

          canvas.renderAll();
        }
      }
    });

    /*
    |--------------------------------------------------------------------------
    | MOUSE OUT
    |--------------------------------------------------------------------------
    */

    canvas.on("mouse:out", () => {
      setIsFloatingToolbarVisible(false);

      if (hoveredObject) {
        hoveredObject.set({
          stroke: undefined,
          strokeDashArray: undefined,
        });

        hoveredObject = null;

        canvas.renderAll();
      }
    });

    /*
    |--------------------------------------------------------------------------
    | SELECTION
    |--------------------------------------------------------------------------
    */

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();

      if (activeObj) {
        setActiveCanvas(canvas);

        setSelectedObject(activeObj);

        setIsFloatingToolbarVisible(true);

        revealPdfText(canvas, activeObj);

        updateFloatingMenuPosition(
          canvas,
          activeObj
        );

        setOpacity(activeObj.opacity || 1);

        if (
          activeObj.type === "i-text" ||
          activeObj.type === "textbox"
        ) {
          const textObj =
            activeObj as fabric.IText;

          setFontFamily(
            textObj.fontFamily || "Helvetica"
          );

          setFontSize(
            Math.round(textObj.fontSize || 20)
          );

          setIsBold(
            textObj.fontWeight === "bold"
          );

          setIsItalic(
            textObj.fontStyle === "italic"
          );

          setIsUnderline(
            !!textObj.underline
          );

          setTextColor(
            (textObj.fill as string) ||
              "#1e293b"
          );

          setBgColor(
            (textObj.textBackgroundColor as string) ||
              "#ffffff"
          );
        }
      } else {
        setSelectedObject(null);

        setIsFloatingToolbarVisible(false);

        setFloatingMenuPos(null);
      }
    };

    canvas.on(
      "selection:created",
      handleSelection
    );

    canvas.on(
      "selection:updated",
      handleSelection
    );

    canvas.on(
      "selection:cleared",
      () => {
        setSelectedObject(null);
        setIsFloatingToolbarVisible(false);
        setFloatingMenuPos(null);
      }
    );

    /*
    |--------------------------------------------------------------------------
    | OBJECT MOVING
    |--------------------------------------------------------------------------
    */

    canvas.on("object:moving", () => {
      const object = canvas.getActiveObject();

      updateFloatingMenuPosition(
        canvas,
        object
      );

      if (object) {
        sampleBackgroundColor(
          canvas,
          object
        );
      }
    });

    /*
    |--------------------------------------------------------------------------
    | OBJECT SCALING
    |--------------------------------------------------------------------------
    */

    canvas.on("object:scaling", () => {
      const object = canvas.getActiveObject();

      updateFloatingMenuPosition(
        canvas,
        object
      );

      if (object) {
        sampleBackgroundColor(
          canvas,
          object
        );
      }
    });

    /*
    |--------------------------------------------------------------------------
    | OBJECT MODIFIED
    |--------------------------------------------------------------------------
    */

    canvas.on(
      "object:modified",
      (event) => {
        const object = event.target;

        if (!object) return;

        sampleBackgroundColor(
          canvas,
          object
        );

        const mask =
          pdfTextMasks.current.get(object);

        if (mask) {
          const bounds =
            object.getBoundingRect();

          mask.set({
            left:
              bounds.left +
              bounds.width / 2,

            top:
              bounds.top +
              bounds.height / 2,

            width:
              bounds.width + 2,

            height:
              bounds.height + 1,

            angle:
              object.angle || 0,
          });

          canvas.requestRenderAll();
        }

        updateFloatingMenuPosition(
          canvas,
          object
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | TEXT CHANGED
    |--------------------------------------------------------------------------
    */

    canvas.on(
      "text:changed",
      (event) => {
        const object = event.target;

        if (
          !object ||
          (
            object.type !== "i-text" &&
            object.type !== "textbox"
          )
        ) {
          return;
        }

        const mask =
          pdfTextMasks.current.get(object);

        if (!mask) return;

        const textObject =
          object as fabric.IText;

        if (!textObject.text?.trim()) {
          canvas.remove(mask);

          pdfTextMasks.current.delete(
            object
          );

          pdfTextMaskColors.current.delete(
            object
          );

          pdfTextBounds.current.delete(
            object
          );

          canvas.requestRenderAll();

          return;
        }

        const bounds =
          object.getBoundingRect();

        sampleBackgroundColor(
          canvas,
          object
        );

        mask.set({
          left:
            bounds.left +
            bounds.width / 2,

          top:
            bounds.top +
            bounds.height / 2,

          width:
            bounds.width + 2,

          height:
            bounds.height + 1,

          angle:
            object.angle || 0,
        });

        canvas.requestRenderAll();
      }
    );

    /*
    |--------------------------------------------------------------------------
    | OBJECT REMOVED
    |--------------------------------------------------------------------------
    */

    canvas.on(
      "object:removed",
      (event) => {
        const object = event.target;

        if (!object) return;

        const mask =
          pdfTextMasks.current.get(object);

        if (mask) {
          canvas.remove(mask);

          pdfTextMasks.current.delete(
            object
          );

          pdfTextMaskColors.current.delete(
            object
          );

          pdfTextBounds.current.delete(
            object
          );

          canvas.requestRenderAll();
        }
      }
    );

    fabricCanvases.current[id] =
      canvas;

    if (!activeCanvas) {
      setActiveCanvas(canvas);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE PAGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    pages.forEach((page) => {
      initCanvas(
        page.id,
        page.width,
        page.height
      );
    });
  }, [pages]);

  /*
  |--------------------------------------------------------------------------
  | BLANK PROJECT
  |--------------------------------------------------------------------------
  */

  const startBlankProject = () => {
    const id = `page-${Date.now()}`;

    setPages([
      {
        id,
        width: 595.28,
        height: 841.89,
      },
    ]);

    setHasDocument(true);

    setTimeout(() => {
      const canvas =
        fabricCanvases.current[id];

      if (canvas) {
        setActiveCanvas(canvas);
      }
    }, 100);
  };

  /*
  |--------------------------------------------------------------------------
  | ADD NEW PAGE
  |--------------------------------------------------------------------------
  */

  const addNewPage = () => {
    const newId = `page-${Date.now()}`;

    const newPage: PdfPage = {
      id: newId,
      width: 595.28,
      height: 841.89,
    };

    setPages((prev) => [
      ...prev,
      newPage,
    ]);

    setHasDocument(true);
  };

  /*
  |--------------------------------------------------------------------------
  | PDF UPLOAD
  |--------------------------------------------------------------------------
  */

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    try {
      const arrayBuffer =
        await file.arrayBuffer();

      const loadingTask =
        pdfjsLib.getDocument({
          data: arrayBuffer,
        });

      const pdf =
        await loadingTask.promise;

      const pageList: PdfPage[] = [];

      for (
        let i = 1;
        i <= pdf.numPages;
        i++
      ) {
        const page =
          await pdf.getPage(i);

        const viewport =
          page.getViewport({
            scale: 1,
          });

        pageList.push({
          id: `page-${i}`,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(pageList);

      setHasDocument(true);

      setTimeout(async () => {
        for (
          let i = 1;
          i <= pdf.numPages;
          i++
        ) {
          const page =
            await pdf.getPage(i);

          const renderScale = 4;

          const viewport =
            page.getViewport({
              scale: renderScale,
            });

          const pageViewport =
            page.getViewport({
              scale: 1,
            });

          const tempCanvas =
            document.createElement(
              "canvas"
            );

          const context =
            tempCanvas.getContext(
              "2d",
              {
                willReadFrequently: true,
              }
            );

          if (!context) continue;

          context.imageSmoothingEnabled =
            true;

          context.imageSmoothingQuality =
            "high";

          tempCanvas.height =
            viewport.height;

          tempCanvas.width =
            viewport.width;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          const imgData =
            tempCanvas.toDataURL(
              "image/png"
            );

          const fCanvas =
            fabricCanvases.current[
              `page-${i}`
            ];

          if (!fCanvas) continue;

          const img =
            await fabric.Image.fromURL(
              imgData
            );

          img.set({
            scaleX:
              fCanvas.width! /
              img.width!,

            scaleY:
              fCanvas.height! /
              img.height!,

            originX: "left",
            originY: "top",
          });

          fCanvas.backgroundImage =
            img;

          fCanvas.requestRenderAll();

          /*
          |--------------------------------------------------------------------------
          | EXTRACT PDF TEXT
          |--------------------------------------------------------------------------
          */

          const textContent =
            await page.getTextContent();

          textContent.items.forEach(
            (item: any) => {
              if (
                !("str" in item) ||
                !("transform" in item)
              ) {
                return;
              }

              const textItem =
                item as PdfTextItemLike;

              if (
                !textItem.str.trim()
              ) {
                return;
              }

              const [
                textX,
                textY,
              ] =
                pageViewport.convertToViewportPoint(
                  textItem.transform[4],
                  textItem.transform[5]
                );

              const fontSize =
                Math.max(
                  6,
                  Math.hypot(
                    textItem.transform[2],
                    textItem.transform[3]
                  ) || 14
                );

              const textTop =
                textY -
                fontSize * 0.82;

              const textWidth =
                Math.max(
                  fontSize,
                  textItem.width ||
                    textItem.str.length *
                      fontSize *
                      0.55
                );

              const sampleX =
                Math.max(
                  0,
                  Math.min(
                    tempCanvas.width - 1,
                    Math.round(
                      (
                        textX +
                        textWidth / 2
                      ) *
                        renderScale
                    )
                  )
                );

              const sampleY =
                Math.max(
                  0,
                  Math.min(
                    tempCanvas.height - 1,
                    Math.round(
                      (textTop - 2) *
                        renderScale
                    )
                  )
                );

              const angle =
                Math.atan2(
                  textItem.transform[1],
                  textItem.transform[0]
                ) *
                (180 / Math.PI);

              const pixel =
                context.getImageData(
                  sampleX,
                  sampleY,
                  1,
                  1
                ).data;

              const maskColor =
                `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

              const text =
                new fabric.IText(
                  textItem.str,
                  {
                    left: textX,
                    top: textTop,

                    originX: "left",
                    originY: "top",

                    fontSize,

                    fontFamily:
                      "Helvetica",

                    fill:
                      "rgba(0, 0, 0, 0)",

                    opacity: 1,

                    padding: 0,

                    angle,
                  }
                );

              pdfTextMaskColors.current.set(
                text,
                maskColor
              );

              pdfTextBounds.current.set(
                text,
                {
                  left: textX,
                  top: textTop,
                  width: textWidth,
                  height:
                    fontSize * 1.15,
                  angle,
                }
              );

              fCanvas.add(text);
            }
          );

          fCanvas.requestRenderAll();
        }
      }, 300);
    } catch (error) {
      console.error(
        "PDF parsing error:",
        error
      );

      alert(
        "Failed to parse PDF file. Please try another file."
      );
    }

    e.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE UPLOAD
  |--------------------------------------------------------------------------
  */

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file || !activeCanvas) return;

    const reader =
      new FileReader();

    reader.onload = (event) => {
      const imgObj =
        new Image();

      imgObj.src =
        event.target?.result as string;

      imgObj.onload = () => {
        const image =
          new fabric.Image(
            imgObj,
            {
              left: 150,
              top: 150,

              cornerColor:
                "#2563eb",

              cornerStyle:
                "circle",
            }
          );

        image.scaleToWidth(250);

        activeCanvas.add(image);

        activeCanvas.setActiveObject(
          image
        );

        activeCanvas.renderAll();
      };
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | ADD TEXT
  |--------------------------------------------------------------------------
  */

  const addTextBox = () => {
    if (!activeCanvas) return;

    const text =
      new fabric.IText(
        "Your Text Here",
        {
          left: 150,
          top: 150,

          fontSize: 24,

          fontFamily:
            "Helvetica",

          fill: "#1e293b",

          padding: 6,

          cornerColor:
            "#2563eb",

          cornerStyle:
            "circle",

          cornerSize: 10,

          transparentCorners:
            false,
        }
      );

    activeCanvas.add(text);

    activeCanvas.setActiveObject(
      text
    );

    activeCanvas.renderAll();
  };

  /*
  |--------------------------------------------------------------------------
  | ADD SHAPE
  |--------------------------------------------------------------------------
  */

  const addShape = (
    shapeType:
      | "rect"
      | "circle"
      | "line"
  ) => {
    if (!activeCanvas) return;

    let shape: fabric.Object;

    if (shapeType === "rect") {
      shape =
        new fabric.Rect({
          left: 150,
          top: 150,

          fill: "#2563eb",

          width: 120,
          height: 120,

          rx: 8,
          ry: 8,

          cornerColor:
            "#1d4ed8",
        });
    } else if (
      shapeType === "circle"
    ) {
      shape =
        new fabric.Circle({
          left: 150,
          top: 150,

          fill: "#0ea5e9",

          radius: 60,

          cornerColor:
            "#2563eb",
        });
    } else {
      shape =
        new fabric.Line(
          [50, 100, 250, 100],
          {
            stroke: "#2563eb",

            strokeWidth: 4,

            cornerColor:
              "#2563eb",
          }
        );
    }

    activeCanvas.add(shape);

    activeCanvas.setActiveObject(
      shape
    );

    activeCanvas.renderAll();
  };

  /*
  |--------------------------------------------------------------------------
  | DUPLICATE OBJECT
  |--------------------------------------------------------------------------
  */

  const duplicateObject =
    async () => {
      if (
        !activeCanvas ||
        !selectedObject
      ) {
        return;
      }

      const cloned =
        await selectedObject.clone();

      activeCanvas.discardActiveObject();

      cloned.set({
        left:
          (cloned.left || 0) +
          20,

        top:
          (cloned.top || 0) +
          20,

        evented: true,
      });

      activeCanvas.add(
        cloned
      );

      activeCanvas.setActiveObject(
        cloned
      );

      activeCanvas.requestRenderAll();
    };

  /*
  |--------------------------------------------------------------------------
  | DELETE OBJECT
  |--------------------------------------------------------------------------
  */

  const deleteObject = () => {
    if (
      !activeCanvas ||
      !selectedObject
    ) {
      return;
    }

    activeCanvas.remove(
      selectedObject
    );

    activeCanvas.discardActiveObject();

    setSelectedObject(null);

    activeCanvas.renderAll();
  };

  /*
  |--------------------------------------------------------------------------
  | LOCK / UNLOCK
  |--------------------------------------------------------------------------
  */

  const toggleLock = () => {
    if (
      !selectedObject ||
      !activeCanvas
    ) {
      return;
    }

    const isLocked =
      !selectedObject.lockMovementX;

    selectedObject.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,

      lockRotation: isLocked,

      lockScalingX: isLocked,
      lockScalingY: isLocked,

      hasControls: !isLocked,
    });

    activeCanvas.renderAll();

    setSelectedObject(
      selectedObject
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ROTATE
  |--------------------------------------------------------------------------
  */

  const rotateObject = () => {
    if (
      !selectedObject ||
      !activeCanvas
    ) {
      return;
    }

    selectedObject.rotate(
      (selectedObject.angle || 0) +
        45
    );

    activeCanvas.renderAll();

    updateFloatingMenuPosition(
      activeCanvas,
      selectedObject
    );
  };

  /*
  |--------------------------------------------------------------------------
  | TEXT / OBJECT STYLE
  |--------------------------------------------------------------------------
  */

  const applyTextStyle = (
    key: string,
    value:
      | string
      | number
      | boolean
  ) => {
    if (
      !activeCanvas ||
      !selectedObject
    ) {
      return;
    }

    selectedObject.set(
      key as keyof fabric.Object,
      value
    );

    activeCanvas.renderAll();
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE PDF
  |--------------------------------------------------------------------------
  */

  const createPdfBlob = () => {
    if (!pages.length) {
      return null;
    }

    const firstPage =
      pages[0];

    const doc =
      new jsPDF({
        orientation:
          firstPage.width >
          firstPage.height
            ? "landscape"
            : "portrait",

        unit: "pt",

        format: [
          firstPage.width,
          firstPage.height,
        ],
      });

    pages.forEach(
      (page, index) => {
        const canvas =
          fabricCanvases.current[
            page.id
          ];

        if (!canvas) return;

        const imgData =
          canvas.toDataURL({
            format: "png",
            multiplier: 4,
          });

        const orientation =
          page.width >
          page.height
            ? "landscape"
            : "portrait";

        if (index > 0) {
          doc.addPage(
            [
              page.width,
              page.height,
            ],
            orientation
          );
        }

        doc.addImage(
          imgData,
          "PNG",
          0,
          0,
          page.width,
          page.height
        );
      }
    );

    return doc.output("blob");
  };

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const runExport =
    async () => {
      const firstCanvas =
        pages[0] &&
        fabricCanvases.current[
          pages[0].id
        ];

      if (!firstCanvas) return;

      const isPdf =
        exportFormat === "pdf";

      const mime =
        exportFormat === "png"
          ? "image/png"
          : "image/jpeg";

      const extension =
        exportFormat;

      const blob = isPdf
        ? createPdfBlob()
        : await new Promise<Blob | null>(
            (resolve) => {
              firstCanvas.lowerCanvasEl.toBlob(
                resolve,
                mime,
                0.98
              );
            }
          );

      if (!blob) return;

      const url =
        URL.createObjectURL(
          blob
        );

      const filename =
        `utilai-edited-document.${extension}`;

      try {
        if (
          exportAction ===
          "download"
        ) {
          const link =
            document.createElement(
              "a"
            );

          link.href = url;
          link.download =
            filename;

          document.body.appendChild(
            link
          );

          link.click();

          link.remove();
        } else if (
          exportAction ===
          "preview"
        ) {
          window.open(
            url,
            "_blank",
            "noopener,noreferrer"
          );
        } else if (
          exportAction === "print"
        ) {
          const printWindow =
            window.open(
              url,
              "_blank",
              "noopener,noreferrer"
            );

          if (printWindow) {
            printWindow.addEventListener(
              "load",
              () => {
                printWindow.print();
              }
            );
          }
        } else if (
          navigator.share
        ) {
          await navigator.share({
            title:
              "Edited PDF document",

            files: [
              new File(
                [blob],
                filename,
                {
                  type:
                    blob.type,
                }
              ),
            ],
          });
        } else {
          alert(
            "Sharing is not supported by this browser."
          );
        }
      } catch (error) {
        console.error(
          "Export error:",
          error
        );
      }

      window.setTimeout(
        () => {
          URL.revokeObjectURL(
            url
          );
        },
        1000
      );

      setIsExportOpen(false);

      setIsExportConfirmed(
        false
      );
    };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="utilai-pdf-editor flex h-screen w-full flex-col overflow-hidden bg-[#f4f8ff] font-sans text-slate-900 select-none">

      {/* ============================================================
          TOP BAR
      ============================================================ */}

      <header className="pdf-editor-topbar z-30 flex h-16 shrink-0 items-center justify-between border-b border-blue-100 bg-white px-4 shadow-sm md:px-5">

        {/* BRAND */}

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-blue-200">
              U
            </div>

            <div>
              <div className="text-base font-extrabold leading-none text-[#12366b]">
                UtilAI
              </div>

              <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                PDF Editor
              </div>
            </div>

          </div>

          {hasDocument && (
            <>
              <div className="mx-1 hidden h-7 w-px bg-slate-200 md:block" />

              <span className="hidden text-xs font-semibold text-slate-500 md:block">
                Document Editor
              </span>
            </>
          )}

        </div>

        {/* DESKTOP CONTEXT TOOLBAR */}

        {hasDocument && (
          <div className="pdf-editor-context-tools hidden items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm lg:flex">

            {/* FONT */}

            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(
                  e.target.value
                );

                applyTextStyle(
                  "fontFamily",
                  e.target.value
                );
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="Helvetica">
                Helvetica
              </option>

              <option value="Arial">
                Arial
              </option>

              <option value="Times New Roman">
                Times New Roman
              </option>

              <option value="Courier">
                Courier
              </option>

              <option value="Impact">
                Impact
              </option>
            </select>

            <div className="mx-1 h-5 w-px bg-slate-200" />

            {/* FONT SIZE */}

            <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50">

              <button
                onClick={() => {
                  const newSize =
                    Math.max(
                      8,
                      fontSize - 2
                    );

                  setFontSize(
                    newSize
                  );

                  applyTextStyle(
                    "fontSize",
                    newSize
                  );
                }}
                className="flex h-7 w-7 items-center justify-center font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                -
              </button>

              <span className="flex w-8 items-center justify-center text-xs font-bold text-slate-700">
                {fontSize}
              </span>

              <button
                onClick={() => {
                  const newSize =
                    fontSize + 2;

                  setFontSize(
                    newSize
                  );

                  applyTextStyle(
                    "fontSize",
                    newSize
                  );
                }}
                className="flex h-7 w-7 items-center justify-center font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                +
              </button>

            </div>

            <div className="mx-1 h-5 w-px bg-slate-200" />

            {/* TEXT COLOR */}

            <label
              className="relative cursor-pointer rounded-lg p-1.5 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />

              <input
                type="color"
                value={textColor}
                onChange={(e) => {
                  setTextColor(
                    e.target.value
                  );

                  applyTextStyle(
                    "fill",
                    e.target.value
                  );
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>

            {/* HIGHLIGHT */}

            <label
              className="relative cursor-pointer rounded-lg p-1.5 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              title="Highlight Color"
            >
              <Highlighter className="h-4 w-4" />

              <input
                type="color"
                value={bgColor}
                onChange={(e) => {
                  setBgColor(
                    e.target.value
                  );

                  applyTextStyle(
                    "textBackgroundColor",
                    e.target.value
                  );
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>

            <div className="mx-1 h-5 w-px bg-slate-200" />

            {/* ALIGN */}

            <button
              onClick={() =>
                applyTextStyle(
                  "textAlign",
                  "left"
                )
              }
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                applyTextStyle(
                  "textAlign",
                  "center"
                )
              }
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                applyTextStyle(
                  "textAlign",
                  "right"
                )
              }
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </button>

            <div className="mx-1 h-5 w-px bg-slate-200" />

            {/* BOLD */}

            <button
              onClick={() => {
                setIsBold(
                  !isBold
                );

                applyTextStyle(
                  "fontWeight",
                  !isBold
                    ? "bold"
                    : "normal"
                );
              }}
              className={`rounded-lg p-1.5 ${
                isBold
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>

            {/* ITALIC */}

            <button
              onClick={() => {
                setIsItalic(
                  !isItalic
                );

                applyTextStyle(
                  "fontStyle",
                  !isItalic
                    ? "italic"
                    : "normal"
                );
              }}
              className={`rounded-lg p-1.5 ${
                isItalic
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>

            {/* UNDERLINE */}

            <button
              onClick={() => {
                setIsUnderline(
                  !isUnderline
                );

                applyTextStyle(
                  "underline",
                  !isUnderline
                );
              }}
              className={`rounded-lg p-1.5 ${
                isUnderline
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* EXPORT */}

        {hasDocument && (
          <button
            onClick={() => {
              setIsExportConfirmed(
                false
              );

              setIsExportOpen(
                true
              );
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600"
          >
            <Download className="h-4 w-4" />

            <span className="hidden sm:inline">
              Export
            </span>
          </button>
        )}

      </header>

      {/* ============================================================
          BODY
      ============================================================ */}

      <div className="pdf-editor-body relative flex flex-1 flex-col overflow-hidden md:flex-row">

        {/* ==========================================================
            LEFT ICON SIDEBAR
        ========================================================== */}

        <aside className="pdf-editor-sidebar z-20 flex w-full shrink-0 flex-row items-center justify-center gap-2 border-b border-slate-200 bg-white px-3 py-2 shadow-sm md:w-20 md:flex-col md:justify-start md:gap-3 md:border-b-0 md:border-r md:px-2 md:py-5">

          {/* UPLOADS */}

          <button
            onClick={() =>
              setActiveTab(
                "uploads"
              )
            }
            className={`flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold transition-all ${
              activeTab ===
              "uploads"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Upload className="h-5 w-5" />

            <span>
              Uploads
            </span>
          </button>

          {/* TEXT */}

          <button
            onClick={() =>
              setActiveTab(
                "text"
              )
            }
            className={`flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold transition-all ${
              activeTab ===
              "text"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Type className="h-5 w-5" />

            <span>
              Text
            </span>
          </button>

          {/* ELEMENTS */}

          <button
            onClick={() =>
              setActiveTab(
                "elements"
              )
            }
            className={`flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold transition-all ${
              activeTab ===
              "elements"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Square className="h-5 w-5" />

            <span>
              Elements
            </span>
          </button>

        </aside>

        {/* ==========================================================
            EXTENDED PANEL
        ========================================================== */}

        <div className="pdf-editor-panel z-10 w-full shrink-0 overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-sm md:w-72 md:border-b-0 md:border-r md:p-5">

          {/* ========================================================
              UPLOADS
          ======================================================== */}

          {activeTab ===
            "uploads" && (
            <div className="flex flex-col gap-4">

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#12366b]">
                  Import Document
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Start editing your PDF
                </p>
              </div>

              {/* PDF */}

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100">

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:scale-105">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>

                <span className="text-sm font-bold text-[#12366b]">
                  Upload PDF File
                </span>

                <span className="mt-1 text-[11px] leading-5 text-slate-500">
                  Edit, add text and customize your PDF
                </span>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={
                    handlePdfUpload
                  }
                  className="hidden"
                />
              </label>

              {/* BLANK */}

              <button
                onClick={
                  startBlankProject
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <FilePlus className="h-4 w-4" />

                Start Blank Canvas
              </button>

              <div className="my-1 h-px bg-slate-100" />

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#12366b]">
                  Add Media
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Add images to your document
                </p>
              </div>

              {/* IMAGE */}

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-blue-200 hover:bg-blue-50">

                <ImageIcon className="mb-2 h-7 w-7 text-blue-500 transition group-hover:scale-105" />

                <span className="text-xs font-bold text-slate-700">
                  Upload Image
                </span>

                <span className="mt-1 text-[10px] text-slate-400">
                  JPG, PNG, WEBP
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />
              </label>

            </div>
          )}

          {/* ========================================================
              TEXT
          ======================================================== */}

          {activeTab ===
            "text" && (
            <div className="flex flex-col gap-4">

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#12366b]">
                  Add Text
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Add editable text to your PDF
                </p>
              </div>

              <button
                onClick={
                  addTextBox
                }
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3.5 text-xs font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>

                Add Text Layer
              </button>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="mb-3 flex items-center gap-2">
                  <Type className="h-4 w-4 text-blue-600" />

                  <span className="text-xs font-bold text-slate-700">
                    Text Editing
                  </span>
                </div>

                <p className="text-[11px] leading-5 text-slate-500">
                  Select a text object on the page to edit its font, size, color, alignment and style.
                </p>

              </div>

            </div>
          )}

          {/* ========================================================
              ELEMENTS
          ======================================================== */}

          {activeTab ===
            "elements" && (
            <div className="flex flex-col gap-4">

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#12366b]">
                  Elements
                </h3>

                <p className="mt-1 text-[11px] text-slate-400">
                  Add shapes and dividers
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">

                {/* RECTANGLE */}

                <button
                  onClick={() =>
                    addShape(
                      "rect"
                    )
                  }
                  className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Square className="h-6 w-6 text-blue-600 transition group-hover:scale-110" />

                  Rectangle
                </button>

                {/* CIRCLE */}

                <button
                  onClick={() =>
                    addShape(
                      "circle"
                    )
                  }
                  className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  <Circle className="h-6 w-6 text-cyan-500 transition group-hover:scale-110" />

                  Circle
                </button>

                {/* LINE */}

                <button
                  onClick={() =>
                    addShape(
                      "line"
                    )
                  }
                  className="group col-span-2 flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <ArrowRight className="h-6 w-6 text-blue-500 transition group-hover:translate-x-1" />

                  Line / Divider
                </button>

              </div>

            </div>
          )}

        </div>

        {/* ==========================================================
            WORKSPACE
        ========================================================== */}

        <main className="pdf-editor-workspace relative flex flex-1 flex-col items-center gap-8 overflow-y-auto bg-gradient-to-br from-[#eef6ff] via-[#f8fbff] to-[#e5f3ff] p-5 md:p-8">

          {!hasDocument ? (
            /* ========================================================
               EMPTY STATE
            ======================================================== */

            <div className="my-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,47,102,0.12)]">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <Upload className="h-8 w-8" />
              </div>

              <h2 className="mb-2 text-xl font-extrabold text-[#12366b]">
                No Document Loaded
              </h2>

              <p className="mb-6 text-sm leading-6 text-slate-500">
                Upload a PDF document or start with a blank canvas to begin editing.
              </p>

              <label className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600">

                Upload PDF Document

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={
                    handlePdfUpload
                  }
                  className="hidden"
                />

              </label>

              <button
                onClick={
                  startBlankProject
                }
                className="mt-3 rounded-xl px-6 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
              >
                Or start with a blank canvas
              </button>

            </div>
          ) : (
            <>
              {/* ====================================================
                  PAGES
              ==================================================== */}

              {pages.map(
                (
                  page,
                  index
                ) => (
                  <div
                    key={page.id}
                    className="flex max-w-full flex-col items-center gap-2"
                  >

                    <div className="self-start text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                      Page{" "}
                      {index + 1}
                    </div>

                    <div className="canvas-container relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,47,102,0.14)]">

                      <canvas
                        ref={(el) => {
                          canvasRefs.current[
                            page.id
                          ] = el;
                        }}
                      />

                    </div>

                  </div>
                )
              )}

              {/* ====================================================
                  ADD PAGE
              ==================================================== */}

              <button
                onClick={
                  addNewPage
                }
                className="my-4 flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-xs font-bold text-blue-700 shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />

                Add Page
              </button>

            </>
          )}

        </main>

        {/* ==========================================================
            FLOATING OBJECT TOOLBAR
        ========================================================== */}

        {selectedObject &&
          floatingMenuPos &&
          isFloatingToolbarVisible && (
            <div
              onMouseEnter={() =>
                setIsFloatingToolbarVisible(
                  true
                )
              }
              onMouseLeave={() =>
                setIsFloatingToolbarVisible(
                  false
                )
              }
              style={{
                position:
                  "fixed",

                top: `${floatingMenuPos.top}px`,

                left: `${floatingMenuPos.left}px`,

                transform:
                  "translateX(-50%)",
              }}
              className="z-50 flex items-center gap-1 rounded-2xl border border-blue-400/20 bg-[#12366b] px-3 py-2 text-white shadow-2xl"
            >

              {/* MOVE */}

              <button
                className="rounded-lg p-1.5 text-blue-100 transition hover:bg-blue-600 hover:text-white"
                title="Move Object"
              >
                <Move className="h-4 w-4" />
              </button>

              {/* DUPLICATE */}

              <button
                onClick={
                  duplicateObject
                }
                className="rounded-lg p-1.5 text-blue-100 transition hover:bg-blue-600 hover:text-white"
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>

              {/* ROTATE */}

              <button
                onClick={
                  rotateObject
                }
                className="rounded-lg p-1.5 text-blue-100 transition hover:bg-blue-600 hover:text-white"
                title="Rotate 45°"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              {/* LOCK */}

              <button
                onClick={
                  toggleLock
                }
                className="rounded-lg p-1.5 text-blue-100 transition hover:bg-blue-600 hover:text-white"
                title="Lock / Unlock"
              >
                {selectedObject.lockMovementX ? (
                  <Lock className="h-4 w-4 text-amber-300" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </button>

              <div className="mx-1 h-5 w-px bg-white/20" />

              {/* DELETE */}

              <button
                onClick={
                  deleteObject
                }
                className="rounded-lg p-1.5 text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            </div>
          )}

      </div>

      {/* ============================================================
          EXPORT MODAL
      ============================================================ */}

      {isExportOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-100 p-6">

              <div>

                <div className="mb-2 inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                  Export
                </div>

                <h2 className="text-xl font-extrabold text-[#12366b]">
                  Export document
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Choose a format and operation before processing.
                </p>

              </div>

              <button
                onClick={() =>
                  setIsExportOpen(
                    false
                  )
                }
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close export dialog"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="p-6">

              {/* FORMAT */}

              <div>

                <div className="mb-2 text-xs font-bold text-slate-700">
                  File format
                </div>

                <div className="grid grid-cols-3 gap-2">

                  {(
                    [
                      "pdf",
                      "png",
                      "jpg",
                    ] as const
                  ).map(
                    (
                      format
                    ) => (
                      <button
                        key={
                          format
                        }
                        onClick={() =>
                          setExportFormat(
                            format
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-extrabold uppercase transition ${
                          exportFormat ===
                          format
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                        }`}
                      >
                        {format}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* ACTION */}

              <div className="mt-5">

                <div className="mb-2 text-xs font-bold text-slate-700">
                  Operation
                </div>

                <div className="grid grid-cols-2 gap-2">

                  {(
                    [
                      "download",
                      "print",
                      "share",
                      "preview",
                    ] as const
                  ).map(
                    (
                      action
                    ) => (
                      <button
                        key={
                          action
                        }
                        onClick={() =>
                          setExportAction(
                            action
                          )
                        }
                        className={`rounded-xl border px-3 py-3 text-xs font-bold capitalize transition ${
                          exportAction ===
                          action
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                        }`}
                      >
                        {action}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* CONFIRM */}

              <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">

                <label
                  htmlFor="export-confirm"
                  className="mb-3 block text-sm font-bold text-[#12366b]"
                >
                  Slide to process this file
                </label>

                <input
                  id="export-confirm"
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="0"
                  onChange={(
                    event
                  ) =>
                    setIsExportConfirmed(
                      Number(
                        event.target
                          .value
                      ) === 100
                    )
                  }
                  className="w-full accent-blue-600"
                />

                <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">

                  <ArrowRightCircle className="h-4 w-4 text-blue-600" />

                  Slide fully right to continue

                </div>

              </div>

              {/* PROCESS */}

              <button
                onClick={
                  runExport
                }
                disabled={
                  !isExportConfirmed
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <Download className="h-4 w-4" />

                Process{" "}
                {exportAction}{" "}
                as{" "}
                {exportFormat.toUpperCase()}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}