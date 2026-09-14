"use client";

import { useEffect } from "react";
import { getPreferences } from "@/lib/preferences";

function applyPreferences() {
  const preferences = getPreferences();
  document.body.style.backgroundImage = preferences.background
    ? `linear-gradient(rgba(243, 246, 244, 0.3), rgba(243, 246, 244, 0.42)), url("${preferences.background}")`
    : "";
}

export function ThemeManager() {
  useEffect(() => {
    applyPreferences();
    const syncPreferences = () => applyPreferences();
    window.addEventListener("preferences:change", syncPreferences);
    return () => window.removeEventListener("preferences:change", syncPreferences);
  }, []);

  return null;
}
