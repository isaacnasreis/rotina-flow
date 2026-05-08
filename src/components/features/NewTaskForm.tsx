"use client";

import { createTask } from "@/actions/task";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { SmartTimeInput } from "./SmartTimeInput";
import { EnergyTagSelector } from "./EnergyTags";

export function NewTaskForm({ blockId }: { blockId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("deepwork");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<number | null>(60);

  const getEndTime = (start: string, mins: number) => {
    if (!start) return "";
    const [h, m] = start.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return start;
    const date = new Date();
    date.setHours(h, m + mins, 0, 0);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="mb-12 relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-full py-4 border border-dashed border-white/20 hover:border-purple-500 hover:bg-purple-500/10 rounded-2xl text-white/50 flex items-center justify-center gap-2 transition-colors uppercase font-bold tracking-widest text-sm cursor-pointer"
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
              const result = await createTask(formData);
              if (result?.error) {
                toast.error(result.error);
              } else if (result?.success) {
                toast.success(result.success);
                setIsOpen(false);
              }
            }}
            className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black italic uppercase text-xl">
                Novo Bloco de Rotina
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="opacity-50 hover:opacity-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input type="hidden" name="blockId" value={blockId} />
              <input
                type="text"
                name="title"
                placeholder="Título da Tarefa"
                required
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl font-bold placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <div className="flex flex-col gap-8 py-4">
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-widest font-bold opacity-30">Quando e Quanto tempo?</span>
                  <div className="flex flex-wrap gap-4 items-center">
                    <SmartTimeInput
                      name="startTime"
                      defaultValue={new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      onBlur={(e) => setStartTime(e.target.value)}
                      className="w-24 bg-white/5 border border-white/10 p-4 rounded-xl font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors text-center"
                    />

                    <div className="h-8 w-px bg-white/10 hidden sm:block" />

                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      {[15, 30, 60, 120].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDuration(mins)}
                          className={`cursor-pointer px-4 py-3 rounded-lg text-xs font-bold transition-all ${duration === mins ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
                            }`}
                        >
                          {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setDuration(null)}
                        className={`cursor-pointer px-4 py-3 rounded-lg text-xs font-bold transition-all ${duration === null ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
                          }`}
                      >
                        Livre
                      </button>
                    </div>

                    {duration === null && (
                      <SmartTimeInput
                        name="endTime"
                        className="w-24 bg-white/5 border border-white/10 p-4 rounded-xl font-mono text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors text-center"
                      />
                    )}
                    {duration !== null && (
                      <input type="hidden" name="endTime" value={getEndTime(startTime, duration)} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-widest font-bold opacity-30">Frequência / Vibração</span>
                  <EnergyTagSelector selected={selectedTag} onSelect={setSelectedTag} />
                </div>
              </div>

              <textarea
                name="description"
                placeholder="Detalhes, links ou notas rápidas..."
                rows={3}
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />

              <SubmitButton />
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Registrando...
        </>
      ) : (
        "Registrar no Banco"
      )}
    </button>
  );
}
