import { logout } from "@/actions/auth";
import { LogOut, Share2 } from "lucide-react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 selection:bg-purple-500">
      <nav className="border-b border-white/10 p-6 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
          Flow <span className="text-purple-500">State</span>
        </h1>
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono opacity-50 uppercase tracking-widest">
              Live Sync
            </span>
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button
              className="text-white/50 hover:text-purple-400 transition-colors cursor-pointer"
              title="Compartilhar Rotina"
            >
              <Share2 size={18} />
            </button>
            <form action={logout} className="flex items-center">
              <button
                type="submit"
                className="text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                title="Desconectar"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 pb-24">{children}</main>
    </div>
  );
}
