import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light" | "oled";
export type Language = "pt" | "en";

interface SettingsState {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "dark", // default
      language: "pt", // default
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.cookie = `flow_theme=${theme}; path=/; max-age=31536000`;
        }
      },
      setLanguage: (language) => {
        set({ language });
        if (typeof document !== "undefined") {
          document.cookie = `flow_lang=${language}; path=/; max-age=31536000`;
        }
      },
    }),
    {
      name: "rotina-settings", // key in localStorage
    }
  )
);
