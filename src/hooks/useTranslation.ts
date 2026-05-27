"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { dictionaries } from "@/i18n/dictionaries";

export function useTranslation() {
  const language = useSettingsStore((state) => state.language);
  // Default to pt if language is somehow undefined
  const t = dictionaries[language] || dictionaries.pt;
  return t;
}
