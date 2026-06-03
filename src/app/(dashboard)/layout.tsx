"use client";

import { ShareButton } from "@/components/features/ShareButton";
import { Logo } from "@/components/ui/Logo";
import { LogOut, Settings, History } from "lucide-react";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Capacitor } from '@capacitor/core';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const API_URL = Capacitor.isNativePlatform() ? "https://rotina-flow.vercel.app" : "";
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST" });
      localStorage.removeItem("userId");
      router.replace("/login");
    } catch (e) {
      toast.error("Erro ao sair.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent">
      <div className="relative z-10">
        <nav className="border-b border-border-subtle px-5 py-4 flex justify-between items-center bg-bg-primary/80 backdrop-blur-md sticky top-0 z-50">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <ShareButton />
            <Link 
              href="/history"
              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-bg-card-hover"
              title="Logbook"
            >
              <History size={18} />
            </Link>
            <Link 
              href="/settings"
              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-bg-card-hover"
              title="Configurações"
            >
              <Settings size={18} />
            </Link>
            <div className="w-px h-5 bg-border-subtle mx-1" />
            <button
              onClick={handleLogout}
              className="text-text-muted hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-bg-card-hover"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-5 pb-40">{children}</main>
      </div>
    </div>
  );
}
