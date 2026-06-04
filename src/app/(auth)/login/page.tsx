"use client";

import { Logo } from "@/components/ui/Logo";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Capacitor } from '@capacitor/core';

export default function LoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("userId")) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const username = formData.get("username") as string;
      const pin = formData.get("pin") as string;

      const API_URL = Capacitor.isNativePlatform() ? "https://rotina-flow.vercel.app" : "";
      const res = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pin }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("userId", data.userId);
        router.replace("/");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setPending(false);
    }
  };

  const handleOfflineLogin = () => {
    const offlineId = "offline-" + crypto.randomUUID();
    localStorage.setItem("userId", offlineId);
    router.replace("/");
  };

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
        <div className="mb-12 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-2" />
          <p className="font-mono text-xs opacity-50 uppercase tracking-widest text-white mt-1">
            Acesso Restrito ao Fluxo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
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
            disabled={pending}
            className="w-full cursor-pointer bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-xl transition-colors mt-4 flex justify-center items-center gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sincronizando...
              </>
            ) : (
              "Sincronizar"
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/30 font-mono text-xs uppercase tracking-widest">ou</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleOfflineLogin}
            disabled={pending}
            className="w-full cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/80 font-black uppercase tracking-widest py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            Usar Apenas Offline
          </button>
        </form>
      </motion.div>
    </div>
  );
}
