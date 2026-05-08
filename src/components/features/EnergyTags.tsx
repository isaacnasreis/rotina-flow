"use client";
import { clsx } from "clsx";

export const ENERGY_TAGS = [
  { id: "deepwork", label: "Foco Profundo", color: "fuchsia", border: "border-fuchsia-500/40", glow: "shadow-[0_0_20px_rgba(217,70,239,0.15)]", bg: "bg-fuchsia-500/15", text: "text-fuchsia-400", hex: "rgba(217,70,239,0.2)" },
  { id: "flow", label: "Fluxo Criativo", color: "cyan", border: "border-cyan-500/40", glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]", bg: "bg-cyan-500/15", text: "text-cyan-400", hex: "rgba(6,182,212,0.2)" },
  { id: "recharge", label: "Recarregar", color: "emerald", border: "border-emerald-500/40", glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]", bg: "bg-emerald-500/15", text: "text-emerald-400", hex: "rgba(16,185,129,0.2)" },
  { id: "connect", label: "Conectar", color: "orange", border: "border-orange-500/40", glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]", bg: "bg-orange-500/15", text: "text-orange-400", hex: "rgba(249,115,22,0.2)" },
  { id: "ops", label: "Operacional", color: "slate", border: "border-slate-500/40", glow: "shadow-[0_0_20px_rgba(148,163,184,0.15)]", bg: "bg-slate-500/15", text: "text-slate-400", hex: "rgba(148,163,184,0.2)" },
];

export function EnergyTagSelector({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {ENERGY_TAGS.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => onSelect(tag.id)}
          className={clsx(
            "cursor-pointer relative px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 overflow-hidden",
            selected === tag.id
              ? `${tag.border} ${tag.text} scale-105 ${tag.glow} border`
              : "border border-white/5 text-white/40 hover:bg-white/5"
          )}
        >
          {selected === tag.id && (
            <div className={`absolute inset-0 opacity-20 ${tag.bg} mix-blend-screen`} />
          )}
          <span className={clsx("w-2 h-2 rounded-full", selected === tag.id ? tag.bg.replace('/15', '') : "bg-white/20")} />
          <span className="relative z-10">{tag.label}</span>
        </button>
      ))}
      <input type="hidden" name="category" value={selected} />
    </div>
  );
}
