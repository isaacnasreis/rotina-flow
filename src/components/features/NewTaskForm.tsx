"use client";

import { createTask } from "@/actions/task";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export function NewTaskForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-12 relative">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.button
            key="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-full py-4 border border-dashed border-white/20 hover:border-purple-500 hover:bg-purple-500/10 rounded-2xl text-white/50 flex items-center justify-center gap-2 transition-colors uppercase font-bold tracking-widest text-sm"
          >
            <Plus size={18} />
          </motion.button>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            action={async (formData) => {
              await createTask(formData);
              setIsOpen(false);
            }}
            className="bg-[#111] border-2 border-purple-500/30 p-6 rounded-3xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black italic uppercase text-xl">Novo Bloco de Rotina</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="TÍTULO DA TEREFA"
                required
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl font-bold uppercase placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <div className="flex gap-4">
                <input
                  type="text"
                  name="time"
                  placeholder="EX: 14:00 - 16:00"
                  className="w-1/3 bg-black/50 border border-white/10 p-4 rounded-xl font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <select
                  name="category"
                  className="w-2/3 bg-black/50 border border-white/10 p-4 rounded-xl uppercase text-sm focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="trabalho">Trabalho / Código</option>
                  <option value="estudo">Estudos / Universidade</option>
                  <option value="saude">Saúde / Corpo</option>
                  <option value="lazer">Artes / Lazer</option>
                </select>
              </div>

              <textarea
                name="description"
                placeholder="Detalhes, links ou notas rápidas..."
                rows={3}
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-colors"
              >
                Registrar no Banco
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
