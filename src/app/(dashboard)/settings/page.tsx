"use client";

import { useSettingsStore, Theme, Language } from "@/store/useSettingsStore";
import { useTranslation } from "@/hooks/useTranslation";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { ArrowLeft, Moon, Sun, Monitor, Type } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, language, setTheme, setLanguage } = useSettingsStore();
  const t = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    router.refresh();
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    router.refresh();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <DynamicBackground />

      <section className="pt-8 pb-20 max-w-lg mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              {t.settings.title}
            </h2>
          </div>
        </header>

        <div className="space-y-10">
          {/* Appearance / Theme */}
          <section className="animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 px-1">
              {t.settings.appearance}
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <ThemeButton 
                active={theme === "light"} 
                onClick={() => handleThemeChange("light")}
                icon={<Sun size={20} />}
                label={t.settings.themeLight}
                previewClass="bg-[#f8fafc] border-[rgba(0,0,0,0.1)] text-[#0f172a]"
              />
              <ThemeButton 
                active={theme === "dark"} 
                onClick={() => handleThemeChange("dark")}
                icon={<Moon size={20} />}
                label={t.settings.themeDark}
                previewClass="bg-[#0a0a0f] border-[rgba(255,255,255,0.08)] text-[#f1f5f9]"
              />
              <ThemeButton 
                active={theme === "oled"} 
                onClick={() => handleThemeChange("oled")}
                icon={<Monitor size={20} />}
                label={t.settings.themeOled}
                previewClass="bg-black border-[rgba(255,255,255,0.15)] text-white"
              />
            </div>
          </section>

          {/* Language */}
          <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 px-1">
              {t.settings.language}
            </h3>
            
            <div className="flex flex-col gap-2">
              <LanguageButton
                active={language === "pt"}
                onClick={() => handleLanguageChange("pt")}
                label="Português"
              />
              <LanguageButton
                active={language === "en"}
                onClick={() => handleLanguageChange("en")}
                label="English"
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function ThemeButton({ 
  active, 
  onClick, 
  icon, 
  label, 
  previewClass 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  previewClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
        active 
          ? "border-accent bg-accent/5 ring-1 ring-accent shadow-[0_0_20px_var(--color-accent-glow)]" 
          : "border-border-subtle bg-bg-card hover:bg-bg-card-hover"
      )}
    >
      <div className={clsx("w-12 h-12 rounded-full border flex items-center justify-center transition-colors", previewClass)}>
        {icon}
      </div>
      <span className={clsx("text-sm font-medium", active ? "text-accent" : "text-text-secondary")}>
        {label}
      </span>
    </button>
  );
}

function LanguageButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 w-full text-left",
        active 
          ? "border-accent bg-accent/5 text-text-primary" 
          : "border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-secondary"
      )}
    >
      <div className="flex items-center gap-3">
        <Type size={18} className={active ? "text-accent" : "text-text-muted"} />
        <span className="font-medium">{label}</span>
      </div>
      {active && (
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      )}
    </button>
  );
}
