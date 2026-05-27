"use client";

import { useEffect, useState } from "react";

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 23) return "evening";
  return "night";
}

const messages: Record<TimeOfDay, { title: string; subtitle: string }> = {
  morning: {
    title: "Bom dia! ☀️",
    subtitle: "Comece adicionando sua primeira tarefa do dia.",
  },
  afternoon: {
    title: "A tarde é sua 🌤",
    subtitle: "O que vamos conquistar agora?",
  },
  evening: {
    title: "Boa noite 🌙",
    subtitle: "Planeje o amanhã ou finalize o que ficou pendente.",
  },
  night: {
    title: "Sessão noturna 🌌",
    subtitle: "Registre suas ideias antes de descansar.",
  },
};

function MorningSVG() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="animate-float">
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Horizon line */}
      <line x1="20" y1="100" x2="160" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Sun */}
      <circle cx="90" cy="70" r="22" stroke="url(#sunGrad)" strokeWidth="2" fill="none" />
      <circle cx="90" cy="70" r="8" fill="url(#sunGrad)" opacity="0.3" />
      {/* Rays */}
      <line x1="90" y1="38" x2="90" y2="28" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="90" y1="102" x2="90" y2="112" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="58" y1="70" x2="48" y2="70" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="122" y1="70" x2="132" y2="70" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="67.4" y1="47.4" x2="60.3" y2="40.3" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="112.6" y1="92.6" x2="119.7" y2="99.7" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="112.6" y1="47.4" x2="119.7" y2="40.3" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="67.4" y1="92.6" x2="60.3" y2="99.7" stroke="url(#rayGrad)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Mountains silhouette */}
      <path d="M20 100 L50 72 L70 88 L95 58 L120 82 L140 66 L160 100" stroke="rgba(168,85,247,0.2)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function AfternoonSVG() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="animate-float">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {/* Rhythmic waves */}
      <path d="M10 55 Q35 35, 60 55 Q85 75, 110 55 Q135 35, 160 55" stroke="url(#waveGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M10 75 Q35 55, 60 75 Q85 95, 110 75 Q135 55, 160 75" stroke="url(#waveGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M10 95 Q35 75, 60 95 Q85 115, 110 95 Q135 75, 160 95" stroke="url(#waveGrad)" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3" />
      {/* Floating circles */}
      <circle cx="45" cy="45" r="3" fill="#a855f7" opacity="0.3" />
      <circle cx="130" cy="50" r="2" fill="#6366f1" opacity="0.4" />
      <circle cx="90" cy="38" r="4" fill="#a855f7" opacity="0.15" />
      {/* Dotted path */}
      <path d="M40 110 L60 105 L80 108 L100 103 L120 107 L140 102" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 4" />
    </svg>
  );
}

function EveningSVG() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="animate-float">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Moon crescent */}
      <circle cx="90" cy="55" r="24" stroke="url(#moonGrad)" strokeWidth="2" fill="none" />
      <circle cx="100" cy="48" r="20" fill="#0a0a0f" />
      {/* Stars */}
      <circle cx="40" cy="35" r="1.5" fill="#c4b5fd" opacity="0.7" className="animate-gentle-pulse" />
      <circle cx="145" cy="40" r="1" fill="#c4b5fd" opacity="0.5" className="animate-gentle-pulse" />
      <circle cx="55" cy="60" r="1" fill="#a855f7" opacity="0.4" className="animate-gentle-pulse" />
      <circle cx="130" cy="70" r="1.5" fill="#c4b5fd" opacity="0.6" className="animate-gentle-pulse" />
      <circle cx="35" cy="80" r="0.8" fill="#c4b5fd" opacity="0.3" className="animate-gentle-pulse" />
      <circle cx="155" cy="55" r="0.8" fill="#a855f7" opacity="0.5" className="animate-gentle-pulse" />
      {/* Horizon */}
      <line x1="20" y1="110" x2="160" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {/* Small hills */}
      <path d="M20 110 Q50 95 80 110 Q110 95 140 110 L160 110" stroke="rgba(168,85,247,0.15)" strokeWidth="1" fill="none" />
    </svg>
  );
}

function NightSVG() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="animate-float">
      <defs>
        <linearGradient id="constGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Constellation lines */}
      <line x1="45" y1="30" x2="75" y2="50" stroke="url(#constGrad)" strokeWidth="0.8" />
      <line x1="75" y1="50" x2="110" y2="35" stroke="url(#constGrad)" strokeWidth="0.8" />
      <line x1="110" y1="35" x2="130" y2="60" stroke="url(#constGrad)" strokeWidth="0.8" />
      <line x1="75" y1="50" x2="60" y2="80" stroke="url(#constGrad)" strokeWidth="0.8" />
      <line x1="60" y1="80" x2="100" y2="90" stroke="url(#constGrad)" strokeWidth="0.8" />
      <line x1="100" y1="90" x2="130" y2="60" stroke="url(#constGrad)" strokeWidth="0.8" />
      {/* Constellation stars */}
      <circle cx="45" cy="30" r="2.5" fill="#818cf8" opacity="0.8" className="animate-gentle-pulse" />
      <circle cx="75" cy="50" r="3" fill="#c4b5fd" opacity="0.9" className="animate-gentle-pulse" />
      <circle cx="110" cy="35" r="2" fill="#818cf8" opacity="0.7" className="animate-gentle-pulse" />
      <circle cx="130" cy="60" r="2.5" fill="#a855f7" opacity="0.8" className="animate-gentle-pulse" />
      <circle cx="60" cy="80" r="2" fill="#c4b5fd" opacity="0.6" className="animate-gentle-pulse" />
      <circle cx="100" cy="90" r="2" fill="#818cf8" opacity="0.7" className="animate-gentle-pulse" />
      {/* Scattered background stars */}
      <circle cx="30" cy="60" r="0.8" fill="white" opacity="0.15" />
      <circle cx="150" cy="45" r="0.8" fill="white" opacity="0.1" />
      <circle cx="90" cy="15" r="0.8" fill="white" opacity="0.12" />
      <circle cx="25" cy="100" r="0.8" fill="white" opacity="0.08" />
      <circle cx="155" cy="95" r="0.8" fill="white" opacity="0.1" />
    </svg>
  );
}

const svgMap: Record<TimeOfDay, React.FC> = {
  morning: MorningSVG,
  afternoon: AfternoonSVG,
  evening: EveningSVG,
  night: NightSVG,
};

export function EmptyState() {
  const [time, setTime] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTime(getTimeOfDay());
  }, []);

  const SVGComponent = svgMap[time];
  const { title, subtitle } = messages[time];

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in select-none">
      <SVGComponent />
      <h3 className="text-xl font-bold mt-8 text-white/80">{title}</h3>
      <p className="text-sm text-white/30 mt-2 text-center max-w-[260px] leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
