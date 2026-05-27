import { logout } from "@/actions/auth";
import { ShareButton } from "@/components/features/ShareButton";
import { Logo } from "@/components/ui/Logo";
import { LogOut, Settings } from "lucide-react";
import React from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent">
      <div className="relative z-10">
        <nav className="border-b border-border-subtle px-5 py-4 flex justify-between items-center bg-bg-primary/80 backdrop-blur-md sticky top-0 z-50">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <ShareButton />
            <Link 
              href="/settings"
              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-bg-card-hover"
              title="Configurações"
            >
              <Settings size={18} />
            </Link>
            <div className="w-px h-5 bg-border-subtle mx-1" />
            <form action={logout} className="flex items-center">
              <button
                type="submit"
                className="text-text-muted hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-bg-card-hover"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-5 pb-40">{children}</main>
      </div>
    </div>
  );
}
