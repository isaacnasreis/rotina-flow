import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow State | Rotina",
  description: "Sistema experimental de rotinas para o dia a dia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
