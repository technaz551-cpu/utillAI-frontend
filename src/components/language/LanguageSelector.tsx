"use client";

import { useLanguage } from "@/components/language/LanguageProvider";
import type { Language } from "@/i18n";

export function LanguageSelector() {
const {
language,
setLanguage,
languageNames,
} = useLanguage();

console.log("SELECTOR LANGUAGE:", language);

const handleChange = (
event: React.ChangeEvent<HTMLSelectElement>
) => {
const newLanguage = event.target.value as Language;


console.log("SELECTED LANGUAGE:", newLanguage);

setLanguage(newLanguage);


};

return ( <select
   value={language}
   onChange={handleChange}
   aria-label="Select language"
   className="h-10 rounded-full border border-[var(--border)] bg-white px-3 text-sm font-semibold text-black outline-none"
 >
{(Object.keys(languageNames) as Language[]).map(
(code) => ( <option key={code} value={code}>
{languageNames[code]} </option>
)
)} </select>
);
}
