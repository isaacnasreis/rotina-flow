"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect } from "react";

export function ThemeProvider() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    // Aplica o data-theme no <html>
    document.documentElement.setAttribute("data-theme", theme);

    // Atualiza meta theme-color para mobile browser chrome
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (meta) {
      const colors: Record<string, string> = {
        dark: "#0a0a0f",
        light: "#f0f4f8",
        oled: "#000000",
      };
      meta.content = colors[theme] ?? "#0a0a0f";
    }
  }, [theme]);

  return null;
}
