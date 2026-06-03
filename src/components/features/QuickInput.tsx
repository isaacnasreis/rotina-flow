"use client";

import { ArrowUp, Loader2 } from "lucide-react";
import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { syncOfflineTasks } from "@/lib/sync";

interface QuickInputProps {
  userId: string;
}

function getPlaceholder(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Bom dia! O que vamos fazer hoje?";
  if (hour >= 12 && hour < 18) return "Adicione uma tarefa...";
  if (hour >= 18 && hour < 23) return "Última sprint do dia...";
  return "Registre uma ideia rápida...";
}

export function QuickInput({ userId }: QuickInputProps) {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("Adicione uma tarefa...");
  const [isPending, startTransition] = useTransition();
  const [justSubmitted, setJustSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPlaceholder(getPlaceholder());
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;

    // Flash feedback antes de limpar
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 300);

    setValue("");
    startTransition(async () => {
      try {
        const taskId = crypto.randomUUID();
        
        // Grava IMEDIATAMENTE no banco local do celular/navegador (Offline-First)
        await db.tasks.add({
          id: taskId,
          title: trimmed,
          isCompleted: false,
          category: "geral",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId,
          syncStatus: "created"
        });

        // Tenta sincronizar com a nuvem em background
        syncOfflineTasks();

      } catch (error) {
        toast.error("Erro ao salvar tarefa offline.");
        setValue(trimmed); // restaura em caso de erro
      }
    });

    // Mantém foco para entrada rápida em série
    inputRef.current?.focus();
  }, [value, isPending, userId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setValue("");
        inputRef.current?.blur();
      }
    },
    [handleSubmit]
  );

  const hasText = value.trim().length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      {/* Gradiente para separar visualmente da lista */}
      <div className="absolute bottom-full left-0 right-0 h-20 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 pb-4 pt-2 pointer-events-auto">
        {/* Container principal */}
        <div
          className={`quick-input flex items-center gap-3 px-4 py-3.5 ${justSubmitted ? "animate-submit-flash" : ""}`}
        >
          {/* Ícone de status */}
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {isPending ? (
              <Loader2
                size={18}
                className="text-accent animate-spin"
                aria-label="Salvando tarefa..."
              />
            ) : (
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  hasText
                    ? "bg-accent scale-125 shadow-[0_0_8px_var(--accent-glow-strong)]"
                    : "bg-border-subtle"
                }`}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Campo de texto */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isPending}
            className="flex-1 bg-transparent text-[15px] font-medium outline-none
              placeholder:text-text-muted text-text-primary caret-accent
              disabled:opacity-60"
            autoComplete="off"
            spellCheck={false}
            aria-label="Nova tarefa"
          />

          {/* Botão de envio — visível apenas com texto */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasText || isPending}
            className={`
              flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
              transition-all duration-200
              ${hasText && !isPending
                ? "bg-accent text-bg-primary scale-100 hover:opacity-85 hover:scale-105 active:scale-95 shadow-[0_0_12px_var(--accent-glow)]"
                : "bg-border-subtle text-text-muted scale-90 opacity-0 pointer-events-none"
              }
            `}
            aria-label="Adicionar tarefa"
          >
            <ArrowUp size={17} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dica de atalho */}
        <p className="text-center text-[10px] text-text-muted mt-2 font-mono tracking-widest select-none">
          {hasText ? "ENTER para adicionar · ESC para cancelar" : "Digite e pressione ENTER"}
        </p>
      </div>
    </div>
  );
}
