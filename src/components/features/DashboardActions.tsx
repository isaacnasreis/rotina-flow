"use client";

import { CheckCircle2, Trash2, MoreVertical, History, Settings } from "lucide-react";
import { useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ShareButton } from "./ShareButton";
import { db } from "@/lib/db";
import { syncOfflineTasks } from "@/lib/sync";

export function DashboardActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCompleteAll = () => {
    startTransition(async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const tasks = await db.tasks.where('userId').equals(userId).filter(t => !t.isCompleted && t.syncStatus !== 'deleted').toArray();
        await Promise.all(tasks.map(t => db.tasks.update(t.id, { 
          isCompleted: true, 
          syncStatus: (t as any).syncStatus === 'created' ? 'created' : 'updated', 
          updatedAt: new Date() 
        })));
        toast.success("Todas concluídas.");
        syncOfflineTasks();
      } catch (e) {
        toast.error("Erro ao concluir tarefas.");
      }
      setIsOpen(false);
    });
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Tem certeza que deseja apagar todas as tarefas de hoje?")) {
      return;
    }

    startTransition(async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const tasks = await db.tasks.where('userId').equals(userId).filter(t => t.syncStatus !== 'deleted').toArray();
        await Promise.all(tasks.map(t => {
          if ((t as any).syncStatus === 'created') return db.tasks.delete(t.id);
          else return db.tasks.update(t.id, { syncStatus: 'deleted', updatedAt: new Date() });
        }));
        toast.success("Todas as tarefas limpas.");
        syncOfflineTasks();
      } catch (e) {
        toast.error("Erro ao limpar tarefas.");
      }
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-full transition-all duration-200
          ${isOpen
            ? "bg-bg-card text-text-primary"
            : "text-text-muted hover:bg-bg-card-hover hover:text-text-primary"
          }
        `}
        disabled={isPending}
        aria-label="Ações do painel"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div
            ref={menuRef}
            role="menu"
            aria-label="Ações do painel"
            className="absolute right-0 top-full mt-2 w-52 glass-card py-2 shadow-[0_16px_48px_rgba(0,0,0,0.25)] z-50 animate-slide-up origin-top-right"
          >
            <button
              role="menuitem"
              onClick={handleCompleteAll}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5
                hover:bg-bg-card-hover transition-colors text-success cursor-pointer rounded-lg mx-auto"
              style={{ width: "calc(100% - 8px)", marginLeft: "4px" }}
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Concluir Todas</span>
            </button>
            <button
              role="menuitem"
              onClick={handleDeleteAll}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5
                hover:bg-red-500/10 hover:text-red-400 transition-colors text-red-500 cursor-pointer rounded-lg"
              style={{ width: "calc(100% - 8px)", marginLeft: "4px" }}
            >
              <Trash2 size={16} aria-hidden="true" />
              <span>Limpar Todas</span>
            </button>

            <div className="h-px w-full bg-border-subtle my-1.5" role="separator" />

            <Link
              href="/history"
              role="menuitem"
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5
                hover:bg-bg-card-hover transition-colors text-text-secondary hover:text-text-primary rounded-lg"
              style={{ width: "calc(100% - 8px)", marginLeft: "4px" }}
              onClick={() => setIsOpen(false)}
            >
              <History size={16} aria-hidden="true" />
              <span>Logbook</span>
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5
                hover:bg-bg-card-hover transition-colors text-text-secondary hover:text-text-primary rounded-lg"
              style={{ width: "calc(100% - 8px)", marginLeft: "4px" }}
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} aria-hidden="true" />
              <span>Configurações</span>
            </Link>
            <ShareButton
              withLabel
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5
                hover:bg-bg-card-hover transition-colors text-text-secondary hover:text-text-primary cursor-pointer rounded-lg"
              onClickCallback={() => setIsOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
