"use client";
import { useEffect, useState } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour <= 23) return "evening";
  return "night";
}

// Gradientes por período do dia — dark (padrão)
const darkGradients: Record<TimeOfDay, string> = {
  morning:   "from-amber-500/8 via-bg-primary to-bg-primary",
  afternoon: "from-blue-500/8 via-bg-primary to-bg-primary",
  evening:   "from-purple-600/10 via-bg-primary to-bg-primary",
  night:     "from-indigo-700/8 via-bg-primary to-bg-primary",
};

// Gradientes para light mode — mais sutis
const lightGradients: Record<TimeOfDay, string> = {
  morning:   "from-amber-100/80 via-blue-50/30 to-transparent",
  afternoon: "from-sky-100/60 via-slate-50/20 to-transparent",
  evening:   "from-violet-100/70 via-slate-50/20 to-transparent",
  night:     "from-indigo-100/50 via-slate-50/20 to-transparent",
};

export function DynamicBackground() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("evening");

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
  }, []);

  return (
    <>
      {/* Gradiente principal — desativado no OLED via CSS */}
      <div
        className={`dynamic-bg fixed inset-0 z-[-2] bg-gradient-to-br ${darkGradients[timeOfDay]} transition-colors duration-[2000ms]`}
      />
      {/* Gradiente light mode — sobrepõe apenas quando tema é light */}
      <div
        className={`dynamic-bg fixed inset-0 z-[-1] hidden bg-gradient-to-br ${lightGradients[timeOfDay]}
          [data-theme='light'] &:block transition-colors duration-[2000ms]`}
        aria-hidden="true"
      />
      {/* Noise texture overlay — adiciona profundidade */}
      <svg
        className="pointer-events-none fixed isolate z-[-1] opacity-[0.12] mix-blend-overlay w-full h-full"
        aria-hidden="true"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </>
  );
}
