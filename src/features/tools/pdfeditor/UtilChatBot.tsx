// import React, { useEffect, useRef, useState } from 'react';
// import { Send, Sparkles } from 'lucide-react';
// import { FAQ, FALLBACK, GREETING, SUGGESTIONS } from './UtilKnowledge';

// type ChatMessage = { id: number; role: 'user' | 'bot'; text: string };

// // Optional: point this to your FastAPI endpoint later.
// // It must accept POST { message, history } and return { reply: string }.
// // If it is not set (or fails), the built-in knowledge base below is used.
// const CHAT_API_URL = process.env.NEXT_PUBLIC_UTILAI_CHAT_URL;

// // Keeps the conversation when the panel is closed and opened again.
// let cachedMessages: ChatMessage[] = [{ id: 1, role: 'bot', text: GREETING }];

// const normalize = (value: string) =>
//   value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

// function localAnswer(question: string): string {
//   const text = ` ${normalize(question)} `;
//   if (!text.trim()) return FALLBACK;

//   if (/^ (hi|hello|hey|salam|assalam o alaikum|aoa) /.test(text)) {
//     return GREETING;
//   }
//   if (/ (thanks|thank you|shukriya|thx) /.test(text)) {
//     return "You're welcome! Let me know if you need anything else.";
//   }

//   let best: { score: number; answer: string } | null = null;
//   for (const entry of FAQ) {
//     let score = 0;
//     for (const keyword of entry.keywords) {
//       if (text.includes(` ${normalize(keyword)} `)) {
//         // Longer (multi-word) matches are more specific, so they weigh more.
//         score += keyword.split(' ').length * 2;
//       }
//     }
//     if (score > 0 && (!best || score > best.score)) {
//       best = { score, answer: entry.answer };
//     }
//   }
//   return best ? best.answer : FALLBACK;
// }

// async function getReply(message: string, history: ChatMessage[]): Promise<string> {
//   if (CHAT_API_URL) {
//     try {
//       const response = await fetch(CHAT_API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message,
//           history: history.map((m) => ({ role: m.role, text: m.text })),
//         }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data && typeof data.reply === 'string' && data.reply.trim()) return data.reply;
//       }
//     } catch {
//       /* fall back to the local knowledge base */
//     }
//   }
//   return localAnswer(message);
// }

// export default function UtilAiChatBot() {
//   const [messages, setMessages] = useState<ChatMessage[]>(cachedMessages);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     cachedMessages = messages;
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

//   const send = async (raw: string) => {
//     const text = raw.trim();
//     if (!text || isTyping) return;

//     const userMessage: ChatMessage = { id: Date.now(), role: 'user', text };
//     const history = [...messages, userMessage];
//     setMessages(history);
//     setInput('');
//     setIsTyping(true);

//     const reply = await getReply(text, history);
//     setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: reply }]);
//     setIsTyping(false);
//   };

//   return (
//     <div className="flex h-full min-h-0 w-full flex-col bg-white">
//       {/* Header */}
//       <div className="flex items-center gap-2 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
//         <Sparkles className="h-5 w-5" />
//         <div>
//           <div className="text-sm font-bold leading-tight">UtilAI Assistant</div>
//           <div className="text-[10px] text-blue-100">PDF editor help &amp; company info</div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 select-text">
//         {messages.map((message) => (
//           <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div
//               className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
//                 message.role === 'user'
//                   ? 'rounded-br-sm bg-blue-600 text-white'
//                   : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
//               }`}
//             >
//               {message.text}
//             </div>
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex justify-start">
//             <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
//               Typing...
//             </div>
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Suggestions (only at the start) */}
//       {messages.length <= 1 && (
//         <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
//           {SUGGESTIONS.map((suggestion) => (
//             <button
//               key={suggestion}
//               onClick={() => send(suggestion)}
//               className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
//             >
//               {suggestion}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Input */}
//       <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') send(input);
//           }}
//           placeholder="Ask about the PDF editor or UtilAI"
//           className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-800 select-text focus:border-blue-400 focus:outline-none"
//         />
//         <button
//           onClick={() => send(input)}
//           disabled={!input.trim() || isTyping}
//           aria-label="Send message"
//           className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
//         >
//           <Send className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }





// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
// import { FAQ, FALLBACK, GREETING, SUGGESTIONS } from './UtilKnowledge';

// type ChatMessage = { id: number; role: 'user' | 'bot'; text: string };

// // Optional: point this to your FastAPI endpoint later.
// // It must accept POST { message, history } and return { reply: string }.
// // If it is not set (or fails), the built-in knowledge base below is used.
// const CHAT_API_URL = process.env.NEXT_PUBLIC_UTILAI_CHAT_URL;

// // Keeps the conversation when the panel is closed and opened again.
// let cachedMessages: ChatMessage[] = [{ id: 1, role: 'bot', text: GREETING }];

// const normalize = (value: string) =>
//   value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

// function localAnswer(question: string): string {
//   const text = ` ${normalize(question)} `;
//   if (!text.trim()) return FALLBACK;

//   if (/^ (hi|hello|hey|salam|assalam o alaikum|aoa) /.test(text)) {
//     return GREETING;
//   }
//   if (/ (thanks|thank you|shukriya|thx) /.test(text)) {
//     return "You're welcome! Let me know if you need anything else.";
//   }

//   let best: { score: number; answer: string } | null = null;
//   for (const entry of FAQ) {
//     let score = 0;
//     for (const keyword of entry.keywords) {
//       if (text.includes(` ${normalize(keyword)} `)) {
//         // Longer (multi-word) matches are more specific, so they weigh more.
//         score += keyword.split(' ').length * 2;
//       }
//     }
//     if (score > 0 && (!best || score > best.score)) {
//       best = { score, answer: entry.answer };
//     }
//   }
//   return best ? best.answer : FALLBACK;
// }

// async function getReply(message: string, history: ChatMessage[]): Promise<string> {
//   if (CHAT_API_URL) {
//     try {
//       const response = await fetch(CHAT_API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message,
//           history: history.map((m) => ({ role: m.role, text: m.text })),
//         }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data && typeof data.reply === 'string' && data.reply.trim()) return data.reply;
//       }
//     } catch {
//       /* fall back to the local knowledge base */
//     }
//   }
//   return localAnswer(message);
// }

// export default function UtilAiChatBot() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>(cachedMessages);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     cachedMessages = messages;
//     if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping, open]);

//   // Close with the Escape key.
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') setOpen(false);
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [open]);

//   const send = async (raw: string) => {
//     const text = raw.trim();
//     if (!text || isTyping) return;

//     const userMessage: ChatMessage = { id: Date.now(), role: 'user', text };
//     const history = [...messages, userMessage];
//     setMessages(history);
//     setInput('');
//     setIsTyping(true);

//     const reply = await getReply(text, history);
//     setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: reply }]);
//     setIsTyping(false);
//   };

//   return (
//     // Fixed to the viewport: it never pushes the layout or covers the top toolbar,
//     // and it stays at the bottom-right while the page scrolls.
//     <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
//       {open && (
//         <div
//           role="dialog"
//           aria-label="UtilAI Assistant"
//           className="pointer-events-auto flex h-[min(520px,calc(100vh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
//         >
//           {/* Header */}
//           <div className="flex items-center gap-2 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
//             <Sparkles className="h-5 w-5" />
//             <div className="min-w-0 flex-1">
//               <div className="text-sm font-bold leading-tight">UtilAI Assistant</div>
//               <div className="text-[10px] text-blue-100">PDF editor help &amp; company info</div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               aria-label="Close chat"
//               className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/20"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 select-text">
//             {messages.map((message) => (
//               <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div
//                   className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
//                     message.role === 'user'
//                       ? 'rounded-br-sm bg-blue-600 text-white'
//                       : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
//                   Typing...
//                 </div>
//               </div>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* Suggestions (only at the start) */}
//           {messages.length <= 1 && (
//             <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
//               {SUGGESTIONS.map((suggestion) => (
//                 <button
//                   key={suggestion}
//                   onClick={() => send(suggestion)}
//                   className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Input */}
//           <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') send(input);
//               }}
//               placeholder="Ask about the PDF editor or UtilAI"
//               className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-800 select-text focus:border-blue-400 focus:outline-none"
//             />
//             <button
//               onClick={() => send(input)}
//               disabled={!input.trim() || isTyping}
//               aria-label="Send message"
//               className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
//             >
//               <Send className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Floating toggle button */}
//       <button
//         onClick={() => setOpen((v) => !v)}
//         aria-label={open ? 'Close chat' : 'Open chat'}
//         aria-expanded={open}
//         className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
//       >
//         {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
//       </button>
//     </div>
//   );
// }




// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
// import { FAQ, FALLBACK, GREETING, SUGGESTIONS } from './UtilKnowledge';

// type ChatMessage = { id: number; role: 'user' | 'bot'; text: string };

// // Optional: point this to your FastAPI endpoint later.
// // It must accept POST { message, history } and return { reply: string }.
// // If it is not set (or fails), the built-in knowledge base below is used.
// const CHAT_API_URL = process.env.NEXT_PUBLIC_UTILAI_CHAT_URL;

// // Keeps the conversation when the panel is closed and opened again.
// let cachedMessages: ChatMessage[] = [{ id: 1, role: 'bot', text: GREETING }];

// const normalize = (value: string) =>
//   value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

// function localAnswer(question: string): string {
//   const text = ` ${normalize(question)} `;
//   if (!text.trim()) return FALLBACK;

//   if (/^ (hi|hello|hey|salam|assalam o alaikum|aoa) /.test(text)) {
//     return GREETING;
//   }
//   if (/ (thanks|thank you|shukriya|thx) /.test(text)) {
//     return "You're welcome! Let me know if you need anything else.";
//   }

//   let best: { score: number; answer: string } | null = null;
//   for (const entry of FAQ) {
//     let score = 0;
//     for (const keyword of entry.keywords) {
//       if (text.includes(` ${normalize(keyword)} `)) {
//         // Longer (multi-word) matches are more specific, so they weigh more.
//         score += keyword.split(' ').length * 2;
//       }
//     }
//     if (score > 0 && (!best || score > best.score)) {
//       best = { score, answer: entry.answer };
//     }
//   }
//   return best ? best.answer : FALLBACK;
// }

// async function getReply(message: string, history: ChatMessage[]): Promise<string> {
//   if (CHAT_API_URL) {
//     try {
//       const response = await fetch(CHAT_API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           message,
//           history: history.map((m) => ({ role: m.role, text: m.text })),
//         }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data && typeof data.reply === 'string' && data.reply.trim()) return data.reply;
//       }
//     } catch {
//       /* fall back to the local knowledge base */
//     }
//   }
//   return localAnswer(message);
// }

// export default function UtilAiChatBot() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>(cachedMessages);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const listRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     cachedMessages = messages;
//     // Scroll only the message list. scrollIntoView() also scrolls parent
//     // containers, which can push the editor's top toolbar out of view.
//     const el = listRef.current;
//     if (open && el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
//   }, [messages, isTyping, open]);

//   // Close with the Escape key.
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') setOpen(false);
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [open]);

//   const send = async (raw: string) => {
//     const text = raw.trim();
//     if (!text || isTyping) return;

//     const userMessage: ChatMessage = { id: Date.now(), role: 'user', text };
//     const history = [...messages, userMessage];
//     setMessages(history);
//     setInput('');
//     setIsTyping(true);

//     const reply = await getReply(text, history);
//     setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: reply }]);
//     setIsTyping(false);
//   };

//   return (
//     // Fixed to the viewport: it never pushes the layout or covers the top toolbar,
//     // and it stays at the bottom-right while the page scrolls.
//     <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
//       {open && (
//         <div
//           role="dialog"
//           aria-label="UtilAI Assistant"
//           className="pointer-events-auto flex h-[min(520px,calc(100vh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
//         >
//           {/* Header */}
//           <div className="flex items-center gap-2 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
//             <Sparkles className="h-5 w-5" />
//             <div className="min-w-0 flex-1">
//               <div className="text-sm font-bold leading-tight">UtilAI Assistant</div>
//               <div className="text-[10px] text-blue-100">PDF editor help &amp; company info</div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               aria-label="Close chat"
//               className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/20"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>

//           {/* Messages */}
//           <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 select-text">
//             {messages.map((message) => (
//               <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                 <div
//                   className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
//                     message.role === 'user'
//                       ? 'rounded-br-sm bg-blue-600 text-white'
//                       : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
//                   Typing...
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Suggestions (only at the start) */}
//           {messages.length <= 1 && (
//             <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
//               {SUGGESTIONS.map((suggestion) => (
//                 <button
//                   key={suggestion}
//                   onClick={() => send(suggestion)}
//                   className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
//                 >
//                   {suggestion}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Input */}
//           <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') send(input);
//               }}
//               placeholder="Ask about the PDF editor or UtilAI"
//               className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-800 select-text focus:border-blue-400 focus:outline-none"
//             />
//             <button
//               onClick={() => send(input)}
//               disabled={!input.trim() || isTyping}
//               aria-label="Send message"
//               className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
//             >
//               <Send className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Floating toggle button */}
//       <button
//         onClick={() => setOpen((v) => !v)}
//         aria-label={open ? 'Close chat' : 'Open chat'}
//         aria-expanded={open}
//         className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
//       >
//         {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
//       </button>
//     </div>
//   );
// }






'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { FAQ, FALLBACK, GREETING, SUGGESTIONS } from './UtilKnowledge';

type ChatMessage = { id: number; role: 'user' | 'bot'; text: string };

// Optional: point this to your FastAPI endpoint later.
// It must accept POST { message, history } and return { reply: string }.
// If it is not set (or fails), the built-in knowledge base below is used.
const CHAT_API_URL = process.env.NEXT_PUBLIC_UTILAI_CHAT_URL;

// Keeps the conversation when the panel is closed and opened again.
let cachedMessages: ChatMessage[] = [{ id: 1, role: 'bot', text: GREETING }];

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

function localAnswer(question: string): string {
  const text = ` ${normalize(question)} `;
  if (!text.trim()) return FALLBACK;

  if (/^ (hi|hello|hey|salam|assalam o alaikum|aoa) /.test(text)) {
    return GREETING;
  }
  if (/ (thanks|thank you|shukriya|thx) /.test(text)) {
    return "You're welcome! Let me know if you need anything else.";
  }

  let best: { score: number; answer: string } | null = null;
  for (const entry of FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (text.includes(` ${normalize(keyword)} `)) {
        // Longer (multi-word) matches are more specific, so they weigh more.
        score += keyword.split(' ').length * 2;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }
  return best ? best.answer : FALLBACK;
}

async function getReply(message: string, history: ChatMessage[]): Promise<string> {
  if (CHAT_API_URL) {
    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.reply === 'string' && data.reply.trim()) return data.reply;
      }
    } catch {
      /* fall back to the local knowledge base */
    }
  }
  return localAnswer(message);
}

export default function UtilAiChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(cachedMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    cachedMessages = messages;
    // Scroll only the message list. scrollIntoView() also scrolls parent
    // containers, which can push the editor's top toolbar out of view.
    const el = listRef.current;
    if (open && el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, open]);

  // Close with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setIsTyping(true);

    const reply = await getReply(text, history);
    setMessages((current) => [...current, { id: Date.now() + 1, role: 'bot', text: reply }]);
    setIsTyping(false);
  };

  return (
    // Fixed to the viewport: it never pushes the layout or covers the top toolbar,
    // and it stays at the bottom-right while the page scrolls.
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="UtilAI Assistant"
          className="pointer-events-auto flex h-[min(520px,calc(100vh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
            <Sparkles className="h-5 w-5" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold leading-tight">UtilAI Assistant</div>
              <div className="text-[10px] text-blue-100">PDF editor help &amp; company info</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 select-text">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-blue-600 text-white'
                      : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Suggestions (only at the start) */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-3 pt-3">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input);
              }}
              placeholder="Ask about the PDF editor or UtilAI"
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-800 select-text focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}