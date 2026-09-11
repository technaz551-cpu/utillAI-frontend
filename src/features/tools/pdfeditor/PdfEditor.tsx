

import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
// import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
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
  Star,
  Layers,
  FilePlus,
  Eye,
  Sliders,
  Highlighter
} from 'lucide-react';

// Setting up pdfjs worker using CDN fallback to fix render issues
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;


// 1. Updated Import

// 2. Updated Worker setup
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export default function CanvaPdfEditor() {
  const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'export'>('uploads');
  const [pages, setPages] = useState<{ id: string }[]>([]);
  const [hasDocument, setHasDocument] = useState<boolean>(false);
  
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const fabricCanvases = useRef<{ [key: string]: fabric.Canvas }>({});
  const [activeCanvas, setActiveCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

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

  // Initialize fabric canvas instance per page
  const initCanvas = (id: string) => {
    const el = canvasRefs.current[id];
    if (!el || fabricCanvases.current[id]) return;

    const canvas = new fabric.Canvas(el, {
      width: 794,   // Standard A4 width @ 96 DPI
      height: 1123, // Standard A4 height @ 96 DPI
      backgroundColor: '#ffffff',
      selectionColor: 'rgba(139, 92, 246, 0.15)',
      selectionBorderColor: '#8b5cf6',
      selectionLineWidth: 2,
    });

    let hoveredObject: fabric.Object | null = null;

    canvas.on('mouse:move', (e) => {
      if (e.target && e.target !== canvas.getActiveObject()) {
        if (hoveredObject !== e.target) {
          hoveredObject = e.target;
          hoveredObject.set({
            stroke: '#8b5cf6',
            strokeWidth: 2,
            strokeDashArray: [4, 4],
          });
          canvas.renderAll();
        }
      } else if (hoveredObject) {
        hoveredObject.set({ stroke: undefined, strokeDashArray: undefined });
        hoveredObject = null;
        canvas.renderAll();
      }
    });

    canvas.on('mouse:out', () => {
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
        updateFloatingMenuPosition(canvas, activeObj);

        setOpacity(activeObj.opacity || 1);

        if (activeObj.type === 'i-text' || activeObj.type === 'textbox') {
          const textObj = activeObj as fabric.IText;
          setFontFamily(textObj.fontFamily || 'Helvetica');
          setFontSize(textObj.fontSize || 20);
          setIsBold(textObj.fontWeight === 'bold');
          setIsItalic(textObj.fontStyle === 'italic');
          setIsUnderline(!!textObj.underline);
          setTextColor((textObj.fill as string) || '#1e293b');
          setBgColor((textObj.textBackgroundColor as string) || 'transparent');
        }
      } else {
        setSelectedObject(null);
        setFloatingMenuPos(null);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setFloatingMenuPos(null);
    });

    canvas.on('object:moving', () => updateFloatingMenuPosition(canvas, canvas.getActiveObject()));
    canvas.on('object:scaling', () => updateFloatingMenuPosition(canvas, canvas.getActiveObject()));

    fabricCanvases.current[id] = canvas;
    if (!activeCanvas) setActiveCanvas(canvas);
  };

  useEffect(() => {
    pages.forEach((p) => initCanvas(p.id));
  }, [pages]);

  // Floating Context Menu Position Calculator
  const updateFloatingMenuPosition = (canvas: fabric.Canvas, obj: fabric.Object | null | undefined) => {
    if (!obj || !canvas.upperCanvasEl) return;
    const bound = obj.getBoundingRect();
    const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

    setFloatingMenuPos({
      top: canvasRect.top + bound.top - 58,
      left: canvasRect.left + bound.left + bound.width / 2,
    });
  };

  // Create Blank Canvas Project
  const startBlankProject = () => {
    setPages([{ id: 'page-1' }]);
    setHasDocument(true);
  };

  // Add Page dynamically
  const addNewPage = () => {
    const newId = `page-${pages.length + 1}`;
    setPages([...pages, { id: newId }]);
  };

  // PDF File Importer & Text Extractor
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pageList = Array.from({ length: pdf.numPages }, (_, i) => ({
        id: `page-${i + 1}`,
      }));

      setPages(pageList);
      setHasDocument(true);

      setTimeout(async () => {
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const tempCanvas = document.createElement('canvas');
          const context = tempCanvas.getContext('2d')!;
          tempCanvas.height = viewport.height;
          tempCanvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;

          const imgData = tempCanvas.toDataURL('image/png');
          const fCanvas = fabricCanvases.current[`page-${i}`];

          if (fCanvas) {
            fabric.Image.fromURL(imgData, (img) => {
              fCanvas.setBackgroundImage(img, fCanvas.renderAll.bind(fCanvas), {
                scaleX: fCanvas.width! / img.width!,
                scaleY: fCanvas.height! / img.height!,
              });
            });

            const textContent = await page.getTextContent();
            textContent.items.forEach((item: any) => {
              if ('str' in item && item.str.trim().length > 0) {
                const tx = new fabric.IText(item.str, {
                  left: item.transform[4] * 0.8,
                  top: fCanvas.height! - item.transform[5] * 0.8,
                  fontSize: Math.abs(item.transform[0]) || 14,
                  fill: '#000000',
                  fontFamily: 'Helvetica',
                });
                fCanvas.add(tx);
              }
            });
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
      padding: 6,
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
  const duplicateObject = () => {
    if (!activeCanvas || !selectedObject) return;
    selectedObject.clone((cloned: fabric.Object) => {
      activeCanvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      });
      activeCanvas.add(cloned);
      activeCanvas.setActiveObject(cloned);
      activeCanvas.requestRenderAll();
    });
  };

  const deleteObject = () => {
    if (!activeCanvas || !selectedObject) return;
    activeCanvas.remove(selectedObject);
    activeCanvas.discardActiveObject();
    activeCanvas.renderAll();
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
    setSelectedObject({ ...selectedObject });
  };

  const rotateObject = () => {
    if (!selectedObject || !activeCanvas) return;
    selectedObject.rotate((selectedObject.angle || 0) + 45);
    activeCanvas.renderAll();
  };

  const applyTextStyle = (key: string, value: any) => {
    if (!activeCanvas || !selectedObject) return;
    selectedObject.set(key as keyof fabric.Object, value);
    activeCanvas.renderAll();
  };

  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [794, 1123],
    });

    // const pageKeys = Object.keys(fabricCanvases);
    const pageKeys = Object.keys(fabricCanvases.current);   // ✅ .current add karo
    pageKeys.forEach((key, index) => {
      const canvas = fabricCanvases.current[key];
      const imgData = canvas.toDataURL({ format: 'png', multiplier: 2 });
      if (index > 0) doc.addPage([794, 1123], 'portrait');
      doc.addImage(imgData, 'PNG', 0, 0, 794, 1123);
    });

    doc.save('canva-edited-document.pdf');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 font-sans overflow-hidden select-none">
      {/* TOP CANVA TOOLBAR */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wide shadow-md shadow-purple-200">
            CanvaPDF
          </div>
          <span className="text-xs font-semibold text-slate-400 border-l pl-3 border-slate-200">
            Studio Editor
          </span>
        </div>

        {/* Dynamic Context Control Bar */}
        {hasDocument && (
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shadow-inner">
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
              className={`p-1 rounded ${isBold ? 'bg-purple-200 text-purple-800' : 'hover:bg-slate-200 text-slate-700'}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsItalic(!isItalic);
                applyTextStyle('fontStyle', !isItalic ? 'italic' : 'normal');
              }}
              className={`p-1 rounded ${isItalic ? 'bg-purple-200 text-purple-800' : 'hover:bg-slate-200 text-slate-700'}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsUnderline(!isUnderline);
                applyTextStyle('underline', !isUnderline);
              }}
              className={`p-1 rounded ${isUnderline ? 'bg-purple-200 text-purple-800' : 'hover:bg-slate-200 text-slate-700'}`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PDF Export Button */}
        {hasDocument && (
          <button
            onClick={exportToPdf}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        )}
      </header>

      {/* BODY CONTENT */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-20 bg-slate-900 flex flex-col items-center py-5 gap-6 text-slate-400 z-10 shadow-xl">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'uploads' ? 'text-purple-400' : ''}`}
          >
            <Upload className="w-5 h-5" /> Uploads
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'text' ? 'text-purple-400' : ''}`}
          >
            <Type className="w-5 h-5" /> Text
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'elements' ? 'text-purple-400' : ''}`}
          >
            <Square className="w-5 h-5" /> Elements
          </button>
        </aside>

        {/* SIDEBAR EXTENDED PANELS */}
        <div className="w-72 bg-white border-r border-slate-200 p-5 overflow-y-auto z-10 shadow-sm">
          {activeTab === 'uploads' && (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Import Document</h3>

              {/* PDF Import Card */}
              <label className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/60 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center shadow-sm">
                <Upload className="w-8 h-8 text-purple-600 mb-2 animate-bounce" />
                <span className="text-xs font-bold text-purple-900">Upload PDF File</span>
                <span className="text-[10px] text-purple-600 mt-1">Extract text & make pages canvas-ready</span>
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
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-sm"
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
                  <Square className="w-5 h-5 text-purple-600" /> Rectangle
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex flex-col items-center gap-1 text-slate-700 text-xs font-medium"
                >
                  <Circle className="w-5 h-5 text-pink-500" /> Circle
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
        <main className="flex-1 bg-slate-200 overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
          {!hasDocument ? (
            <div className="my-auto flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">No Document Loaded</h2>
              <p className="text-xs text-slate-500 mb-6">
                Please upload a PDF document from the left panel or start with a blank template canvas to begin editing.
              </p>
              <label className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-purple-200 transition">
                Upload PDF Document
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <>
              {pages.map((page, index) => (
                <div key={page.id} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-slate-400 self-start mb-1">
                    Page {index + 1}
                  </div>
                  <div className="bg-white shadow-2xl rounded-sm overflow-hidden relative border border-slate-300">
                    <canvas ref={(el) => (canvasRefs.current[page.id] = el)} />
                  </div>
                </div>
              ))}

              {/* CANVA ADD PAGE CONTROL */}
              <button
                onClick={addNewPage}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-full shadow-lg transition my-4 text-xs"
              >
                <Plus className="w-4 h-4 text-purple-600" /> Add Page
              </button>
            </>
          )}
        </main>

        {/* CANVA PURPLE FLOATING CONTEXT MENU (Shown on selecting objects) */}
        {selectedObject && floatingMenuPos && (
          <div
            style={{
              position: 'fixed',
              top: `${floatingMenuPos.top}px`,
              left: `${floatingMenuPos.left}px`,
              transform: 'translateX(-50%)',
            }}
            className="bg-purple-600 text-white rounded-full shadow-2xl flex items-center px-3 py-1.5 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 border border-purple-400"
          >
            {/* Move Control Indicator */}
            <button className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Move Object">
              <Move className="w-4 h-4" />
            </button>

            {/* Duplicate Button */}
            <button onClick={duplicateObject} className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>

            {/* Rotate Button */}
            <button onClick={rotateObject} className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Rotate 45°">
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Lock / Unlock */}
            <button onClick={toggleLock} className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Lock Position">
              {selectedObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4" />}
            </button>

            <div className="h-4 w-[1px] bg-purple-400 my-auto mx-1" />

            {/* Delete Button */}
            <button onClick={deleteObject} className="p-1.5 hover:bg-purple-800 rounded-full text-red-200 hover:text-red-100" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}





// import React, { useEffect, useRef, useState } from 'react';
// import * as fabric from 'fabric';
// import * as pdfjsLib from 'pdfjs-dist';
// import { jsPDF } from 'jspdf';
// import {
//   Type,
//   Image as ImageIcon,
//   Square,
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
//   FilePlus,
//   Highlighter
// } from 'lucide-react';

// // import * as pdfjsLib from 'pdfjs-dist';
// // src/features/tools/pdfeditor/PdfEditor.tsx
// // import * as pdfjsLib from 'pdfjs-dist';

// pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
// export default function CanvaPdfEditor() {
//   const [activeTab, setActiveTab] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'export'>('uploads');
//   const [pages, setPages] = useState<{ id: string }[]>([]);
//   const [hasDocument, setHasDocument] = useState<boolean>(false);

//   const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
//   const fabricCanvases = useRef<{ [key: string]: fabric.Canvas }>({});
//   const [activeCanvas, setActiveCanvas] = useState<fabric.Canvas | null>(null);
//   const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

//   const [floatingMenuPos, setFloatingMenuPos] = useState<{ top: number; left: number } | null>(null);

//   const [fontFamily, setFontFamily] = useState<string>('Helvetica');
//   const [fontSize, setFontSize] = useState<number>(20);
//   const [isBold, setIsBold] = useState<boolean>(false);
//   const [isItalic, setIsItalic] = useState<boolean>(false);
//   const [isUnderline, setIsUnderline] = useState<boolean>(false);
//   const [textColor, setTextColor] = useState<string>('#1e293b');
//   const [bgColor, setBgColor] = useState<string>('#ffffff');
//   const [opacity, setOpacity] = useState<number>(1);

//   const initCanvas = (id: string) => {
//     const el = canvasRefs.current[id];
//     if (!el || fabricCanvases.current[id]) return;

//     const canvas = new fabric.Canvas(el, {
//       width: 794,
//       height: 1123,
//       backgroundColor: '#ffffff',
//       selectionColor: 'rgba(139, 92, 246, 0.15)',
//       selectionBorderColor: '#8b5cf6',
//       selectionLineWidth: 2,
//     });

//     let hoveredObject: fabric.Object | null = null;

//     canvas.on('mouse:move', (e) => {
//       if (e.target && e.target !== canvas.getActiveObject()) {
//         if (hoveredObject !== e.target) {
//           hoveredObject = e.target;
//           hoveredObject.set({
//             stroke: '#8b5cf6',
//             strokeWidth: 2,
//             strokeDashArray: [4, 4],
//           });
//           canvas.renderAll();
//         }
//       } else if (hoveredObject) {
//         hoveredObject.set({ stroke: undefined, strokeDashArray: undefined });
//         hoveredObject = null;
//         canvas.renderAll();
//       }
//     });

//     canvas.on('mouse:out', () => {
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
//         updateFloatingMenuPosition(canvas, activeObj);

//         setOpacity(activeObj.opacity ?? 1);

//         if (activeObj.type === 'i-text' || activeObj.type === 'textbox') {
//           const textObj = activeObj as fabric.IText;
//           setFontFamily(textObj.fontFamily || 'Helvetica');
//           setFontSize(textObj.fontSize || 20);
//           setIsBold(textObj.fontWeight === 'bold');
//           setIsItalic(textObj.fontStyle === 'italic');
//           setIsUnderline(!!textObj.underline);
//           setTextColor((textObj.fill as string) || '#1e293b');
//           setBgColor((textObj.textBackgroundColor as string) || 'transparent');
//         }
//       } else {
//         setSelectedObject(null);
//         setFloatingMenuPos(null);
//       }
//     };

//     canvas.on('selection:created', handleSelection);
//     canvas.on('selection:updated', handleSelection);
//     canvas.on('selection:cleared', () => {
//       setSelectedObject(null);
//       setFloatingMenuPos(null);
//     });

//     canvas.on('object:moving', () => updateFloatingMenuPosition(canvas, canvas.getActiveObject()));
//     canvas.on('object:scaling', () => updateFloatingMenuPosition(canvas, canvas.getActiveObject()));

//     fabricCanvases.current[id] = canvas;
//     if (!activeCanvas) setActiveCanvas(canvas);
//   };

//   useEffect(() => {
//     pages.forEach((p) => initCanvas(p.id));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pages]);

//   const updateFloatingMenuPosition = (canvas: fabric.Canvas, obj: fabric.Object | null | undefined) => {
//     if (!obj || !canvas.upperCanvasEl) return;
//     const bound = obj.getBoundingRect();
//     const canvasRect = canvas.upperCanvasEl.getBoundingClientRect();

//     setFloatingMenuPos({
//       top: canvasRect.top + bound.top - 58,
//       left: canvasRect.left + bound.left + bound.width / 2,
//     });
//   };

//   const startBlankProject = () => {
//     setPages([{ id: 'page-1' }]);
//     setHasDocument(true);
//   };

//   const addNewPage = () => {
//     const newId = `page-${pages.length + 1}`;
//     setPages([...pages, { id: newId }]);
//   };

//   // PDF Importer — background image ONLY, no text extraction.
//   // (Text extraction/overlay was removed on purpose: pdf.js returns text
//   // in tiny fragments that never line up perfectly with the rendered
//   // background, which is what caused the garbled/overlapping text you saw.
//   // For real editing, use the Text tool to add your own text boxes, and
//   // cover old text with a rectangle first if you need to "replace" it.)
//   const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
//       const pdf = await loadingTask.promise;

//       const pageList = Array.from({ length: pdf.numPages }, (_, i) => ({
//         id: `page-${i + 1}`,
//       }));

//       setPages(pageList);
//       setHasDocument(true);

//       setTimeout(async () => {
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const fCanvas = fabricCanvases.current[`page-${i}`];
//           if (!fCanvas) continue;

//           const page = await pdf.getPage(i);
//           const viewport = page.getViewport({ scale: 1.5 });

//           const tempCanvas = document.createElement('canvas');
//           const context = tempCanvas.getContext('2d')!;
//           tempCanvas.height = viewport.height;
//           tempCanvas.width = viewport.width;

//           await page.render({ canvasContext: context, viewport }).promise;
//           const imgData = tempCanvas.toDataURL('image/png');

//           // v6: fromURL is a Promise, no callback
//           const img = await fabric.FabricImage.fromURL(imgData);
//           img.set({
//             scaleX: fCanvas.width! / img.width!,
//             scaleY: fCanvas.height! / img.height!,
//             selectable: false,
//             evented: false,
//           });
//           // v6: setBackgroundImage() was removed — assign directly
//           fCanvas.backgroundImage = img;
//           fCanvas.renderAll();
//         }
//       }, 300);
//     } catch (err) {
//       console.error('PDF parsing error:', err);
//       alert('Failed to parse PDF file. Please try another file.');
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !activeCanvas) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const imgObj = new window.Image();
//       imgObj.src = event.target?.result as string;
//       imgObj.onload = () => {
//         // v6: renamed to FabricImage (avoids clashing with window.Image)
//         const image = new fabric.FabricImage(imgObj, {
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
//     text.enterEditing();
//     text.selectAll();
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

//   // v6: clone() is async now — no more callback signature
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
//     setSelectedObject({ ...selectedObject } as fabric.Object);
//   };

//   // v6-safe rotate: set + setCoords instead of the old .rotate() helper
//   const rotateObject = () => {
//     if (!selectedObject || !activeCanvas) return;
//     selectedObject.set('angle', (selectedObject.angle || 0) + 45);
//     selectedObject.setCoords();
//     activeCanvas.renderAll();
//   };

//   const applyTextStyle = (key: string, value: any) => {
//     if (!activeCanvas || !selectedObject) return;
//     selectedObject.set(key as keyof fabric.Object, value);
//     activeCanvas.renderAll();
//   };

//   const exportToPdf = () => {
//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'px',
//       format: [794, 1123],
//     });

//     const pageKeys = Object.keys(fabricCanvases.current);
//     pageKeys.forEach((key, index) => {
//       const canvas = fabricCanvases.current[key];
//       if (!canvas) return;
//       const imgData = canvas.toDataURL({ format: 'png', multiplier: 2 });
//       if (index > 0) doc.addPage([794, 1123], 'portrait');
//       doc.addImage(imgData, 'PNG', 0, 0, 794, 1123);
//     });

//     doc.save('canva-edited-document.pdf');
//   };

//   return (
//     <div className="flex flex-col h-screen w-screen bg-slate-100 font-sans overflow-hidden select-none">
//       <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black px-3 py-1.5 rounded-xl text-lg tracking-wide shadow-md shadow-purple-200">
//             CanvaPDF
//           </div>
//           <span className="text-xs font-semibold text-slate-400 border-l pl-3 border-slate-200">
//             Studio Editor
//           </span>
//         </div>

//         {hasDocument && (
//           <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shadow-inner">
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

//             <button
//               onClick={() => {
//                 setIsBold(!isBold);
//                 applyTextStyle('fontWeight', !isBold ? 'bold' : 'normal');
//               }}
//               className={`p-1 rounded ${isBold ? 'bg-purple-200 text-purple-800' : 'hover:bg-slate-200 text-slate-700'}`}
//             >
//               <Bold className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 setIsItalic(!isItalic);
//                 applyTextStyle('fontStyle', !isItalic ? 'italic' : 'normal');
//               }}
//               className={`p-1 rounded ${isItalic ? 'bg-purple-200 text-purple-800' : 'hover:bg-slate-200 text-slate-700'}`}
//             >
//               <Italic className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => {
//                 setIsUnderline(!isUnderline);
//                 applyTextStyle('underline', !isUnderline);
//               }}
//               className={`p-1 rounded ${isUnderline ? 'bg-purple-200 text-purple-800' : 'hover:bg-slate-200 text-slate-700'}`}
//             >
//               <Underline className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         {hasDocument && (
//           <button
//             onClick={exportToPdf}
//             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition"
//           >
//             <Download className="w-4 h-4" /> Export PDF
//           </button>
//         )}
//       </header>

//       <div className="flex flex-1 overflow-hidden relative">
//         <aside className="w-20 bg-slate-900 flex flex-col items-center py-5 gap-6 text-slate-400 z-10 shadow-xl">
//           <button
//             onClick={() => setActiveTab('uploads')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'uploads' ? 'text-purple-400' : ''}`}
//           >
//             <Upload className="w-5 h-5" /> Uploads
//           </button>
//           <button
//             onClick={() => setActiveTab('text')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'text' ? 'text-purple-400' : ''}`}
//           >
//             <Type className="w-5 h-5" /> Text
//           </button>
//           <button
//             onClick={() => setActiveTab('elements')}
//             className={`flex flex-col items-center gap-1 text-[11px] font-semibold hover:text-white transition ${activeTab === 'elements' ? 'text-purple-400' : ''}`}
//           >
//             <Square className="w-5 h-5" /> Elements
//           </button>
//         </aside>

//         <div className="w-72 bg-white border-r border-slate-200 p-5 overflow-y-auto z-10 shadow-sm">
//           {activeTab === 'uploads' && (
//             <div className="flex flex-col gap-4">
//               <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Import Document</h3>

//               <label className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/60 p-5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-center shadow-sm">
//                 <Upload className="w-8 h-8 text-purple-600 mb-2 animate-bounce" />
//                 <span className="text-xs font-bold text-purple-900">Upload PDF File</span>
//                 <span className="text-[10px] text-purple-600 mt-1">Rendered as a background — add your own text/shapes on top</span>
//                 <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
//               </label>

//               <button
//                 onClick={startBlankProject}
//                 className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
//               >
//                 <FilePlus className="w-4 h-4 text-slate-500" /> Start Blank Canvas
//               </button>

//               <div className="h-[1px] bg-slate-100 my-1" />

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
//                 className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs transition shadow-sm"
//               >
//                 <Plus className="w-4 h-4" /> Add Text Layer
//               </button>
//               <p className="text-[11px] text-slate-500 leading-5">
//                 Tip: to "replace" existing PDF text, first cover it with a rectangle
//                 (matching the page color) from the Elements tab, then add a text
//                 box on top with your new text.
//               </p>
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
//                   <Square className="w-5 h-5 text-purple-600" /> Rectangle
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

//         <main className="flex-1 bg-slate-200 overflow-y-auto p-8 flex flex-col items-center gap-8 relative">
//           {!hasDocument ? (
//             <div className="my-auto flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200 max-w-md">
//               <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
//                 <Upload className="w-8 h-8" />
//               </div>
//               <h2 className="text-xl font-bold text-slate-800 mb-2">No Document Loaded</h2>
//               <p className="text-xs text-slate-500 mb-6">
//                 Please upload a PDF document from the left panel or start with a blank template canvas to begin editing.
//               </p>
//               <label className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-purple-200 transition">
//                 Upload PDF Document
//                 <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
//               </label>
//             </div>
//           ) : (
//             <>
//               {pages.map((page, index) => (
//                 <div key={page.id} className="flex flex-col items-center gap-2">
//                   <div className="text-xs font-bold text-slate-400 self-start mb-1">
//                     Page {index + 1}
//                   </div>
//                   <div className="bg-white shadow-2xl rounded-sm overflow-hidden relative border border-slate-300">
//                     <canvas ref={(el) => { canvasRefs.current[page.id] = el; }} />
//                   </div>
//                 </div>
//               ))}

//               <button
//                 onClick={addNewPage}
//                 className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-full shadow-lg transition my-4 text-xs"
//               >
//                 <Plus className="w-4 h-4 text-purple-600" /> Add Page
//               </button>
//             </>
//           )}
//         </main>

//         {selectedObject && floatingMenuPos && (
//           <div
//             style={{
//               position: 'fixed',
//               top: `${floatingMenuPos.top}px`,
//               left: `${floatingMenuPos.left}px`,
//               transform: 'translateX(-50%)',
//             }}
//             className="bg-purple-600 text-white rounded-full shadow-2xl flex items-center px-3 py-1.5 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150 border border-purple-400"
//           >
//             <button className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Move Object">
//               <Move className="w-4 h-4" />
//             </button>

//             <button onClick={duplicateObject} className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Duplicate">
//               <Copy className="w-4 h-4" />
//             </button>

//             <button onClick={rotateObject} className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Rotate 45°">
//               <RotateCw className="w-4 h-4" />
//             </button>

//             <button onClick={toggleLock} className="p-1.5 hover:bg-purple-700 rounded-full text-purple-100 hover:text-white" title="Lock Position">
//               {selectedObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-300" /> : <Unlock className="w-4 h-4" />}
//             </button>

//             <div className="h-4 w-[1px] bg-purple-400 my-auto mx-1" />

//             <button onClick={deleteObject} className="p-1.5 hover:bg-purple-800 rounded-full text-red-200 hover:text-red-100" title="Delete">
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }