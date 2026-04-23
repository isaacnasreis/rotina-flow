"use client";

import { login } from "@/actions/auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 selection:bg-purple-500 overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
      </motion.div>

      <div className="absolute inset-0 bg-noise z-0 mix-blend-overlay"></div>

      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2 text-white">
            Flow <span className="text-purple-500">State</span>
          </h1>
          <p className="font-mono text-xs opacity-50 uppercase tracking-widest text-white">
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
            <label className="block font-mono text-xs opacity-50 uppercase tracking-widest mb-2 text-white">
              Identificação (Username)
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full text-white bg-black/50 border border-white/10 p-4 rounded-xl font-bold placeholder:text-white/80 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-xs opacity-50 uppercase tracking-widest mb-2 text-white">
              PIN de Acesso
            </label>
            <input
              type="password"
              name="pin"
              maxLength={4}
              required
              className="w-full text-white bg-black/50 border border-white/10 p-4 rounded-xl font-bold text-center tracking-[1em] placeholder:text-white/80 focus:outline-none focus:border-purple-500 transition-colors"
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
