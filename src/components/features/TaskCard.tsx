"use client";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

interface TaskProps {
  task: {
    id: string;
    title: string;
    time: string;
    description: string;
    category: string;
  };
}

export function TaskCard({ task }: TaskProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsOpen(!isOpen)}
      className={clsx(
        "relative cursor-pointer overflow-hidden transition-all duration-500",
        isOpen
          ? "bg-purple-900/20 border-2 border-purple-500/50 my-8 p-8 rounded-3xl"
          : "bg-white/5 border border-white/10 hover:border-white/30 my-4 p-5 rounded-2xl",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div layout className="p-2 bg-white/5 rounded-full">
            <Clock size={18} className="text-purple-400" />
          </motion.div>
          <div>
            <motion.span
              layout
              className="text-xs font-mono opacity-40 uppercase tracking-tighter"
            >
              {task.time}
            </motion.span>
            <motion.h3 layout className="text-lg font-bold block leading-tight">
              {task.title}
            </motion.h3>
          </div>
        </div>

        <motion.div layout>
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

            <div className="mt-4">
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors">
                Concluir Tarefa
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
