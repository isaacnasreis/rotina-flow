import { logout } from "@/actions/auth";
import { ShareButton } from "@/components/features/ShareButton";
import { Logo } from "@/components/ui/Logo";
import { LogOut } from "lucide-react";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 selection:bg-purple-500">
      <div className="relative z-10">
        <nav className="border-b border-white/[0.06] px-5 py-4 flex justify-between items-center bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <ShareButton />
            <div className="w-px h-5 bg-white/[0.06]" />
            <form action={logout} className="flex items-center">
              <button
                type="submit"
                className="text-white/30 hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-5 pb-40">{children}</main>
      </div>
    </div>
  );
}
