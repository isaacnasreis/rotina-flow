"use client";

import { createTask } from "@/actions/task";
import { Plus, ChevronUp } from "lucide-react";
import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { toast } from "sonner";

function getPlaceholder(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Bom dia! O que vamos fazer hoje?";
  if (hour >= 12 && hour < 18) return "Adicione uma tarefa...";
  if (hour >= 18 && hour < 23) return "Última sprint do dia...";
  return "Registre uma ideia rápida...";
}

export function QuickInput() {
  const [value, setValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [placeholder, setPlaceholder] = useState("Adicione uma tarefa...");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPlaceholder(getPlaceholder());
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setValue("");
    startTransition(async () => {
      const result = await createTask(trimmed);
      if (result?.error) {
        toast.error(result.error);
        setValue(trimmed); // restore on error
      }
    });

    // Keep focus for rapid entry
    inputRef.current?.focus();
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-2xl mx-auto p-4 pointer-events-auto">
        {/* Expanded options (future: time/category) */}
        {isExpanded && (
          <div className="glass-card mb-2 p-4 animate-slide-up">
            <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold mb-3">
              Opções rápidas
            </p>
            <p className="text-xs text-white/20 italic">
              Use o menu &quot;···&quot; em cada tarefa para adicionar horário e categoria.
            </p>
          </div>
        )}

        {/* Main Input Area */}
        <div
          className="quick-input flex items-center gap-3 px-5 py-4"
          style={{
            boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              cursor-pointer flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-200
              ${isExpanded
                ? "bg-purple-500/20 text-purple-400 rotate-180"
                : "bg-white/5 text-white/25 hover:bg-white/10 hover:text-white/40"
              }
            `}
            aria-label="Expandir opções"
          >
            {isExpanded ? <ChevronUp size={16} /> : <Plus size={16} />}
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isPending}
            className={`
              flex-1 bg-transparent text-[15px] font-medium outline-none
              placeholder:text-white/20 text-white caret-purple-400
              disabled:opacity-50
            `}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Submit button — only visible when there's text */}
          {value.trim() && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="cursor-pointer flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-400 disabled:opacity-50 flex items-center justify-center transition-all animate-fade-in"
              aria-label="Adicionar tarefa"
            >
              <Plus size={16} className="text-white" />
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-[10px] text-white/10 mt-2 font-mono tracking-wider">
          ENTER para adicionar · ESC para limpar
        </p>
      </div>

      {/* Gradient fade above input for visual separation */}
      <div className="absolute bottom-full left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </div>
  );
}
