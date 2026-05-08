"use client";

import { TaskCard } from "./TaskCard";
import { TaskListWrapper } from "@/components/ui/TaskListWrapper";
import { createBlock, deleteBlock } from "@/actions/block";
import { completeAllTasks, deleteAllTasks } from "@/actions/task";
import { Plus, X, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { clsx } from "clsx";
import { NewTaskForm } from "./NewTaskForm";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useTransition } from "react";

export function DashboardBlocks({ tasks, blocks }: { tasks: any[], blocks: any[] }) {
  const [activeTab, setActiveTab] = useState("geral");
  const [isCreatingBlock, setIsCreatingBlock] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  const [isDeleting, startDeletingTransition] = useTransition();
  const [isCreating, startCreatingTransition] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);

  const filteredTasks = tasks.filter((t: any) =>
    activeTab === "geral" ? !t.blockId : t.blockId === activeTab
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab("geral")}
          className={clsx(
            "cursor-pointer px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
            activeTab === "geral" ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
          )}
        >
          Geral
        </button>

        {blocks.map(b => (
          <div
            key={b.id}
            className={clsx(
              "group flex items-center gap-2 pl-6 pr-3 py-2 rounded-full text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === b.id ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            )}
          >
            <button onClick={() => setActiveTab(b.id)} className="cursor-pointer">{b.name}</button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBlockToDelete(b.id);
              }}
              className="cursor-pointer opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {isCreatingBlock ? (
          <form
            action={(fd) => {
              startCreatingTransition(async () => {
                const res = await createBlock(fd.get("name") as string);
                if (res?.success) {
                  toast.success(res.success);
                  setIsCreatingBlock(false);
                }
                if (res?.error) toast.error(res.error);
              });
            }}
            className="flex items-center gap-2 ml-2 relative"
          >
            <input
              autoFocus
              type="text"
              name="name"
              disabled={isCreating}
              className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold outline-none w-32 placeholder:text-white/20 focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-50"
              placeholder="Nome do bloco..."
              onBlur={(e) => {
                if (!e.target.value) setIsCreatingBlock(false);
              }}
            />
            {isCreating && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-white/40" size={14} />
              </div>
            )}
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingBlock(true)}
            className="cursor-pointer px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 transition-all flex items-center justify-center ml-2 border border-dashed border-white/20 hover:border-white/50"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <NewTaskForm blockId={activeTab} />

      {filteredTasks.length > 0 && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              startTransition(async () => {
                const res = await completeAllTasks();
                if (res.success) toast.success(res.success);
                else if (res.error) toast.error(res.error);
              });
            }}
            disabled={isPending}
            className="cursor-pointer px-4 py-2 bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/20 text-green-400 rounded-xl transition-all font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono"
          >
            {isPending ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle2 size={12} />}
            Concluir Tudo
          </button>
          <button
            onClick={() => setIsConfirmingDeleteAll(true)}
            disabled={isPending}
            className="cursor-pointer px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 rounded-xl transition-all font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono"
          >
            <Trash2 size={12} />
            Limpar Rotina
          </button>
        </div>
      )}

      <div className="relative border-l-2 border-white/5 pl-8 ml-4 mt-8">
        <TaskListWrapper>
          {filteredTasks.length === 0 ? (
            <p className="text-white/30 italic">
              A rotina de hoje está limpa neste bloco. Adicione um fluxo acima.
            </p>
          ) : (
            filteredTasks.map((t) => <TaskCard key={t.id} task={t} />)
          )}
        </TaskListWrapper>
      </div>

      <AnimatePresence>
        {blockToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 p-6 bg-[#111] border border-red-500/30 rounded-2xl">
              <p className="text-white font-bold text-xl">Eliminar este bloco?</p>
              <p className="text-white/60 text-sm text-center max-w-xs">
                As tarefas deste bloco não serão perdidas, elas irão automaticamente para a aba "Geral".
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    startDeletingTransition(async () => {
                      const res = await deleteBlock(blockToDelete);
                      if (res?.success) toast.success(res.success);
                      if (activeTab === blockToDelete) setActiveTab("geral");
                      setBlockToDelete(null);
                    });
                  }}
                  className="cursor-pointer px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2 className="animate-spin" size={16} />}
                  Confirmar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setBlockToDelete(null)}
                  className="cursor-pointer px-6 py-2 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isConfirmingDeleteAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 p-8 bg-[#0e0e0e] border border-red-500/30 rounded-2xl max-w-sm mx-4 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="h-12 w-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-2 border border-red-500/20">
                <Trash2 size={22} />
              </div>
              <p className="text-white font-black text-xl uppercase tracking-wider italic font-mono text-center">Eliminar toda a rotina?</p>
              <p className="text-white/60 text-sm text-center font-mono leading-relaxed">
                Todas as tarefas de hoje para este usuário serão excluídas permanentemente. Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 w-full mt-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      const res = await deleteAllTasks();
                      if (res?.success) toast.success(res.success);
                      else if (res?.error) toast.error(res.error);
                      setIsConfirmingDeleteAll(false);
                    });
                  }}
                  className="cursor-pointer flex-1 py-3 bg-red-600 hover:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all text-xs font-black uppercase tracking-wider font-mono flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="animate-spin" size={14} />}
                  Confirmar
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsConfirmingDeleteAll(false)}
                  className="cursor-pointer flex-1 py-3 bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all text-xs font-black uppercase tracking-wider font-mono"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
