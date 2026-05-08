"use client";
import { deleteTask, toggleTaskStatus, updateTask } from "@/actions/task";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { SmartTimeInput } from "./SmartTimeInput";
import { ENERGY_TAGS, EnergyTagSelector } from "./EnergyTags";

interface TaskProps {
  task: {
    id: string;
    title: string;
    time: string;
    startTimeStr: string;
    endTimeStr: string;
    description: string;
    category: string;
    isCompleted: boolean;
  };
  isReadOnly?: boolean;
}

export function TaskCard({ task, isReadOnly = false }: TaskProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTag, setCurrentTag] = useState(task.category);
  const [isPendingToggle, startToggleTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tagData = ENERGY_TAGS.find((t) => t.id === currentTag) || ENERGY_TAGS[0];

  return (
    <motion.form
      action={async (formData) => {
        const result = await updateTask(task.id, formData);
        if (result?.success) toast.success(result.success);
        if (result?.error) toast.error(result.error);
      }}
      layout
      className={clsx(
        "relative cursor-pointer overflow-hidden transition-all duration-500",
        task.isCompleted ? "opacity-40 grayscale-[0.5]" : "opacity-100",
        isOpen
          ? `border-2 my-8 p-8 rounded-[2rem] ${tagData.border}`
          : "bg-white/5 border border-white/10 hover:border-white/30 my-4 p-5 rounded-2xl",
      )}
      style={
        isOpen && !task.isCompleted
          ? {
            background: `radial-gradient(circle at top right, ${tagData.hex}, transparent 60%), rgba(10,10,10,0.6)`,
            backdropFilter: "blur(16px)",
          }
          : {}
      }
    >
      {task.isCompleted && (
        <motion.div
          layoutId="check"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="absolute top-1/2 left-0 h-0.5 bg-purple-500 z-10 pointer-events-none"
          style={{ originX: 0 }}
        />
      )}

      <div
        className="flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {isReadOnly ? (
            <div className="z-20 p-2">
              {task.isCompleted ? (
                <CheckCircle2 size={24} className="text-green-400/50" />
              ) : (
                <Circle size={24} className="text-white/10" />
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled={isPendingToggle}
              onClick={(e) => {
                e.stopPropagation();
                startToggleTransition(async () => {
                  const result = await toggleTaskStatus(task.id, task.isCompleted);
                  if (result?.success) toast.success(result.success);
                });
              }}
              className="z-20 p-2 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPendingToggle ? (
                <Loader2 size={24} className="text-white/40 animate-spin" />
              ) : task.isCompleted ? (
                <CheckCircle2 size={24} className="text-green-400" />
              ) : (
                <Circle size={24} className="text-white/20" />
              )}
            </button>
          )}

          <div className="p-2 bg-white/5 rounded-full">
            <Clock size={18} className="text-purple-400" />
          </div>

          <div>
            {isOpen && !isReadOnly ? (
              <div className="flex gap-2 mb-1" onClick={(e) => e.stopPropagation()}>
                <SmartTimeInput
                  name="startTime"
                  defaultValue={task.startTimeStr}
                  onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                  className="bg-transparent border-none text-xs font-mono opacity-60 uppercase tracking-tighter focus:outline-none focus:text-purple-400 w-12"
                />
                <span className="text-xs font-mono opacity-40">-</span>
                <SmartTimeInput
                  name="endTime"
                  defaultValue={task.endTimeStr}
                  onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                  className="bg-transparent border-none text-xs font-mono opacity-60 uppercase tracking-tighter focus:outline-none focus:text-purple-400 w-12"
                />
              </div>
            ) : (
              <motion.span
                layout
                className="text-xs font-mono opacity-40 uppercase tracking-tighter"
              >
                {task.time}
              </motion.span>
            )}

            {isOpen && !isReadOnly ? (
              <input
                type="text"
                name="title"
                defaultValue={task.title}
                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                onClick={(e) => e.stopPropagation()}
                className="text-lg font-bold block leading-tight bg-transparent border-none w-full focus:outline-none focus:text-purple-300 transition-colors"
              />
            ) : (
              <h3 className="text-lg font-bold block leading-tight">
                {task.title}
              </h3>
            )}
          </div>
        </div>

        <motion.div layout className="flex items-center gap-2">
          {!isReadOnly && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmingDelete(true);
              }}
              className="p-2 opacity-20 group-hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
          {isOpen ? (
            <ChevronRight className="rotate-90 opacity-20" />
          ) : (
            <ChevronRight className="opacity-20" />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            {isReadOnly ? (
              <p className="text-slate-400 leading-relaxed italic">
                "{task.description || "Sem detalhes adicionais."}"
              </p>
            ) : (
              <textarea
                name="description"
                defaultValue={task.description}
                placeholder="Detalhes adicionais..."
                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent border-none text-slate-400 leading-relaxed italic focus:outline-none focus:ring-1 focus:ring-purple-500/30 rounded-lg p-2 resize-none"
                rows={3}
              />
            )}

            <div className="mt-8 flex justify-end" onClick={(e) => e.stopPropagation()}>
              {!isReadOnly ? (
                <div className="scale-75 origin-right">
                  <EnergyTagSelector
                    selected={currentTag}
                    onSelect={(id) => {
                      setCurrentTag(id);
                      // Usar setTimeout para permitir que o input hidden atualize
                      setTimeout(() => {
                        const form = document.querySelector(`form:has(input[value="${task.id}"])`) as HTMLFormElement;
                        if (form) form.requestSubmit();
                      }, 0);
                    }}
                  />
                  {/* Para referência do form onSubmit hack */}
                  <input type="hidden" defaultValue={task.id} />
                </div>
              ) : (
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 ${tagData.bg} ${tagData.text} rounded-full`}>
                  {tagData.label}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMounted && createPortal(
        <AnimatePresence>
          {isConfirmingDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-4 p-6 bg-[#111] border border-red-500/30 rounded-2xl">
                <p className="text-white font-bold text-xl">Eliminar esta tarefa?</p>
                <p className="text-white/60 text-sm text-center max-w-xs">
                  A tarefa "{task.title}" será removida permanentemente.
                </p>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      startDeleteTransition(async () => {
                        const result = await deleteTask(task.id);
                        if (result?.success) toast.success(result.success);
                        setIsConfirmingDelete(false);
                      });
                    }}
                    className="px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isDeleting && <Loader2 className="animate-spin" size={16} />}
                    Confirmar
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-6 py-2 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.form>
  );
}
