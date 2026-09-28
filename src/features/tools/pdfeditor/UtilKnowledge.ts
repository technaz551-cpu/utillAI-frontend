// Everything the UtilAI chatbot knows lives in this file.
// Fill in the COMPANY details below and add or change FAQ entries as your
// website grows. No other file needs to change.
//
// Any COMPANY field left as an empty string ('') is skipped automatically, so
// the chatbot never shows placeholder text to visitors.

export const COMPANY = {
  name: 'UtilAI',
  tagline: 'Online utility tools, all in one place',
  about:
    'UtilAI is an online utility platform that brings everyday tools together on one website. ' +
    'Every tool has its own page, so it is easy to find and use.',
  categories: ['Internet tools', 'Developer tools', 'PDF tools', 'AI tools', 'Image tools'],
  plans:
    'Free plan: unlimited PDF tools and Image Converter tools, plus one free trial per tool for ' +
    'Internet, Developer and AI tools. Paid plans (with Stripe) are planned for later.',

  // Fill these in with your real details (leave '' to hide a line).
  mission: '',
  team: '',
  contactEmail: '',
  location: '',
  socials: '',
};

export type FaqEntry = {
  keywords: string[];
  answer: string;
};

// Builds "Label: value" lines, skipping empty values.
const lines = (rows: [string, string][]) =>
  rows
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

const contactAnswer = () => {
  const details = lines([
    ['Email', COMPANY.contactEmail],
    ['Location', COMPANY.location],
    ['Socials', COMPANY.socials],
  ]);
  return details
    ? `${details}\n\nYou can also use the Contact page on the website.`
    : 'Please use the Contact page on the website to reach the UtilAI team.';
};

const missionAnswer = () => {
  const details = lines([
    ['Mission', COMPANY.mission],
    ['Team', COMPANY.team],
  ]);
  return details || `${COMPANY.about}\n\nSee the About page on the website for more.`;
};

export const FAQ: FaqEntry[] = [
  // ---------- Company / website ----------
  {
    keywords: ['what is utilai', 'about utilai', 'about company', 'about you', 'who are you', 'utilai'],
    answer: `${COMPANY.about}\n\nCategories: ${COMPANY.categories.join(', ')}.`,
  },
  {
    keywords: ['tools', 'category', 'categories', 'services', 'what can you do', 'features', 'kya kya hai'],
    answer: `UtilAI has these categories: ${COMPANY.categories.join(', ')}. Open the Tools or Categories menu on the website to browse them. This PDF editor is one of the PDF tools.`,
  },
  {
    keywords: [
      'price', 'pricing', 'plan', 'plans', 'free', 'paid', 'subscription', 'trial', 'cost',
      'free hai', 'qeemat', 'kitne paise', 'paise',
    ],
    answer: COMPANY.plans,
  },
  {
    keywords: ['contact', 'email', 'support', 'help desk', 'reach you', 'phone', 'address', 'location', 'rabta'],
    answer: contactAnswer(),
  },
  {
    keywords: ['mission', 'vision', 'team', 'founder', 'who made', 'who built', 'kisne banaya'],
    answer: missionAnswer(),
  },
  {
    keywords: ['sign in', 'login', 'log in', 'sign up', 'register', 'account'],
    answer:
      'Use Sign In or Get Started at the top of the website to log in or create an account. An account lets you keep your usage and plan in one place.',
  },
  {
    keywords: ['chatbot', 'chat', 'assistant', 'ai talk', 'ask ai'],
    answer:
      'The UtilAI assistant is the round chat button at the bottom-right of the page. Click it to open or close the chat.',
  },

  // ---------- PDF editor ----------
  {
    keywords: [
      'upload pdf', 'open pdf', 'import pdf', 'load pdf', 'how to start', 'get started',
      'pdf upload', 'pdf kholna', 'pdf kaise',
    ],
    answer:
      'To edit a PDF: click Home (or Uploads) in the sidebar, choose "Upload PDF", and pick your file. Every page opens on the canvas and its text becomes editable.',
  },
  {
    keywords: [
      'edit text', 'change text', 'edit pdf text', 'modify text', 'replace text', 'delete text',
      'pdf edit', 'text edit', 'text change', 'edit kaise', 'text badalna',
    ],
    answer:
      'Click the text you want to change, then type. The original text is covered automatically and your new text is drawn in its place. To delete text, select it and press the Delete (trash) button in the floating toolbar.',
  },
  {
    keywords: [
      'font', 'font size', 'text size', 'color', 'colour', 'bold', 'italic', 'underline', 'align', 'highlight',
    ],
    answer:
      'Select a text object, then use the top toolbar: font family, size (- / +), text colour, highlight colour, left/center/right alignment, and Bold / Italic / Underline.',
  },
  {
    keywords: ['add text', 'text box', 'new text', 'text add'],
    answer: 'Open "Text" in the sidebar and click "Add Text Layer". Drag it where you want and double-click to type.',
  },
  {
    keywords: ['shape', 'shapes', 'rectangle', 'circle', 'divider', 'element', 'elements'],
    answer: 'Open "Elements" in the sidebar to insert a rectangle, circle or line. You can then move, resize, rotate and recolour it.',
  },
  {
    keywords: ['add image', 'upload image', 'insert image', 'image add', 'photo', 'picture', 'logo'],
    answer: 'Go to Uploads, then under "Add Media" choose "Upload Image". The image is placed on the active page; drag and resize it as needed.',
  },
  {
    keywords: ['duplicate', 'rotate', 'lock', 'unlock', 'delete object', 'remove object', 'floating toolbar'],
    answer:
      'When you hover or select an object, a floating toolbar appears with Move, Duplicate, Rotate 45°, Lock/Unlock and Delete.',
  },
  {
    keywords: ['add page', 'new page', 'more pages', 'page add'],
    answer: 'Scroll to the bottom of the workspace and click "Add Page" to append a blank page.',
  },
  {
    keywords: ['blank', 'new document', 'create design', 'new file', 'new project', 'blank page'],
    answer: 'Click "Create" (the round + button) in the sidebar, or "Blank document" on Home, to open a fresh blank page.',
  },
  {
    keywords: [
      'export', 'download', 'save as', 'print', 'share', 'preview', 'png', 'jpg', 'jpeg', 'convert',
      'save kaise', 'download kaise',
    ],
    answer:
      'Click Export (top right), choose PDF, PNG or JPG, choose Download / Print / Share / Preview, slide the confirm slider fully to the right, then press the process button.\n\nGood to know: PDF export saves every page as a high-resolution image, so text in the exported PDF is not selectable. PNG/JPG export currently saves the first page only.',
  },
  {
    keywords: ['project', 'projects', 'saved', 'autosave', 'auto save', 'history', 'recent', 'lost', 'reopen'],
    answer:
      'Your work is saved automatically as a project in this browser. Open "Projects" in the sidebar to reopen, rename or delete any project. Projects are stored locally, so clearing your browser data removes them; export important files as PDF.',
  },
  {
    keywords: ['sidebar', 'menu', 'hide', 'collapse', 'close panel', 'open panel'],
    answer: 'Use the panel icon at the top of the sidebar to hide it. When it is hidden, click the small round icon at the top-left to bring it back.',
  },
  {
    keywords: ['undo', 'redo'],
    answer: 'Undo/redo is not available in the editor yet.',
  },
  {
    keywords: ['problem', 'not working', 'error', 'bug', 'issue', 'slow', 'fail', 'failed', 'masla'],
    answer:
      'Sorry about that. Try re-uploading the PDF or refreshing the page. Very large or scanned PDFs can be slow or have no editable text. If it keeps happening, contact us with the file type and what you clicked.',
  },
  {
    keywords: ['scanned', 'ocr', 'image pdf'],
    answer: 'Scanned PDFs are pictures, not real text, so there is no text to edit. Only PDFs that contain real text become editable.',
  },
  {
    keywords: ['privacy', 'secure', 'safe', 'my data', 'my file', 'server', 'mehfooz'],
    answer: 'The PDF editor runs in your browser: your file is processed on your device and projects are stored locally in your browser.',
  },
];

export const GREETING =
  `Hi! I'm the ${COMPANY.name} assistant. I can help you use the PDF editor and answer questions about ${COMPANY.name}. What would you like to know?`;

export const SUGGESTIONS = [
  'How do I edit PDF text?',
  'How do I export my file?',
  'What is UtilAI?',
  'Pricing plans',
];

export const FALLBACK =
  "I'm not sure about that one. I can help with editing PDFs (text, fonts, images, shapes, pages, export, projects) and with questions about UtilAI, like tools, plans and contact details.";