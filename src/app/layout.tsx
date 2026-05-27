import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rotina Flow",
  description: "Organize seu dia com rapidez — abra, digite, faça.",
};

import { Toaster } from "@/components/ui/Toaster";
import { DynamicBackground } from "@/components/layout/DynamicBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased bg-transparent text-white" suppressHydrationWarning>
        <DynamicBackground />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
