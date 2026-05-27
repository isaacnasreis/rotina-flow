"use client";

import { completeAllTasks, deleteAllTasks } from "@/actions/task";
import { CheckCircle2, Trash2, MoreVertical, History } from "lucide-react";
import { useState, useRef, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function DashboardActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCompleteAll = () => {
    startTransition(async () => {
      const result = await completeAllTasks();
      if (result?.success) toast.success(result.success);
      setIsOpen(false);
    });
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Tem certeza que deseja apagar todas as tarefas de hoje?")) {
      return;
    }
    
    startTransition(async () => {
      const result = await deleteAllTasks();
      if (result?.success) toast.success(result.success);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-colors"
        disabled={isPending}
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-48 glass-card py-2 shadow-xl z-50 animate-fade-in"
          >
            <button
              onClick={handleCompleteAll}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-bg-card-hover transition-colors text-success"
            >
              <CheckCircle2 size={16} />
              <span>Concluir Todas</span>
            </button>
            <button
              onClick={handleDeleteAll}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-bg-card-hover transition-colors text-red-500"
            >
              <Trash2 size={16} />
              <span>Limpar Todas</span>
            </button>
            <div className="h-px w-full bg-border-subtle my-1" />
            <Link
              href="/history"
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-bg-card-hover transition-colors text-text-secondary hover:text-text-primary"
            >
              <History size={16} />
              <span>Logbook</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
