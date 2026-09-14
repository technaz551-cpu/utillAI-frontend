export type UserPreferences = {
  language: string;
  background: string;
  avatar: string;
};

const PREFERENCES_KEY = "utilai_preferences";

export const BACKGROUND_OPTIONS = [
  { id: "mint", label: "Mint grid", value: "" },
  { id: "aurora", label: "Aurora", value: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2400&q=80" },
  { id: "desk", label: "Workspace", value: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=80" },
  { id: "mountains", label: "Mountains", value: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80" },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: "en",
  background: "",
  avatar: "",
};

export function getPreferences(): UserPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    return { ...DEFAULT_PREFERENCES, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setPreferences(next: Partial<UserPreferences>) {
  if (typeof window === "undefined") return;
  const preferences = { ...getPreferences(), ...next };
  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new Event("preferences:change"));
}
