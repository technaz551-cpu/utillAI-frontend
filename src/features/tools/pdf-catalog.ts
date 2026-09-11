import type { ToolMeta } from "@/features/tools/client-processors";

export const PDF_TOOL_SLUGS = new Set([
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "pdf-editor",
]);

const howTo = (action: string, extra: string[] = []): string[] => [
  "Drop files or click to upload — nothing is sent to a server",
  action,
  "Click Process and wait for the result",
  "Download the file to your device",
  ...extra,
];

const privacyFaq = {
  question: "Is my file uploaded to a server?",
  answer: "No. PDF tools run entirely in your browser. Files never leave your device.",
};

export const PDF_TOOLS: ToolMeta[] = [
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    name: "Merge & Split PDF",
    category_slug: "pdf",
    processing_type: "client",
    short_description: "Merge multiple PDFs into one document, or split a PDF into separate pages.",
    long_description: "Upload PDFs in your browser, then choose Merge or Split. Reorder files before combining, or extract every page into its own file — nothing is uploaded.",
    how_to_use: howTo("Upload one or more PDFs, then choose Merge or Split."),
    features: [
      "Merge unlimited files (browser memory permitting)",
      "Reorder before merging",
      "Split into one PDF per page",
      "Private — processed locally",
    ],
    faq: [
      privacyFaq,
      { question: "Do I merge or split after uploading?", answer: "After you add PDF files, choose Merge or Split, then click Process." },
      { question: "What do I get after splitting?", answer: "A ZIP archive with one PDF file per page, or a single PDF if there is only one page." },
    ],
    related_tools: ["pdf-editor", "compress-pdf"],
    seo_title: "Merge & Split PDF — Combine or Extract Pages Online",
    meta_description: "Merge PDF files or split a PDF into pages in your browser. Free, no signup, files stay on your device.",
    accepted_formats: ["pdf"],
  },
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    name: "Compress PDF",
    category_slug: "pdf",
    processing_type: "client",
    short_description: "Reduce PDF file size while preserving readability.",
    long_description: "Optimize PDF structure and object streams to shrink file size without sending the file anywhere.",
    how_to_use: howTo("Upload a PDF. Compression optimizes the document structure in your browser."),
    features: ["Object-stream optimization", "No quality slider needed", "Private — processed locally"],
    faq: [
      privacyFaq,
      { question: "How much smaller will my PDF get?", answer: "Savings depend on the file. Structure optimization often helps most on PDFs with unused objects or uncompressed streams." },
    ],
    related_tools: ["merge-pdf", "jpg-to-pdf"],
    seo_title: "Compress PDF — Reduce PDF Size Online",
    meta_description: "Compress a PDF in your browser to reduce file size. Free, private, no upload required.",
    accepted_formats: ["pdf"],
  },
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    name: "JPG & PDF Converter",
    category_slug: "pdf",
    processing_type: "client",
    short_description: "Convert JPG images to a PDF, or PDF pages to JPG images.",
    long_description: "Upload a PDF or images in your browser, then choose JPG to PDF or PDF to JPG. Nothing is uploaded.",
    how_to_use: howTo("Upload a PDF or JPG/PNG images, then choose JPG to PDF or PDF to JPG."),
    features: [
      "JPG and PNG to a multi-page PDF",
      "PDF pages to JPG images",
      "Quality control for PDF to JPG",
      "Private — processed locally",
    ],
    faq: [
      privacyFaq,
      { question: "Do I choose the conversion after uploading?", answer: "Yes. After you add a PDF or images, choose JPG to PDF or PDF to JPG, then click Process." },
      { question: "What image formats are supported?", answer: "JPG, JPEG, and PNG for converting to PDF." },
      { question: "What do I get after converting a PDF?", answer: "A ZIP archive with one JPG per page, or a single JPG if there is only one page." },
    ],
    related_tools: ["merge-pdf", "compress-pdf"],
    seo_title: "JPG to PDF & PDF to JPG — Convert Online",
    meta_description: "Convert JPG to PDF or PDF to JPG in your browser. Free, private, no upload required.",
    accepted_formats: ["pdf", "jpg", "jpeg", "png"],
  },
  {
    id: "pdf-editor",
    slug: "pdf-editor",
    name: "PDF Editor",
    category_slug: "pdf",
    processing_type: "client",
    short_description: "Edit a PDF on a canvas: insert, move and delete text, shapes and images, then download, print or share.",
    long_description: "Open a PDF in your browser, preview every page, and place text, shapes or framed images. Move or delete what you added. Watermarks are detected and removed only if you allow it.",
    how_to_use: [
      "Drop a PDF to open every page on the canvas — nothing is sent to a server",
      "Insert text, pick a shape or icon, or drop a layout template",
      "Select an object to move it anywhere, resize, rotate, recolor or delete it. Double-click text to type on the page",
      "Use undo, zoom, download, print or share. If a watermark is found, it is removed only after you confirm",
    ],
    features: [
      "Full PDF preview with move and delete for inserted objects",
      "Click to place text, shapes, icons and images, then drag them anywhere",
      "Searchable icon library",
      "Layout templates",
      "Font styles with bold and italic",
      "Many shapes, including frames for images",
      "Download, print and share",
      "Watermark detection with permission before removal",
      "Private — processed locally",
    ],
    faq: [
      privacyFaq,
      { question: "Can I move or delete text I added?", answer: "Yes. Switch to Select, click the object, then drag it or press Delete. Original PDF text is not a separate object." },
      { question: "Will watermarks be removed automatically?", answer: "No. If a watermark is detected, you are asked first. It is removed only if you choose Remove." },
    ],
    related_tools: ["merge-pdf", "compress-pdf"],
    seo_title: "PDF Editor — Edit PDF Pages in Your Browser",
    meta_description: "Edit PDFs privately in your browser: rotate, delete, extract, watermark, add text or images. Free, no upload.",
    accepted_formats: ["pdf"],
  },
];

export const PDF_CATEGORY = {
  slug: "pdf",
  name: "PDF Tools",
  description: "Merge, split, compress, convert and edit PDF files in your browser. Files never leave your device.",
  icon: "file-text",
  tools: PDF_TOOLS,
};

export function getPdfTool(category: string, slug: string): ToolMeta | null {
  if (category !== "pdf") return null;
  if (slug === "split-pdf") {
    const merged = PDF_TOOLS.find((t) => t.slug === "merge-pdf");
    return merged ? { ...merged, id: "split-pdf", slug: "split-pdf" } : null;
  }
  if (slug === "pdf-to-jpg") {
    const merged = PDF_TOOLS.find((t) => t.slug === "jpg-to-pdf");
    return merged ? { ...merged, id: "pdf-to-jpg", slug: "pdf-to-jpg" } : null;
  }
  return PDF_TOOLS.find((t) => t.slug === slug) ?? null;
}

export function collapseMergedPdfTools<T extends { slug?: string }>(tools: T[]): T[] {
  const slugs = new Set(tools.map((t) => t.slug));
  return tools.filter((t) => {
    if (t.slug === "split-pdf" && slugs.has("merge-pdf")) return false;
    if (t.slug === "pdf-to-jpg" && slugs.has("jpg-to-pdf")) return false;
    return true;
  });
}

export function localPdfTools(params?: { category?: string; popular?: boolean }): ToolMeta[] {
  if (params?.category && params.category !== "pdf") return [];
  const popular = new Set(["merge-pdf", "compress-pdf", "pdf-editor"]);
  if (params?.popular) return PDF_TOOLS.filter((t) => popular.has(t.slug));
  return PDF_TOOLS;
}
