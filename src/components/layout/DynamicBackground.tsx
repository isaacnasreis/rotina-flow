"use client";
import { useEffect, useState } from "react";

export function DynamicBackground() {
  const [timeOfDay, setTimeOfDay] = useState("evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay("morning");
    else if (hour >= 12 && hour < 18) setTimeOfDay("afternoon");
    else if (hour >= 18 && hour <= 23) setTimeOfDay("evening");
    else setTimeOfDay("night");
  }, []);

  const gradients: Record<string, string> = {
    morning: "from-orange-500/10 dark:from-orange-950/40 via-bg-primary to-bg-primary",
    afternoon: "from-blue-500/10 dark:from-blue-950/40 via-bg-primary to-bg-primary",
    evening: "from-purple-500/10 dark:from-purple-950/40 via-bg-primary to-bg-primary",
    night: "from-indigo-500/10 dark:from-indigo-950/30 via-bg-primary to-bg-primary",
  };

  return (
    <>
      <div
        className={`dynamic-bg fixed inset-0 z-[-2] bg-gradient-to-br ${gradients[timeOfDay]} transition-colors duration-[3000ms]`}
      />
      {/* Noise overlay pattern */}
      <svg className="pointer-events-none fixed isolate z-[-1] opacity-[0.15] mix-blend-overlay w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </>
  );
}
