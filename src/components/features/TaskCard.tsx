"use client";
import { deleteTask, toggleTaskStatus } from "@/actions/task";
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

interface TaskProps {
  task: {
    id: string;
    title: string;
    time: string;
    description: string;
    category: string;
    isCompleted: boolean;
  };
}

export function TaskCard({ task }: TaskProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskStatus(task.id, task.isCompleted);
            }}
            className="z-20 p-2 hover:scale-110 transition-transform cursor-pointer"
          >
            {task.isCompleted ? (
              <CheckCircle2 size={24} className="text-green-400" />
            ) : (
              <Circle size={24} className="text-white/20" />
            )}
          </button>

          <div className="p-2 bg-white/5 rounded-full">
            <Clock size={18} className="text-purple-400" />
          </div>

          <div>
            <motion.span
              layout
              className="text-xs font-mono opacity-40 uppercase tracking-tighter"
            >
              {task.time}
            </motion.span>
            <h3 className="text-lg font-bold block leading-tight">
              {task.title}
            </h3>
          </div>
        </div>

        <motion.div layout className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Eliminar este bloco do fluxo?")) deleteTask(task.id);
            }}
            className="p-2 opacity-20 group-hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
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
            <p className="text-slate-400 leading-relaxed italic">
              "{task.description}"
            </p>

            <div className="mt-8 flex justify-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/10 rounded-full">
                Categoria: {task.category}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
