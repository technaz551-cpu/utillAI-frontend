// import type { ToolMeta } from "@/features/tools/client-processors";

// export const PDF_TOOL_SLUGS = new Set([
//   "merge-pdf",
//   "split-pdf",
//   "compress-pdf",
//   "jpg-to-pdf",
//   "pdf-to-jpg",
//   "pdf-editor",
// ]);

// const howTo = (action: string, extra: string[] = []): string[] => [
//   "Drop files or click to upload — nothing is sent to a server",
//   action,
//   "Click Process and wait for the result",
//   "Download the file to your device",
//   ...extra,
// ];

// const privacyFaq = {
//   question: "Is my file uploaded to a server?",
//   answer: "No. PDF tools run entirely in your browser. Files never leave your device.",
// };

// export const PDF_TOOLS: ToolMeta[] = [
//   {
//     id: "merge-pdf",
//     slug: "merge-pdf",
//     name: "Merge & Split PDF",
//     category_slug: "pdf",
//     processing_type: "client",
//     short_description: "Merge multiple PDFs into one document, or split a PDF into separate pages.",
//     long_description: "Upload PDFs in your browser, then choose Merge or Split. Reorder files before combining, or extract every page into its own file — nothing is uploaded.",
//     how_to_use: howTo("Upload one or more PDFs, then choose Merge or Split."),
//     features: [
//       "Merge unlimited files (browser memory permitting)",
//       "Reorder before merging",
//       "Split into one PDF per page",
//       "Private — processed locally",
//     ],
//     faq: [
//       privacyFaq,
//       { question: "Do I merge or split after uploading?", answer: "After you add PDF files, choose Merge or Split, then click Process." },
//       { question: "What do I get after splitting?", answer: "A ZIP archive with one PDF file per page, or a single PDF if there is only one page." },
//     ],
//     related_tools: ["pdf-editor", "compress-pdf"],
//     seo_title: "Merge & Split PDF — Combine or Extract Pages Online",
//     meta_description: "Merge PDF files or split a PDF into pages in your browser. Free, no signup, files stay on your device.",
//     accepted_formats: ["pdf"],
//   },
//   {
//     id: "compress-pdf",
//     slug: "compress-pdf",
//     name: "Compress PDF",
//     category_slug: "pdf",
//     processing_type: "client",
//     short_description: "Reduce PDF file size while preserving readability.",
//     long_description: "Optimize PDF structure and object streams to shrink file size without sending the file anywhere.",
//     how_to_use: howTo("Upload a PDF. Compression optimizes the document structure in your browser."),
//     features: ["Object-stream optimization", "No quality slider needed", "Private — processed locally"],
//     faq: [
//       privacyFaq,
//       { question: "How much smaller will my PDF get?", answer: "Savings depend on the file. Structure optimization often helps most on PDFs with unused objects or uncompressed streams." },
//     ],
//     related_tools: ["merge-pdf", "jpg-to-pdf"],
//     seo_title: "Compress PDF — Reduce PDF Size Online",
//     meta_description: "Compress a PDF in your browser to reduce file size. Free, private, no upload required.",
//     accepted_formats: ["pdf"],
//   },
//   {
//     id: "jpg-to-pdf",
//     slug: "jpg-to-pdf",
//     name: "JPG & PDF Converter",
//     category_slug: "pdf",
//     processing_type: "client",
//     short_description: "Convert JPG images to a PDF, or PDF pages to JPG images.",
//     long_description: "Upload a PDF or images in your browser, then choose JPG to PDF or PDF to JPG. Nothing is uploaded.",
//     how_to_use: howTo("Upload a PDF or JPG/PNG images, then choose JPG to PDF or PDF to JPG."),
//     features: [
//       "JPG and PNG to a multi-page PDF",
//       "PDF pages to JPG images",
//       "Quality control for PDF to JPG",
//       "Private — processed locally",
//     ],
//     faq: [
//       privacyFaq,
//       { question: "Do I choose the conversion after uploading?", answer: "Yes. After you add a PDF or images, choose JPG to PDF or PDF to JPG, then click Process." },
//       { question: "What image formats are supported?", answer: "JPG, JPEG, and PNG for converting to PDF." },
//       { question: "What do I get after converting a PDF?", answer: "A ZIP archive with one JPG per page, or a single JPG if there is only one page." },
//     ],
//     related_tools: ["merge-pdf", "compress-pdf"],
//     seo_title: "JPG to PDF & PDF to JPG — Convert Online",
//     meta_description: "Convert JPG to PDF or PDF to JPG in your browser. Free, private, no upload required.",
//     accepted_formats: ["pdf", "jpg", "jpeg", "png"],
//   },
//   {
//     id: "pdf-editor",
//     slug: "pdf-editor",
//     name: "PDF Editor",
//     category_slug: "pdf",
//     processing_type: "client",
//     short_description: "Edit a PDF on a canvas: insert, move and delete text, shapes and images, then download, print or share.",
//     long_description: "Open a PDF in your browser, preview every page, and place text, shapes or framed images. Move or delete what you added. Watermarks are detected and removed only if you allow it.",
//     how_to_use: [
//       "Drop a PDF to open every page on the canvas — nothing is sent to a server",
//       "Insert text, pick a shape or icon, or drop a layout template",
//       "Select an object to move it anywhere, resize, rotate, recolor or delete it. Double-click text to type on the page",
//       "Use undo, zoom, download, print or share. If a watermark is found, it is removed only after you confirm",
//     ],
//     features: [
//       "Full PDF preview with move and delete for inserted objects",
//       "Click to place text, shapes, icons and images, then drag them anywhere",
//       "Searchable icon library",
//       "Layout templates",
//       "Font styles with bold and italic",
//       "Many shapes, including frames for images",
//       "Download, print and share",
//       "Watermark detection with permission before removal",
//       "Private — processed locally",
//     ],
//     faq: [
//       privacyFaq,
//       { question: "Can I move or delete text I added?", answer: "Yes. Switch to Select, click the object, then drag it or press Delete. Original PDF text is not a separate object." },
//       { question: "Will watermarks be removed automatically?", answer: "No. If a watermark is detected, you are asked first. It is removed only if you choose Remove." },
//     ],
//     related_tools: ["merge-pdf", "compress-pdf"],
//     seo_title: "PDF Editor — Edit PDF Pages in Your Browser",
//     meta_description: "Edit PDFs privately in your browser: rotate, delete, extract, watermark, add text or images. Free, no upload.",
//     accepted_formats: ["pdf"],
//   },
// ];

// export const PDF_CATEGORY = {
//   slug: "pdf",
//   name: "PDF Tools",
//   description: "Merge, split, compress, convert and edit PDF files in your browser. Files never leave your device.",
//   icon: "file-text",
//   tools: PDF_TOOLS,
// };

// export function getPdfTool(category: string, slug: string): ToolMeta | null {
//   if (category !== "pdf") return null;
//   if (slug === "split-pdf") {
//     const merged = PDF_TOOLS.find((t) => t.slug === "merge-pdf");
//     return merged ? { ...merged, id: "split-pdf", slug: "split-pdf" } : null;
//   }
//   if (slug === "pdf-to-jpg") {
//     const merged = PDF_TOOLS.find((t) => t.slug === "jpg-to-pdf");
//     return merged ? { ...merged, id: "pdf-to-jpg", slug: "pdf-to-jpg" } : null;
//   }
//   return PDF_TOOLS.find((t) => t.slug === slug) ?? null;
// }

// export function collapseMergedPdfTools<T extends { slug?: string }>(tools: T[]): T[] {
//   const slugs = new Set(tools.map((t) => t.slug));
//   return tools.filter((t) => {
//     if (t.slug === "split-pdf" && slugs.has("merge-pdf")) return false;
//     if (t.slug === "pdf-to-jpg" && slugs.has("jpg-to-pdf")) return false;
//     return true;
//   });
// }

// export function localPdfTools(params?: { category?: string; popular?: boolean }): ToolMeta[] {
//   if (params?.category && params.category !== "pdf") return [];
//   const popular = new Set(["merge-pdf", "compress-pdf", "pdf-editor"]);
//   if (params?.popular) return PDF_TOOLS.filter((t) => popular.has(t.slug));
//   return PDF_TOOLS;
// }


import type { ToolMeta } from "@/features/tools/client-processors";

export const PDF_TOOL_SLUGS = new Set([
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "pdf-editor",
  // NEW
  "organize-pdf",
  "rotate-crop-pdf",
  "watermark-pdf",
  "protect-pdf",
  "pdf-metadata",
]);

const howTo = (action: string, extra: string[] = []): string[] => [
  "Upload files to the UTILAI Python backend for processing",
  action,
  "Click Process and wait for the result",
  "Download the file to your device",
  ...extra,
];

const privacyFaq = {
  question: "Is my file uploaded to a server?",
  answer: "No. PDF tools run entirely in your browser. Files never leave your device.",
};

const serverPrivacyFaq = {
  question: "How are my files processed?",
  answer: "The selected file is uploaded to the UTILAI Python backend for processing. Do not upload files you are not comfortable sending to the service.",
};

export const PDF_TOOLS: ToolMeta[] = [
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    name: "Merge & Split PDF",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Merge multiple PDFs, or export each page as a separate image.",
    long_description: "Upload PDFs to the UTILAI Python backend, then choose Merge or Split. Reorder files before combining, or export each page as a JPG, PNG, or WebP image.",
    how_to_use: howTo("Upload one or more PDFs, then choose Merge or Split."),
    features: [
      "Merge multiple files",
      "Reorder before merging",
      "Export split pages as JPG, PNG, or WebP images",
      "Processed by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "Do I merge or split after uploading?", answer: "After you add PDF files, choose Merge or Split, then click Process." },
      { question: "What do I get after splitting?", answer: "A ZIP archive with one JPG, PNG, or WebP image per page, or a single image if the PDF has one page." },
    ],
    related_tools: ["organize-pdf", "pdf-editor", "compress-pdf"],
    seo_title: "Merge & Split PDF — Combine or Extract Pages Online",
    meta_description: "Merge PDF files or split a PDF into page images using the UTILAI Python backend.",
    accepted_formats: ["pdf"],
  },
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    name: "Compress PDF",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Reduce PDF file size while preserving readability.",
    long_description: "Optimize PDF structure and object streams to shrink file size using the UTILAI Python backend.",
    how_to_use: howTo("Upload a PDF. Compression optimizes the document structure on the backend."),
    features: ["Object-stream optimization", "No quality slider needed", "Processed by the UTILAI Python backend"],
    faq: [
      serverPrivacyFaq,
      { question: "How much smaller will my PDF get?", answer: "Savings depend on the file. Structure optimization often helps most on PDFs with unused objects or uncompressed streams." },
    ],
    related_tools: ["merge-pdf", "jpg-to-pdf", "pdf-metadata"],
    seo_title: "Compress PDF — Reduce PDF Size Online",
    meta_description: "Compress a PDF using the UTILAI Python backend.",
    accepted_formats: ["pdf"],
  },
  {
    id: "jpg-to-pdf",
    slug: "jpg-to-pdf",
    name: "JPG & PDF Converter",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Convert JPG images to a PDF, or PDF pages to JPG images.",
    long_description: "Upload a PDF or images, then choose JPG to PDF or PDF pages to images. Files are processed by the UTILAI Python backend.",
    how_to_use: howTo("Upload a PDF or JPG/PNG images, then choose JPG to PDF or PDF to JPG."),
    features: [
      "JPG and PNG to a multi-page PDF",
      "PDF pages to JPG, PNG, or WebP images",
      "Processed by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "Do I choose the conversion after uploading?", answer: "Yes. After you add a PDF or images, choose JPG to PDF or PDF to JPG, then click Process." },
      { question: "What image formats are supported?", answer: "JPG, JPEG, and PNG for converting to PDF." },
      { question: "What do I get after converting a PDF?", answer: "A ZIP archive with one image per page, or a single image if there is only one page." },
    ],
    related_tools: ["merge-pdf", "compress-pdf"],
    seo_title: "JPG to PDF & PDF to JPG — Convert Online",
    meta_description: "Convert JPG to PDF or PDF pages to images using the UTILAI Python backend.",
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
    related_tools: ["watermark-pdf", "merge-pdf", "compress-pdf"],
    seo_title: "PDF Editor — Edit PDF Pages in Your Browser",
    meta_description: "Edit PDFs privately in your browser: rotate, delete, extract, watermark, add text or images. Free, no upload.",
    accepted_formats: ["pdf"],
  },

  /* ================================================================ */
  /* NEW TOOLS                                                        */
  /* ================================================================ */

  {
    id: "organize-pdf",
    slug: "organize-pdf",
    name: "Organize PDF & Page Numbers",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Reorder, rotate and delete PDF pages, and add page numbers — all in one tool.",
    long_description: "Upload a PDF to the UTILAI Python backend, then reorder pages, rotate or delete them, and optionally add page numbers with your choice of position, format and starting number.",
    how_to_use: [
      "Upload a PDF for server-side processing",
      "Drag pages to reorder them, or use the arrow buttons. Rotate or delete pages you don't need",
      "Turn on Add page numbers and pick position, format, start number and font size",
      "Click Save organized PDF and download the result",
    ],
    features: [
      "Drag-and-drop page reordering with thumbnails",
      "Delete and rotate individual pages",
      "Page numbers: position, format (1, 1 / 10, Page 1), start number, font size",
      "Numbers follow your final page order",
      "Processed by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "Are page numbers based on the new order?", answer: "Yes. Numbers are added after reordering and deleting, so they follow the final page order." },
      { question: "Can I start numbering from a different number?", answer: "Yes. Set any start number, for example 5, if this PDF continues another document." },
    ],
    related_tools: ["merge-pdf", "rotate-crop-pdf", "pdf-editor"],
    seo_title: "Organize PDF — Reorder Pages & Add Page Numbers Online",
    meta_description: "Reorder, rotate and delete PDF pages, then add page numbers using the UTILAI Python backend.",
    accepted_formats: ["pdf"],
  },
  {
    id: "rotate-crop-pdf",
    slug: "rotate-crop-pdf",
    name: "Rotate & Crop PDF",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Rotate PDF pages and crop their margins in one step.",
    long_description: "Upload a PDF to rotate individual pages or the whole document, and trim the margins of every page using the UTILAI Python backend.",
    how_to_use: [
      "Upload a PDF for server-side processing",
      "Rotate pages one by one, or use All left / All right",
      "Set crop margins (top, right, bottom, left) and check the blue preview box",
      "Click Apply & save and download the result",
    ],
    features: [
      "Per-page and all-pages rotation (90° steps)",
      "Crop margins in percent with live preview",
      "Rotate and crop in a single pass",
      "Processed by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "Does crop apply to all pages?", answer: "Yes. The same margins are applied to every page. Rotation can be set per page." },
      { question: "Is the cropped content deleted?", answer: "Crop sets the visible page area. The file is not re-rendered, so page content outside the crop box may still exist inside the file." },
    ],
    related_tools: ["organize-pdf", "compress-pdf", "pdf-editor"],
    seo_title: "Rotate & Crop PDF — Fix Page Orientation and Margins Online",
    meta_description: "Rotate PDF pages and crop margins using the UTILAI Python backend.",
    accepted_formats: ["pdf"],
  },
  {
    id: "watermark-pdf",
    slug: "watermark-pdf",
    name: "Watermark & Signature PDF",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Add, remove or replace watermarks and your own signature on a PDF.",
    long_description: "Upload a PDF and stamp a text or image watermark on every page, or add your own signature. Marks added by this tool can later be removed or replaced.",
    how_to_use: [
      "Upload a PDF for server-side processing",
      "Choose a watermark action: add text or an image, or remove one added earlier with this tool",
      "Choose a signature action: draw or upload your own signature, then pick page, position and size — or replace or remove one added earlier with this tool",
      "Click Apply & save and download the result",
    ],
    features: [
      "Text or image watermark with opacity, angle, size and color",
      "Draw your own signature or upload an image",
      "Signature on first, last or all pages",
      "Replace or remove watermarks and signatures added by this tool",
      "Processed by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "Can I remove any watermark from any PDF?", answer: "No. Only watermarks and signatures added with this tool can be removed, because they are tagged in the file. Watermarks made by other software are part of the page and cannot be removed reliably." },
      { question: "Can I copy someone else's signature?", answer: "No. Use this tool only for your own signature, or one you are authorized to apply." },
      { question: "Is this a legally binding digital signature?", answer: "No. It places a visible image on the page. It is not a cryptographic digital signature." },
    ],
    related_tools: ["pdf-editor", "protect-pdf", "organize-pdf"],
    seo_title: "Watermark & Sign PDF — Add Text, Image Watermark and Signature Online",
    meta_description: "Add watermarks and your own signature to a PDF, or remove and replace ones added by this tool.",
    accepted_formats: ["pdf"],
  },
  {
    id: "protect-pdf",
    slug: "protect-pdf",
    name: "Protect PDF with Password",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "Lock a PDF with a password so only people who know it can open it.",
    long_description: "Upload a PDF for AES-256 encryption and set a password. You can also allow or block printing, copying text and editing.",
    how_to_use: [
      "Upload a PDF for server-side processing",
      "Enter and confirm a password",
      "Choose whether printing, copying text and editing are allowed",
      "Click Protect PDF and download the locked file. Share the password only with people you trust",
    ],
    features: [
      "AES-256 password encryption",
      "Allow or block printing, copying and editing",
      "Encrypted by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "What if I forget the password?", answer: "It cannot be recovered. Keep the password somewhere safe." },
      { question: "Can I give access to specific people?", answer: "Anyone who has the password can open the file. Per-person access or expiry needs an account-based service." },
    ],
    related_tools: ["watermark-pdf", "pdf-metadata", "compress-pdf"],
    seo_title: "Protect PDF — Add Password to a PDF Online",
    meta_description: "Password-protect a PDF with AES-256 encryption using the UTILAI Python backend.",
    accepted_formats: ["pdf"],
  },
  {
    id: "pdf-metadata",
    slug: "pdf-metadata",
    name: "PDF Metadata Viewer & Editor",
    category_slug: "pdf",
    processing_type: "server",
    short_description: "View, edit or clear a PDF's title, author, keywords and other properties.",
    long_description: "Review PDF properties and upload the document to edit or clear its title, author, subject, keywords, creator and producer using the UTILAI Python backend.",
    how_to_use: [
      "Upload a PDF for server-side processing",
      "Read the document properties shown at the top",
      "Edit any field, or click to clear all fields",
      "Click Save metadata and download the updated PDF",
    ],
    features: [
      "View title, author, subject, keywords, creator, producer",
      "See creation and modification dates, page count and encryption status",
      "Edit or clear metadata before sharing",
      "Processed by the UTILAI Python backend",
    ],
    faq: [
      serverPrivacyFaq,
      { question: "Why clear metadata before sharing?", answer: "Metadata can include your name, the software you used and dates. Clearing it avoids sharing that by accident." },
      { question: "Does this remove everything hidden in the PDF?", answer: "It edits the standard document properties. Other embedded data, such as XMP metadata, may not be changed." },
    ],
    related_tools: ["protect-pdf", "compress-pdf", "organize-pdf"],
    seo_title: "PDF Metadata Viewer & Editor — View and Edit PDF Properties Online",
    meta_description: "View, edit or clear PDF metadata like title, author and keywords using the UTILAI Python backend.",
    accepted_formats: ["pdf"],
  },
];

export const PDF_CATEGORY = {
  slug: "pdf",
  name: "PDF Tools",
  description: "Merge, split, organize, compress, convert and protect PDF files using the UTILAI Python backend. The PDF Editor remains browser-based.",
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
  const popular = new Set(["merge-pdf", "compress-pdf", "pdf-editor", "organize-pdf"]);
  if (params?.popular) return PDF_TOOLS.filter((t) => popular.has(t.slug));
  return PDF_TOOLS;
}