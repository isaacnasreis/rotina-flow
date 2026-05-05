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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
          ? "bg-purple-900/20 border-2 border-purple-500/50 my-8 p-8 rounded-3xl"
          : "bg-white/5 border border-white/10 hover:border-white/30 my-4 p-5 rounded-2xl",
      )}
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
              onClick={async (e) => {
                e.stopPropagation();
                const result = await toggleTaskStatus(task.id, task.isCompleted);
                if (result?.success) toast.success(result.success);
              }}
              className="z-20 p-2 hover:scale-110 transition-transform"
            >
              {task.isCompleted ? (
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
                <input
                  type="time"
                  name="startTime"
                  defaultValue={task.startTimeStr}
                  onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                  className="bg-transparent border-none text-xs font-mono opacity-60 uppercase tracking-tighter focus:outline-none focus:text-purple-400 w-16"
                />
                <span className="text-xs font-mono opacity-40">-</span>
                <input
                  type="time"
                  name="endTime"
                  defaultValue={task.endTimeStr}
                  onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                  className="bg-transparent border-none text-xs font-mono opacity-60 uppercase tracking-tighter focus:outline-none focus:text-purple-400 w-16"
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

            <div className="mt-8 flex justify-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/10 rounded-full">
                Categoria: {task.category}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConfirmingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-4 p-6 bg-[#111] border border-red-500/30 rounded-2xl">
              <p className="text-white font-bold">Eliminar este bloco?</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={async () => {
                    const result = await deleteTask(task.id);
                    if (result?.success) toast.success(result.success);
                    setIsConfirmingDelete(false);
                  }}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-sm font-bold"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
