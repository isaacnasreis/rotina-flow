import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow State | Rotina",
  description: "Sistema experimental de rotinas para o dia a dia",
};

import { Toaster } from "@/components/ui/Toaster";
import { DynamicBackground } from "@/components/layout/DynamicBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-transparent text-white">
        <DynamicBackground />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
