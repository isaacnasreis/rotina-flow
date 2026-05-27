"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect } from "react";

export function ThemeProvider() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
