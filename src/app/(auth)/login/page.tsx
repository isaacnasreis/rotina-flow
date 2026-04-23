"use client";

import { login } from "@/actions/auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex items-center justify-center p-6 selection:bg-purple-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Flow <span className="text-purple-500">State</span>
          </h1>
          <p className="font-mono text-xs opacity-50 uppercase tracking-widest">
            Acesso Restrito ao Fluxo
          </p>
        </div>

        <form
          action={async (formData) => {
            await login(formData);
          }}
          className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10"
        >
          <div>
            <label className="block font-mono text-xs opacity-50 uppercase tracking-widest mb-2">
              Identificação (Username)
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-black/50 border border-white/10 p-4 rounded-xl font-bold placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs opacity-50 uppercase tracking-widest mb-2">
              PIN de Acesso
            </label>
            <input
              type="password"
              name="pin"
              maxLength={4}
              required
              className="w-full bg-black/50 border border-white/10 p-4 rounded-xl font-bold text-center tracking-[1em] placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-colors mt-4"
          >
            Sincronizar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
