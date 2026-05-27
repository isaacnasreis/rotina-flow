"use client";
import { clsx } from "clsx";

import { ENERGY_TAGS } from "@/lib/constants";

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
